'use client';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AGENTS = [
  { code: 'COPILOT', label: 'AI Placement Copilot', desc: 'General career mentor', icon: Bot },
  { code: 'TUTOR', label: 'Subject Tutor', desc: 'Concept explanations', icon: Sparkles },
  { code: 'INTERVIEW_COACH', label: 'Interview Coach', desc: 'Mock interviews', icon: MessageCircle },
  { code: 'RESUME_EXPERT', label: 'Resume Expert', desc: 'Resume reviews', icon: MessageCircle },
  { code: 'CAREER_STRATEGIST', label: 'Career Strategist', desc: 'Path planning', icon: Sparkles },
];

const SUGGESTIONS = [
  'What should I learn this semester for placement readiness?',
  'Suggest 3 companies I should target based on my profile.',
  'What are my weak topics based on my recent tests?',
  'How do I prepare for a technical interview at a service-based company?',
  'Build me a 30-day study plan to crack campus placements.',
];

export default function AiCopilot() {
  const viewParams = useApp((s) => s.viewParams);
  const [agent, setAgent] = useState('COPILOT');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState(viewParams?.context || '');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewParams?.context) {
      send(viewParams.context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversationId, agent }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setConversationId(j.conversationId);
      setMessages((m) => [...m, { role: 'assistant', content: j.reply }]);
    } catch (e: any) {
      toast.error(e.message);
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I could not generate a response right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Placement Copilot</h1>
          <p className="text-sm text-muted-foreground">Context-aware mentor that knows your branch, semester, CGPA and target role</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {AGENTS.map((a) => {
            const Icon = a.icon;
            const active = agent === a.code;
            return (
              <button
                key={a.code}
                onClick={() => { setAgent(a.code); setMessages([]); setConversationId(null); }}
                title={a.desc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-accent'}`}
              >
                <Icon className="h-3.5 w-3.5" /> {a.label.split(' ').slice(-1)}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          <ScrollArea className="flex-1" >
            <div ref={scrollRef} className="p-4 space-y-4 min-h-full">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-4"><Sparkles className="h-7 w-7" /></div>
                  <h3 className="font-semibold">Ask me anything about your engineering career</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">I have access to your profile, subjects, attempts, skills and target role. Get personalized advice in seconds.</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => send(s)} className="text-left text-sm p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.role === 'user' ? 'You' : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full grid place-items-center bg-muted"><Bot className="h-4 w-4" /></div>
                  <div className="bg-muted rounded-2xl p-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about your studies, career, interview prep…"
              disabled={loading}
            />
            <Button onClick={() => send()} disabled={loading || !input.trim()} className="gap-2">
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
