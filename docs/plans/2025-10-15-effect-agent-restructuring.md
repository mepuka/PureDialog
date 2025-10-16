# Effect Agent Restructuring Plan

> **For Claude:** This plan restructures the Effect agents from 5 domain-specific agents to 3 workflow-based agents with enhanced research capabilities.

**Goal:** Create three lifecycle-based Effect agents (Architect, Engineer, Tester) that are smarter, more resourceful, and better aligned with the Effect development workflow.

**Current State:** 5 agents organized by technical domain (error handling, layers, concurrency, testing, streams)

**Target State:** 3 agents organized by development lifecycle with unified Effect knowledge and intelligent research protocols

---

## Analysis: Current Agent Inventory

### Existing Agents (5)
1. **effect-error-handler.md** (5.4KB)
   - Focus: Data.TaggedError, catchTag, error recovery
   - Strengths: Comprehensive error patterns, good examples
   - Limitations: Too narrow - errors are everywhere in Effect code

2. **effect-layer-architect.md** (8.8KB)
   - Focus: Layer composition, dependency injection, service design
   - Strengths: Excellent on avoiding requirement leakage
   - Limitations: Layers are foundational - needed by all agents

3. **effect-concurrency-expert.md** (9.8KB)
   - Focus: Fibers, Effect.all, racing, interruption
   - Strengths: Deep concurrency knowledge, good patterns
   - Limitations: Concurrency is core to most Effect code

4. **effect-test-engineer.md** (10.1KB)
   - Focus: @effect/vitest, TestClock, it.effect pattern
   - Strengths: Strong testing focus, already lifecycle-aligned
   - Limitations: Could benefit from implementation context

5. **effect-stream-processor.md** (11.9KB)
   - Focus: Stream API, Sink patterns, data pipelines
   - Strengths: Comprehensive stream knowledge
   - Limitations: Streams integrate with everything else

6. **effect-expert.md** (3.4KB) - Original general agent
   - Can be deprecated or kept as fallback

**Total Knowledge:** ~46KB across domains
**Problem:** Artificial boundaries - Effect is unified, these divisions don't match workflow

---

## New Agent Architecture

### Agent 1: effect-architect
**Purpose:** Design services, define boundaries, establish dependency graphs

**When to Use:**
- "Design a user authentication system"
- "How should I structure this feature?"
- "What services do I need for X?"
- "Review this service architecture"

**Core Knowledge:**
- **PRIMARY**: Service boundary design, Layer composition patterns, Schema definition
- **SECONDARY**: Full Effect patterns (errors, concurrency, streams) with design bias
- Context.Tag and service contracts
- Dependency graph design principles
- Avoiding requirement leakage
- API design with Effect types

**Research Protocol:**
1. Check codebase for existing service patterns (Glob for `*.ts` with `Context.Tag`)
2. On unfamiliar architectural patterns: Search Effect docs for "Layer", "Context", "Service"
3. On complex composition: Inspect Effect source `packages/effect/src/Layer.ts`
4. On type errors in service definitions: Deep dive into Context.ts type definitions

**Outputs:**
- Service interface definitions (Context.Tag declarations)
- Layer dependency graphs
- Schema definitions for domain models
- Architecture decision rationale

**Handoff to:** effect-engineer with clear service contracts

---

### Agent 2: effect-engineer
**Purpose:** Implement all Effect code - the workhorse developer agent

**When to Use:**
- "Implement the UserService"
- "Fix this type error in my Stream pipeline"
- "Add error handling to this Effect"
- "Make this concurrent"
- "Why isn't this Stream processing correctly?"

**Core Knowledge:**
- **PRIMARY**: All Effect operators, composition patterns, type resolution
- **SECONDARY**: Design principles (for iterating on architecture), basic testing
- Effect.gen and generator patterns
- Error handling (TaggedError, catchTag, catchAll, retry)
- Concurrency (fork, Effect.all, race, Fiber management)
- Streams (map, filter, fold, Sink consumption)
- Resource management (Scope, acquireRelease)
- Platform APIs (HttpClient, FileSystem)

