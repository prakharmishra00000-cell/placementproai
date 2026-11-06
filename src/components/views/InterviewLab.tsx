'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Bot, Send, Mic, FileText, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const INTERVIEW_TYPES = [
  { code: 'TECHNICAL', label: 'Technical Interview', desc: 'Branch-specific technical questions', icon: FileText },
  { code: 'HR', label: 'HR Interview', desc: 'Behavioral and cultural fit', icon: User },
  { code: 'BEHAVIORAL', label: 'Behavioral', desc: 'STAR-format behavioral questions', icon: MessageSquare },
  { code: 'MANAGERIAL', label: 'Managerial', desc: 'Project and team scenarios', icon: User },
];

const QUESTION_BANK: Record<string, string[]> = {
  TECHNICAL: [
    'Walk me through your favorite project. What were the key technical decisions?',
    'Explain a complex engineering concept you understand well, as if to a non-engineer.',
    'How do you approach debugging a tricky bug in production?',
    'What is your favorite data structure and when would you use it?',
    'Describe a time when you had to optimize a slow process.',
  ],
  HR: [
    'Tell me about yourself.',
    'Why do you want to join our company specifically?',
    'Where do you see yourself in 5 years?',
    'What are your strengths and weaknesses?',
    'Why should we hire you over other candidates?',
  ],
  BEHAVIORAL: [
    'Describe a time you faced a major setback. How did you handle it?',
    'Tell me about a time you had to work with a difficult team member.',
    'Give an example of when you took initiative beyond your role.',
    'Describe a time when you had to make a decision with incomplete information.',
    'Tell me about a time you failed. What did you learn?',
  ],
  MANAGERIAL: [
    'How would you handle a project that is running behind schedule?',
    'Describe how you would prioritize conflicting tasks.',
    'How do you ensure quality when working under tight deadlines?',
    'Tell me about a time you led a team through ambiguity.',
    'How would you convince stakeholders to adopt a new approach?',
  ],
};

export default function InterviewLab() {
  const setView = useApp((s) => s.setView);
  const [type, setType] = useState<string | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string; feedback: string }[]>([]);

  if (!type) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><MessageSquare className="h-7 w-7 text-primary" /> Interview Lab</h1>
          <p className="text-muted-foreground mt-1">Practice with AI-powered mock interviews. Get instant feedback on your answers.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INTERVIEW_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.code} className="hover:shadow-md transition-shadow cursor-pointer">
                <button onClick={() => setType(t.code)} className="text-left w-full h-full">
                  <CardContent className="p-5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3"><Icon className="h-5 w-5" /></div>
                    <h3 className="font-semibold">{t.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    <div className="mt-3 flex items-center text-primary text-xs font-medium gap-1">Start <ArrowRight className="h-3 w-3" /></div>
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const qs = QUESTION_BANK[type];
  const current = qs[qIdx % qs.length];

  const submit = async () => {
    if (!answer.trim()) return toast.error('Type your answer first');
    setLoading(true);
    try {
      // Use the AI chat endpoint for evaluation
      const r = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `This is a ${type} mock interview. Question: "${current}". My answer: "${answer}". Evaluate my answer in under 150 words. Be specific and constructive. Cover: (1) technical correctness/relevance (2) clarity (3) structure (4) one concrete improvement.`,
          agent: 'INTERVIEW_COACH',
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setFeedback(j.reply);
      setHistory((h) => [...h, { q: current, a: answer, feedback: j.reply }]);
    } catch (e: any) {
      toast.error(e.message);
      setFeedback('Sorry, AI feedback is unavailable right now. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setQIdx((i) => i + 1);
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge variant="outline">{INTERVIEW_TYPES.find(t => t.code === type)?.label}</Badge>
          <h1 className="text-2xl font-bold mt-1">Mock Interview Session</h1>
        </div>
        <Button variant="ghost" onClick={() => setType(null)}>← Change type</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-start gap-2"><Bot className="h-5 w-5 text-primary flex-shrink-0" /> Question {qIdx + 1}</CardTitle>
          <CardDescription className="text-base text-foreground mt-2">{current}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
          />
          <div className="flex justify-between">
            <Button variant="outline" className="gap-2"><Mic className="h-4 w-4" /> Voice (coming soon)</Button>
            <Button onClick={submit} disabled={loading} className="gap-2"><Send className="h-4 w-4" /> {loading ? 'Evaluating…' : 'Get AI feedback'}</Button>
          </div>
        </CardContent>
      </Card>

      {feedback && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-emerald-600" /> AI Feedback</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-wrap">{feedback}</div>
            <Button onClick={next} className="mt-4 gap-2">Next question <ArrowRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      )}

      {history.length > 1 && (
        <Card>
          <CardHeader><CardTitle>Session history ({history.length} answered)</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">Q: {h.q}</div>
                <div className="text-muted-foreground mt-1"><strong>Your answer:</strong> {h.a.slice(0, 100)}{h.a.length > 100 ? '…' : ''}</div>
                <div className="text-muted-foreground mt-1"><strong>Feedback:</strong> {h.feedback.slice(0, 100)}{h.feedback.length > 100 ? '…' : ''}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
