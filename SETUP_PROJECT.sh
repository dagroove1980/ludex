#!/bin/bash

# Setup script for Ludex PDF Processor Google Cloud Project

set -e

echo "🔧 Setting up Google Cloud Project for Ludex"
echo "=============================================="
echo ""

# Check if project is set
PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT" ]; then
    echo "⚠️  No project set. Creating a new project..."
    echo ""
    
    # Generate unique project ID
    TIMESTAMP=$(date +%s)
    PROJECT_ID="ludex-pdf-processor-${TIMESTAMP}"
    
    echo "Creating project: $PROJECT_ID"
    gcloud projects create "$PROJECT_ID" --name="Ludex PDF Processor"
    
    echo ""
    echo "✅ Project created: $PROJECT_ID"
    echo ""
    echo "⚠️  IMPORTANT: You need to enable billing for this project!"
    echo "   Go to: https://console.cloud.google.com/billing"
    echo "   Link a billing account to: $PROJECT_ID"
    echo ""
    read -p "Press Enter after you've enabled billing..."
    
    gcloud config set project "$PROJECT_ID"
else
    echo "✅ Current project: $PROJECT"
    read -p "Use this project? (y/n): " USE_CURRENT
    if [ "$USE_CURRENT" != "y" ]; then
        echo ""
        echo "Available projects:"
        gcloud projects list
        echo ""
        read -p "Enter project ID: " PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    fi
fi

echo ""
echo "📦 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
echo "✅ APIs enabled"
echo ""

echo "✅ Setup complete! Project: $(gcloud config get-value project)"
echo ""
echo "Next step: Run the deployment script"
echo "  cd /Users/david.scebat/Documents/ludex/pdf-processor"
echo "  ./deploy-now.sh"

