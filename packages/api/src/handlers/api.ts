import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { JobConflictError } from "../errors.js"
import { CreateJobRequest, HealthStatus, InternalUpdateResponse, JobAccepted, PubSubPushMessage } from "../schemas.js"

const Health = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("status", "/health").addSuccess(HealthStatus)
)

// Public jobs endpoint group
const Jobs = HttpApiGroup.make("jobs").add(
  HttpApiEndpoint.post("createJob", "/jobs")
    .setPayload(CreateJobRequest)
    .addSuccess(JobAccepted, { status: 202 })
    .addError(JobConflictError, { status: 409 })
)

// Internal endpoints for State-Triggered Choreography
const Internal = HttpApiGroup.make("internal")
  .add(
    HttpApiEndpoint.post("notifications", "/_internal/notifications")
      .setPayload(PubSubPushMessage)
      .addSuccess(InternalUpdateResponse)
  )

// Complete API definition
export const PureDialogApi = HttpApi.make("PureDialogApi")
  .add(Health)
  .add(Jobs)
  .add(Internal)
