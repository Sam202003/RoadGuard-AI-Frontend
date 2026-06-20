'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  isLoading,
  placeholder = 'Describe your vehicle problem…',
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isLoading) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="flex flex-col gap-2 border-t border-border/60 bg-background/80 p-4 backdrop-blur-sm">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={disabled || isLoading}
        className="min-h-[80px] resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={disabled || isLoading || !value.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
