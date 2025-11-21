# LexSim - AI-Powered Legal Trial Preparation Platform

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**LexSim** is a cutting-edge AI legal training platform that leverages Google's Gemini AI to help attorneys prepare for trial. Practice witness examinations, refine oral arguments, analyze case strategy, and draft legal documents—all powered by advanced AI.

## Features

### 1. Dashboard
- Overview of all active cases with real-time statistics
- Visual analytics showing case distribution by status
- Quick access to upcoming court dates and case priorities

### 2. Case Manager
- Create and manage case files with detailed metadata
- Upload and analyze legal documents (PDFs, images, text)
- AI-powered document summarization and entity extraction
- Track case status: Pre-Trial, Discovery, Trial, Appeal, Closed

### 3. Witness Lab
- Practice witness examination with AI-driven personalities:
  - **Hostile witnesses** - Evasive and defensive responses
  - **Nervous witnesses** - Hesitant with inconsistent testimony
  - **Cooperative witnesses** - Clear and helpful responses
- Real-time credibility scoring
- Build questioning strategies in a safe environment

### 4. Trial Simulator (Live Audio) 🎤
- **Real-time 2-way voice conversation** with AI using Gemini Live API
- **Industry-leading voice recognition** - Speak naturally, AI responds with voice
- **Instant objection system** - AI interrupts you like a real opposing counsel
- Practice all trial phases:
  - Pre-trial motions
  - Voir dire (jury selection)
  - Opening statements
  - Direct examination
  - Cross-examination
  - Closing arguments
  - Sentencing hearings
- Three difficulty modes:
  - **Learn** - Guided practice with AI-generated scripts
  - **Practice** - Balanced with hints and feedback
  - **Trial** - Realistic adversarial environment (hard mode)
- Real-time coaching with rhetorical analysis and fallacy detection
- Live transcription of both your speech and AI responses
- Visual objection alerts with legal grounds
- Teleprompter scripts for suggested responses

**📖 See [VOICE_FEATURES.md](VOICE_FEATURES.md) for detailed voice feature guide**
**🧪 See [AUDIO_TESTING.md](AUDIO_TESTING.md) for audio testing and troubleshooting**

### 5. Strategy & AI Insights
- Deep strategic analysis using Gemini's thinking models
- Opponent profiling and tactical predictions
- Risk assessment and opportunity identification
- Win probability modeling

### 6. Drafting Assistant
- AI-powered legal document drafting
- Template generation for motions, briefs, and discovery requests
- Citation assistance and legal research integration

### 7. Settings
- API key configuration
- User preferences and customization
- Data export and backup options

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v7 (HashRouter for static deployment)
- **Styling**: Tailwind CSS (custom legal theme)
- **Charts**: Recharts
- **AI**: Google Gemini AI
  - `gemini-2.5-flash` - Fast responses for chat and simulation
  - `gemini-3-pro-preview` - Deep reasoning with thinking models
  - `gemini-live-2.5-flash-preview` - Real-time audio interaction
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key** - Get yours at [https://ai.google.dev/](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lexsim-ai-trial-prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API key**

   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
lexsim-ai-trial-prep/
├── components/           # React components
│   ├── Dashboard.tsx
│   ├── CaseManager.tsx
│   ├── WitnessLab.tsx
│   ├── ArgumentPractice.tsx
│   ├── StrategyRoom.tsx
│   ├── DraftingAssistant.tsx
│   └── Settings.tsx
├── services/
│   └── geminiService.ts  # All Gemini API integrations
├── types.ts              # TypeScript type definitions
├── constants.ts          # Mock data and templates
├── App.tsx               # Main app with routing
├── index.tsx             # Entry point
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Usage Guide

### Creating Your First Case

1. Navigate to **Case Files** from the sidebar
2. Click **Create New Case**
3. Fill in case details (title, client, status, etc.)
4. Upload relevant documents for AI analysis
5. The system will automatically extract key entities and risks

### Practicing Witness Examination

1. Go to **Witness Lab**
2. Select a witness with the personality type you want to practice against
3. Start the examination and type your questions
4. The AI will respond in character, adapting to your questioning strategy
5. Review credibility scores and adjust your approach

### Live Trial Simulation (Voice)

1. **Prerequisites**: Working microphone, Chrome/Edge browser, quiet environment
2. Navigate to **Trial Simulator**
3. Select a case and trial phase (e.g., Cross-Examination)
4. Choose difficulty mode:
   - **Learn** - Best for first-time users, provides full scripts
   - **Practice** - Balanced difficulty with helpful feedback
   - **Trial** - Realistic and challenging, no hand-holding
5. Click **"Enter Courtroom"** then **"Start"**
6. Allow microphone access when prompted
7. **Speak naturally** - the AI will:
   - Transcribe your words in real-time
   - Respond with natural voice (not robotic)
   - Interrupt with objections when appropriate
   - Provide live coaching feedback
8. Watch for objection alerts and respond appropriately
9. Review coaching panel for tips and suggested responses

**💡 Tip**: Start with **Learn mode** in **Cross Examination** to get comfortable!

**⚠️ Important**: HTTPS or localhost required for microphone access. The Live API uses significant bandwidth and API tokens.

### Getting Strategic Insights

1. Open **Strategy & AI**
2. Select your active case
3. The AI will analyze using advanced reasoning:
   - Identify risks and opportunities
   - Predict opponent tactics
   - Suggest case theory adjustments
4. Review confidence scores for each insight

## API Usage and Costs

This application uses the Google Gemini API. Be aware of:

- **API calls are made per interaction** (document analysis, witness responses, strategy generation, etc.)
- **Live API sessions** (Trial Simulator) use streaming and can consume more tokens
- **Thinking models** (Strategy Room) use extended reasoning and may be more expensive

Monitor your usage at [Google AI Studio](https://aistudio.google.com/)

## Customization

### Mock Case Templates

The app includes pre-built case templates in `constants.ts`:
- Criminal Defense (DUI, Armed Robbery, Murder)
- Civil Litigation (Slip & Fall, Breach of Contract)
- Civil Rights & Federal (Section 1983, RICO)
- Family Law (Custody Disputes)

These templates are available for practice but won't appear in your case list by default.

### Witness Personalities

Edit `MOCK_WITNESSES` in `constants.ts` to customize witness profiles, credibility scores, and personality traits.

## Troubleshooting

### API Key Issues
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Restart the dev server after changing environment variables
- Verify your API key is active at [Google AI Studio](https://aistudio.google.com/)

### Microphone Access (Trial Simulator)
- Grant microphone permissions when prompted
- Ensure you're using HTTPS in production (required for microphone access)
- Check browser console for audio-related errors

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is 18 or higher: `node --version`

## Privacy & Data

- All case data is stored **locally in browser memory** (no backend database)
- Case data is **lost on page refresh** (no persistence implemented)
- API calls send your prompts to Google's Gemini API - review [Google's Privacy Policy](https://policies.google.com/privacy)

## Contributing

We welcome contributions! Areas for improvement:
- Persistent storage (localStorage, IndexedDB, or backend)
- Additional trial phases and scenarios
- Document template library expansion
- Test coverage
- Mobile optimization

## License

This project was generated with [AI Studio](https://ai.studio/apps/). See the original project link in the banner above.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Built with Google Gemini AI** | [View on AI Studio](https://ai.studio/apps/drive/1V2CDhsqj46ydvFpmYDwK7mwA9ZvplvwL)
