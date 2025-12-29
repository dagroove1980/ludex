# Step-by-Step Deployment Guide

## Step 1: Set Up Google Cloud Project

1. **Check your current project:**
```bash
gcloud config get-value project
```

2. **If you need to set/change project:**
```bash
gcloud config set project YOUR_PROJECT_ID
```

3. **Enable required APIs:**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

4. **Authenticate (if needed):**
```bash
gcloud auth login
gcloud auth application-default login
```

## Step 2: Deploy Python Service to Cloud Run

Navigate to the pdf-processor directory and deploy:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor

# Deploy (this will build and deploy in one command)
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

**Note:** The first deployment may take 5-10 minutes as it builds the Docker image.

## Step 3: Get the Service URL

After deployment completes, get the URL:

```bash
gcloud run services describe ludex-pdf-processor \
  --region us-central1 \
  --format 'value(status.url)'
```

Copy this URL - you'll need it for the next step.

## Step 4: Test the Service

Test that the service is working:

```bash
# Replace YOUR_URL with the URL from Step 3
curl https://YOUR_URL/health
```

You should see: `{"status":"healthy"}`

## Step 5: Update Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `ludex` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `PYTHON_SERVICE_URL`
   - **Value**: The URL from Step 3 (e.g., `https://ludex-pdf-processor-xxxxx.run.app`)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your app (go to Deployments → click "..." → Redeploy)

## Step 6: Update Google Sheets Schema

The `ruleSections` column will be created automatically when the first game is processed. However, you can manually add it:

1. Open your Google Sheet
2. Go to column N (after column M which is `errorMessage`)
3. Add header: `ruleSections` in row 1
4. Format as Plain text (not JSON)

**Note:** The code will auto-create this column if it doesn't exist, so this step is optional.

## Step 7: Test End-to-End

1. Go to your deployed Ludex app
2. Upload a PDF rulebook
3. Wait for processing (should be faster now!)
4. Check the Rules tab - it should show structured sections with sidebar navigation

## Troubleshooting

### If deployment fails:

1. **Check billing:**
```bash
gcloud billing accounts list
```

2. **Check quotas:**
```bash
gcloud compute project-info describe --project YOUR_PROJECT_ID
```

3. **View logs:**
```bash
gcloud run services logs read ludex-pdf-processor --region us-central1
```

### If service times out:

Increase timeout and memory:
```bash
gcloud run services update ludex-pdf-processor \
  --region us-central1 \
  --timeout 600 \
  --memory 4Gi
```

### If you need to update the service:

After making changes to the Python code:
```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor \
  --source . \
  --region us-central1
```

## Quick Reference Commands

```bash
# Deploy
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor --source . --region us-central1 --allow-unauthenticated --memory 2Gi --timeout 300

# Get URL
gcloud run services describe ludex-pdf-processor --region us-central1 --format 'value(status.url)'

# View logs
gcloud run services logs read ludex-pdf-processor --region us-central1 --limit 50

# Update service
gcloud run services update ludex-pdf-processor --region us-central1 --memory 4Gi --timeout 600

# Delete service (if needed)
gcloud run services delete ludex-pdf-processor --region us-central1
```

