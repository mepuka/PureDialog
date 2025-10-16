import { createFailingJobStoreMock, createMockJobStore } from "../mocks/JobStoreMock.js"
/**
 * Layer composition utilities for test environments
 */
/**
 * Create a test layer with a pre-populated JobStore
 */
export const createTestJobStoreLayer = (initialJobs = []) => {
  const mockStore = createMockJobStore(initialJobs)
  return {
    layer: mockStore.mockLayer,
    mock: mockStore
  }
}
/**
 * Create a test layer that simulates database failures
 */
export const createFailingJobStoreLayer = () => {
  const failingMock = createFailingJobStoreMock()
  return {
    layer: failingMock.mockLayer,
    mock: failingMock
  }
}
/**
 * Combine multiple test layers for comprehensive testing
 */
export const createTestEnvironmentLayer = (options = {}) => {
  const { initialJobs = [], simulateFailures = false } = options
  if (simulateFailures) {
    return createFailingJobStoreLayer()
  }
  return createTestJobStoreLayer(initialJobs)
}
/**
 * Create layers for specific test scenarios
 */
export const TestScenarios = {
  /**
   * Empty store for testing job creation
   */
  emptyStore: () => createTestJobStoreLayer([]),
  /**
   * Store with existing jobs for testing collisions
   */
  withExistingJobs: (jobs) => createTestJobStoreLayer(jobs),
  /**
   * Store that fails all operations
   */
  failing: () => createFailingJobStoreLayer(),
  /**
   * Store for testing idempotency scenarios
   */
  idempotencyTest: (jobWithIdempotencyKey) => createTestJobStoreLayer([jobWithIdempotencyKey])
}
// # sourceMappingURL=testLayers.js.map
