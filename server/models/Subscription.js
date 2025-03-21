
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  planType: {
    type: String,
    enum: ['free', 'monthly', 'yearly'],
    default: 'free'
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true
  },
  currentPeriodEnd: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'],
    default: 'active'
  },
  usageThisMonth: {
    detections: {
      type: Number,
      default: 0
    },
    humanizations: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field automatically
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
