
const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');

// Create a Stripe checkout session
const createCheckoutSession = async (req, res) => {
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
    
    // Define price IDs for each plan type
    if (planType === 'premium') {
      priceId = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1RKSWUB6lMlRE8ViKMPsae8l';
    } else if (planType === 'pro') {
      priceId = process.env.STRIPE_PRO_PRICE_ID || 'price_1RKSflB6lMlRE8VicFIcfDg8';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }

    // Default success URL if not provided
    const defaultSuccessUrl = `${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/subscription-success`;

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL || `${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}/pricing`,
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
};

// Cancel a user's subscription
const cancelSubscription = async (req, res) => {
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
};

module.exports = {
  createCheckoutSession,
  cancelSubscription
};
