
const Stripe = require('stripe');

// Initialize Stripe with the API key from environment variables
// If not available, use the provided test key (for development only)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51RK4CZPXnmc0TuP5ZTfSMVOnAOamtJdYuxpX4iCtRvcoAHajTa33kfrDGbGbmFjsEfvpXyewWibzEpVm2pFgbTzm00Ao2iCSml';

const stripe = Stripe(stripeSecretKey);

console.log('Stripe initialized with API key');

module.exports = stripe;