**Research Protocol:**
1. Check codebase for similar implementations (Grep for pattern usage)
2. On unfamiliar operators: Search Effect docs (MCP) for the specific module
3. **ON TYPE ERRORS** (PRIMARY TRIGGER):
   - Inspect Effect source in `node_modules/effect/src/`
   - Read actual type definitions and implementations
   - Understand variance and type parameter constraints
4. On performance questions: Review Effect source for internal optimizations

**Outputs:**
- Complete Effect implementations
- Error handling with TaggedError
- Concurrent operations with proper resource cleanup
- Stream processing pipelines
- Basic unit tests (delegates comprehensive testing to effect-tester)

**Handoff to:** effect-tester with working implementation

---

### Agent 3: effect-tester
**Purpose:** Comprehensive testing, validation, quality assurance

**When to Use:**
- "Write tests for UserService"
- "This test is flaky, fix it"
- "Add edge case coverage"
- "Why is this test failing?"
- "Set up test infrastructure for X"

**Core Knowledge:**
- **PRIMARY**: @effect/vitest, TestClock, test layers, mocking strategies
- **SECONDARY**: Full Effect patterns (to write meaningful tests), implementation understanding
- it.effect pattern and assert methods (NOT expect)
- TestClock.adjust for time control
- Creating test layers and mock services
- Testing errors with Effect.flip
- Testing concurrency with Ref/Deferred
- Property-based testing patterns

**Research Protocol:**
1. Check codebase for existing test patterns (Glob for `**/*.test.ts`)
2. On test setup questions: Search Effect docs for "TestContext", "TestClock"
3. On complex mocking: Review @effect/vitest source for test utilities
4. On timing issues: Deep dive into TestClock implementation

**Outputs:**
- Comprehensive test suites
- Test layer definitions for mocking
- Edge case coverage
- Performance/stress tests (with TestClock)
- Test infrastructure and utilities

**Handoff to:** effect-architect (for next iteration) or effect-engineer (for bug fixes)

---

## Enhanced Research Capabilities

### 1. Codebase Pattern Discovery

**All agents get this section:**

```markdown
## Research Protocol: Finding Patterns in Your Codebase

Before implementing any Effect pattern, search the codebase first:

**Use Glob to find:**
- Services: `**/*.ts` containing `Context.Tag`
- Layers: `**/*.ts` containing `Layer.`
- Tests: `**/*.test.ts` for testing patterns
- Streams: `**/*.ts` containing `Stream.`

**Use Grep to find:**
- Specific patterns: `Effect.gen`, `Data.TaggedError`, `Layer.effect`
- Error handling: `catchTag`, `catchAll`, `retry`
- Concurrency: `Effect.all`, `Effect.fork`, `Fiber.`

**Prioritize your patterns over generic examples** - consistency matters.
```

### 2. Effect Documentation Access (MCP)

**All agents get this section:**

```markdown
## Research Protocol: Effect Documentation

Use the Effect docs MCP when:
- **Unfamiliar with a pattern** (PRIMARY TRIGGER)
- Need to understand an API you haven't used
- Want to see official examples
- Looking for best practices

**Search strategy:**
1. `mcp__effect-docs__effect_docs_search` with specific keywords
2. `mcp__effect-docs__get_effect_doc` to read full documentation
3. Multiple searches for different aspects if needed

**Example queries:**
- "Layer dependency injection service composition"
- "Stream processing pipeline sink transformations"
- "TestClock time control testing"
- "TaggedError catchTag error handling"
```

### 3. Source Code Inspection

**All agents get this section:**

```markdown
## Research Protocol: Effect Source Inspection

**CRITICAL TRIGGER: Type errors you can't resolve**

When TypeScript gives errors you don't understand, inspect the source:

**Key source files:**
- `node_modules/effect/src/Effect.ts` - Core Effect type and operators
- `node_modules/effect/src/Layer.ts` - Layer composition
- `node_modules/effect/src/Stream.ts` - Stream API
- `node_modules/effect/src/Context.ts` - Service context
- `node_modules/@effect/platform/src/` - Platform APIs

**What to look for:**
- Actual type signatures with variance annotations
- Implementation details for complex operators
- Internal helpers that might be useful
- JSDoc comments explaining behavior

**Use Read tool:**
```typescript
// Read the actual Effect source
yield* Read("node_modules/effect/src/Layer.ts")
```

This often reveals the "why" behind type errors.
```

