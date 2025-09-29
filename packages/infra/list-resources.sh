#!/bin/bash

# Script to list all Eventarc Advanced and related resources
# Usage: ./list-resources.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="gen-lang-client-0874846742"
CLOUD_RUN_REGION="us-west1"
EVENTARC_REGION="us-central1"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Eventarc Advanced Stack Resources${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Project: ${BLUE}${PROJECT_ID}${NC}"
echo -e "Cloud Run Region: ${BLUE}${CLOUD_RUN_REGION}${NC}"
echo -e "Eventarc Region: ${BLUE}${EVENTARC_REGION}${NC}"
echo ""

# Set the active project
gcloud config set project "${PROJECT_ID}" --quiet

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  1. MessageBus (existing)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud eventarc message-buses list \
  --location="${EVENTARC_REGION}" \
  --format="table(name, location, loggingConfig.logSeverity)" || echo "No message buses found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  2. Google API Sources${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud eventarc google-api-sources list \
  --location="${EVENTARC_REGION}" \
  --format="table(name, location, destination, loggingConfig.logSeverity)" || echo "No Google API sources found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  3. Pipelines${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud eventarc pipelines list \
  --location="${EVENTARC_REGION}" \
  --format="table(name, location, destinations[0].httpEndpoint.uri.basename(), loggingConfig.logSeverity)" || echo "No pipelines found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  4. Enrollments${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud eventarc enrollments list \
  --location="${EVENTARC_REGION}" \
  --format="table(name, location, messageBus.basename(), destination.basename())" || echo "No enrollments found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  5. Cloud Run Services${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud run services list \
  --region="${CLOUD_RUN_REGION}" \
  --format="table(metadata.name, status.url, status.conditions[0].status)" \
  --filter="metadata.labels.managed_by=pulumi" || echo "No Cloud Run services found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  6. Storage Buckets${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud storage buckets list \
  --format="table(name, location, labels.managed_by)" \
  --filter="labels.managed_by=pulumi" || echo "No buckets found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  7. Pub/Sub Topics${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud pubsub topics list \
  --format="table(name, labels.managed_by)" \
  --filter="labels.managed_by=pulumi" || echo "No topics found"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  8. Pub/Sub Subscriptions${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
gcloud pubsub subscriptions list \
  --format="table(name, topic.basename(), ackDeadlineSeconds, pushConfig.pushEndpoint.basename())" \
  --filter="labels.managed_by=pulumi" || echo "No subscriptions found"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Detailed Enrollment CEL Filters${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

for enrollment in $(gcloud eventarc enrollments list --location="${EVENTARC_REGION}" --format="value(name)" 2>/dev/null); do
  enrollment_id=$(basename "${enrollment}")
  echo -e "${BLUE}Enrollment:${NC} ${enrollment_id}"
  gcloud eventarc enrollments describe "${enrollment_id}" \
    --location="${EVENTARC_REGION}" \
    --format="yaml(celMatch, destination, messageBus)" || echo "  Failed to get details"
  echo ""
done

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Resource Summary Complete${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
