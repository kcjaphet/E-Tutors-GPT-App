
const Stripe = require('stripe');

// Initialize Stripe with the provided API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
  process.exit(1);
}

const stripe = Stripe(stripeSecretKey);

console.log('Stripe initialized successfully');

module.exports = stripe;