### 4. Escalation Decision Tree

**All agents get this guidance:**

```markdown
## When to Research vs When to Implement

**Implement directly when:**
- Pattern is in your built-in knowledge ✓
- You've used it before in this codebase ✓
- It's a common Effect idiom (Effect.gen, basic map/flatMap) ✓

**Check codebase first when:**
- Implementing a service layer (look for patterns)
- Writing tests (find existing test setup)
- Using platform APIs (see how others did it)

**Search Effect docs when:**
- **Unfamiliar with the pattern** (PRIMARY)
- Need to understand options/variations
- Want to verify best practices

**Inspect Effect source when:**
- **Type error you can't resolve** (PRIMARY)
- Need to understand internal behavior
- Debugging unexpected behavior
- Performance optimization needed

**Multiple sources when:**
- Complex scenario combining patterns
- No clear codebase example
- Type errors persist after doc search
```

---

## Implementation Steps

### Step 1: Create effect-architect.md
**Files:** Create `.claude/agents/effect-architect.md`

**Content Structure:**
```markdown
---
name: effect-architect
description: Expert in Effect service design, Layer composition, and architectural decisions. Invoke when designing systems, defining service boundaries, or establishing dependency graphs. Hands off clean contracts to effect-engineer.
tools: Read, Grep, Glob, Edit, Write, Bash, mcp__effect-docs__effect_docs_search, mcp__effect-docs__get_effect_doc
model: inherit
---

[Agent profile with:]
- Full Effect knowledge baseline (all patterns)
- Design-focused expertise (services, layers, schemas)
- Research protocol (all 4 sections above)
- Best practices for architecture
- Common design patterns
- Handoff format to effect-engineer
```

**Key consolidations from existing agents:**
- Take all Layer knowledge from `effect-layer-architect.md`
- Take service design patterns from `effect-expert.md`
- Take Schema/domain modeling (add if missing)
- Add dependency graph design principles
- Add architectural decision guidance

### Step 2: Create effect-engineer.md
**Files:** Create `.claude/agents/effect-engineer.md`

**Content Structure:**
```markdown
---
name: effect-engineer
description: Expert Effect implementer for all patterns - errors, concurrency, streams, resources. Invoke when implementing services, fixing type errors, or building Effect programs. The workhorse developer agent.
tools: Read, Grep, Glob, Edit, Write, Bash, mcp__effect-docs__effect_docs_search, mcp__effect-docs__get_effect_doc
model: inherit
---

[Agent profile with:]
- Full Effect knowledge baseline (all patterns equally)
- Implementation-focused expertise
- Type resolution and debugging focus
- Research protocol (all 4 sections above)
- Operator selection guidance
- Common implementation patterns
- Basic testing (delegates comprehensive to effect-tester)
```

**Key consolidations from existing agents:**
- Merge ALL pattern knowledge from:
  - `effect-error-handler.md` → Error handling section
  - `effect-concurrency-expert.md` → Concurrency section
  - `effect-stream-processor.md` → Stream processing section
  - `effect-layer-architect.md` → Layer usage section
- Emphasize type error resolution as primary research trigger
- Add source inspection examples for common type issues

### Step 3: Create effect-tester.md
**Files:** Create `.claude/agents/effect-tester.md`

**Content Structure:**
```markdown
---
name: effect-tester
description: Expert in testing Effect code with @effect/vitest, TestClock, and test layers. Invoke when writing tests, fixing flaky tests, or setting up test infrastructure. Ensures comprehensive quality coverage.
tools: Read, Grep, Glob, Edit, Write, Bash, mcp__effect-docs__effect_docs_search, mcp__effect-docs__get_effect_doc
model: inherit
---

[Agent profile with:]
- Full Effect knowledge (to understand what to test)
- Testing-focused expertise (@effect/vitest, TestClock)
- Research protocol (all 4 sections above)
- Mock/test layer creation patterns
- Edge case identification
- Common testing patterns
```

**Key consolidations from existing agents:**
- Primary source: `effect-test-engineer.md` (already well-structured)
- Add implementation understanding (knows enough to write meaningful tests)
- Add test infrastructure setup patterns
- Keep strong focus on TestClock and timing

