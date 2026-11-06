'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FlaskConical, ArrowRight, CheckCircle2, BrainCircuit, Wrench, Cpu } from 'lucide-react';

export default function VirtualLabs() {
  const [sims, setSims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any>(null);
  const [submission, setSubmission] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/simulations').then(r => r.json()).then(j => setSims(j.simulations || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!submission.trim()) return toast.error('Write your solution first');
    try {
      const r = await fetch(`/api/simulations/${active.id}/attempt`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setResult(j.attempt);
      toast.success('Submission evaluated');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (active) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Button variant="ghost" onClick={() => { setActive(null); setResult(null); setSubmission(''); }}>← Back to scenarios</Button>
        <div>
          <Badge variant="outline">{active.branchCode}</Badge>
          <h1 className="text-2xl font-bold mt-2">{active.title}</h1>
        </div>
        <Card>
          <CardHeader><CardTitle>Problem statement</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{active.description}</p>
            <div>
              <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Objectives</div>
              <ul className="list-disc pl-4">{JSON.parse(active.objectives || '[]').map((o: string, i: number) => <li key={i}>{o}</li>)}</ul>
            </div>
            <div>
              <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Constraints</div>
              <ul className="list-disc pl-4">{JSON.parse(active.constraints || '[]').map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
            </div>
            <div>
              <div className="font-medium text-xs uppercase text-muted-foreground mb-1">Evaluation rubric</div>
              <ul className="list-disc pl-4">{JSON.parse(active.rubric || '[]').map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your workspace</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea rows={10} value={submission} onChange={(e) => setSubmission(e.target.value)} placeholder="Type your solution, code, or analysis here…" />
            <Button onClick={submit} className="gap-2"><CheckCircle2 className="h-4 w-4" /> Submit & evaluate</Button>
          </CardContent>
        </Card>
        {result && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> Result</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div>Score: <Badge variant="secondary">{result.score.toFixed(1)}/100</Badge></div>
              <p className="text-sm text-muted-foreground">{result.feedback}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><FlaskConical className="h-7 w-7 text-primary" /> Virtual Labs</h1>
        <p className="text-muted-foreground mt-1">Branch-specific industry simulations. Practice real engineering scenarios in a safe environment.</p>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sims.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <button onClick={() => setActive(s)} className="text-left w-full h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs">{s.branchCode}</Badge>
                    <Badge variant="secondary" className="text-xs">{s.difficulty}</Badge>
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">{s.description}</p>
                  <div className="flex items-center text-primary text-xs font-medium gap-1 pt-2">Open <ArrowRight className="h-3 w-3" /></div>
                </CardContent>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
