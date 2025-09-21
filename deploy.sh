#!/bin/bash

# App Engine Standard deployment script for PureDialog
# Make sure you have the Google Cloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-gen-lang-client-0874846742}"
REGION="${GOOGLE_CLOUD_REGION:-us-west1}"
SERVICE_NAME="${SERVICE_NAME:-pure-dialog}"
SERVICE_ACCOUNT="${SERVICE_NAME}-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🚀 Deploying PureDialog to App Engine Standard..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Service Account: $SERVICE_ACCOUNT"

# Check if required environment variables are set
if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "❌ Please set GOOGLE_CLOUD_PROJECT environment variable"
    exit 1
fi

# Verify secret exists
echo "🔍 Verifying Secret Manager setup..."
if ! gcloud secrets describe gemini-api-key --project=$PROJECT_ID >/dev/null 2>&1; then
    echo "❌ Secret 'gemini-api-key' not found in Secret Manager"
    echo "Please run ./migrate-from-ai-studio.sh first to set up secrets"
    exit 1
fi

# Verify service account exists
echo "🔍 Verifying service account..."
if ! gcloud iam service-accounts describe $SERVICE_ACCOUNT --project=$PROJECT_ID >/dev/null 2>&1; then
    echo "❌ Service account '$SERVICE_ACCOUNT' not found"
    echo "Please run ./migrate-from-ai-studio.sh first to create the service account"
    exit 1
fi

# Enable required APIs (idempotent)
echo "📋 Ensuring required APIs are enabled..."
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID --quiet
gcloud services enable appengine.googleapis.com --project=$PROJECT_ID --quiet

# Create App Engine application if it doesn't exist
echo "🏗️ Setting up App Engine application..."
gcloud app create --region=$REGION --project=$PROJECT_ID --quiet || echo "App Engine application already exists"

# Build and deploy using Cloud Build
echo "🏗️ Building and deploying with secure configuration..."
gcloud builds submit \
    --config cloudbuild.yaml \
    --substitutions _REGION=$REGION,_SERVICE_NAME=$SERVICE_NAME,_SERVICE_ACCOUNT=$SERVICE_ACCOUNT \
    --project=$PROJECT_ID

# Get the service URL
SERVICE_URL="https://${PROJECT_ID}.appspot.com"

echo "✅ Deployment complete!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "🔐 Security features enabled:"
echo "  - API key retrieved from Secret Manager"
echo "  - Dedicated service account with minimal permissions"
echo "  - App Engine Standard runtime security"
echo ""
echo "🧪 Test your deployment:"
echo "  curl -I $SERVICE_URL/health"