### Step 4: Remove old agents
**Files:** Delete from `.claude/agents/`:
- `effect-error-handler.md`
- `effect-layer-architect.md`
- `effect-concurrency-expert.md`
- `effect-stream-processor.md`

**Keep:**
- `effect-expert.md` (original general agent - can serve as fallback)

### Step 5: Update effect-expert.md (optional)
**Decision:** Either:
A) Delete it (3 new agents cover everything)
B) Keep as "general Effect consultant" for questions/guidance
C) Update to point users to the right specialized agent

**Recommendation:** Keep and update to be a meta-agent that helps choose:
```markdown
"I can help with Effect questions. For better results:
- Designing a system? → Use effect-architect
- Implementing code? → Use effect-engineer
- Writing tests? → Use effect-tester"
```

---

## Knowledge Distribution Matrix

| Knowledge Area | Architect | Engineer | Tester |
|---------------|-----------|----------|---------|
| Effect.gen | Secondary | Primary | Secondary |
| Layer composition | **Primary** | Secondary | Secondary |
| Service design | **Primary** | Secondary | None |
| Schema definition | **Primary** | Secondary | None |
| Error handling | Secondary | **Primary** | Secondary |
| Concurrency | Secondary | **Primary** | Secondary |
| Streams | Secondary | **Primary** | Secondary |
| Type resolution | Secondary | **Primary** | None |
| @effect/vitest | None | Secondary | **Primary** |
| TestClock | None | Secondary | **Primary** |
| Test layers | Secondary | Secondary | **Primary** |
| Mocking | None | Secondary | **Primary** |

**Key:**
- **Primary** = Deep expertise, main focus, authoritative
- Secondary = Working knowledge, can use effectively
- None = Knows it exists, delegates to specialist

---

## Research Enhancement Summary

### Before (Current State)
- Agents have knowledge baked in
- No explicit research protocol
- No guidance on when to look things up
- No MCP tool integration mentioned
- Source inspection not encouraged

### After (New State)
- All agents have unified research protocol
- Four-tier escalation: Built-in → Codebase → Docs (MCP) → Source
- **Primary triggers**: Unfamiliarity + Type errors
- Explicit MCP tool usage in agent tools list
- Source inspection as debugging tool
- Codebase pattern discovery first (consistency)

### Research Tools Added to All Agents
```yaml
tools: Read, Grep, Glob, Edit, Write, Bash,
       mcp__effect-docs__effect_docs_search,
       mcp__effect-docs__get_effect_doc
```

---

## Testing the New Agents

### Validation Scenarios

**Test effect-architect with:**
1. "Design a user authentication system with Effect"
2. "How should I structure services for a multi-tenant application?"
3. Expected: Layer diagrams, service boundaries, Schema definitions

**Test effect-engineer with:**
1. "Implement this service" (give spec)
2. "I'm getting type error: [complex Effect type error]"
3. Expected: Full implementation, type resolution via source inspection

**Test effect-tester with:**
1. "Write comprehensive tests for UserService"
2. "This test is flaky - it sometimes passes, sometimes fails"
3. Expected: Full test suite, TestClock usage, proper timing control

**Cross-agent workflow:**
1. Architect → designs service
2. Engineer → implements it
3. Tester → validates it
4. Expected: Smooth handoffs, no gaps

---

## Success Criteria

✅ Three agents covering full development lifecycle
✅ Each agent has complete Effect knowledge baseline
✅ Clear differentiation by focus/bias, not by domain walls
✅ Research protocol in every agent profile
✅ MCP tools integrated for docs access
✅ Source inspection encouraged for type debugging
✅ Codebase pattern discovery prioritized
✅ Smooth handoffs between agents
✅ Total knowledge maintained (~45-50KB across 3 agents)
✅ Better aligned with actual Effect development workflow

---

## Next Steps

**Option 1: Subagent-Driven (this session)**
- Create each agent one by one
- Review after each creation
- Fast iteration and refinement

**Option 2: Parallel Execution**
- Execute all steps in batch
- Review complete set
- Faster but less iterative

**Which approach?**
