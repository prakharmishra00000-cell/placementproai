'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Clock, CheckCircle2, ArrowRight, Trophy, FileText, Code2, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { name: 'Aptitude Test', desc: 'Quantitative, logical reasoning, verbal ability', icon: Trophy, time: '45 min' },
  { name: 'Technical MCQs', desc: 'Branch-specific technical assessment', icon: FileText, time: '30 min' },
  { name: 'Coding Assessment', desc: 'Programming problem-solving (where applicable)', icon: Code2, time: '60 min' },
  { name: 'Group Discussion', desc: 'Communication and teamwork evaluation', icon: Users, time: '20 min' },
  { name: 'Technical Interview', desc: 'Deep technical interview with mock panel', icon: MessageSquare, time: '45 min' },
  { name: 'HR Interview', desc: 'Behavioral and HR interview', icon: MessageSquare, time: '20 min' },
];

const COMPANY_TEMPLATES = [
  { name: 'Mass Recruiter (TCS, Infosys, Cognizant)', desc: 'Service-based IT company with large intake. Eligibility: 60%+ throughout, no active backlogs. Rounds: Aptitude → Coding → Technical → HR.', difficulty: 'Medium' },
  { name: 'Product Company (ServiceNow, Salesforce)', desc: 'Product SaaS company. Eligibility: 7+ CGPA, strong DSA. Rounds: Coding → System Design → Technical → Managerial → HR.', difficulty: 'Hard' },
  { name: 'Semiconductor (Intel, AMD, NVIDIA)', desc: 'VLSI / embedded roles. Eligibility: ECE/EEE branches, 7.5+ CGPA, no backlogs. Rounds: Technical MCQs → Technical Interview (2-3 rounds) → HR.', difficulty: 'Hard' },
  { name: 'Core Mechanical (Tata, L&T, Mahindra)', desc: 'Mechanical / production roles. Eligibility: ME/PE branches, 6.5+ CGPA, ≤1 backlog. Rounds: Aptitude → Technical → GD → Interview.', difficulty: 'Medium' },
  { name: 'Civil / Construction (L&T Construction, Shapoorji)', desc: 'Site / design roles. Eligibility: CE branch, 6+ CGPA. Rounds: Aptitude → Technical → GD → HR.', difficulty: 'Medium' },
];

export default function CompanySimulator() {
  const setView = useApp((s) => s.setView);
  const [selected, setSelected] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const startSim = (i: number) => {
    setSelected(i);
    setActiveStage(0);
    setScores([]);
  };

  const finishStage = (score: number) => {
    setScores((s) => [...s, score]);
    if (activeStage < STAGES.length - 1) {
      setActiveStage(activeStage + 1);
    } else {
      const total = [...scores, score].reduce((a, b) => a + b, 0) / STAGES.length;
      toast.success(`Simulation complete! Overall score: ${total.toFixed(1)}/100`);
    }
  };

  if (selected !== null) {
    const stage = STAGES[activeStage];
    const Icon = stage.icon;
    return (
      <div className="space-y-6 max-w-3xl">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back to templates</Button>
        <div>
          <Badge variant="outline">{COMPANY_TEMPLATES[selected].difficulty}</Badge>
          <h1 className="text-2xl font-bold mt-2">{COMPANY_TEMPLATES[selected].name} — Simulation</h1>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {STAGES.map((s, i) => (
            <div key={s.name} className={`rounded-lg border p-2 text-center ${i < activeStage ? 'bg-emerald-500/10 border-emerald-500/30' : i === activeStage ? 'bg-primary text-primary-foreground' : 'opacity-50'}`}>
              <div className="text-xs font-medium">{i + 1}</div>
              <div className="text-[10px] mt-1 leading-tight hidden sm:block">{s.name}</div>
            </div>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /> Stage {activeStage + 1}: {stage.name}</CardTitle>
            <CardDescription>{stage.desc} • Expected duration: {stage.time}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">This stage is a guided simulation. In the full version, you&apos;d answer real questions or write code. For the demo, you can self-evaluate your performance to simulate the experience.</p>
            <div className="flex flex-wrap gap-2">
              {[60, 70, 80, 90, 100].map((s) => (
                <Button key={s} variant="outline" onClick={() => finishStage(s)}>Score {s}%</Button>
              ))}
            </div>
            {scores.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">Stages completed: {scores.length}. Average: {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}%</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Building className="h-7 w-7 text-primary" /> Company Placement Simulator</h1>
        <p className="text-muted-foreground mt-1">Simulate the complete recruitment journey end-to-end across common company templates</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {COMPANY_TEMPLATES.map((c, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <button onClick={() => startSim(i)} className="text-left w-full h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{c.name}</h3>
                  <Badge variant={c.difficulty === 'Hard' ? 'destructive' : 'secondary'}>{c.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-3 flex items-center text-primary text-sm font-medium gap-1">
                  Start simulation <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Stages in a typical recruitment journey</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="text-sm font-medium">{i + 1}. {s.name}</div>
                </div>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <div className="text-xs text-muted-foreground mt-1">⏱ {s.time}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4 text-sm">
        <strong>Note:</strong> This is a simulation — passing it does not guarantee selection in actual recruitment. Use it to identify and improve weak areas.
      </div>
    </div>
  );
}
