# Test Plan Implementation - 3 Phase Approach

## Overview
This document breaks down the comprehensive test plan into 3 focused phases, prioritizing core functionality and critical business logic over full coverage due to time constraints.

## Phase 1: Core Service Testing (Priority: CRITICAL)
**Timeline: 1-2 days**
**Goal: Ensure core business logic and data persistence work correctly**

### 1.1 Test Foundation Setup
**Files to create:**
- `src/test/fixtures/jobs.ts` - TranscriptionJob test data factories
- `src/test/mocks/JobStoreMock.ts` - Enhanced mock with state validation
- `src/test/utils/testLayers.ts` - Layer composition utilities

**Implementation:**
```typescript
// Key factory functions for consistent test data
export const createTestJob = (overrides?: Partial<TranscriptionJob>): TranscriptionJob
export const createJobWithStatus = (status: JobStatus): TranscriptionJob
export const createJobWithIdempotencyKey = (key: string): TranscriptionJob
```

### 1.2 JobStore Critical Path Testing
**File: `src/services/JobStore.test.ts`**

**Critical test scenarios:**
- ✅ **Job creation** - Basic job persistence
- ✅ **Idempotency collision detection** - Prevent duplicate jobs
- ✅ **Job status updates** - Status transition logic
- ✅ **Error handling** - Repository errors mapped correctly

**Why these tests:** JobStore is the primary interface for handlers and contains the core business logic for job management.

### 1.3 Idempotency Logic Testing
**File: `src/utils/idempotency.test.ts`**

**Critical test scenarios:**
- ✅ **Key generation** - Deterministic hash generation
- ✅ **Media hash consistency** - Same media = same hash
- ✅ **Key collision detection** - Different media with same user key

**Why these tests:** Idempotency is critical for preventing duplicate job creation and ensuring API reliability.

### 1.4 Job Creation Logic Testing
**File: `src/utils/job-creation.test.ts`**

**Critical test scenarios:**
- ✅ **Valid job creation** - Proper entity construction
- ✅ **Metadata assignment** - Idempotency key and timestamps
- ✅ **Validation failures** - Invalid media resource handling

**Why these tests:** Job creation is the entry point for all transcription requests.

## Phase 2: Handler Business Logic Testing (Priority: HIGH)
**Timeline: 1-2 days**
**Goal: Test core handler functionality focusing on business logic and error handling**

### 2.1 Internal Job Update Handler Testing (CORE FOCUS)
**File: `test/handlers/internal.test.ts`**

**Critical test scenarios:**
- ✅ **JobStatusChanged events** - Basic status transition processing
- ✅ **TranscriptComplete events** - Job completion with transcript ID
- ✅ **JobFailed events** - Error handling and status update
- ✅ **Job not found handling** - Missing job scenarios (log warning)
- ✅ **Message decoding errors** - Invalid message format handling
- ✅ **Database errors** - Repository failure handling

**Focused scope:** Target the `processEvent` function which contains the core business logic for all job state transitions.

**Mock setup:**
```typescript
// Use existing JobStoreMock and create simple MessageAdapter mock
const { mockJobStore, capturedUpdates } = createMockJobStore()
const mockMessageAdapter = createMockMessageAdapter()
```

**Why prioritized:** The internal handler processes all job lifecycle events and is critical for system operation.

### 2.2 Public Jobs Handler Testing (SIMPLIFIED SCOPE)
**File: `test/handlers/jobs.test.ts`**

**Critical test scenarios (LIMITED):**
- ✅ **Basic job creation** - Happy path flow only
- ✅ **Idempotency collision** - Return existing job
- ✅ **Repository errors** - Database failure handling
- ⚠️ **Skip complex validation testing** - Focus on business logic core

**Reduced scope:** Test only the core business logic flow, skip detailed input validation and edge cases.

**Why simplified:** The jobs handler is important but secondary to the internal message processing logic.

### 2.3 Message Processing Infrastructure
**Files to create:**
- `test/mocks/MessageAdapterMock.ts` - Domain event decoding simulation
- `test/fixtures/domainEvents.ts` - Core domain event test data

**Implementation focus:**
```typescript
// Minimal MessageAdapter mock
export const createMockMessageAdapter = () => {
  const decodedEvents: DomainEvent[] = []
  return { mockAdapter, decodedEvents }
}
```

