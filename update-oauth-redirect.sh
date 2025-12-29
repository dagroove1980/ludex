#!/bin/bash

# Script to update Google OAuth Redirect URI using gcloud CLI
# This requires the OAuth Client ID

set -e

PROJECT_ID="ludex-482617"
REDIRECT_URI="https://ludex-iota.vercel.app/api/auth/callback/google"

echo "🔧 Updating Google OAuth Redirect URI"
echo "Project: $PROJECT_ID"
echo "Redirect URI: $REDIRECT_URI"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Get OAuth client ID from user or Vercel
echo ""
echo "📋 To update OAuth redirect URI, you need:"
echo "1. Your OAuth Client ID (from Google Cloud Console)"
echo ""
echo "You can find it at:"
echo "https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
read -p "Enter your OAuth Client ID (or press Enter to skip): " CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo ""
    echo "⚠️  Skipping automated update."
    echo ""
    echo "Please update manually:"
    echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
    echo "2. Click on your OAuth 2.0 Client ID"
    echo "3. Under 'Authorized redirect URIs', add:"
    echo "   $REDIRECT_URI"
    echo "4. Click Save"
    exit 0
fi

echo ""
echo "Using OAuth Client ID: $CLIENT_ID"
echo ""

# Note: Updating OAuth redirect URIs via gcloud CLI is complex
# It requires using the Google Cloud Console API directly
# The easiest way is through the web UI

echo "⚠️  Note: Updating OAuth redirect URIs via CLI requires complex API calls."
echo ""
echo "📝 Recommended: Update via Google Cloud Console web UI"
echo ""
echo "Steps:"
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "2. Click on your OAuth 2.0 Client ID"
echo "3. Under 'Authorized redirect URIs', click 'ADD URI'"
echo "4. Add: $REDIRECT_URI"
echo "5. Click 'SAVE'"
echo ""
echo "✅ After updating, the OAuth redirect error should be fixed!"

