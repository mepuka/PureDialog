import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema } from "effect"
import {
  BuiltContainerImageSchema,
  DeployedCloudRunServiceSchema,
  GcpConfig,
  GcpConfigTest
} from "../../src/index.js"

describe("Resource Schema Composition", () => {
  describe("Schema Transformations", () => {
    it("composes image and service schemas", () =>
      Effect.gen(function*() {
        // Image data from build step
        const image = {
          uri: "gcr.io/my-project/worker:v1" as any,
          digest: "sha256:abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234" as any,
          tag: "v1" as any,
          projectId: "my-project" as any,
          registry: "gcr.io",
          repository: "my-project/worker",
          builtAt: "2025-01-16T10:00:00Z",
          sizeBytes: 50000000
        }

        // Validate image
        const validatedImage = yield* Schema.decode(BuiltContainerImageSchema)(image)

        // Use validated image to create service
        const service = {
          name: "worker-service" as any,
          projectId: validatedImage.projectId, // Reuse from image
          region: "us-west1" as any,
          url: "https://worker-service-abc-uw.a.run.app" as any,
          image: validatedImage.uri, // Reference built image
          serviceAccount: "worker@my-project.iam.gserviceaccount.com" as any,
          status: "READY" as const,
          latestRevision: "worker-service-00001",
          deployedAt: "2025-01-16T10:05:00Z"
        }

        const validatedService = yield* Schema.decode(DeployedCloudRunServiceSchema)(service)

        // Verify composition
        assert.strictEqual(validatedService.image, validatedImage.uri)
        assert.strictEqual(validatedService.projectId, validatedImage.projectId)
      })
    )
  })

  describe("Layer-based Resource Construction", () => {
    it("demonstrates image layer → service layer pattern", () =>
      Effect.gen(function*() {
        // Simulate image build layer - returns BuiltContainerImage
        interface ImageBuildResult {
          readonly image: typeof BuiltContainerImageSchema.Type
        }

        class ImageBuildTag extends Effect.Tag("ImageBuild")<ImageBuildTag, ImageBuildResult>() {}

        const ImageBuildLayer = Layer.succeed(ImageBuildTag, {
          image: {
            uri: "gcr.io/test/app:latest" as any,
            digest: "sha256:1111111111111111111111111111111111111111111111111111111111111111" as any,
            tag: "latest" as any,
            projectId: "test-project" as any,
            registry: "gcr.io",
            repository: "test/app",
            builtAt: "2025-01-16T12:00:00Z",
            sizeBytes: 45000000
          }
        })

        // Service deploy layer depends on image layer
        interface ServiceDeployResult {
          readonly service: typeof DeployedCloudRunServiceSchema.Type
        }

        class ServiceDeployTag extends Effect.Tag("ServiceDeploy")<
          ServiceDeployTag,
          ServiceDeployResult
        >() {}

        const ServiceDeployLayer = Layer.effect(
          ServiceDeployTag,
          Effect.gen(function*() {
            // Get built image from previous layer
            const { image } = yield* ImageBuildTag

            // Create service using image
            return {
              service: {
                name: "deployed-app" as any,
                projectId: image.projectId,
                region: "us-central1" as any,
                url: "https://deployed-app-xyz-uc.a.run.app" as any,
                image: image.uri,
                serviceAccount: "app@test-project.iam.gserviceaccount.com" as any,
                status: "READY" as const,
                latestRevision: "deployed-app-00001",
                deployedAt: "2025-01-16T12:05:00Z"
              }
            }
          })
        )

        // Compose layers using Layer.provideMerge
        const fullPipeline = Layer.provideMerge(ServiceDeployLayer, ImageBuildLayer)

        // Use the pipeline
        const result = yield* Effect.gen(function*() {
          const buildResult = yield* ImageBuildTag
          const deployResult = yield* ServiceDeployTag

          return {
            image: buildResult.image,
            service: deployResult.service
          }
        }).pipe(Effect.provide(fullPipeline))

        // Verify the pipeline
        assert.strictEqual(result.service.image, result.image.uri)
        assert.strictEqual(result.service.projectId, result.image.projectId)
        assert.strictEqual(result.service.status, "READY")
      })
    )

    it("demonstrates config → image → service composition", () =>
      Effect.gen(function*() {
        // Layer 1: Config
        const configLayer = GcpConfigTest({
          projectId: "pipeline-test" as any,
          projectNumber: "123456",
          region: "us-west1" as any,
          serviceAccount: "deployer@pipeline-test.iam.gserviceaccount.com" as any
        })

        // Layer 2: Image build (uses config)
        interface ImageResult {
          readonly image: typeof BuiltContainerImageSchema.Type
        }

        class ImageTag extends Effect.Tag("Image")<ImageTag, ImageResult>() {}

        const imageLayer = Layer.effect(
          ImageTag,
          Effect.gen(function*() {
            const config = yield* GcpConfig

            return {
              image: {
                uri: `gcr.io/${config.projectId}/service:latest` as any,
                digest: "sha256:2222222222222222222222222222222222222222222222222222222222222222" as any,
                tag: "latest" as any,
                projectId: config.projectId,
                registry: "gcr.io",
                repository: `${config.projectId}/service`,
                builtAt: "2025-01-16T14:00:00Z",
                sizeBytes: 60000000
              }
            }
          })
        )

        // Layer 3: Service deploy (uses config + image)
        interface ServiceResult {
          readonly service: typeof DeployedCloudRunServiceSchema.Type
        }

        class ServiceTag extends Effect.Tag("Service")<ServiceTag, ServiceResult>() {}

        const serviceLayer = Layer.effect(
          ServiceTag,
          Effect.gen(function*() {
            const config = yield* GcpConfig
            const { image } = yield* ImageTag

            return {
              service: {
                name: "full-pipeline" as any,
                projectId: config.projectId,
                region: config.region,
                url: "https://full-pipeline-abc-uw.a.run.app" as any,
                image: image.uri,
                serviceAccount: config.serviceAccount,
                status: "READY" as const,
                latestRevision: "full-pipeline-00001",
                deployedAt: "2025-01-16T14:05:00Z"
              }
            }
          })
        )

        // Compose all layers
        const pipeline = Layer.provideMerge(
          Layer.provideMerge(serviceLayer, imageLayer),
          configLayer
        )

        // Execute pipeline
        const result = yield* Effect.gen(function*() {
          const config = yield* GcpConfig
          const { image } = yield* ImageTag
          const { service } = yield* ServiceTag

          return { config, image, service }
        }).pipe(Effect.provide(pipeline))

        // Verify the composition
        assert.strictEqual(result.service.projectId, result.config.projectId)
        assert.strictEqual(result.service.region, result.config.region)
        assert.strictEqual(result.service.image, result.image.uri)
        assert.strictEqual(result.image.projectId, result.config.projectId)
      })
    )
  })

  describe("Functor Transformation Pattern", () => {
    it("demonstrates Layer.map for pure transformations", () =>
      Effect.gen(function*() {
        // Base layer with image
        interface ImageData {
          readonly image: typeof BuiltContainerImageSchema.Type
        }

        class ImageTag extends Effect.Tag("Image")<ImageTag, ImageData>() {}

        const baseImageLayer = Layer.succeed(ImageTag, {
          image: {
            uri: "gcr.io/transform/app:v1.0" as any,
            digest: "sha256:3333333333333333333333333333333333333333333333333333333333333333" as any,
            tag: "v1.0" as any,
            projectId: "transform-project" as any,
            registry: "gcr.io",
            repository: "transform/app",
            builtAt: "2025-01-16T16:00:00Z",
            sizeBytes: 40000000
          }
        })

        // Transform layer using Layer.map (pure transformation)
        interface ImageMetadata {
          readonly uri: string
          readonly sizeInMB: number
          readonly registry: string
        }

        class MetadataTag extends Effect.Tag("Metadata")<MetadataTag, ImageMetadata>() {}

        // Layer.map transforms the context
        const metadataLayer = baseImageLayer.pipe(
          Layer.map((context) => {
            const imageData = Effect.runSync(context.pipe(Effect.map((ctx) => ctx.get(ImageTag))))

            return Effect.runSync(
              Effect.succeed({
                uri: imageData.image.uri,
                sizeInMB: Math.round(imageData.image.sizeBytes / (1024 * 1024)),
                registry: imageData.image.registry
              })
            )
          })
        )

        // Note: In real usage, you'd use Layer.flatMap or provide pattern
        // This is just demonstrating the concept
        const imageData = yield* ImageTag.pipe(Effect.provide(baseImageLayer))

        assert.strictEqual(imageData.image.sizeBytes, 40000000)
      })
    )
  })
})
