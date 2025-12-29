#!/bin/bash

# Ludex PDF Processor Deployment Script
# This script helps deploy the Python service to Google Cloud Run

set -e

echo "🚀 Ludex PDF Processor Deployment"
echo "=================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$CURRENT_PROJECT" ]; then
    echo "⚠️  No Google Cloud project is set"
    echo ""
    echo "Available projects:"
    gcloud projects list --format="table(projectId,name)" || echo "  (No projects found or not authenticated)"
    echo ""
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
    echo "✅ Project set to: $PROJECT_ID"
else
    echo "✅ Current project: $CURRENT_PROJECT"
    read -p "Use this project? (y/n): " USE_CURRENT
    if [ "$USE_CURRENT" != "y" ]; then
        echo ""
        echo "Available projects:"
        gcloud projects list --format="table(projectId,name)"
        echo ""
        read -p "Enter your Google Cloud Project ID: " PROJECT_ID
        gcloud config set project "$PROJECT_ID"
        echo "✅ Project set to: $PROJECT_ID"
    else
        PROJECT_ID=$CURRENT_PROJECT
    fi
fi

echo ""
echo "📦 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet || true
gcloud services enable run.googleapis.com --quiet || true
echo "✅ APIs enabled"

echo ""
echo "🔨 Building and deploying to Cloud Run..."
echo "   This may take 5-10 minutes on first deployment..."
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

# Get the service URL
SERVICE_URL=$(gcloud run services describe ludex-pdf-processor \
  --region us-central1 \
  --format 'value(status.url)')

echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Test the service:"
echo "   curl $SERVICE_URL/health"
echo ""
echo "2. Add to Vercel environment variables:"
echo "   Key: PYTHON_SERVICE_URL"
echo "   Value: $SERVICE_URL"
echo ""
echo "3. Redeploy your Vercel app"
echo ""

