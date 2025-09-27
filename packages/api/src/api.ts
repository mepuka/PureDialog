import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { CreateJobRequest, HealthStatus, JobAccepted, JobAlreadyExists, PubSubPushMessage } from "./schemas.js"

// Health endpoint group
const Health = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("status", "/health")
    .addSuccess(HealthStatus)
)

// Public jobs endpoint group
const Jobs = HttpApiGroup.make("jobs").add(
  HttpApiEndpoint.post("createJob", "/jobs")
    .addSuccess(JobAccepted)
    .addSuccess(JobAlreadyExists)
    .setPayload(CreateJobRequest)
)

// Internal Pub/Sub endpoint group
const Internal = HttpApiGroup.make("internal").add(
  HttpApiEndpoint.post("jobUpdate", "/_internal/job-update")
    .addSuccess(Schema.Struct({ received: Schema.Boolean }))
    .setPayload(PubSubPushMessage)
)

// Complete API definition
const PureDialogApi = HttpApi.make("PureDialogApi")
  .add(Health)
  .add(Jobs)
  .add(Internal)

export { Health, Internal, Jobs, PureDialogApi }
