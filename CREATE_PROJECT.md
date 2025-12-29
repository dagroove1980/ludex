# Create Google Cloud Project for Ludex

You need to create a new project. Here are two options:

## Option 1: Create via Web UI (Recommended)

1. Go to: https://console.cloud.google.com/projectcreate
2. Fill in:
   - **Project name**: `Ludex PDF Processor`
   - **Project ID**: Will auto-generate (or choose something like `ludex-pdf-processor`)
3. Click **Create**
4. Wait for project creation (30 seconds)
5. Then run:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Option 2: Create via CLI

```bash
# Create the project
gcloud projects create ludex-pdf-processor-$(date +%s) \
  --name="Ludex PDF Processor"

# Set it as active
gcloud config set project ludex-pdf-processor-XXXXX
```

**Note:** Replace `XXXXX` with the actual project ID that gets created.

## After Creating Project

1. Enable billing (required for Cloud Run):
   - Go to: https://console.cloud.google.com/billing
   - Link your billing account to the new project

2. Enable APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

3. Then proceed with deployment!

