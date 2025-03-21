
# Deploying the GPTTextTools Frontend to Vercel

This guide explains how to deploy the React frontend to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Vercel CLI (optional, for command-line deployment)

## Deployment Steps

### Option 1: Deploy through Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "New Project"
4. Import your repository
5. Configure your project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
6. Add environment variables:
   - VITE_API_URL: Your backend API URL
7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy from your project directory:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## Environment Variables

Configure these environment variables in Vercel:

- VITE_API_URL: Your backend API URL (e.g., https://your-aws-api-url.amazonaws.com)

## Continuous Deployment

After connecting your Git repository to Vercel, any push to your main branch will trigger automatic deployments.

## Previews

Vercel automatically creates preview deployments for pull requests, allowing you to review changes before merging.
