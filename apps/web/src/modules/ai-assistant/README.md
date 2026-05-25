# modules/ai-assistant — AI Diagnostic Assistant Module

Chat-based AI assistant that diagnoses vehicle problems and can take actions on the user's behalf (create breakdown request, find nearest provider, call emergency).

## Highlights

- Consumes `src/ai/` infrastructure (`agents/diagnosis-agent`, `chat/streaming`).
- Stream responses via SSE — messages append to the `aiApi` slice in real time.
- Tool-calling: agent emits tool requests; UI executes them and returns results.
- Persists conversation in IDB so users can resume mid-conversation across sessions.
- Voice mode delegates to `modules/voice-assistant`.

## Folder Shape

```
ai-assistant/
├── components/
│   ├── AIAssistantPage.tsx
│   ├── ChatThread.tsx
│   ├── MessageBubble.tsx
│   ├── StreamingMessage.tsx
│   ├── ToolExecutionCard.tsx
│   ├── SuggestedActions.tsx
│   └── DiagnosticSummary.tsx
├── hooks/
│   ├── useAIChat.ts                Wraps @rg/hooks/ai/useAIChat
│   ├── useToolExecutor.ts          Bridges agent tool requests to module hooks
│   └── useConversationHistory.ts
├── services/
│   └── ai-assistant.service.ts
├── store/
│   ├── ai.slice.ts                 Active conversation, streaming state
│   └── ai.selectors.ts
├── validations/
└── index.ts
```

## Tool Execution Flow

```
Agent emits tool request: { name: 'createBreakdownRequest', args: {…} }
   ↓
useToolExecutor catches request
   ↓
Maps to module hook (e.g., useCreateBreakdown from modules/breakdown)
   ↓
Executes → returns result to agent
   ↓
Agent continues conversation with tool result in context
```

Tools are declared in `src/ai/tools/` and registered with the agent in `src/ai/agents/`.
