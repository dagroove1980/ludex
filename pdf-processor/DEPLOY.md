# Deployment Guide for PDF Processor

## Quick Deploy to Google Cloud Run

### Option 1: Using gcloud CLI

```bash
# Set your project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Build and deploy in one command
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

### Option 2: Using Docker + gcloud

```bash
# Build Docker image
docker build -t gcr.io/$PROJECT_ID/ludex-pdf-processor .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/ludex-pdf-processor

# Deploy to Cloud Run
gcloud run deploy ludex-pdf-processor \
  --image gcr.io/$PROJECT_ID/ludex-pdf-processor \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300
```

## Get Service URL

After deployment, get the service URL:

```bash
gcloud run services describe ludex-pdf-processor \
  --region us-central1 \
  --format 'value(status.url)'
```

## Update Vercel Environment Variable

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `PYTHON_SERVICE_URL` with the Cloud Run URL from above
5. Redeploy your Vercel app

## Testing

Test the deployed service:

```bash
# Health check
curl https://your-service-url.run.app/health

# Process a PDF (replace with actual values)
curl -X POST https://your-service-url.run.app/process \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "test-id",
    "pdfUrl": "https://example.com/rules.pdf",
    "userId": "test-user"
  }'
```

## Troubleshooting

### Service times out
- Increase timeout: `--timeout 600`
- Increase memory: `--memory 4Gi`

### Out of memory errors
- Increase memory: `--memory 4Gi`

### Service not accessible
- Check if `--allow-unauthenticated` flag is set
- Verify the service is deployed successfully: `gcloud run services list`