**Reduced scope:** Create only essential mocks needed for handler testing, avoid complex PubSub simulation.

## Phase 3: Critical Path Validation (Priority: MEDIUM)
**Timeline: 1 day**
**Goal: Validate only the most critical system flows**

### 3.1 End-to-End Core Flow Testing (MINIMAL)
**File: `test/integration/core-flow.test.ts`**

**Single critical scenario:**
- ✅ **Job creation to completion** - Create job → receive completion event → verify final state

**Scope:** One integration test that validates the complete job lifecycle with mocked dependencies.

**Why minimal:** Focus on proving the core business flow works, skip edge cases and error scenarios.

### 3.2 Essential Error Propagation (TARGETED)
**Integration scenarios (LIMITED):**
- ✅ **Repository errors in handlers** - Verify error mapping works
- ✅ **Handler response structure** - Ensure proper HTTP responses

**Reduced scope:** Test only critical error paths that could break the API, skip comprehensive error testing.

## Implementation Priorities (NARROWED FOCUS)

### MUST HAVE (Phase 1 & 2 CORE)
1. ✅ **JobStore functionality** - Core business logic (COMPLETED)
2. ✅ **Idempotency logic** - Duplicate prevention (COMPLETED)
3. 🎯 **Internal jobUpdate handler** - Message processing (PRIMARY FOCUS)
4. 🎯 **Basic createJob handler** - Core job creation flow
5. 🎯 **Essential error handling** - Repository error mapping

### SHOULD HAVE (Phase 3 MINIMAL)
1. 🎯 **Core flow integration** - Single end-to-end test
2. 🎯 **Critical error propagation** - Handler error responses

### WILL NOT IMPLEMENT (Out of Scope)
1. ❌ **Complex validation testing** - Input edge cases
2. ❌ **HTTP integration testing** - Server startup/health checks  
3. ❌ **Repository layer testing** - CloudStorage integration
4. ❌ **Performance testing** - Concurrent operations
5. ❌ **Google Cloud emulator testing** - Infrastructure realism
6. ❌ **Comprehensive error scenarios** - All failure modes

## Testing Tools & Patterns

### Effect-Specific Patterns
```typescript
import { assert, describe, it } from "@effect/vitest"

describe("Service", () => {
  it.effect("should handle operation", () =>
    Effect.gen(function* () {
      const result = yield* operation()
      assert.strictEqual(result, expected)
    })
  )
})
```

### Mock Service Pattern
```typescript
// Complete interface implementation with state capture
export const createMockService = () => {
  const capturedCalls: Array<CallData> = []
  const mockService: ServiceInterface = {
    method: (input) => Effect.sync(() => {
      capturedCalls.push({ method: "methodName", input })
      return result
    })
  }
  return { mockService, capturedCalls }
}
```

### Layer Testing Pattern
```typescript
const testLayer = Layer.effect(Service, Effect.succeed(mockImplementation))
const program = Effect.provide(businessLogic, testLayer)
```

## Success Criteria (FOCUSED)

### Phase 1 Success ✅ COMPLETED
- ✅ All JobStore operations tested and passing (57 tests)
- ✅ Idempotency logic validated 
- ✅ Job creation utilities tested
- ✅ Mock infrastructure established

### Phase 2 Success (CORE FOCUS)
- 🎯 **Internal handler core logic tested** - processEvent function validated
- 🎯 **Essential domain events processed** - JobStatusChanged, TranscriptComplete, JobFailed
- 🎯 **Basic jobs handler tested** - Core creation flow only
- 🎯 **Repository error handling validated** - Error mapping confirmed

### Phase 3 Success (MINIMAL)
- 🎯 **Single integration test passing** - Job lifecycle end-to-end
- 🎯 **Critical error responses verified** - Handler error mapping works

## Scope Constraints
This narrowed approach prioritizes:
1. **Business logic correctness** over comprehensive coverage
2. **Core functionality** over edge cases  
3. **Error handling** over input validation
4. **Essential flows** over system integration

**Timeline: 2-3 days total** for Phases 2-3 vs. original 5-7 days, focusing on the most critical 20% of functionality that provides 80% of the value.