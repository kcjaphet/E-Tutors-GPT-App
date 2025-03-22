
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const webhookService = require('../services/webhookService');

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
        await webhookService.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await webhookService.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await webhookService.handleSubscriptionCanceled(event.data.object);
        break;
      case 'checkout.session.completed':
        const session = event.data.object;
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription;
          const userId = session.metadata.userId;
          const planType = session.metadata.planType;
          
          if (userId) {
            await webhookService.handleSubscriptionCreated(subscriptionId, userId, planType);
          }
        }
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
});

module.exports = router;
