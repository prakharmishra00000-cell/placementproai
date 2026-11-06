'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, ArrowRight, Clock, User } from 'lucide-react';

export default function ProjectMarketplace() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState('');

  useEffect(() => {
    fetch(`/api/projects${branchFilter ? `?branchCode=${branchFilter}` : ''}`)
      .then(r => r.json())
      .then(j => setProjects(j.projects || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [branchFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Rocket className="h-7 w-7 text-primary" /> Project Marketplace</h1>
        <p className="text-muted-foreground mt-1">Real industry projects, micro-internships, and engineering challenges from verified companies and faculty</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-sm text-muted-foreground">No projects available right now.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-xs">{p.branchCode}</Badge>
                  <Badge variant="secondary" className="text-xs">{p.status}</Badge>
                </div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(p.requiredSkills || []).slice(0, 3).map((s: string) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
                <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.timeline}</div>
                  <div className="flex items-center gap-1"><User className="h-3 w-3" /> {p.mentor}</div>
                </div>
                <Button size="sm" className="w-full gap-2" onClick={() => alert(`You've expressed interest in "${p.title}". A mentor will contact you.`)}>Apply <ArrowRight className="h-3.5 w-3.5" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
