'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, ClipboardCheck, CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

export default function PracticeTest() {
  const viewParams = useApp((s) => s.viewParams);
  const profile = useApp((s) => s.profile);
  const setView = useApp((s) => s.setView);

  const [setup, setSetup] = useState<any>({
    subjectId: viewParams?.subjectId || '',
    branchId: profile?.branchId || '',
    difficulty: '',
    count: 10,
  });
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (profile?.branchId) {
      fetch(`/api/subjects?branchId=${profile.branchId}`)
        .then(r => r.json())
        .then(j => setSubjects(j.subjects || []))
        .catch(() => {});
    }
    // Common subjects
    fetch('/api/subjects?isCommon=true').then(r => r.json()).then(j => setSubjects(prev => [...prev, ...(j.subjects || [])])).catch(() => {});
  }, [profile?.branchId]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [started, timeLeft]);

  const startTest = async () => {
    setLoading(true);
    try {
      const body: any = { count: Number(setup.count), type: 'PRACTICE' };
      if (setup.subjectId) body.subjectId = setup.subjectId;
      else if (setup.branchId) body.branchId = setup.branchId;
      if (setup.difficulty) body.difficulty = setup.difficulty;
      const r = await fetch('/api/test/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setTest(j);
      setAnswers({});
      setResults(null);
      setIdx(0);
      setStarted(true);
      setTimeLeft(j.questions.reduce((a: number, q: any) => a + (q.expectedTimeSec || 60), 0));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/test/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: test.testId, answers, durationSec: 0 }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setResults(j);
      setStarted(false);
      toast.success(`Test submitted! Score: ${j.score}/${j.maxScore} • Accuracy: ${j.accuracy}%`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setTest(null); setAnswers({}); setResults(null); setIdx(0); setStarted(false); setTimeLeft(0);
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ===== Setup screen =====
  if (!test && !results) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button onClick={() => setView('learning')} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><ClipboardCheck className="h-7 w-7 text-primary" /> Practice Test</h1>
          <p className="text-muted-foreground mt-1">Take a timed test. Answers, explanations and detailed results are saved to your profile.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Configure your test</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={setup.subjectId} onChange={(e) => setSetup({ ...setup, subjectId: e.target.value })}>
                <option value="">Any subject in my branch</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={setup.difficulty} onChange={(e) => setSetup({ ...setup, difficulty: e.target.value })}>
                  <option value="">Mixed</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Number of questions</Label>
                <Input type="number" min="1" max="50" value={setup.count} onChange={(e) => setSetup({ ...setup, count: Number(e.target.value) })} />
              </div>
            </div>
            <Button onClick={startTest} disabled={loading} className="gap-2 w-full">
              {loading ? 'Starting…' : <>Start test <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== Results screen =====
  if (results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
          <Button onClick={restart} variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" /> Take another test</Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Score</div><div className="text-2xl font-bold">{results.score}/{results.maxScore}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Correct</div><div className="text-2xl font-bold">{results.correctCount}/{results.total}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Accuracy</div><div className="text-2xl font-bold">{results.accuracy}%</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Time</div><div className="text-2xl font-bold">{fmtTime(results.durationSec)}</div></CardContent></Card>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Detailed review</h2>
          <div className="space-y-3">
            {results.results?.map((r: any, i: number) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {r.isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-rose-600 mt-1 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs">Q{i + 1}</Badge>
                        <Badge variant="secondary" className="text-xs">{r.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">{r.type}</Badge>
                      </div>
                      <p className="font-medium">{r.text}</p>
                      {r.options?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {r.options.map((o: string, idx: number) => {
                            const correctArr = JSON.parse(r.correctAnswer || '[]');
                            const userAns = r.userAnswer !== undefined && r.userAnswer !== null ? String(r.userAnswer) : null;
                            const isCorrect = correctArr.includes(idx);
                            const isUser = userAns === String(idx);
                            return (
                              <div key={idx} className={`text-sm p-2 rounded ${isCorrect ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : isUser ? 'bg-rose-500/15 text-rose-700' : 'bg-muted/40'}`}>
                                {String.fromCharCode(65 + idx)}. {o} {isCorrect && '✓'} {isUser && !isCorrect && '← your answer'}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!r.options?.length && (
                        <div className="mt-2 text-sm">
                          <div>Your answer: <span className={`font-medium ${r.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>{String(r.userAnswer ?? '-')}</span></div>
                          <div>Correct: <span className="font-medium text-emerald-600">{r.correctAnswer}</span></div>
                        </div>
                      )}
                      {r.explanation && <div className="mt-2 p-2 rounded bg-muted/50 text-sm border-l-2 border-primary"><div className="text-xs font-medium text-primary mb-1">EXPLANATION</div>{r.explanation}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== Test in progress =====
  const q = test.questions[idx];
  const totalQ = test.questions.length;
  const progress = (idx / totalQ) * 100;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">Question {idx + 1} of {totalQ}</div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" /> <span className={timeLeft < 60 ? 'text-rose-600 font-medium' : ''}>{fmtTime(timeLeft)}</span>
        </div>
      </div>
      <Progress value={progress} className="h-1" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">{q.type}</Badge>
            <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
            <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
          </div>
          <CardTitle className="text-lg mt-2">{q.text}</CardTitle>
        </CardHeader>
        <CardContent>
          {q.options?.length > 0 ? (
            <RadioGroup value={String(answers[q.id] ?? '')} onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}>
              <div className="space-y-2">
                {q.options.map((o: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
                    <Label htmlFor={`opt-${idx}`} className="cursor-pointer flex-1">{String.fromCharCode(65 + idx)}. {o}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <Input
              placeholder="Type your answer"
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</Button>
        <div className="flex gap-2">
          {idx < totalQ - 1 ? (
            <Button onClick={() => setIdx(idx + 1)}>Next</Button>
          ) : (
            <Button onClick={submit} disabled={loading} className="gap-2">
              {loading ? 'Submitting…' : <>Submit test <CheckCircle2 className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {test.questions.map((qq: any, i: number) => (
          <button
            key={qq.id}
            onClick={() => setIdx(i)}
            className={`h-8 w-8 rounded text-xs font-medium ${answers[qq.id] !== undefined ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
