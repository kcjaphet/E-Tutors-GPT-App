
const Subscription = require('../models/Subscription');
const stripe = require('../config/stripe');

// Get user subscription information
const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user's subscription
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return res.json({
        success: true,
        data: {
          planType: 'free',
          status: 'active',
          usageThisMonth: {
            detections: 0,
            humanizations: 0
          }
        }
      });
    }

    // If they have a paid subscription, check with Stripe to make sure it's still active
    if (subscription.stripeSubscriptionId && (subscription.planType === 'monthly' || subscription.planType === 'yearly')) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        
        subscription.status = stripeSubscription.status;
        subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
        
        await subscription.save();
      } catch (error) {
        console.error('Error retrieving Stripe subscription:', error);
      }
    }

    return res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription information',
      error: error.message
    });
  }
};

// Update usage counters for the current month
const updateUsage = async (req, res) => {
  try {
    const { userId, type } = req.body;
    
    if (!userId || !type || !['detection', 'humanization'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'User ID and valid type are required'
      });
    }

    // Find or create the user's subscription
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      subscription = new Subscription({ userId });
    }

    // Update the usage counter
    if (type === 'detection') {
      subscription.usageThisMonth.detections += 1;
    } else if (type === 'humanization') {
      subscription.usageThisMonth.humanizations += 1;
    }

    await subscription.save();

    return res.json({
      success: true,
      data: subscription.usageThisMonth
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update usage',
      error: error.message
    });
  }
};

// Reset usage counters for the month (called by a cron job)
const resetUsage = async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Reset usage for all users
    await Subscription.updateMany({}, {
      'usageThisMonth.detections': 0,
      'usageThisMonth.humanizations': 0
    });

    return res.json({
      success: true,
      message: 'Usage counts reset for all users'
    });
  } catch (error) {
    console.error('Error resetting usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset usage',
      error: error.message
    });
  }
};

module.exports = {
  getUserSubscription,
  updateUsage,
  resetUsage
};
