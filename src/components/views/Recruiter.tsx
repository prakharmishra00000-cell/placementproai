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
import { Briefcase, Building2, Users, Plus, Search, Award, MapPin, ArrowRight } from 'lucide-react';

export default function Recruiter() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'post' | 'talent'>('overview');
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', location: '', jobType: 'FULL_TIME', salaryMin: '', salaryMax: '', requiredBranches: [] as string[], minCgpa: '6.5', maxBacklogs: '0', requiredSkills: [] as string[] });
  const [skillInput, setSkillInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/analytics/recruiter').then(r => r.json()).then(j => { setData(j); if (j.company) {}}).catch(() => {}).finally(() => setLoading(false));
    fetch('/api/branches').then(r => r.json()).then(j => setBranches(j.branches || [])).catch(() => {});
  }, []);

  const postJob = async () => {
    if (!form.title || !data?.company?.id) return toast.error('Job title required');
    try {
      const r = await fetch('/api/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, companyId: data.company.id,
          description: form.description, location: form.location, jobType: form.jobType,
          salaryMin: Number(form.salaryMin) || 0, salaryMax: Number(form.salaryMax) || 0,
          requiredBranches: form.requiredBranches, minCgpa: Number(form.minCgpa), maxBacklogs: Number(form.maxBacklogs),
          requiredSkills: form.requiredSkills,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      toast.success('Job posted');
      setForm({ title: '', description: '', location: '', jobType: 'FULL_TIME', salaryMin: '', salaryMax: '', requiredBranches: [], minCgpa: '6.5', maxBacklogs: '0', requiredSkills: [] });
      setTab('overview');
      const r2 = await fetch('/api/analytics/recruiter'); const j = await r2.json(); setData(j);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading recruiter dashboard…</div>;
  if (!data?.company) return <div className="text-center py-12 text-muted-foreground">No recruiter profile found. Contact admin.</div>;

  const candidates = (data.candidates || []).filter(c => !search || (c.name + c.branch + (c.targetJob || '')).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Building2 className="h-7 w-7 text-primary" /> {data.company.name} — Recruiter Dashboard</h1>
        <p className="text-muted-foreground mt-1">{data.company.industry} • {data.totals?.jobs} jobs posted • {data.totals?.applications} total applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          ['overview', 'Overview'],
          ['post', 'Post new job'],
          ['talent', 'Talent search'],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === k ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Open jobs</div><div className="text-2xl font-bold mt-1">{data.totals?.jobs}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Applications</div><div className="text-2xl font-bold mt-1">{data.totals?.applications}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Talent pool</div><div className="text-2xl font-bold mt-1">{data.totals?.candidates}</div></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Your job postings</CardTitle><CardDescription>Click any job to view applicants</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {data.jobs?.map((j: any) => (
                <div key={j.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {j.location} • {j.jobType.replace('_', '-')}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {j.requiredBranches?.map((b: string) => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                        {j.requiredSkills?.slice(0, 4).map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                    <Badge variant="outline">{j.applicationsCount} apps</Badge>
                  </div>
                  {j.applications?.length > 0 && (
                    <div className="mt-3 border-t pt-2 space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Applicants</div>
                      {j.applications.slice(0, 3).map((a: any) => (
                        <div key={a.id} className="text-xs flex justify-between">
                          <span>{a.user.name} ({a.user.email})</span>
                          <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                        </div>
                      ))}
                      {j.applications.length > 3 && <div className="text-xs text-muted-foreground">+{j.applications.length - 3} more</div>}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'post' && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Post a new job</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Job title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Software Engineer" /></div>
              <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bengaluru" /></div>
              <div className="space-y-1.5"><Label>Job type</Label>
                <Select value={form.jobType} onValueChange={(v) => setForm({ ...form, jobType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="APPRENTICESHIP">Apprenticeship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Salary range (₹)</Label>
                <div className="flex gap-2"><Input type="number" placeholder="Min" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} /><Input type="number" placeholder="Max" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Min CGPA</Label><Input type="number" step="0.1" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Max active backlogs</Label><Input type="number" value={form.maxBacklogs} onChange={(e) => setForm({ ...form, maxBacklogs: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Required branches</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-3 max-h-32 overflow-y-auto">
                {branches.map((b) => (
                  <label key={b.id} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={form.requiredBranches.includes(b.code)} onChange={(e) => setForm({ ...form, requiredBranches: e.target.checked ? [...form.requiredBranches, b.code] : form.requiredBranches.filter(c => c !== b.code) })} />
                    {b.code}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Required skills</Label>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Type a skill and press Enter" onKeyDown={(e) => { if (e.key === 'Enter' && skillInput) { e.preventDefault(); setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput] }); setSkillInput(''); } }} />
                <Button type="button" variant="outline" onClick={() => { if (skillInput) { setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput] }); setSkillInput(''); } }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.requiredSkills.map((s) => <Badge key={s} variant="secondary" className="text-xs gap-1 cursor-pointer" onClick={() => setForm({ ...form, requiredSkills: form.requiredSkills.filter(x => x !== s) })}>{s} ×</Badge>)}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Job description, responsibilities, benefits…" /></div>
            <Button onClick={postJob} className="gap-2"><Plus className="h-4 w-4" /> Post job</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'talent' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Search by name, branch or target role…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidates.slice(0, 30).map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold flex-shrink-0">{c.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.branch} • Sem {c.semester} • CGPA {c.cgpa?.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">{c.college}</div>
                      <div className="text-xs mt-1">Target: <strong>{c.targetJob || '—'}</strong></div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.skills?.slice(0, 4).map((s: any) => <Badge key={s.name} variant="outline" className="text-xs">{s.name}</Badge>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {candidates.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No matching candidates.</p>}
        </div>
      )}
    </div>
  );
}
