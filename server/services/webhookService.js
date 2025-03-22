
const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');

// Handle new subscription creation
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

// Handle subscription updates
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

// Handle subscription cancellations
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

module.exports = {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionCanceled
};
