'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Briefcase, ArrowRight } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  APPLIED: 'bg-blue-500/10 text-blue-700',
  SHORTLISTED: 'bg-violet-500/10 text-violet-700',
  INTERVIEW: 'bg-amber-500/10 text-amber-700',
  OFFER: 'bg-emerald-500/10 text-emerald-700',
  REJECTED: 'bg-rose-500/10 text-rose-700',
  WITHDRAWN: 'bg-gray-500/10 text-gray-700',
};

export default function Applications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const setView = useApp((s) => s.setView);

  useEffect(() => {
    fetch('/api/applications').then(r => r.json()).then(j => setApps(j.applications || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Group by status
  const byStatus: Record<string, any[]> = {};
  apps.forEach(a => { (byStatus[a.status] = byStatus[a.status] || []).push(a); });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Rocket className="h-7 w-7 text-primary" /> My Applications</h1>
          <p className="text-muted-foreground mt-1">{apps.length} applications across {Object.keys(byStatus).length} statuses</p>
        </div>
        <Button onClick={() => setView('job-portal')} className="gap-2"><Briefcase className="h-4 w-4" /> Browse jobs</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : apps.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Rocket className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">No applications yet.</p>
          <Button onClick={() => setView('job-portal')} className="gap-2">Browse jobs <ArrowRight className="h-4 w-4" /></Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(byStatus).map(([status, list]) => (
            <div key={status}>
              <h2 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Badge className={STATUS_COLOR[status] || ''}>{status}</Badge> {list.length}
              </h2>
              <div className="space-y-2">
                {list.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{a.job.title}</div>
                        <div className="text-sm text-muted-foreground">{a.job.company.name} • {a.job.location} • {a.job.jobType.replace('_', '-')}</div>
                        <div className="text-xs text-muted-foreground mt-1">Applied {new Date(a.appliedAt).toLocaleDateString()}</div>
                      </div>
                      <Badge variant="outline">₹{(a.job.salaryMin/100000).toFixed(1)}–{(a.job.salaryMax/100000).toFixed(1)} LPA</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
