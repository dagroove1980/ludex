# Quick Deployment Guide - Manual Steps

## Prerequisites Check

Before starting, make sure you have:
- ✅ Google Cloud account with billing enabled
- ✅ gcloud CLI installed (you have it, but may need to fix Python env)
- ✅ Access to Vercel dashboard

## Step 1: Fix gcloud (if needed)

If you see Python errors with gcloud, try:

```bash
# Option 1: Reinstall gcloud
brew reinstall --cask google-cloud-sdk

# Option 2: Set Python path
export CLOUDSDK_PYTHON=$(which python3)
```

Then verify:
```bash
gcloud --version
```

## Step 2: Set Up Google Cloud Project

### Option A: Use Existing Project

```bash
# List your projects
gcloud projects list

# Set the project
gcloud config set project YOUR_PROJECT_ID
```

### Option B: Create New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name it: `ludex-pdf-processor`
4. Click "Create"
5. Wait for project creation
6. Set it: `gcloud config set project ludex-pdf-processor`

## Step 3: Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

## Step 4: Authenticate

```bash
gcloud auth login
gcloud auth application-default login
```

## Step 5: Deploy the Service

Navigate to the pdf-processor directory:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
```

Deploy to Cloud Run:

```bash
gcloud run deploy ludex-pdf-processor \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0
```

**What happens:**
- Cloud Build will build your Docker image (5-10 min first time)
- Service will be deployed to Cloud Run
- You'll get a URL at the end

**Copy the URL** that appears at the end - it looks like:
```
https://ludex-pdf-processor-xxxxx-uc.a.run.app
```

## Step 6: Test the Service

```bash
# Replace YOUR_URL with the URL from Step 5
curl https://YOUR_URL/health
```

Expected response: `{"status":"healthy"}`

## Step 7: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **ludex** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key**: `PYTHON_SERVICE_URL`
   - **Value**: The URL from Step 5
   - **Environment**: Check all (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **Redeploy**

## Step 8: Test End-to-End

1. Go to your deployed Ludex app
2. Sign in
3. Upload a PDF rulebook
4. Wait for processing (should be much faster now!)
5. Check the **Rules** tab - you should see:
   - Left sidebar with section navigation
   - Structured rules (not AI summaries)
   - Subsections if available

## Troubleshooting

### "Permission denied" errors
```bash
# Make sure you're authenticated
gcloud auth login
gcloud auth application-default login

# Check your project
gcloud config get-value project
```

### "Billing not enabled"
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Billing → Link a billing account
3. Cloud Run has a free tier, so you won't be charged unless you exceed limits

### Service not accessible
- Make sure `--allow-unauthenticated` flag was used
- Check service status: `gcloud run services list`

### Need to update the service later
```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor --source . --region us-central1
```

## Alternative: Use Google Cloud Console (Web UI)

If CLI isn't working, you can deploy via the web UI:

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click **Create Service**
3. Select **Deploy one revision from a source repository** or **Deploy from a container image**
4. For source: Upload the `pdf-processor` folder
5. Configure:
   - Service name: `ludex-pdf-processor`
   - Region: `us-central1`
   - Authentication: Allow unauthenticated invocations
   - Memory: 2 GiB
   - Timeout: 300 seconds
6. Click **Create**
7. Wait for deployment
8. Copy the service URL from the service details page

## Quick Reference

**Deploy:**
```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor --source . --region us-central1 --allow-unauthenticated --memory 2Gi --timeout 300
```

**Get URL:**
```bash
gcloud run services describe ludex-pdf-processor --region us-central1 --format 'value(status.url)'
```

**View logs:**
```bash
gcloud run services logs read ludex-pdf-processor --region us-central1 --limit 50
```

**Update service:**
```bash
gcloud run services update ludex-pdf-processor --region us-central1 --memory 4Gi --timeout 600
```

