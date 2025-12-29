#!/bin/bash

# Quick deployment script - Run this in your terminal
# Make sure you've set: export CLOUDSDK_PYTHON=$(which python3)

set -e

echo "🚀 Deploying Ludex PDF Processor to Cloud Run"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found. Make sure you're in the pdf-processor directory"
    exit 1
fi

# Check current project
PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ -z "$PROJECT" ]; then
    echo "⚠️  No project set. Listing available projects..."
    gcloud projects list
    echo ""
    read -p "Enter project ID: " PROJECT
    gcloud config set project "$PROJECT"
fi

echo "✅ Using project: $(gcloud config get-value project)"
echo ""

# Enable APIs (skip if permission denied - can be done via web UI)
echo "📦 Enabling required APIs..."
if gcloud services enable cloudbuild.googleapis.com --quiet 2>/dev/null; then
    echo "✅ Cloud Build API enabled"
else
    echo "⚠️  Could not enable Cloud Build API (permission denied)"
    echo "   Enable it manually: https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com?project=$(gcloud config get-value project)"
fi

if gcloud services enable run.googleapis.com --quiet 2>/dev/null; then
    echo "✅ Cloud Run API enabled"
else
    echo "⚠️  Could not enable Cloud Run API (permission denied)"
    echo "   Enable it manually: https://console.cloud.google.com/apis/library/run.googleapis.com?project=$(gcloud config get-value project)"
    echo ""
    echo "   After enabling APIs, press Enter to continue..."
    read
fi
echo ""

# Check permissions before deploying
echo "🔍 Checking permissions..."
if ! gcloud run services list --region us-central1 --quiet 2>/dev/null; then
    echo ""
    echo "❌ Permission denied! You need Cloud Run Admin role."
    echo ""
    echo "Fix this:"
    echo "1. Go to: https://console.cloud.google.com/iam-admin/iam?project=$(gcloud config get-value project)"
    echo "2. Click 'Grant Access'"
    echo "3. Add: $(gcloud config get-value account)"
    echo "4. Role: Cloud Run Admin (or Owner)"
    echo "5. Save and wait 30 seconds"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Deploy
echo "🔨 Building and deploying (this may take 5-10 minutes)..."
echo ""

gcloud run deploy ludex-pdf-processor \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0

echo ""
echo "✅ Deployment complete!"
echo ""

# Get URL
SERVICE_URL=$(gcloud run services describe ludex-pdf-processor \
  --region us-central1 \
  --format 'value(status.url)')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Service URL:"
echo "   $SERVICE_URL"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Test the service:"
echo "   curl $SERVICE_URL/health"
echo ""
echo "2. Add to Vercel:"
echo "   - Go to: https://vercel.com/dashboard"
echo "   - Select your ludex project"
echo "   - Settings → Environment Variables"
echo "   - Add: PYTHON_SERVICE_URL = $SERVICE_URL"
echo "   - Redeploy your app"
echo ""
echo "3. Test end-to-end by uploading a PDF in your app"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

