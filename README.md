# PureDialog - YouTube Transcription App

An advanced application that extracts YouTube links from text and generates high-quality, speaker-diarized transcripts using Google's Gemini multimodal AI capabilities.

## Features

- 🎥 **Automatic YouTube Link Detection** - Paste any text and YouTube links are automatically extracted
- 🎯 **Speaker Diarization** - Identifies and labels different speakers in conversations
- ⚡ **Real-time Streaming** - Watch transcripts generate in real-time
- 🎛️ **Configurable Speakers** - Customize speaker names and descriptions
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ☁️ **Cloud Run Ready** - Easy deployment to Google Cloud Run

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Google Cloud CLI (for deployment)

### Development Setup

1. **Clone and setup:**

   ```bash
   git clone <your-repo>
   cd PureDialog
   pnpm install
   ```

2. **Configure environment:**

   ```bash
   cp env.template .env
   # Edit .env and add your Gemini API key
   ```

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Migration from AI Studio

If you're migrating from an existing AI Studio applet deployment:

```bash
chmod +x migrate-from-ai-studio.sh
./migrate-from-ai-studio.sh
```

This will:

- Set up your environment with existing API keys
- Configure Google Cloud services
- Prepare for independent deployment

## Deployment to Cloud Run

### Automated Deployment

```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. **Set up Google Cloud:**

   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable APIs:**

   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

3. **Deploy:**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

## Environment Variables

| Variable               | Description                    | Required       |
| ---------------------- | ------------------------------ | -------------- |
| `GEMINI_API_KEY`       | Your Google Gemini API key     | ✅             |
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID                 | For deployment |
| `GOOGLE_CLOUD_REGION`  | GCP Region (default: us-west1) | For deployment |
| `SERVICE_NAME`         | Cloud Run service name         | For deployment |

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   React App     │───▶│ Vite Build   │───▶│  Node.js HTTP   │
│                 │    │              │    │    Server       │
└─────────────────┘    └──────────────┘    │  (Cloud Run)    │
         │                                 │                 │
         ▼                                 │  Static Files + │
┌─────────────────┐                       │   API Routes    │
│ Gemini Service  │◀──────────────────────┤                 │
│                 │                       └─────────────────┘
└─────────────────┘                                │
         │                                         ▼
         ▼                               ┌─────────────────┐
┌─────────────────┐                     │  Google Gemini  │
│  /api/health    │                     │      API        │
│  /api/*         │                     └─────────────────┘
└─────────────────┘
```

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Native Node.js HTTP server
- **Styling:** Tailwind CSS (via classes)
- **AI/ML:** Google Gemini 2.5 Flash
- **Deployment:** Docker, Google Cloud Run
- **Build:** Cloud Build, Artifact Registry

## API Usage & Costs

The app uses Google Gemini 2.5 Flash for video transcription:

- **Input:** Video files via YouTube URLs
- **Processing:** Low-resolution analysis for efficiency
- **Output:** JSON-structured transcripts with timestamps
- **Streaming:** Real-time transcript generation

Monitor usage in your Google Cloud Console under AI Platform.

## Development Scripts

```bash
pnpm dev          # Start development server (Vite)
pnpm build        # Build for production
pnpm start        # Start production server (Node.js)
pnpm preview      # Preview production build (Vite)
pnpm setup        # Run setup script
pnpm deploy       # Deploy to Cloud Run
pnpm type-check   # TypeScript type checking
```

## File Structure

```
PureDialog/
├── components/           # React components
│   ├── Header.tsx
│   ├── TranscriptView.tsx
│   ├── VideoQueue.tsx
│   └── icons/
├── services/
│   └── geminiService.ts  # Gemini API integration
├── utils/
│   └── youtube.ts        # YouTube URL parsing
├── types.ts              # TypeScript definitions
├── App.tsx               # Main application
├── server.js             # Node.js HTTP server
├── Dockerfile            # Container configuration
├── cloudbuild.yaml       # Cloud Build configuration
└── deploy.sh             # Deployment script
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run type checking: `pnpm type-check`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues and questions:

- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and steps to reproduce

---

**Current Status:** Migrating from AI Studio applet to independent Cloud Run deployment
