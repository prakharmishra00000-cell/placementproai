'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { IdCard, Plus, Trash2, Shield, BadgeCheck, Award } from 'lucide-react';

const CATEGORIES = [
  { key: 'TECHNICAL', label: 'Technical' },
  { key: 'PROGRAMMING', label: 'Programming' },
  { key: 'TOOL', label: 'Tools' },
  { key: 'SOFT', label: 'Soft skills' },
  { key: 'DOMAIN', label: 'Domain' },
];

export default function SkillTwin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'TECHNICAL', proficiency: 50, verifiedBy: 'SELF' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/skills');
      const j = await r.json();
      setData(j);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return toast.error('Skill name required');
    setAdding(true);
    try {
      const r = await fetch('/api/skills', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, proficiency: form.proficiency / 100 }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      toast.success('Skill added');
      setForm({ name: '', category: 'TECHNICAL', proficiency: 50, verifiedBy: 'SELF' });
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading skill twin…</div>;

  const cats = data?.skillsByCategory || {};
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><IdCard className="h-7 w-7 text-primary" /> Skill Digital Twin</h1>
        <p className="text-muted-foreground mt-1">A continuously updated profile of your verified engineering skills</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total skills</div><div className="text-2xl font-bold mt-1">{data?.skillCount || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Verified</div><div className="text-2xl font-bold mt-1 text-emerald-600">{data?.verifiedCount || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Overall readiness</div><div className="text-2xl font-bold mt-1">{data?.overallReadiness || 0}%</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Credentials</div><div className="text-2xl font-bold mt-1">{data?.credentials?.length || 0}</div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {CATEGORIES.map((c) => {
            const skills = cats[c.key] || [];
            if (skills.length === 0) return null;
            return (
              <Card key={c.key}>
                <CardHeader className="pb-3"><CardTitle className="text-base">{c.label} <Badge variant="outline" className="text-xs ml-2">{skills.length}</Badge></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {skills.map((s: any) => (
                    <div key={s.id} className="group">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{s.name}</span>
                          {s.verifiedBy && s.verifiedBy !== 'SELF' && (
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700 gap-1"><BadgeCheck className="h-3 w-3" /> {s.verifiedBy}</Badge>
                          )}
                          {s.verifiedBy === 'SELF' && <Badge variant="outline" className="text-xs">Self</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{Math.round(s.proficiency * 100)}%</span>
                          <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <Progress value={s.proficiency * 100} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit sticky top-24">
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Add skill</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Skill name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. React, SolidWorks, Python" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Proficiency: {form.proficiency}%</Label>
              <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="space-y-1.5">
              <Label>Verified by</Label>
              <Select value={form.verifiedBy} onValueChange={(v) => setForm({ ...form, verifiedBy: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELF">Self-declared</SelectItem>
                  <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                  <SelectItem value="FACULTY">Faculty</SelectItem>
                  <SelectItem value="EMPLOYER">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={add} disabled={adding} className="w-full gap-2">{adding ? 'Adding…' : <><Plus className="h-4 w-4" /> Add skill</>}</Button>
            <p className="text-[11px] text-muted-foreground">Note: Self-declared skills are marked but not verified. Verified credentials appear in your Skill Passport.</p>
          </CardContent>
        </Card>
      </div>

      {/* Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Digital Credentials</CardTitle>
          <CardDescription>Verified credentials issued by PlacementPro AI or your college</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.credentials?.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {data.credentials.map((c: any) => (
                <div key={c.id} className="rounded-lg border p-3 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Issued by {c.issuer} • {new Date(c.issuedAt).toLocaleDateString()}</div>
                    {c.skill && <Badge variant="outline" className="text-xs mt-1">{c.skill}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No credentials yet. Pass assessments to earn verified credentials.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
