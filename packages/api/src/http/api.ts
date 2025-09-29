import { HttpApi, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"

import { CreateJobRequest, HealthStatus, InternalUpdateResponse, JobAccepted, PubSubPushMessage } from "./schemas.js"

const Health = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("status", "/health").addSuccess(HealthStatus).addError(HttpApiError.HttpApiDecodeError)
)

const createJob = HttpApiEndpoint.post("createJob", "/jobs")
  .setPayload(CreateJobRequest)
  .addSuccess(JobAccepted, { status: 202 })
  .addError(HttpApiError.Conflict)
  .addError(HttpApiError.HttpApiDecodeError)

const Jobs = HttpApiGroup.make("jobs").add(createJob)

const Internal = HttpApiGroup.make("internal").add(
  HttpApiEndpoint.post("notifications", "/internal/notifications")
    .setPayload(PubSubPushMessage)
    .addSuccess(InternalUpdateResponse)
    .addError(HttpApiError.HttpApiDecodeError)
)

export const pureDialogApi = HttpApi
  .make(
    "PureDialogApi"
  )
  .add(Health)
  .add(Jobs)
  .add(Internal)
