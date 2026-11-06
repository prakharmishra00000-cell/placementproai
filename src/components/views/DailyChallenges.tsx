'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trophy, Flame, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyChallenges() {
  const [today, setToday] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const load = () => {
    fetch('/api/challenges').then(r => r.json()).then(j => {
      setToday(j.challenge);
      setSubmitted(j.attempted?.[0] || null);
    }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!answer) return toast.error('Type your answer');
    try {
      const r = await fetch(`/api/challenges/${today.id}/attempt`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setSubmitted(j.attempt);
      if (j.isCorrect) toast.success(`Correct! +${j.attempt.earnedPoints} points`);
      else toast.error(`Not quite — answer was ${j.correctAnswer}`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Trophy className="h-7 w-7 text-primary" /> Daily Challenges</h1>
        <p className="text-muted-foreground mt-1">Build your streak, earn points and stay sharp across aptitude, reasoning, programming and core engineering</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{today?.category}</Badge>
            <span className="text-xs text-muted-foreground">{today?.date}</span>
          </div>
          <CardTitle className="mt-2">{today?.title}</CardTitle>
          <CardDescription>{today?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">{today?.question}</p>
          {submitted ? (
            <div className={`rounded-lg p-3 ${submitted.isCorrect ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'}`}>
              <div className="flex items-center gap-2 font-medium">
                {submitted.isCorrect ? <><CheckCircle2 className="h-5 w-5" /> Correct! +{submitted.earnedPoints} points</> : <><XCircle className="h-5 w-5" /> Incorrect</>}
              </div>
              <div className="text-sm mt-1">Your answer: {submitted.submittedAnswer}</div>
              <div className="text-sm">Correct answer: {today?.answer}</div>
            </div>
          ) : (
            <>
              <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" onKeyDown={(e) => e.key === 'Enter' && submit()} />
              <Button onClick={submit} className="gap-2"><ArrowRight className="h-4 w-4" /> Submit answer</Button>
            </>
          )}
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" /> Solving daily builds your streak and unlocks weekly rewards.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Why daily challenges?</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
          <div><div className="font-medium">Consistency</div><div className="text-muted-foreground">Daily practice compounds over weeks.</div></div>
          <div><div className="font-medium">Variety</div><div className="text-muted-foreground">Each day covers a different skill area.</div></div>
          <div><div className="font-medium">Competition</div><div className="text-muted-foreground">Leaderboards at college and branch level.</div></div>
        </CardContent>
      </Card>
    </div>
  );
}
