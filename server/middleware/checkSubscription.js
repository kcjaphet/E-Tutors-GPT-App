
const Subscription = require('../models/Subscription');

/**
 * Middleware to check subscription status and usage limits
 */
async function checkSubscription(req, res, next) {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return next(); // Skip check if no user ID (anonymous user)
    }

    // Get the service type from the route
    const servicePath = req.path;
    const serviceType = servicePath.includes('detect') ? 'detection' : 'humanization';
    
    // Get the user's subscription
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      // If no subscription record exists, create one with free plan
      const newSubscription = new Subscription({ userId });
      await newSubscription.save();
      
      // For free plan, check usage limits
      if (serviceType === 'detection' && newSubscription.usageThisMonth.detections >= 5) {
        return res.status(403).json({
          success: false,
          message: 'You have reached the detection limit for the free plan. Please upgrade to continue.'
        });
      }
      
      if (serviceType === 'humanization' && newSubscription.usageThisMonth.humanizations >= 3) {
        return res.status(403).json({
          success: false,
          message: 'You have reached the humanization limit for the free plan. Please upgrade to continue.'
        });
      }
    } else {
      // If user has a paid plan, check if it's active
      if ((subscription.planType === 'monthly' || subscription.planType === 'yearly') && 
          subscription.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your subscription is not active. Please check your payment method.'
        });
      }
      
      // For free plan, check usage limits
      if (subscription.planType === 'free') {
        if (serviceType === 'detection' && subscription.usageThisMonth.detections >= 5) {
          return res.status(403).json({
            success: false,
            message: 'You have reached the detection limit for the free plan. Please upgrade to continue.'
          });
        }
        
        if (serviceType === 'humanization' && subscription.usageThisMonth.humanizations >= 3) {
          return res.status(403).json({
            success: false,
            message: 'You have reached the humanization limit for the free plan. Please upgrade to continue.'
          });
        }
      }
    }

    // Update usage counter after check
    if (subscription) {
      if (serviceType === 'detection') {
        subscription.usageThisMonth.detections += 1;
      } else if (serviceType === 'humanization') {
        subscription.usageThisMonth.humanizations += 1;
      }
      
      await subscription.save();
    }

    next();
  } catch (error) {
    console.error('Error checking subscription:', error);
    next(); // Continue even if there's an error checking the subscription
  }
}

module.exports = checkSubscription;
