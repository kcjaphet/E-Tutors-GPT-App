
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');

/**
 * @route   POST /api/create-checkout-session
 * @desc    Create a Stripe checkout session
 * @access  Private
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, planType, successUrl, cancelUrl } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get or create the user's subscription record
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      subscription = new Subscription({ userId });
      await subscription.save();
    }

    // Determine which price ID to use based on the plan type
    let priceId;
    const prices = {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_YEARLY_PRICE_ID
    };

    priceId = prices[planType];

    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }

    // Create a new Stripe customer if one doesn't exist
    let customerId = subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: userId
        }
      });
      
      customerId = customer.id;
      subscription.stripeCustomerId = customerId;
      await subscription.save();
    }

    // Default success URL if not provided
    const defaultSuccessUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/subscription-success`;

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL || `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/pricing`,
      metadata: {
        userId: userId,
        planType: planType
      }
    });

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const planType = session.metadata.planType;
      
      await handleSubscriptionCreated(session.subscription, userId, planType);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionCanceled(subscription);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

/**
 * @route   GET /api/subscription/:userId
 * @desc    Get user subscription information
 * @access  Private
 */
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user's subscription
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return res.json({
        success: true,
        data: {
          planType: 'free',
          status: 'active',
          usageThisMonth: {
            detections: 0,
            humanizations: 0
          }
        }
      });
    }

    // If they have a paid subscription, check with Stripe to make sure it's still active
    if (subscription.stripeSubscriptionId && (subscription.planType === 'monthly' || subscription.planType === 'yearly')) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        
        subscription.status = stripeSubscription.status;
        subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
        
        await subscription.save();
      } catch (error) {
        console.error('Error retrieving Stripe subscription:', error);
      }
    }

    return res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription information',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/cancel-subscription
 * @desc    Cancel a user's subscription
 * @access  Private
 */
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user's subscription
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel the subscription at the end of the current period
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    return res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period'
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/update-usage
 * @desc    Update usage counters for the current month
 * @access  Private
 */
router.post('/update-usage', async (req, res) => {
  try {
    const { userId, type } = req.body;
    
    if (!userId || !type || !['detection', 'humanization'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'User ID and valid type are required'
      });
    }

    // Find or create the user's subscription
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      subscription = new Subscription({ userId });
    }

    // Update the usage counter
    if (type === 'detection') {
      subscription.usageThisMonth.detections += 1;
    } else if (type === 'humanization') {
      subscription.usageThisMonth.humanizations += 1;
    }

    await subscription.save();

    return res.json({
      success: true,
      data: subscription.usageThisMonth
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update usage',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/reset-usage
 * @desc    Reset usage counters for the month (called by a cron job)
 * @access  Private
 */
router.post('/reset-usage', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Reset usage for all users
    await Subscription.updateMany({}, {
      'usageThisMonth.detections': 0,
      'usageThisMonth.humanizations': 0
    });

    return res.json({
      success: true,
      message: 'Usage counts reset for all users'
    });
  } catch (error) {
    console.error('Error resetting usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset usage',
      error: error.message
    });
  }
});

// Helper functions for handling webhook events
async function handleSubscriptionCreated(subscriptionId, userId, planType) {
  try {
    // Get the subscription details from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the user's subscription record
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      subscription = new Subscription({ userId });
    }
    
    // Update the subscription data
    subscription.planType = planType;
    subscription.stripeSubscriptionId = subscriptionId;
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    
    await subscription.save();
    
    console.log(`Subscription created for user ${userId}: ${planType} plan`);
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(stripeSubscription) {
  try {
    // Find the user's subscription by the Stripe subscription ID
    const subscription = await Subscription.findOne({ 
      stripeSubscriptionId: stripeSubscription.id 
    });
    
    if (!subscription) {
      console.log(`No subscription found for Stripe subscription ID: ${stripeSubscription.id}`);
      return;
    }
    
    // Update the subscription status
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    
    // Check if the plan has changed based on the price
    const priceId = stripeSubscription.items.data[0].price.id;
    
    if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
      subscription.planType = 'monthly';
    } else if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
      subscription.planType = 'yearly';
    }
    
    await subscription.save();
    
    console.log(`Subscription updated for user ${subscription.userId}: ${subscription.planType} plan, status: ${subscription.status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCanceled(stripeSubscription) {
  try {
    // Find the user's subscription by the Stripe subscription ID
    const subscription = await Subscription.findOne({ 
      stripeSubscriptionId: stripeSubscription.id 
    });
    
    if (!subscription) {
      console.log(`No subscription found for Stripe subscription ID: ${stripeSubscription.id}`);
      return;
    }
    
    // Update the subscription data
    subscription.status = stripeSubscription.status;
    subscription.planType = 'free';
    
    await subscription.save();
    
    console.log(`Subscription canceled for user ${subscription.userId}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

module.exports = router;
