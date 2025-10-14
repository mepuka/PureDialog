# Infrastructure Management Scripts

## Resource Listing Scripts

### `list-resources.sh` - Human-Readable Output

Lists all Eventarc Advanced resources with formatted, colored output.

**Usage:**
```bash
cd packages/infra
./list-resources.sh
```

**What it lists:**
1. MessageBus (existing `main` bus in us-central1)
2. Google API Sources (GCS event source)
3. Pipelines (3 pipelines for routing to Cloud Run)
4. Enrollments (3 enrollments with CEL filters)
5. Cloud Run Services (API + Workers)
6. Storage Buckets (Shared artifacts bucket)
7. Pub/Sub Topics (Events topic)
8. Pub/Sub Subscriptions (Event monitoring)
9. Detailed CEL filters for each enrollment

**Example Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Eventarc Advanced Stack Resources
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: gen-lang-client-0874846742
Cloud Run Region: us-west1
Eventarc Region: us-central1

═══════════════════════════════════════════════════
  1. MessageBus (existing)
═══════════════════════════════════════════════════
NAME  LOCATION     LOGGING_CONFIG
main  us-central1  INFO
...
```

### `list-resources-json.sh` - JSON Output

Outputs all resources in JSON format for programmatic use.

**Usage:**
```bash
cd packages/infra

# View JSON output
./list-resources-json.sh

# Save to file
./list-resources-json.sh > resources.json

# Process with jq
./list-resources-json.sh | jq '.enrollments[] | {name: .name, celMatch: .celMatch}'
```

**JSON Structure:**
```json
{
  "project": "gen-lang-client-0874846742",
  "cloudRunRegion": "us-west1",
  "eventarcRegion": "us-central1",
  "timestamp": "2025-09-29T19:30:00Z",
  "messageBuses": [...],
  "googleApiSources": [...],
  "pipelines": [...],
  "enrollments": [...],
  "cloudRunServices": [...],
  "storageBuckets": [...],
  "pubsubTopics": [...],
  "pubsubSubscriptions": [...]
}
```

## Quick Commands

### Check Specific Resource Types

```bash
# List only Eventarc Advanced resources
gcloud eventarc message-buses list --location=us-central1
gcloud eventarc google-api-sources list --location=us-central1
gcloud eventarc pipelines list --location=us-central1
gcloud eventarc enrollments list --location=us-central1

# Describe specific resources
gcloud eventarc pipelines describe metadata-worker --location=us-central1
gcloud eventarc enrollments describe metadata-worker --location=us-central1

# List Cloud Run services
gcloud run services list --region=us-west1 --filter="metadata.labels.managed_by=pulumi"

# List storage buckets
gcloud storage buckets list --filter="labels.managed_by=pulumi"
```

### Monitor Event Flow

```bash
# View logs from Google API Source
gcloud logging read "resource.type=eventarc.googleapis.com/GoogleApiSource" --limit=50

# View logs from Pipeline
gcloud logging read "resource.type=eventarc.googleapis.com/Pipeline" --limit=50

# View logs from specific Cloud Run service
gcloud run services logs read api --region=us-west1 --limit=50

# Follow Cloud Run logs in real-time
gcloud run services logs tail api --region=us-west1
```

### Test Event Routing

```bash
# Check if GCS events are being published to MessageBus
gcloud logging read "resource.type=gcs_bucket AND resource.labels.bucket_name=ingestion-shared-artifacts-*" --limit=10

# View Enrollment matching activity
gcloud logging read "resource.type=eventarc.googleapis.com/Enrollment" --limit=50

# Check Pipeline delivery to Cloud Run
gcloud logging read "resource.type=eventarc.googleapis.com/Pipeline AND jsonPayload.destination=~'run.app'" --limit=20
```

## Troubleshooting

### Verify Eventarc Resources Exist

```bash
# Check if resources are created
./list-resources.sh | grep -E "(found|No .* found)"
```

### Check for Errors

```bash
# View Eventarc errors
gcloud logging read "resource.type=~'eventarc' AND severity>=ERROR" --limit=50 --format=json

# View Cloud Run errors
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit=50
```

### Verify CEL Expressions

```bash
# Get CEL filter for each enrollment
gcloud eventarc enrollments list --location=us-central1 --format="table(name, celMatch)"

# Describe specific enrollment with full CEL expression
gcloud eventarc enrollments describe metadata-worker --location=us-central1 --format="value(celMatch)"
```

## Architecture Reference

### Event Flow
```
GCS Event (jobs/Queued/*.json)
  ↓
GoogleApiSource (gcs-events)
  ↓
MessageBus (main)
  ↓
Enrollment (metadata-worker) - CEL Filter
  ↓
Pipeline (metadata-worker)
  ↓
Cloud Run Service (worker-metadata)
```

### Path Patterns
- **Queued Jobs**: `jobs/Queued/*.json` → Metadata Worker
- **Processing Jobs**: `jobs/Processing/*.json` → Transcription Worker
- **Completed Jobs**: `jobs/Completed/*.json` → API Notifications

### Regions
- **Eventarc Advanced**: `us-central1` (MessageBus, Pipelines, Enrollments)
- **Cloud Run**: `us-west1` (All services)
- **Cross-region**: Pipelines in us-central1 call Cloud Run services in us-west1 via HTTPS
