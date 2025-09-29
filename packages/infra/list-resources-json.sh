#!/bin/bash

# Script to list all Eventarc Advanced resources in JSON format
# Usage: ./list-resources-json.sh > resources.json

set -e

PROJECT_ID="gen-lang-client-0874846742"
CLOUD_RUN_REGION="us-west1"
EVENTARC_REGION="us-central1"

gcloud config set project "${PROJECT_ID}" --quiet 2>/dev/null

# Initialize JSON structure
echo "{"
echo "  \"project\": \"${PROJECT_ID}\","
echo "  \"cloudRunRegion\": \"${CLOUD_RUN_REGION}\","
echo "  \"eventarcRegion\": \"${EVENTARC_REGION}\","
echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","

# MessageBuses
echo "  \"messageBuses\": $(gcloud eventarc message-buses list \
  --location="${EVENTARC_REGION}" \
  --format=json 2>/dev/null || echo '[]'),"

# Google API Sources
echo "  \"googleApiSources\": $(gcloud eventarc google-api-sources list \
  --location="${EVENTARC_REGION}" \
  --format=json 2>/dev/null || echo '[]'),"

# Pipelines
echo "  \"pipelines\": $(gcloud eventarc pipelines list \
  --location="${EVENTARC_REGION}" \
  --format=json 2>/dev/null || echo '[]'),"

# Enrollments
echo "  \"enrollments\": $(gcloud eventarc enrollments list \
  --location="${EVENTARC_REGION}" \
  --format=json 2>/dev/null || echo '[]'),"

# Cloud Run Services
echo "  \"cloudRunServices\": $(gcloud run services list \
  --region="${CLOUD_RUN_REGION}" \
  --filter="metadata.labels.managed_by=pulumi" \
  --format=json 2>/dev/null || echo '[]'),"

# Storage Buckets
echo "  \"storageBuckets\": $(gcloud storage buckets list \
  --filter="labels.managed_by=pulumi" \
  --format=json 2>/dev/null || echo '[]'),"

# Pub/Sub Topics
echo "  \"pubsubTopics\": $(gcloud pubsub topics list \
  --filter="labels.managed_by=pulumi" \
  --format=json 2>/dev/null || echo '[]'),"

# Pub/Sub Subscriptions (remove trailing comma for last item)
echo "  \"pubsubSubscriptions\": $(gcloud pubsub subscriptions list \
  --filter="labels.managed_by=pulumi" \
  --format=json 2>/dev/null || echo '[]')"

echo "}"
