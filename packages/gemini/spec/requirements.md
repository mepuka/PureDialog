# LLM Prompting Service - Requirements

## 1. Functional Requirements

### 1.1. Service Infrastructure

- **F1.1.1**: The system MUST define a `PromptingService` interface (using `Context.Tag`) that abstracts the interaction with the LLM.
- **F1.1.2**: The system MUST provide a live implementation of the `PromptingService` as an Effect `Layer`.
- **F1.1.3**: The live implementation layer MUST use the `@effect/ai-google` package to create a Gemini client.
- **F1.1.4**: The service MUST be designed to handle multiple types of media resources (e.g., YouTube videos, local files), with an initial focus on YouTube URLs.

### 1.2. Configuration

- **F1.2.1**: The system MUST use Effect's `Config` module to manage configuration.
- **F1.2.2**: The configuration MUST include the Gemini API key, which should be treated as a `Secret`.
- **F1.2.3**: The configuration MUST allow for setting options for the Gemini client, such as the model to use (e.g., 'gemini-2.5-flash').
- **F1.2.4**: The configuration layer MUST fail at startup if the required API key is not provided.

### 1.3. Core Service Methods

- **F1.3.1**: The `PromptingService` interface MUST define a method for video transcription. This method will take a media resource (e.g., a YouTube URL) and speaker configurations as input.
- **F1.3.2**: The `PromptingService` interface MUST define a method for extracting metadata (e.g., speaker information, timestamps) from podcast-type media.
- **F1.3.3**: Both methods MUST return an `Effect` that encapsulates the logic for interacting with the LLM, including potential failures and the structured output.
- **F1.3.4**: The implementation of these methods at this stage should focus on the interaction with the `effect/ai` layer, not the final prompt string construction.

### 1.4. Output Handling

- **F1.4.1**: The service methods MUST be designed to eventually produce structured output, using `Schema` to define the expected response shape.
- **F1.4.2**: The service MUST support streaming responses from the LLM.

## 2. Non-Functional Requirements

### 2.1. Concurrency and Rate Limiting

- **NF2.1.1**: The underlying `effect/ai` client SHOULD be configured to manage concurrency and rate limiting.

### 2.2. Error Handling and Resilience

- **NF2.2.1**: The service MUST propagate errors from the underlying `effect/ai` client in a typed manner.
- **NF2.2.2**: The service's `Layer` MUST handle initialization errors (e.g., invalid configuration) gracefully.

### 2.3. Testability

- **NF2.3.1**: The `PromptingService` interface MUST be designed for testability, allowing for the creation of a mock implementation `Layer` for testing purposes.

### 2.4. Modularity and Organization

- **NF2.4.1**: The service implementation MUST be modular and follow the project's established coding patterns for creating and providing services.

### 2.5. Compatibility

- **NF2.5.1**: The service's inputs and outputs MUST be compatible with the schemas and types defined in the `@puredialog/domain` package.
