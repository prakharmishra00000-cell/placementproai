'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Briefcase, Building2, Plus, Users, ClipboardCheck, TrendingUp, Calendar } from 'lucide-react';

export default function PlacementOfficer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ collegeId: '', companyId: '', jobId: '', title: '', description: '', visitDate: '' });

  const load = () => {
    setLoading(true);
    fetch('/api/analytics/college').then(r => r.json()).then(setData).catch(() => {});
    fetch('/api/placement/drives').then(r => r.json()).then(j => setDrives(j.drives || [])).catch(() => {});
    fetch('/api/jobs').then(r => r.json()).then(j => setJobs(j.jobs || [])).catch(() => {});
    fetch('/api/colleges').then(r => r.json()).then(j => setCompanies(j.colleges || [])).catch(() => {});
    // Better: fetch all companies
    fetch('/api/jobs?limit=200').then(r => r.json()).then(j => {
      const comps = new Map();
      (j.jobs || []).forEach((job: any) => comps.set(job.company.id, job.company));
      setCompanies(Array.from(comps.values()));
    }).catch(() => {});
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createDrive = async () => {
    if (!form.title || !form.collegeId || !form.companyId) return toast.error('Title, college and company required');
    setCreating(true);
    try {
      const r = await fetch('/api/placement/drives', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      toast.success('Placement drive created');
      setForm({ collegeId: '', companyId: '', jobId: '', title: '', description: '', visitDate: '' });
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Briefcase className="h-7 w-7 text-primary" /> Placement Officer Dashboard</h1>
        <p className="text-muted-foreground mt-1">Create placement drives, shortlist candidates, track recruitment</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Eligible students</div><div className="text-2xl font-bold mt-1">{data?.totals?.students || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active drives</div><div className="text-2xl font-bold mt-1">{drives.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Applications</div><div className="text-2xl font-bold mt-1">{data?.totals?.applications || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Placement rate</div><div className="text-2xl font-bold mt-1">{data?.totals?.placementRate || 0}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create new placement drive</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>College</Label>
              <Select value={form.collegeId} onValueChange={(v) => setForm({ ...form, collegeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
                <SelectContent>{data && <SelectItem value={data.college?.id || ''}>Your college</SelectItem>}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
                <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Linked job (optional)</Label>
              <Select value={form.jobId} onValueChange={(v) => setForm({ ...form, jobId: v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Visit date</Label>
              <Input type="date" value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Drive title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. TechNova Campus Drive 2026" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Drive details, eligibility, process, package, etc." />
          </div>
          <Button onClick={createDrive} disabled={creating} className="gap-2"><Plus className="h-4 w-4" /> {creating ? 'Creating…' : 'Create drive'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent placement drives</CardTitle></CardHeader>
        <CardContent>
          {drives.length > 0 ? (
            <div className="space-y-2">
              {drives.map((d) => (
                <div key={d.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{d.title}</div>
                      <div className="text-sm text-muted-foreground">{d.company?.name} • {d.college?.name}</div>
                      {d.visitDate && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" /> {new Date(d.visitDate).toLocaleDateString()}</div>}
                    </div>
                    <Badge variant={d.status === 'COMPLETED' ? 'secondary' : d.status === 'ONGOING' ? 'default' : 'outline'}>{d.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-6">No drives yet. Create your first one above.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
