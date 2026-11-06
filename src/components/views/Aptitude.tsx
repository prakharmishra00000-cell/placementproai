'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Brain, MessageSquare, Code2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { key: 'AP101', label: 'Quantitative Aptitude', icon: Calculator, color: 'bg-blue-500/10 text-blue-600', desc: 'Percentages, profit-loss, time-speed-distance, probability, statistics' },
  { key: 'AP102', label: 'Logical Reasoning', icon: Brain, color: 'bg-violet-500/10 text-violet-600', desc: 'Series, blood relations, puzzles, syllogisms, data sufficiency' },
  { key: 'AP103', label: 'Verbal Ability', icon: MessageSquare, color: 'bg-emerald-500/10 text-emerald-600', desc: 'Grammar, vocabulary, RC, sentence correction, email writing' },
  { key: 'AP104', label: 'Programming Prep', icon: Code2, color: 'bg-orange-500/10 text-orange-600', desc: 'C, C++, Java, Python, DSA, SQL, debugging, system design basics' },
];

export default function Aptitude() {
  const setView = useApp((s) => s.setView);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Aptitude Center</h1>
        <p className="text-muted-foreground mt-1">Common placement prep — accessible to every engineering branch. Most companies test aptitude + reasoning + verbal in Round 1.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.key}>
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-lg ${c.color} grid place-items-center mb-3`}><Icon className="h-6 w-6" /></div>
                <h3 className="font-semibold">{c.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setView('question-bank', { subjectId: c.key })}>Browse questions</Button>
                  <Button size="sm" className="gap-2" onClick={() => setView('practice-test', { subjectId: c.key })}>Take test <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why placement prep matters</CardTitle>
          <CardDescription>Almost every company — IT, core, semiconductor, PSU — opens with aptitude + reasoning + verbal round.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
          <div><div className="font-medium mb-1">Round 1 — Aptitude</div><div className="text-muted-foreground">Quant + Logical + Verbal. Usually 30-60 questions in 30-60 min.</div></div>
          <div><div className="font-medium mb-1">Round 2 — Technical</div><div className="text-muted-foreground">Branch MCQs + coding (for IT/CSE) + core concepts.</div></div>
          <div><div className="font-medium mb-1">Round 3 — Interview</div><div className="text-muted-foreground">Technical, managerial and HR rounds. Practice in Interview Lab.</div></div>
        </CardContent>
      </Card>
    </div>
  );
}
