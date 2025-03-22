
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const subscriptionController = require('../controllers/subscriptionController');

/**
 * @route   POST /api/create-checkout-session
 * @desc    Create a Stripe checkout session
 * @access  Private
 */
router.post('/create-checkout-session', checkoutController.createCheckoutSession);

/**
 * @route   GET /api/subscription/:userId
 * @desc    Get user subscription information
 * @access  Private
 */
router.get('/subscription/:userId', subscriptionController.getUserSubscription);

/**
 * @route   POST /api/cancel-subscription
 * @desc    Cancel a user's subscription
 * @access  Private
 */
router.post('/cancel-subscription', checkoutController.cancelSubscription);

/**
 * @route   POST /api/update-usage
 * @desc    Update usage counters for the current month
 * @access  Private
 */
router.post('/update-usage', subscriptionController.updateUsage);

/**
 * @route   POST /api/reset-usage
 * @desc    Reset usage counters for the month (called by a cron job)
 * @access  Private
 */
router.post('/reset-usage', subscriptionController.resetUsage);

module.exports = router;
