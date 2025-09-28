# Comprehensive Unit Testing Plan for @packages/api

## Overview
Create comprehensive unit tests for the API service components and message handling following Effect-specific testing patterns and Google Cloud testing best practices.

## Enhanced Testing Strategy

### Core Testing Framework
- **@effect/vitest** with `it.effect()` for all Effect-based code
- **Service mocking** using complete interface implementations
- **Layer-based testing** for dependency injection and service composition
- **Google Cloud emulator integration** for realistic infrastructure testing

## Test Structure & Implementation

### 1. **Testing Utilities** (`src/test/`)
- **`mocks/CloudStorageServiceMock.ts`** - Complete interface mock with state capture
- **`mocks/PubSubClientMock.ts`** - Message publishing simulation with verification
- **`mocks/JobRepositoryMock.ts`** - In-memory repository for isolated testing
- **`fixtures/domainEvents.ts`** - Base64-encoded Pub/Sub message fixtures
- **`fixtures/jobs.ts`** - TranscriptionJob test data factories
- **`utils/testLayers.ts`** - Layer composition utilities for test environments
- **`utils/googleCloudEmulators.ts`** - Cloud Storage and Pub/Sub emulator setup

### 2. **Service Layer Tests** (`src/services/*.test.ts`)
- **`JobRepository.test.ts`** - CRUD operations, idempotency handling, concurrent operations
- **`JobStore.test.ts`** - Facade error mapping, interface compliance, layer integration
- **`storage/indices.test.ts`** - Path generation validation for different statuses

### 3. **Handler Tests** (`src/handlers/*.test.ts`)
- **`jobs.test.ts`** - createJob handler with business logic flow, idempotency collision detection
- **`internal.test.ts`** - jobUpdate handler for Pub/Sub message processing, base64 decoding
- **`health.test.ts`** - Health check endpoint using HTTP testing patterns

### 4. **Utility Tests** (`src/utils/*.test.ts`)
- **`idempotency.test.ts`** - Key generation, validation, expiration handling
- **`job-creation.test.ts`** - Job entity creation, metadata assignment

## Advanced Testing Features

### Google Cloud Emulator Integration
- **Cloud Storage Emulator**: Using Firebase emulator suite with `@firebase/rules-unit-testing`
- **Pub/Sub Emulator**: Local emulator with environment variable configuration
- **Testcontainers**: Alternative containerized approach for CI/CD environments
- **Environment Setup**: Proper `PUBSUB_EMULATOR_HOST` and `GCLOUD_PROJECT` configuration

### Effect-Specific Testing Patterns
- **Layer-based dependency injection** for service testing
- **Mock implementations** using Effect services and complete interfaces
- **Error scenario testing** with `Effect.flip()` and proper error type validation
- **Concurrent operation testing** using Effect's structured concurrency
- **State capture and validation** using captured arrays and assertion patterns

### HTTP Integration Testing
- **Dynamic port assignment** using port 0 for test isolation
- **URL extraction** from server logs for dynamic configuration
- **Real HTTP requests** using Effect HttpClient for complete integration
- **Response validation** including status codes, headers, and body content

## Test Data & Mocking Strategy

### Mock Service Implementations
Following patterns from `generic-testing.md`:
- **Complete interface coverage** implementing every service method
- **State capture arrays** for verifying calls and data
- **Dual interface support** (unsafe and Effect-based)
- **Type safety** with proper service identifiers

### Test Data Factories
- **TranscriptionJob factories** with various states and configurations
- **MediaResource fixtures** for YouTube and other media types
- **Pub/Sub message fixtures** with proper base64 encoding
- **Error scenario data** for comprehensive error path testing

## Testing Scenarios

### Service Layer Testing
- **JobRepository**: Save/retrieve operations, idempotency key handling, status updates
- **JobStore**: Error mapping between layers, interface compliance
- **CloudStorageService**: Object operations with emulator integration

### Handler Testing
- **createJob**: Full business logic flow, idempotency collision detection, Pub/Sub publishing
- **jobUpdate**: Message decoding, status updates, transcription completion
- **Error scenarios**: Validation failures, database errors, Pub/Sub failures

### Integration Testing
- **End-to-end API flows** using HTTP testing patterns
- **Cross-service communication** between handlers and services
- **Error propagation** through the entire stack

## Quality Standards
- **100% coverage** for business logic functions
- **All error paths** thoroughly tested with proper error type validation
- **Performance testing** for concurrent operations
- **Emulator-based testing** for realistic infrastructure scenarios
- **Clean test isolation** with proper setup/teardown

## Implementation Order
1. **Test utilities and mocks setup** - Foundation for all other tests
2. **Google Cloud emulator configuration** - Infrastructure testing capability
3. **Service layer tests** - Core business logic validation
4. **Utility function tests** - Supporting function validation
5. **Handler tests** - API endpoint and message processing
6. **Integration scenarios** - End-to-end flow validation

This comprehensive approach provides both isolated unit testing and realistic integration testing using Google Cloud emulators, following Effect-specific patterns for maintainable and reliable test coverage.