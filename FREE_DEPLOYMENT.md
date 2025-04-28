
# Free Deployment Guide for GPTTextTools

This guide explains how to deploy both frontend and backend components for free testing purposes.

## Frontend Deployment (Vercel)

1. **Create a Vercel Account**
   - Sign up at [Vercel](https://vercel.com) using GitHub, GitLab, or email

2. **Deploy Your Frontend**
   - Push your code to a Git repository
   - Import your repository in Vercel dashboard
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Configure Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL (from Render.com)

## Backend Deployment (Render.com)

1. **Create a Render Account**
   - Sign up at [Render](https://render.com) using GitHub or email

2. **Deploy Your Backend**
   - Create a new Web Service
   - Connect your Git repository
   - Configure the service:
     - Name: `gpt-text-tools-api`
     - Runtime: Node
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && node index.js`
     - Free Instance Type (will spin down after 15 minutes of inactivity)

3. **Set Environment Variables**
   - All your required variables from `.env.example`
   - Make sure to set `CORS_ORIGIN` to your Vercel frontend URL

## Database Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas Account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Create a Free Tier Cluster**
   - Select the "Shared" free tier option
   - Choose a cloud provider and region closest to your users
   - Create cluster (takes a few minutes)

3. **Set Up Database Access**
   - Create a database user with password
   - Add your IP to the IP Access List (or allow access from anywhere for testing)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Add this as `MONGO_URI` in your Render.com environment variables

## API Keys

1. **OpenAI API**
   - Create an account at [OpenAI](https://platform.openai.com/)
   - Generate an API key (new accounts get some free credits)
   - Add as `OPENAI_API_KEY` in Render.com

2. **Stripe Testing**
   - Use Stripe's test mode which doesn't require real payments
   - Get test API keys from the Stripe dashboard
   - Add as `STRIPE_SECRET_KEY` in Render.com

## Important Notes

- **Render Free Tier Limitations**:
  - Your service will "sleep" after 15 minutes of inactivity
  - First request after inactivity will take 30-60 seconds to respond
  - Limited to 750 hours of runtime per month

- **MongoDB Atlas Free Tier Limitations**:
  - 512MB storage limit
  - Shared RAM and compute resources

- **OpenAI API**:
  - While you get some free credits initially, the API isn't free long-term
  - Monitor your usage to avoid unexpected charges

This setup allows for completely free testing but has limitations in terms of performance and scale.
