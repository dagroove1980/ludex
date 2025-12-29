# Deployment Commands - Copy & Paste

Since gcloud works in your terminal, here are the exact commands to run:

## Step 1: Set Python Path (if not already done)

```bash
export CLOUDSDK_PYTHON=$(which python3)
```

## Step 2: Navigate to PDF Processor Directory

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
```

## Step 3: Set Your Google Cloud Project

**Option A: Use existing project**
```bash
# List projects
gcloud projects list

# Set project
gcloud config set project YOUR_PROJECT_ID
```

**Option B: Create new project (via web UI)**
1. Go to https://console.cloud.google.com
2. Create new project named "ludex-pdf-processor"
3. Then: `gcloud config set project ludex-pdf-processor`

## Step 4: Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

## Step 5: Deploy

**Option A: Use the script**
```bash
./deploy-now.sh
```

**Option B: Manual deployment**
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

## Step 6: Get the Service URL

After deployment completes, run:

```bash
gcloud run services describe ludex-pdf-processor \
  --region us-central1 \
  --format 'value(status.url)'
```

**Copy this URL** - you'll need it for Vercel!

## Step 7: Test the Service

```bash
# Replace YOUR_URL with the URL from Step 6
curl https://YOUR_URL/health
```

Should return: `{"status":"healthy"}`

## Step 8: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **ludex** project
3. **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key**: `PYTHON_SERVICE_URL`
   - **Value**: (paste the URL from Step 6)
   - **Environment**: Check all (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** → Click **"..."** on latest → **Redeploy**

## Step 9: Test End-to-End

1. Go to your deployed Ludex app
2. Upload a PDF rulebook
3. Check the Rules tab - should show structured sections with sidebar!

## Troubleshooting

### If deployment fails with "permission denied":
```bash
gcloud auth login
gcloud auth application-default login
```

### If you need to update the service later:
```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
gcloud run deploy ludex-pdf-processor --source . --region us-central1
```

### View logs:
```bash
gcloud run services logs read ludex-pdf-processor --region us-central1 --limit 50
```

