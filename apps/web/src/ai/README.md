# src/ai — AI / Voice / Vision Layer

All client-side AI capabilities: chat assistant, voice assistant, diagnostic flows, vehicle damage vision analysis.

| Folder | Purpose |
|--------|---------|
| `agents/` | Composable agents — `DiagnosisAgent`, `TriageAgent`, `ConciergeAgent` |
| `prompts/` | Versioned prompt templates (loaded from `packages/config` or remote CMS) |
| `memory/` | Short-term (in-session) + long-term (IDB-backed) memory adapters |
| `tools/` | Tool definitions for function-calling: `getCurrentLocation`, `lookupVehicle`, `createRequest`, `callEmergency`, `findNearestProvider`, `getServiceHistory` |
| `voice/stt/` | Speech-to-text adapters (Web Speech, Whisper via BFF) |
| `voice/tts/` | Text-to-speech adapters (Web Speech, ElevenLabs via BFF) |
| `voice/wake-word/` | (Optional) Wake-word detection |
| `chat/streaming/` | SSE consumer for streamed responses |
| `chat/messages/` | Message normalization & rendering |
| `chat/history/` | Persistence (IDB) + sync to backend |
| `vision/` | Image-to-text for vehicle damage analysis |
| `diagnostics/` | Pre-defined diagnostic decision trees |

## Key Design Choices

- **OpenAI keys never reach the browser.** All AI traffic goes through Next.js route handlers in `app/api/ai/*` which proxy to OpenAI.
- **Streaming via SSE.** Messages append to the `chat` Redux slice in real time.
- **Tool-calling pattern.** Agents emit tool requests; the host (browser) executes them and returns results to the agent.
- **Memory is per-user**, encrypted at rest with Web Crypto, and synced to backend for cross-device continuity.
- **Voice abstraction:** the same `useVoice()` hook works on web (Web Speech) and will work on native (expo-speech) by swapping the adapter.
