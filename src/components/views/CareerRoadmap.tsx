'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Map, Plus, Check, ArrowRight, Target } from 'lucide-react';

export default function CareerRoadmap() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState('');

  const load = () => {
    fetch('/api/roadmap').then(r => r.json()).then(j => setData(j)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading roadmap…</div>;

  const r = data?.roadmap;
  const milestones: [string, boolean][] = r?.milestones ? JSON.parse(r.milestones) : [];

  const toggle = async (i: number) => {
    const updated = milestones.map((m, idx) => idx === i ? [m[0], !m[1]] as [string, boolean] : m);
    const done = updated.filter(m => m[1]).length;
    const progress = updated.length > 0 ? done / updated.length : 0;
    await fetch('/api/roadmap', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: r?.goal, milestones: updated, progress }),
    });
    load();
  };

  const add = async () => {
    if (!newMilestone) return;
    const updated = [...milestones, [newMilestone, false] as [string, boolean]];
    await fetch('/api/roadmap', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: r?.goal, milestones: updated, progress: 0 }),
    });
    setNewMilestone('');
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Map className="h-7 w-7 text-primary" /> Career Roadmap</h1>
        <p className="text-muted-foreground mt-1">Your personalized path to your target role: <strong>{r?.goal || 'Not set'}</strong></p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Overall progress</CardTitle>
            <span className="text-2xl font-bold">{r ? Math.round(r.progress * 100) : 0}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(r?.progress || 0) * 100} className="h-3" />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Milestones</h2>
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <button onClick={() => toggle(i)} className={`h-6 w-6 rounded-md grid place-items-center flex-shrink-0 ${m[1] ? 'bg-primary text-primary-foreground' : 'border-2 border-muted'}`}>
                {m[1] && <Check className="h-4 w-4" />}
              </button>
              <span className={`text-sm ${m[1] ? 'line-through text-muted-foreground' : ''}`}>{m[0]}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add a milestone…" onKeyDown={(e) => e.key === 'Enter' && add()} />
          <Button onClick={add} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Suggested milestone templates</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          {[
            'Build foundational skills in target domain',
            'Complete 2 industry-relevant projects',
            'Take 5 mock interviews',
            'Solve 100 aptitude problems',
            'Create ATS-friendly resume',
            'Apply to 15 target companies',
            'Clear technical interview round',
            'Receive at least one offer',
          ].map((t) => (
            <Button key={t} variant="outline" size="sm" className="justify-start h-auto py-2 text-left" onClick={async () => {
              const updated = [...milestones, [t, false] as [string, boolean]];
              await fetch('/api/roadmap', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal: r?.goal, milestones: updated, progress: 0 }),
              });
              load();
            }}>{t}</Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
