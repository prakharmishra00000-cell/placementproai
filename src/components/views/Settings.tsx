'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Save, User, Globe, Palette, Shield } from 'lucide-react';
import { LANGUAGES } from '@/lib/store';

const TARGET_JOBS = ['Software Engineer', 'Data Analyst', 'AI Engineer', 'Cybersecurity Analyst', 'Embedded Engineer', 'VLSI Engineer', 'Electrical Design Engineer', 'Mechanical Design Engineer', 'Production Engineer', 'Civil Design Engineer', 'BIM Engineer', 'Chemical Process Engineer', 'Quality Engineer', 'Automation Engineer', 'Robotics Engineer'];

export default function Settings() {
  const user = useApp((s) => s.user);
  const profile = useApp((s) => s.profile);
  const setProfile = useApp((s) => s.setProfile);
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: user?.name,
        bio: profile.bio || '',
        cgpa: profile.cgpa,
        activeBacklogs: profile.activeBacklogs,
        historyBacklogs: profile.historyBacklogs,
        careerGoal: profile.careerGoal || 'SOFTWARE',
        targetJob: profile.targetJob || 'Software Engineer',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        optedIn: profile.optedIn ?? true,
        semester: profile.semester,
      });
    }
  }, [user, profile]);

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: form.bio, cgpa: Number(form.cgpa), activeBacklogs: Number(form.activeBacklogs),
          historyBacklogs: Number(form.historyBacklogs), careerGoal: form.careerGoal, targetJob: form.targetJob,
          linkedinUrl: form.linkedinUrl, githubUrl: form.githubUrl, optedIn: form.optedIn,
          semester: Number(form.semester),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      const me = await fetch('/api/auth/me');
      const mj = await me.json();
      if (mj.profile) setProfile(mj.profile);
      toast.success('Settings saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><SettingsIcon className="h-7 w-7 text-primary" /> Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, preferences and privacy</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" /> Profile</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short professional bio" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>CGPA</Label>
              <Input type="number" step="0.1" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Semester</Label>
              <Input type="number" min="1" max="8" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Active backlogs</Label>
              <Input type="number" value={form.activeBacklogs} onChange={(e) => setForm({ ...form, activeBacklogs: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>History backlogs</Label>
              <Input type="number" value={form.historyBacklogs} onChange={(e) => setForm({ ...form, historyBacklogs: e.target.value })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Career goal</Label>
              <Select value={form.careerGoal} onValueChange={(v) => setForm({ ...form, careerGoal: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOFTWARE">Software / IT</SelectItem>
                  <SelectItem value="CORE">Core Engineering</SelectItem>
                  <SelectItem value="GOVT">Government Engineering</SelectItem>
                  <SelectItem value="GATE">GATE / Higher Studies</SelectItem>
                  <SelectItem value="HIGHER_EDU">Higher Education (MS/PhD)</SelectItem>
                  <SelectItem value="STARTUP">Entrepreneurship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Target job</Label>
              <Select value={form.targetJob} onValueChange={(v) => setForm({ ...form, targetJob: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TARGET_JOBS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <Label>GitHub URL</Label>
              <Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" /> Privacy</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">Opt-in to reverse hiring</div>
              <div className="text-xs text-muted-foreground">Allow recruiters to discover your profile for job opportunities</div>
            </div>
            <Switch checked={form.optedIn} onCheckedChange={(c) => setForm({ ...form, optedIn: c })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4" /> Language</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map(([code, name]) => (
              <Button key={code} variant={language === code ? 'default' : 'outline'} onClick={() => setLanguage(code)} className="justify-start">{name}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save settings'}</Button>
    </div>
  );
}
