
const webhookService = require('../services/webhookService');

// Process Stripe webhook events
const processWebhookEvent = async (event) => {
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
};

module.exports = {
  processWebhookEvent
};
