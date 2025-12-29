# Deploy Now - You're Ready!

You're now logged in as `david.scebat@gmail.com` which should have access to the project.

## Run Deployment

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor
./deploy-now.sh
```

Or manually:

```bash
cd /Users/david.scebat/Documents/ludex/pdf-processor

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

## What Happens Next

1. **Build Phase** (5-10 minutes first time):
   - Cloud Build will create a Docker image
   - You'll see build logs

2. **Deploy Phase** (1-2 minutes):
   - Service deploys to Cloud Run
   - You'll get a service URL

3. **Get the URL**:
   ```bash
   gcloud run services describe ludex-pdf-processor \
     --region us-central1 \
     --format 'value(status.url)'
   ```

4. **Add to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `PYTHON_SERVICE_URL` = (the URL from step 3)
   - Redeploy your app

## If You Get Permission Errors

If you still get permission errors, grant yourself the role:

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ludex-pdf-processor
2. Click "Grant Access"
3. Add: `david.scebat@gmail.com`
4. Role: **Owner** or **Cloud Run Admin**
5. Save

Then try deployment again.

