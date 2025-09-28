import { assert, describe, it } from "@effect/vitest"
import { generateJobId, generateRequestId } from "../../src/utils/job-creation.js"

describe("Job Creation Logic", () => {
  describe("generateJobId", () => {
    it("should generate valid job IDs", () => {
      const jobId = generateJobId()

      assert.isTrue(jobId.startsWith("job_"))
      assert.isTrue(jobId.length > 10) // UUID length + prefix
    })

    it("should generate unique job IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateJobId())
      const uniqueIds = new Set(ids)

      assert.strictEqual(uniqueIds.size, ids.length)
    })

    it("should generate IDs with correct format", () => {
      const jobId = generateJobId()

      // Should match job_ followed by UUID format
      const uuidPattern = /^job_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.isTrue(uuidPattern.test(jobId))
    })
  })

  describe("generateRequestId", () => {
    it("should generate valid request IDs", () => {
      const requestId = generateRequestId()

      assert.isTrue(requestId.startsWith("req_"))
      assert.isTrue(requestId.length > 10) // UUID length + prefix
    })

    it("should generate unique request IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateRequestId())
      const uniqueIds = new Set(ids)

      assert.strictEqual(uniqueIds.size, ids.length)
    })

    it("should generate IDs with correct format", () => {
      const requestId = generateRequestId()

      // Should match req_ followed by UUID format
      const uuidPattern = /^req_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.isTrue(uuidPattern.test(requestId))
    })
  })

  describe("ID generation performance", () => {
    it("should generate job IDs efficiently", () => {
      const iterations = 1000
      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateJobId()
      }

      const duration = Date.now() - start

      // Should complete 1000 generations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should generate request IDs efficiently", () => {
      const iterations = 1000
      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateRequestId()
      }

      const duration = Date.now() - start

      // Should complete 1000 generations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should handle concurrent ID generation", () => {
      const iterations = 50

      const jobIds = Array.from({ length: iterations }, () => generateJobId())
      const requestIds = Array.from({ length: iterations }, () => generateRequestId())

      // All job IDs should be unique
      const uniqueJobIds = new Set(jobIds)
      assert.strictEqual(uniqueJobIds.size, iterations)

      // All request IDs should be unique
      const uniqueRequestIds = new Set(requestIds)
      assert.strictEqual(uniqueRequestIds.size, iterations)

      // Job IDs and request IDs should be different
      const allIds = new Set([...jobIds, ...requestIds])
      assert.strictEqual(allIds.size, iterations * 2)
    })
  })

  describe("ID consistency", () => {
    it("should maintain consistent formatting", () => {
      const jobIds = Array.from({ length: 10 }, () => generateJobId())
      const requestIds = Array.from({ length: 10 }, () => generateRequestId())

      jobIds.forEach((id) => {
        assert.isTrue(id.startsWith("job_"))
        assert.isTrue(id.length === 40) // job_ (4) + UUID (36)
      })

      requestIds.forEach((id) => {
        assert.isTrue(id.startsWith("req_"))
        assert.isTrue(id.length === 40) // req_ (4) + UUID (36)
      })
    })

    it("should never generate collisions between job and request IDs", () => {
      const jobIds = Array.from({ length: 1000 }, () => generateJobId())
      const requestIds = Array.from({ length: 1000 }, () => generateRequestId())

      // Check that no job ID looks like a request ID or vice versa
      jobIds.forEach((jobId) => {
        assert.isFalse(jobId.startsWith("req_"))
      })

      requestIds.forEach((requestId) => {
        assert.isFalse(requestId.startsWith("job_"))
      })

      // Check for any accidental collisions
      const allIds = new Set([...jobIds, ...requestIds])
      assert.strictEqual(allIds.size, 2000)
    })
  })

  describe("edge cases", () => {
    it("should handle rapid successive calls", () => {
      const rapidJobIds = []
      const rapidRequestIds = []

      // Generate IDs as fast as possible
      for (let i = 0; i < 100; i++) {
        rapidJobIds.push(generateJobId())
        rapidRequestIds.push(generateRequestId())
      }

      // All should still be unique
      const uniqueJobIds = new Set(rapidJobIds)
      const uniqueRequestIds = new Set(rapidRequestIds)

      assert.strictEqual(uniqueJobIds.size, 100)
      assert.strictEqual(uniqueRequestIds.size, 100)
    })

    it("should work correctly in high-concurrency scenarios", () => {
      // Simulate concurrent calls (though they're actually sequential in JS)
      const promises = Array.from({ length: 50 }, () =>
        Promise.resolve({
          jobId: generateJobId(),
          requestId: generateRequestId()
        }))

      return Promise.all(promises).then((results) => {
        const allJobIds = results.map((r) => r.jobId)
        const allRequestIds = results.map((r) => r.requestId)

        // All should be unique
        assert.strictEqual(new Set(allJobIds).size, 50)
        assert.strictEqual(new Set(allRequestIds).size, 50)

        // All should have correct format
        allJobIds.forEach((id) => assert.isTrue(id.startsWith("job_")))
        allRequestIds.forEach((id) => assert.isTrue(id.startsWith("req_")))
      })
    })
  })
})
