
const Stripe = require('stripe');

// Initialize Stripe with the provided API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51RK2w2B6lMlRE8ViqNqxyTmqTJytPGIgaMYwz0CUUsdxD70GzbFt1FAGBulJZrY9cxE8c5xDjRzeciwqaM5W5o8200JokqEIms';

const stripe = Stripe(stripeSecretKey);

console.log('Stripe initialized with API key');

module.exports = stripe;
