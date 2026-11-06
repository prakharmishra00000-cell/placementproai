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
import { FileText, Plus, Trash2, Download, Wand2, Check } from 'lucide-react';

type ResumeData = {
  summary?: string;
  education?: any[];
  experience?: any[];
  projects?: any[];
  skills?: string[];
  certifications?: string[];
};

const TEMPLATES = [
  { code: 'ATS_CLASSIC', label: 'ATS Classic', desc: 'Single column, ATS-friendly' },
  { code: 'MODERN', label: 'Modern', desc: 'Two-column, designed' },
  { code: 'TECHNICAL', label: 'Technical', desc: 'Skills-focused' },
];

export default function ResumeBuilder() {
  const profile = useApp((s) => s.profile);
  const [resumes, setResumes] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResumeData>({});
  const [title, setTitle] = useState('My Resume');
  const [template, setTemplate] = useState('ATS_CLASSIC');

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/resumes');
    const j = await r.json();
    setResumes(j.resumes || []);
    if (j.resumes?.length > 0) {
      const primary = j.resumes.find((x: any) => x.isPrimary) || j.resumes[0];
      setCurrent(primary);
      setData(primary.data || {});
      setTitle(primary.title);
      setTemplate(primary.template);
    } else if (profile) {
      // Initialize a default resume
      setData({
        summary: `${profile.branch?.name} student targeting ${profile.targetJob || 'engineering'} roles.`,
        education: [{ degree: 'B.Tech ' + (profile.branch?.name || ''), college: profile.college?.name, year: profile.graduationYear, cgpa: profile.cgpa }],
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
      });
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const r = await fetch('/api/resumes', {
      method: current ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: current?.id, title, template, data, isPrimary: true }),
    });
    const j = await r.json();
    if (!r.ok) return toast.error(j.error);
    toast.success('Resume saved');
    load();
  };

  const improveWithAI = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Improve this resume summary (return only the improved summary, max 60 words): "${data.summary || ''}"`,
          agent: 'RESUME_EXPERT',
        }),
      });
      const j = await r.json();
      if (r.ok) setData((d) => ({ ...d, summary: j.reply }));
      toast.success('Summary improved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading resume builder…</div>;

  const setField = (key: string, value: any) => setData((d) => ({ ...d, [key]: value }));

  const addItem = (key: 'experience' | 'projects' | 'education', item: any) => {
    setData((d) => ({ ...d, [key]: [...(d[key] || []), item] }));
  };
  const removeItem = (key: 'experience' | 'projects' | 'education', i: number) => {
    setData((d) => ({ ...d, [key]: (d[key] || []).filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-7 w-7 text-primary" /> Resume Builder</h1>
          <p className="text-muted-foreground mt-1">ATS-compatible templates • AI-powered writing suggestions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Download className="h-4 w-4" /> Print / Save PDF</Button>
          <Button onClick={save} className="gap-2"><Check className="h-4 w-4" /> Save</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Resume metadata</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((t) => <SelectItem key={t.code} value={t.code}>{t.label} — {t.desc}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={3} value={data.summary || ''} onChange={(e) => setField('summary', e.target.value)} placeholder="A brief professional summary…" />
              <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={improveWithAI}><Wand2 className="h-4 w-4" /> Improve with AI</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Education</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(data.education || []).map((e, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2 text-sm">
                  <div className="flex justify-between"><div className="font-medium">{e.degree}</div><button onClick={() => removeItem('education', i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div>
                  <div className="text-xs text-muted-foreground">{e.college} • {e.year} • CGPA: {e.cgpa}</div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem('education', { degree: 'New Degree', college: 'College', year: new Date().getFullYear(), cgpa: 7.5 })}><Plus className="h-4 w-4" /> Add education</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Experience</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(data.experience || []).map((e, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2 text-sm">
                  <div className="flex justify-between"><div className="font-medium">{e.role} @ {e.company}</div><button onClick={() => removeItem('experience', i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div>
                  <div className="text-xs text-muted-foreground">{e.duration}</div>
                  <div>{e.description}</div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem('experience', { company: 'Company', role: 'Role', duration: '3 months', description: 'Description of your work and impact.' })}><Plus className="h-4 w-4" /> Add experience</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Projects</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(data.projects || []).map((p, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-1 text-sm">
                  <div className="flex justify-between"><div className="font-medium">{p.title}</div><button onClick={() => removeItem('projects', i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div>
                  <div className="text-xs">{p.description}</div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem('projects', { title: 'Project Title', description: 'Describe the problem, your solution, and impact.', link: '' })}><Plus className="h-4 w-4" /> Add project</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Skills & Certifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Skills (comma-separated)</Label>
                <Input value={(data.skills || []).join(', ')} onChange={(e) => setField('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
              <div className="space-y-1.5">
                <Label>Certifications (comma-separated)</Label>
                <Input value={(data.certifications || []).join(', ')} onChange={(e) => setField('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live preview */}
        <div className="sticky top-24 h-fit">
          <Card>
            <CardHeader><CardTitle className="text-base">Live preview ({template})</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-white text-black rounded-lg p-6 shadow-inner border min-h-[500px] text-sm font-serif" id="resume-preview">
                <div className="text-center mb-4 pb-3 border-b-2 border-black">
                  <div className="text-2xl font-bold">{useApp.getState().user?.name}</div>
                  <div className="text-xs mt-1 text-gray-700">{useApp.getState().user?.email}{profile?.linkedinUrl ? ' • ' + profile.linkedinUrl : ''}</div>
                  <div className="text-xs text-gray-700">{profile?.branch?.name} • CGPA: {profile?.cgpa}</div>
                </div>
                {data.summary && (
                  <div className="mb-3">
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Summary</div>
                    <p>{data.summary}</p>
                  </div>
                )}
                {data.education?.length > 0 && (
                  <div className="mb-3">
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Education</div>
                    {data.education.map((e, i) => (
                      <div key={i} className="flex justify-between text-xs mb-1">
                        <div><strong>{e.degree}</strong>, {e.college}</div>
                        <div>{e.year} • CGPA: {e.cgpa}</div>
                      </div>
                    ))}
                  </div>
                )}
                {data.experience?.length > 0 && (
                  <div className="mb-3">
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Experience</div>
                    {data.experience.map((e, i) => (
                      <div key={i} className="mb-1.5">
                        <div className="text-xs font-medium">{e.role} — {e.company} ({e.duration})</div>
                        <div className="text-xs text-gray-700">{e.description}</div>
                      </div>
                    ))}
                  </div>
                )}
                {data.projects?.length > 0 && (
                  <div className="mb-3">
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Projects</div>
                    {data.projects.map((p, i) => (
                      <div key={i} className="mb-1">
                        <div className="text-xs font-medium">{p.title}</div>
                        <div className="text-xs text-gray-700">{p.description}</div>
                      </div>
                    ))}
                  </div>
                )}
                {data.skills?.length > 0 && (
                  <div className="mb-3">
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Skills</div>
                    <div className="text-xs">{data.skills.join(' • ')}</div>
                  </div>
                )}
                {data.certifications?.length > 0 && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider mb-1">Certifications</div>
                    <ul className="text-xs list-disc pl-4">
                      {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
