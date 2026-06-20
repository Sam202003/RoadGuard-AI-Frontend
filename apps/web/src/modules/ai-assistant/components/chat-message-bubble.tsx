'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '../types/ai.types';
import { DiagnosisCard } from './diagnosis-card';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError === true;

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
          isUser
            ? 'border-primary/30 bg-primary/10 text-primary'
            : isError
              ? 'border-destructive/30 bg-destructive/10 text-destructive'
              : 'border-border bg-muted text-muted-foreground',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('min-w-0 max-w-[85%] space-y-3', isUser && 'items-end text-right')}>
        {message.content && (
          <div
            className={cn(
              'rounded-2xl px-4 py-2.5 text-sm',
              isUser
                ? 'bg-primary text-primary-foreground'
                : isError
                  ? 'border border-destructive/40 bg-destructive/10 text-destructive'
                  : 'border border-border/60 bg-card text-foreground',
            )}
          >
            {message.content}
          </div>
        )}

        {message.diagnosis && (
          <DiagnosisCard
            diagnosis={message.diagnosis}
            source={message.source}
            compact
          />
        )}
      </div>
    </div>
  );
}
