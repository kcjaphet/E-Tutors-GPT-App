
# Environment Variables Setup

This document explains how to set up environment variables for the GPTTextTools application.

## Local Development

1. Create a `.env` file in the server directory with the following variables:

```
# Server port
PORT=5000

# API keys for AI detection services
GPTZERO_API_KEY=your_gptzero_api_key
OPENAI_API_KEY=your_openai_api_key

# MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gpt-text-tools

# CORS configuration
CORS_ORIGIN=http://localhost:8080

# Stripe configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_MONTHLY_PRICE_ID=price_monthly_product_id
STRIPE_YEARLY_PRICE_ID=price_yearly_product_id

# Internal API key for admin operations
INTERNAL_API_KEY=your_internal_api_key_for_cron_jobs
```

2. Create a `.env` file in the root directory for frontend variables:

```
VITE_API_URL=http://localhost:5000
VITE_USE_GPTZERO=false
```

## Production Deployment

### AWS Elastic Beanstalk

For AWS Elastic Beanstalk, set environment variables through:

1. AWS Management Console
   - Go to your Elastic Beanstalk application
   - Navigate to Configuration > Software
   - Click "Edit" in the "Environment properties" section
   - Add each variable and its value

2. Using the EB CLI:
   ```
   eb setenv OPENAI_API_KEY=your_key MONGO_URI=your_uri
   ```

### Vercel Deployment

For Vercel, set environment variables through:

1. Vercel Dashboard
   - Go to your project
   - Navigate to Settings > Environment Variables
   - Add each variable and its value

2. Using Vercel CLI:
   ```
   vercel env add VITE_API_URL
   ```

## Security Notes

- Never commit `.env` files to your repository
- Rotate API keys periodically
- Use different keys for development and production
- Consider using a secrets manager for production environments
