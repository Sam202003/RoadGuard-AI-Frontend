'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  useDiagnoseBreakdownMutation,
  useListDiagnosisHistoryQuery,
} from '../api';
import { ChatInput } from '../components/chat-input';
import { ChatMessageBubble } from '../components/chat-message-bubble';
import { DiagnosisHistoryPanel } from '../components/diagnosis-history-panel';
import { DEFAULT_DIAGNOSIS_HISTORY_QUERY } from '../constants/ai-query';
import type { AiDiagnosisRecord, ChatMessage } from '../types/ai.types';
import { buildAssistantSummary } from '../utils/formatters';

function recordToMessages(record: AiDiagnosisRecord): ChatMessage[] {
  return [
    {
      id: `${record.id}-user`,
      role: 'user',
      content: record.userMessage,
      createdAt: record.createdAt,
    },
    {
      id: `${record.id}-assistant`,
      role: 'assistant',
      content: buildAssistantSummary(record.diagnosis.probableIssue),
      diagnosis: record.diagnosis,
      diagnosisId: record.id,
      source: record.source,
      createdAt: record.createdAt,
    },
  ];
}

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I\'m your Road Guard breakdown assistant. Describe what\'s happening with your vehicle — symptoms, location, and whether you feel safe — and I\'ll suggest next steps.',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: historyData, isLoading: historyLoading } =
    useListDiagnosisHistoryQuery(DEFAULT_DIAGNOSIS_HISTORY_QUERY);
  const [diagnose, { isLoading: isDiagnosing }] = useDiagnoseBreakdownMutation();

  const history = historyData?.diagnoses ?? [];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setSelectedHistoryId(null);

      const contextMessages = messages
        .filter((m) => m.id !== 'welcome' && m.content)
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      try {
        const record = await diagnose({
          message: text,
          contextMessages,
        }).unwrap();

        const assistantMessage: ChatMessage = {
          id: `assistant-${record.id}`,
          role: 'assistant',
          content: buildAssistantSummary(record.diagnosis.probableIssue),
          diagnosis: record.diagnosis,
          diagnosisId: record.id,
          source: record.source,
          createdAt: record.createdAt,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSelectedHistoryId(record.id);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: getErrorMessage(error, 'Failed to analyze your issue'),
            isError: true,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    },
    [diagnose, messages],
  );

  const handleSelectHistory = (record: AiDiagnosisRecord) => {
    setSelectedHistoryId(record.id);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Showing a past diagnosis. You can continue the conversation or request roadside help.',
        createdAt: new Date().toISOString(),
      },
      ...recordToMessages(record),
    ]);
  };

  const handleNewChat = () => {
    setSelectedHistoryId(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Hi! I\'m your Road Guard breakdown assistant. Describe what\'s happening with your vehicle — symptoms, location, and whether you feel safe — and I\'ll suggest next steps.',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <DashboardContent className="max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="AI Breakdown Assistant"
          description="Describe your issue for an instant safety assessment and provider recommendation."
        />
        <div className="flex shrink-0 flex-wrap gap-2 self-start">
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            New chat
          </Button>
          <Button size="sm" asChild>
            <Link href={routes.customer.breakdownNew}>Request help</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <ChatInput onSend={handleSend} isLoading={isDiagnosing} />
        </div>

        <DiagnosisHistoryPanel
          diagnoses={history}
          isLoading={historyLoading}
          selectedId={selectedHistoryId}
          onSelect={handleSelectHistory}
          className="min-h-[280px] lg:min-h-[520px]"
        />
      </div>
    </DashboardContent>
  );
}
