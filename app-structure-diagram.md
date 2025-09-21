# PureDialog App Structure

```
PureDialog/
├── Frontend (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx                    # Main app component
│   │   ├── components/
│   │   │   ├── Header.tsx             # App header
│   │   │   ├── VideoCard.tsx          # YouTube video display
│   │   │   ├── VideoQueue.tsx         # Queue management
│   │   │   ├── TranscriptView.tsx     # Transcript display
│   │   │   ├── Settings.tsx           # App settings
│   │   │   ├── Loader.tsx             # Loading states
│   │   │   └── icons/                 # Icon components
│   │   ├── services/
│   │   │   └── geminiService.ts       # AI service integration
│   │   ├── utils/
│   │   │   └── youtube.ts             # YouTube utilities
│   │   └── types.ts                   # TypeScript definitions
│   └── dist/                          # Built assets
│
├── Backend (Node.js Server)
│   ├── server.js                      # Express server
│   └── Cloud Build Integration
│       ├── cloudbuild.yaml           # GCP build config
│       └── Dockerfile                # Container config
│
├── Configuration & Environment
│   ├── env.example                    # Environment template
│   ├── package.json                   # Dependencies
│   └── Setup Scripts
│       ├── setup.sh                   # Initial setup
│       └── migrate-from-ai-studio.sh  # Migration helper
│
├── Development Patterns & Documentation
│   ├── patterns/                      # Effect patterns library
│   │   ├── README.md                  # Pattern overview
│   │   ├── Core Effect Patterns
│   │   │   ├── effect-creation-patterns.md
│   │   │   ├── effect-composition-control-flow-patterns.md
│   │   │   └── effect-execution-patterns.md
│   │   ├── Error Management
│   │   │   ├── effect-error-management-patterns.md
│   │   │   ├── effect-error-handling-patterns.md
│   │   │   └── effect-defect-handling-patterns.md
│   │   ├── System Architecture
│   │   │   ├── effect-layer-overview.md
│   │   │   ├── effect-service-layer-patterns.md
│   │   │   └── effect-resource-management-patterns.md
│   │   └── Schema & Testing Patterns
│   │       ├── effect-schema-*.md
│   │       ├── http-api.md
│   │       └── testing patterns
│   ├── AGENTS.md                      # AI agent instructions
│   ├── CLAUDE.md                      # Claude-specific config
│   └── GEMINI.md                      # Gemini integration
│
└── Project Management
    ├── README.md                      # Project documentation
    ├── metadata.json                  # Project metadata
    └── .cursor/                       # Cursor IDE config
        └── commands/
            └── new-feature.md         # Feature development workflow
```

## Data Flow

```
User Input (YouTube URL)
         ↓
    VideoQueue Component
         ↓
    YouTube Utils (URL parsing)
         ↓
    Gemini Service (Transcription)
         ↓
    TranscriptView (Display)
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI Integration**: Google Gemini API
- **Deployment**: Google Cloud Platform
- **Development**: Effect-first functional programming patterns
- **IDE**: Cursor with custom commands and AI agents

## Key Features

1. **YouTube Video Processing**: URL parsing and video handling
2. **AI Transcription**: Gemini-powered transcript generation
3. **Queue Management**: Multiple video processing queue
4. **Real-time UI**: Loading states and progress tracking
5. **Settings Management**: Configurable app behavior
6. **Cloud Deployment**: GCP integration with Docker
