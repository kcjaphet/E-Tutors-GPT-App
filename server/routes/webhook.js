
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');

/**
 * @route   POST /api/webhook
 * @desc    Stripe webhook handler for subscription events
 * @access  Public
 */
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object);
        break;
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
});

// Handle successful checkout completion
async function handleCheckoutCompleted(session) {
  if (session.mode !== 'subscription') return; // Only handle subscription checkouts
  
  const subscriptionId = session.subscription;
  const customerId = session.customer;
  const metadata = session.metadata || {};
  const userId = metadata.userId;
  
  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }
  
  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Determine plan type based on price ID
    const priceId = subscription.items.data[0].price.id;
    let planType = 'free';
    
    if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
      planType = 'monthly';
    } else if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
      planType = 'yearly';
    }
    
    // Update or create subscription in database
    await Subscription.findOneAndUpdate(
      { userId },
      {
        planType,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    console.log(`Subscription checkout completed for user ${userId}: ${planType} plan`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription) {
  await handleSubscriptionUpdated(subscription);
}

// Helper functions for handling subscription events
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  
  // Get the customer's userId from metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Determine plan type based on price ID
  const priceId = subscription.items.data[0].price.id;
  let planType = 'free';
  
  if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
    planType = 'monthly';
  } else if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
    planType = 'yearly';
  }

  // Update or create subscription in database
  await Subscription.findOneAndUpdate(
    { userId },
    {
      planType,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
    },
    { upsert: true, new: true, runValidators: true }
  );
}

async function handleSubscriptionCanceled(subscription) {
  const customerId = subscription.customer;
  
  // Get the customer's userId from metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Update subscription status to canceled
  await Subscription.findOneAndUpdate(
    { userId },
    {
      status: 'canceled',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  );
}

async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return; // Not a subscription invoice
  
  // Get the customer's userId from metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Update subscription status to active
  await Subscription.findOneAndUpdate(
    { userId },
    { status: 'active' }
  );
}

async function handleInvoiceFailed(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) return; // Not a subscription invoice
  
  // Get the customer's userId from metadata
  const customer = await stripe.customers.retrieve(customerId);
  const userId = customer.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Update subscription status to past_due
  await Subscription.findOneAndUpdate(
    { userId },
    { status: 'past_due' }
  );
}

module.exports = router;
