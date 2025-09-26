# Domain Package Refactoring - Requirements

## Overview

This document outlines the detailed requirements for refactoring the domain package to improve organization, clarify domain concepts, and enhance the overall architecture of the PureDialog system.

## 1. Functional Requirements

### 1.1 File Organization Requirements

**FR-1.1: Hierarchical Directory Structure**
- MUST reorganize flat file structure into logical groups: `errors/`, `schemas/`, `types/`
- MUST maintain all existing public exports through updated index files
- MUST preserve backward compatibility during transition

**FR-1.2: Schema Separation**
- MUST separate schema definitions from type definitions
- MUST group related schemas by domain concern (media, transcript, feedback, etc.)
- MUST maintain clear import/export paths

### 1.2 Domain Model Enhancement Requirements

**FR-2.1: TranscriptionContext Introduction**
- MUST create `TranscriptionContext` schema to capture user-provided information before processing
- MUST distinguish between a priori user context and extracted metadata
- MUST integrate `TranscriptionContext` into `CreateTranscriptionJobRequest`

**FR-2.2: Media Resource Refinement**
- MUST separate `Speaker` definitions into dedicated module
- MUST redefine `MediaMetadata` to contain only extracted data (not user input)
- MUST maintain discriminated union structure for different media types

**FR-2.3: Transcript Entity Enhancement**
- MUST remove duplicate `TranscriptSegment` (keep `DialogueTurn`)
- MUST add inference traceability fields to `Transcript`
- MUST move `ModelOutputChunk` to LLM package (proper layer separation)

### 1.3 Traceability Requirements

**FR-3.1: Inference Configuration Tracking**
- MUST capture model configuration used for each transcript generation
- MUST include model name, temperature, and other inference parameters
- MUST link inference config to transcript entity

**FR-3.2: Prompt Provenance Tracking**
- MUST track the exact compiled prompt used for generation
- MUST include template identification and final prompt text
- MUST enable reproducibility of transcript generation


### 1.4 Service Contract Requirements

**FR-4.1: Formalized Service Interfaces**
- MUST define `TranscriptionServiceRequest` schema
- MUST define `TranscriptionServiceResponse` schema
- MUST bundle all necessary information for transcription service

## 2. Non-Functional Requirements

### 2.1 Type Safety Requirements

**NFR-1.1: Strict Typing**
- MUST maintain all existing branded types
- MUST use proper Effect Schema patterns
- MUST avoid `any` types and unsafe assertions

**NFR-1.2: Schema Composition**
- MUST use composable schema definitions
- MUST maintain proper schema transformations
- MUST support JSON serialization/deserialization

### 2.2 Performance Requirements

**NFR-2.1: Import Performance**
- MUST NOT introduce circular dependencies
- MUST maintain tree-shaking capability
- MUST minimize bundle size impact

### 2.3 Development Experience Requirements

**NFR-3.1: IDE Support**
- MUST maintain full TypeScript IntelliSense
- MUST provide clear error messages for schema validation
- MUST support Effect language service plugin

**NFR-3.2: Testing Support**
- MUST maintain testability of all schemas
- MUST support mock data generation
- MUST enable comprehensive test coverage

## 3. Package Integration Requirements

### 3.1 Internal Dependencies

**IR-1.1: Package Updates**
- MUST update all dependent packages (api, ingestion, llm, workers)
- MUST maintain proper dependency relationships
- MUST ensure clean integration with refactored schemas

## 4. Quality Requirements

### 4.1 Code Quality

**QR-1.1: Linting Compliance**
- MUST pass all ESLint rules with Effect plugin
- MUST maintain consistent formatting with dprint
- MUST follow established coding patterns

**QR-1.2: Type Checking**
- MUST pass strict TypeScript compilation
- MUST maintain proper type inference
- MUST support incremental type checking

### 4.2 Testing Requirements

**QR-2.1: Test Coverage**
- MUST maintain existing test coverage levels
- MUST add tests for new schemas and functionality
- MUST use @effect/vitest for Effect-aware testing

**QR-2.2: Validation Testing**
- MUST test schema validation for all new entities
- MUST test error cases and edge conditions
- MUST verify JSON serialization roundtrip

## 5. Constraints

### 5.1 Technical Constraints

**TC-1: Effect TypeScript Ecosystem**
- MUST use Effect Schema for all schema definitions
- MUST follow Effect patterns for error handling
- MUST maintain compatibility with Effect runtime

**TC-2: Bun Runtime**
- MUST support Bun runtime requirements
- MUST maintain `.ts` extension imports
- MUST work with bundler module resolution

### 5.2 Process Constraints

**PC-1: Spec-Driven Development**
- MUST follow the established 5-phase development process
- MUST get approval before proceeding to implementation
- MUST update specifications as understanding evolves

**PC-2: Quality Gates**
- MUST run `pnpm lint:fix` and `pnpm typecheck` after each change
- MUST fix all errors before proceeding
- MUST maintain all tests in passing state

## 6. Success Criteria

### 6.1 Primary Success Criteria

- All domain schemas are properly organized in logical directory structure
- `TranscriptionContext` successfully separates user input from extracted metadata
- Transcript entities include full traceability information (inference config + prompt)
- All existing functionality remains intact with improved type safety

### 6.2 Verification Criteria

- All tests pass without modification (except for import path updates)
- TypeScript compilation succeeds with no errors
- All ESLint rules pass
- Package build succeeds and generates proper output
- Dependent packages integrate successfully with refactored domain

## 7. Out of Scope

- Changes to runtime behavior or business logic
- Database schema migrations (if any storage layer exists)
- API endpoint modifications
- UI/UX changes
- Performance optimizations beyond structural improvements