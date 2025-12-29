# Deploying Trained Models to Cloud Run

After training models locally, deploy them to the Cloud Run service.

## Prerequisites

1. Models trained and saved in `training/models/`
2. Cloud Run service already deployed (see `pdf-processor/DEPLOY.md`)

## Step 1: Copy Models to PDF Processor

Models need to be accessible to the PDF processor service:

```bash
cd /Users/david.scebat/Documents/ludex

# Copy models directory to pdf-processor
cp -r training/models pdf-processor/
```

## Step 2: Update Dockerfile (if needed)

The Dockerfile already includes ML dependencies. Verify `pdf-processor/Dockerfile` includes:

```dockerfile
# Models will be copied with application code
COPY . .
```

## Step 3: Build and Deploy

```bash
cd pdf-processor

# Build Docker image with models
gcloud builds submit --tag gcr.io/ludex-pdf-processor/ludex-pdf-processor:latest

# Deploy to Cloud Run
gcloud run deploy ludex-pdf-processor \
  --image gcr.io/ludex-pdf-processor/ludex-pdf-processor:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300
```

**Note**: Increased memory to 2Gi for ML models. Adjust based on model size.

## Step 4: Verify Deployment

Test the service:

```bash
curl https://ludex-pdf-processor-255233430004.us-central1.run.app/health
```

Upload a test PDF and verify ML-enhanced parsing is working.

## Model Size Considerations

- **DistilBERT models**: ~260MB each (3 models = ~780MB)
- **BERT-base models**: ~440MB each (3 models = ~1.3GB)

If Docker image is too large:
1. Use model quantization (reduce precision)
2. Store models in Cloud Storage and download at runtime
3. Use smaller models (DistilBERT instead of BERT-base)

## Fallback Behavior

The service will automatically fall back to pattern-based detection if:
- Models are not found
- Model loading fails
- ML prediction errors occur

This ensures the service continues working even without ML models.

## Monitoring

After deployment, monitor:
- **Response time**: ML inference adds ~100-500ms per request
- **Memory usage**: Should stay under 2Gi
- **Error rates**: Check for model loading errors

## Rollback

If ML models cause issues, redeploy without models:

```bash
# Remove models from pdf-processor directory
rm -rf pdf-processor/models

# Redeploy
gcloud builds submit --tag gcr.io/ludex-pdf-processor/ludex-pdf-processor:latest
gcloud run deploy ludex-pdf-processor --image gcr.io/ludex-pdf-processor/ludex-pdf-processor:latest
```

