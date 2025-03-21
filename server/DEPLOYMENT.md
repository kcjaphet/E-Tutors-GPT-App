
# Deploying the GPTTextTools Backend to AWS Elastic Beanstalk

This guide explains how to deploy the Express backend to AWS Elastic Beanstalk.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. EB CLI (Elastic Beanstalk Command Line Interface) installed

## Deployment Steps

1. **Install EB CLI** (if not already installed):
   ```
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk in your project directory**:
   ```
   cd server
   eb init
   ```
   Follow the prompts to select your region, create a new application, and choose Node.js platform.

3. **Create an environment**:
   ```
   eb create gpt-text-tools-production
   ```

4. **Set up environment variables** (sensitive information):
   Go to the AWS Elastic Beanstalk Console > Your Environment > Configuration > Software > Environment properties and add:
   - OPENAI_API_KEY
   - GPTZERO_API_KEY (if using)
   - MONGO_URI
   - CORS_ORIGIN

5. **Deploy your application**:
   ```
   eb deploy
   ```

6. **Open your deployed application**:
   ```
   eb open
   ```

## Updating Your Deployment

When you make changes to your application:
```
eb deploy
```

## Monitoring and Logs

To view logs:
```
eb logs
```

To monitor your environment:
```
eb health
```

## Cleaning Up

To terminate your environment:
```
eb terminate gpt-text-tools-production
```
