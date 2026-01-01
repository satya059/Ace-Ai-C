# Vercel Deployment Guide

This application is configured for deployment on Vercel. Follow these steps to deploy:

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A GitHub repository with your code
3. All required environment variables configured

## Environment Variables Required

When deploying to Vercel, you'll need to set the following environment variables:

### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - `/onboarding`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - `/onboarding`

### Database
- `DATABASE_URL` - Your PostgreSQL connection string (e.g., from Neon, Supabase, or AWS RDS)

### Groq API
- `GROQ_API_KEY` - Your Groq API key from https://console.groq.com
- `GROQ_MODEL` - `mixtral-8x7b-32768` (default)
- `GROQ_FALLBACK_MODELS` - `mixtral-8x7b-32768,llama2-70b-4096` (optional, for fallback)

## Steps to Deploy

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Connect your repository and deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and add your environment variables when prompted

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure environment variables:
   - Go to Settings → Environment Variables
   - Add all required variables from the list above
5. Click "Deploy"

### Option 3: GitHub Integration

1. Push your code to GitHub
2. Go to Vercel and connect your GitHub account
3. Select the repository to deploy
4. Add environment variables in the Vercel dashboard
5. Vercel will automatically deploy on every push to the main branch

## Post-Deployment Steps

1. Verify the deployment is running at your Vercel domain
2. Check the logs if there are any issues:
   ```bash
   vercel logs
   ```
3. Set up a custom domain (optional) in Vercel settings

## Database Migrations

If you make changes to your Prisma schema:

1. Generate and run migrations locally:
   ```bash
   npx prisma migrate dev
   ```

2. Push to your repository
3. Vercel will handle the build automatically

## Troubleshooting

### Build Failures
- Check the Vercel deployment logs for specific errors
- Ensure all environment variables are correctly set
- Verify your database connection string is valid

### Runtime Errors
- Check application logs in Vercel dashboard
- Ensure Clerk API keys are correct and have proper permissions
- Verify Groq API key is active at https://console.groq.com

### Environment Variables Not Working
- Make sure variables are saved in Vercel Settings
- Redeploy after adding/changing variables
- Variables without `NEXT_PUBLIC_` prefix are server-only

## Performance Optimization

The application uses:
- Next.js 15.1.4 with Turbopack for faster builds
- Prisma ORM with connection pooling
- Groq API for AI features (optimized for speed)
- Clerk for authentication (no extra database needed)

## Monitoring

Set up monitoring and alerting:
1. Use Vercel Analytics for performance metrics
2. Set up error tracking with tools like Sentry
3. Monitor database performance with your database provider's dashboard

## Scaling

If you experience high traffic:
- Upgrade your Vercel plan for more resources
- Use Vercel's automatic scaling
- Consider upgrading your database plan
- Optimize Groq API usage with caching where applicable
