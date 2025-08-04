
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/create-checkout-session
 * @desc    Create a Stripe checkout session
 * @access  Private
 */
router.post('/create-checkout-session', authenticateToken, checkoutController.createCheckoutSession);

/**
 * @route   GET /api/subscription/:userId
 * @desc    Get user subscription information
 * @access  Private
 */
router.get('/subscription/:userId', authenticateToken, subscriptionController.getUserSubscription);

/**
 * @route   POST /api/cancel-subscription
 * @desc    Cancel a user's subscription
 * @access  Private
 */
router.post('/cancel-subscription', authenticateToken, checkoutController.cancelSubscription);

/**
 * @route   POST /api/update-usage
 * @desc    Update usage counters for the current month
 * @access  Private
 */
router.post('/update-usage', authenticateToken, subscriptionController.updateUsage);

/**
 * @route   POST /api/reset-usage
 * @desc    Reset usage counters for the month (called by a cron job)
 * @access  Private
 */
router.post('/reset-usage', subscriptionController.resetUsage);

module.exports = router;
