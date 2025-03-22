
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const webhookController = require('../controllers/webhookController');

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

    // Process the event using the controller
    await webhookController.processWebhookEvent(event);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
});

module.exports = router;
