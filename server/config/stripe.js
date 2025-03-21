
const Stripe = require('stripe');

// Initialize Stripe with the API key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
