import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import { Download, RotateCcw, Send, CalendarCheck } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  downloadBlob,
  extractFramework,
  frameworkToDocxBlob,
  stripFramework,
} from '@/lib/frameworkToDocx';

const STORAGE_KEY = 'event-planner-chat-v1';
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/event-planner-chat`;

function loadMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function messageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function PlanEventPage() {
  const [initialMessages] = useState<UIMessage[]>(loadMessages);
  const [input, setInput] = useState('');
  const [downloading, setDownloading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: CHAT_URL,
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }),
  });

  const isWorking = status === 'submitted' || status === 'streaming';

  // Persist the single conversation in this browser.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const framework = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== 'assistant') continue;
      const found = extractFramework(messageText(messages[i]));
      if (found) return found;
    }
    return null;
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isWorking) return;
    setInput('');
    sendMessage({ text });
  };

  const handleStart = () => {
    sendMessage({
      text: "Hi — I'd like to plan a high-signal community event. Let's start the interview.",
    });
  };

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    setInput('');
  };

  const handleDownload = async () => {
    if (!framework || downloading) return;
    setDownloading(true);
    try {
      const blob = await frameworkToDocxBlob(framework);
      const titleLine = framework.split('\n').find((l) => l.startsWith('# '));
      const name = titleLine
        ? titleLine.slice(2).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
        : 'event-operating-framework';
      downloadBlob(blob, `${name || 'event-operating-framework'}.docx`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppLayout activeTab="resources">
      <Seo
        title="Plan a High-Signal Event | Seattle Startup Pulse"
        description="An AI event producer that interviews you about your community event, pressure-tests the plan, and generates a downloadable Operating Framework."
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-primary" />
              Plan a High-Signal Event
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              An AI event producer interviews you about your event, pressure-tests the plan, and
              generates an Operating Framework you can download as a Word doc. Your conversation
              stays in this browser.
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              className="shrink-0 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Start over
            </Button>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg p-8 bg-card">
            <p className="text-foreground font-medium mb-2">Ready when you are.</p>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              You'll answer a few questions at a time about who your event is for, what people walk
              away with, and how connections actually happen — then get a full plan with a run of
              show, timeline, and follow-up plan.
            </p>
            <Button onClick={handleStart} disabled={isWorking}>
              Start the interview
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 mb-4">
              {messages.map((message) => {
                const raw = messageText(message);
                const display = message.role === 'assistant' ? stripFramework(raw) : raw;
                const hasFramework = message.role === 'assistant' && extractFramework(raw);
                if (!display && !hasFramework) return null;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground',
                      )}
                    >
                      {display && (
                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-inherit prose-headings:text-base prose-headings:mt-3 prose-headings:mb-1">
                          <ReactMarkdown>{display}</ReactMarkdown>
                        </div>
                      )}
                      {hasFramework && (
                        <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Your Operating Framework is ready.
                          </p>
                          <Button size="sm" onClick={handleDownload} disabled={downloading}>
                            <Download className="h-4 w-4 mr-1.5" />
                            {downloading ? 'Preparing…' : 'Download Word doc'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === 'submitted' && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 bg-background pt-2 pb-4">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your answer… (Enter to send, Shift+Enter for a new line)"
                  className="min-h-[52px] max-h-40 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isWorking}
                  size="icon"
                  className="h-[52px] w-[52px] shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
