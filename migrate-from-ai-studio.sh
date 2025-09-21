#!/bin/bash

# Migration script from AI Studio applet to independent Cloud Run deployment

set -e

echo "🔄 Migrating from AI Studio to independent Cloud Run deployment..."

# Configuration from your existing deployment
PROJECT_ID="gen-lang-client-0874846742"  # Corrected: using project ID not project number
PROJECT_NUMBER="211636922435"
REGION="us-west1"
OLD_SERVICE="gemini-youtube-transcriber"
NEW_SERVICE="pure-dialog"
REPOSITORY="pure-dialog-repo"
SERVICE_ACCOUNT="${NEW_SERVICE}-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "📋 Current deployment info:"
echo "  Project: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Old service: $OLD_SERVICE"
echo "  New service: $NEW_SERVICE"

# Set up environment
export GOOGLE_CLOUD_PROJECT=$PROJECT_ID
export GOOGLE_CLOUD_REGION=$REGION
export SERVICE_NAME=$NEW_SERVICE

# Secure API key handling
echo "🔐 Setting up secure API key handling..."
echo "For security, we'll store your API key in Google Secret Manager instead of plaintext files."

# Create secret in Secret Manager
echo "📝 Creating secret in Secret Manager..."
echo "Please enter your Gemini API key when prompted (input will be hidden):"
read -s -p "Gemini API Key: " API_KEY
echo

# Store in Secret Manager
gcloud secrets create gemini-api-key \
    --data-file=<(echo -n "$API_KEY") \
    --project=$PROJECT_ID \
    --quiet || echo "Secret already exists, updating..."

gcloud secrets versions add gemini-api-key \
    --data-file=<(echo -n "$API_KEY") \
    --project=$PROJECT_ID \
    --quiet

# Create .env file for local development (without the actual key)
cat > .env << EOF
# Gemini API Configuration (for local development only)
# In production, this will be retrieved from Secret Manager
GEMINI_API_KEY=your_api_key_here

# Application Configuration
NODE_ENV=development

# Cloud Run Configuration (for deployment)
GOOGLE_CLOUD_PROJECT=$PROJECT_ID
GOOGLE_CLOUD_REGION=$REGION
SERVICE_NAME=$NEW_SERVICE
EOF

echo "✅ API key stored securely in Secret Manager"
echo "⚠️  For local development, manually edit .env with your API key"

# Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
gcloud services enable iam.googleapis.com --project=$PROJECT_ID

# Create dedicated service account
echo "👤 Creating dedicated service account..."
gcloud iam service-accounts create ${NEW_SERVICE}-sa \
    --display-name="PureDialog Service Account" \
    --description="Dedicated service account for PureDialog Cloud Run service" \
    --project=$PROJECT_ID \
    --quiet || echo "Service account already exists"

# Grant minimal required permissions
echo "🔒 Granting minimal required permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/aiplatform.user" \
    --quiet

# Create Artifact Registry repository
echo "📦 Setting up Artifact Registry..."
gcloud artifacts repositories create $REPOSITORY \
    --repository-format=docker \
    --location=$REGION \
    --project=$PROJECT_ID \
    --quiet || echo "Repository already exists"

# Configure Docker
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

echo ""
echo "🚀 Ready to deploy! Run the following commands:"
echo "  1. Build and test locally: pnpm dev"
echo "  2. Deploy to Cloud Run: ./deploy.sh"
echo ""
echo "📊 After deployment, you can:"
echo "  - Compare the new service with the old one"
echo "  - Update your DNS/domain if needed"
echo "  - Delete the old AI Studio service: gcloud run services delete $OLD_SERVICE --region=$REGION"
echo ""
echo "🌐 Your current AI Studio URL: https://gemini-youtube-transcriber-$PROJECT_NUMBER.us-west1.run.app"
echo "🌐 New service will be available at: https://$NEW_SERVICE-$PROJECT_NUMBER.us-west1.run.app"
echo ""
echo "🔐 Security improvements:"
echo "  - API key stored in Secret Manager (not plaintext)"
echo "  - Dedicated service account with minimal permissions"
echo "  - No sensitive data in container or logs"
