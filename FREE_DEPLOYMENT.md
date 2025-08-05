
# Free Deployment Guide for e-tutors

This guide explains how to deploy the e-tutors platform for free using Supabase and Vercel.

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
   - Add `VITE_SUPABASE_URL` with your Supabase project URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key

## Backend Setup (Supabase)

1. **Create a Supabase Account**
   - Sign up at [Supabase](https://supabase.com) using GitHub or email

2. **Create a New Project**
   - Click "New Project"
   - Choose your organization
   - Set project name and database password
   - Select a region closest to your users
   - Wait for project setup (2-3 minutes)

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable email authentication
   - Configure redirect URLs for your domain
   - Set site URL to your Vercel domain

4. **Deploy Edge Functions**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Deploy functions
   supabase functions deploy
   ```

5. **Set Environment Variables in Supabase**
   - Go to Project Settings > API
   - Add these secrets:
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `OPENAI_API_KEY`: Your OpenAI API key

## API Keys

1. **OpenAI API**
   - Create an account at [OpenAI](https://platform.openai.com/)
   - Generate an API key (new accounts get free credits)
   - Add as a secret in Supabase dashboard

2. **Stripe Testing**
   - Use Stripe's test mode for development
   - Get test API keys from the Stripe dashboard
   - Add as a secret in Supabase dashboard

## Important Notes

- **Supabase Free Tier Limitations**:
  - 500MB database storage
  - 2GB bandwidth per month
  - 100,000 reads per month
  - 1,000 writes per month
  - 2 million Edge Function invocations

- **Vercel Free Tier**:
  - 100GB bandwidth per month
  - 100 deployments per day
  - Serverless function execution time limit

- **OpenAI API**:
  - Free credits available for new accounts
  - Monitor usage to avoid unexpected charges
  - Consider implementing usage limits

This setup provides a completely free solution for testing and small-scale deployments.
