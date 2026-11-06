'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Search, MapPin, Building2, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function JobPortal() {
  const profile = useApp((s) => s.profile);
  const user = useApp((s) => s.user);
  const setView = useApp((s) => s.setView);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ branchCode: '', jobType: '', location: '', q: '' });
  const [eligibility, setEligibility] = useState<Record<string, any>>({});
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.branchCode) params.set('branchCode', filters.branchCode);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.location) params.set('location', filters.location);
    fetch(`/api/jobs?${params}`)
      .then(r => r.json())
      .then(j => {
        setJobs(j.jobs || []);
        // For students, check eligibility for each job
        if (user?.role === 'STUDENT') {
          (j.jobs || []).forEach(async (job: any) => {
            try {
              const r = await fetch(`/api/jobs/${job.id}/eligibility`);
              const data = await r.json();
              setEligibility((prev) => ({ ...prev, [job.id]: data }));
            } catch {}
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, user]);

  const apply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const r = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      toast.success('Application submitted!');
      setView('application-tracker');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = filters.q
    ? jobs.filter(j => (j.title + j.description + j.company.name).toLowerCase().includes(filters.q.toLowerCase()))
    : jobs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Briefcase className="h-7 w-7 text-primary" /> Job Portal</h1>
        <p className="text-muted-foreground mt-1">{jobs.length} active openings • Real job listings with rule-based eligibility engine</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1 flex-1 min-w-48">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input placeholder="Job title, company…" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Branch</label>
          <Input placeholder="CSE, ECE…" value={filters.branchCode} onChange={(e) => setFilters({ ...filters, branchCode: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Type</label>
          <Select value={filters.jobType} onValueChange={(v) => setFilters({ ...filters, jobType: v === 'ALL' ? '' : v })}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FULL_TIME">Full-time</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="APPRENTICESHIP">Apprenticeship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Location</label>
          <Input placeholder="City" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        </div>
      </div>

      {/* Job cards */}
      {loading ? (
        <div className="grid lg:grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : filteredJobs.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Search className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No jobs match your filters.</p>
        </CardContent></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-3">
          {filteredJobs.map((j) => {
            const e = eligibility[j.id];
            const isRecruiter = user?.role === 'RECRUITER';
            return (
              <Card key={j.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{j.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {j.company.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {j.location} • {j.jobType.replace('_', '-')}</div>
                    </div>
                    <div className="text-right text-xs">
                      {j.salaryMin && j.salaryMax ? <div className="font-medium">₹{(j.salaryMin/100000).toFixed(1)}–{(j.salaryMax/100000).toFixed(1)} LPA</div> : null}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{j.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      try { return JSON.parse(j.requiredBranches || '[]'); } catch { return []; }
                    })().map((b: string) => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                    {(() => {
                      try { return JSON.parse(j.requiredSkills || '[]'); } catch { return []; }
                    })().slice(0, 4).map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">
                      Min CGPA: {j.minCgpa} • Max backlogs: {j.maxBacklogs}
                    </div>
                    {isRecruiter ? (
                      <Badge variant="outline">Posted by your company</Badge>
                    ) : e ? (
                      <div className="flex items-center gap-2">
                        {e.status === 'ELIGIBLE' && <Badge className="gap-1 bg-emerald-500"><CheckCircle2 className="h-3 w-3" /> Eligible</Badge>}
                        {e.status === 'NEEDS_VERIFICATION' && <Badge className="gap-1 bg-amber-500"><AlertTriangle className="h-3 w-3" /> Needs verification</Badge>}
                        {e.status === 'NOT_ELIGIBLE' && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Not eligible</Badge>}
                        <Button size="sm" disabled={e.status === 'NOT_ELIGIBLE' || applying === j.id} onClick={() => apply(j.id)} className="gap-1">
                          {applying === j.id ? 'Applying…' : <>Apply <ArrowRight className="h-3.5 w-3.5" /></>}
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => apply(j.id)} className="gap-1">Apply <ArrowRight className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>

                  {e?.reasons && e.status !== 'ELIGIBLE' && (
                    <div className="rounded-lg bg-muted/50 p-2 text-xs space-y-1">
                      {e.reasons.map((r: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5">
                          {r.status === 'PASS' ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : r.status === 'FAIL' ? <XCircle className="h-3 w-3 text-rose-600" /> : <Info className="h-3 w-3 text-amber-600" />}
                          <span className="font-medium">{r.rule}:</span> required {r.required}, you have {r.actual}
                          {r.missing && ` — missing: ${r.missing.join(', ')}`}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
