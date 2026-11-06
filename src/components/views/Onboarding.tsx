'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, GraduationCap, ArrowLeft } from 'lucide-react';

const CAREER_GOALS = [
  ['SOFTWARE', 'Software / IT'],
  ['CORE', 'Core Engineering'],
  ['GOVT', 'Government Engineering'],
  ['GATE', 'GATE / Higher Studies'],
  ['HIGHER_EDU', 'Higher Education (MS/PhD)'],
  ['STARTUP', 'Entrepreneurship'],
];

const TARGET_JOBS = [
  'Software Engineer', 'Data Analyst', 'AI Engineer', 'Cybersecurity Analyst',
  'Embedded Engineer', 'VLSI Engineer', 'Electrical Design Engineer',
  'Mechanical Design Engineer', 'Production Engineer', 'Civil Design Engineer',
  'BIM Engineer', 'Chemical Process Engineer', 'Quality Engineer', 'Automation Engineer',
  'Robotics Engineer',
];

export default function Onboarding() {
  const user = useApp((s) => s.user);
  const setView = useApp((s) => s.setView);
  const setProfile = useApp((s) => s.setProfile);

  const [colleges, setColleges] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    collegeId: '',
    branchId: '',
    semester: '1',
    cgpa: '7.5',
    activeBacklogs: '0',
    historyBacklogs: '0',
    graduationYear: String(new Date().getFullYear() + 2),
    careerGoal: 'SOFTWARE',
    targetJob: 'Software Engineer',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/colleges').then(r => r.json()).then(j => setColleges(j.colleges || [])).catch(() => {});
    fetch('/api/branches').then(r => r.json()).then(j => setBranches(j.branches || [])).catch(() => {});
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      // Refresh profile from /api/auth/me
      const me = await fetch('/api/auth/me');
      const mj = await me.json();
      if (mj.profile) setProfile(mj.profile);
      toast.success('Profile set up! Welcome to PlacementPro AI.');
      setView('dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center text-lg">P</div>
            <span>PlacementPro AI</span>
          </div>
          <div className="text-sm text-muted-foreground">Onboarding</div>
        </div>
      </header>
      <div className="flex-1 grid lg:grid-cols-[1fr_2fr] gap-8 p-4 sm:p-8">
        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Let&apos;s personalize your PlacementPro AI experience. We&apos;ll show you the right subjects, questions and career paths for your engineering branch.</p>
              <ol className="mt-6 space-y-3 text-sm">
                <li className={`flex items-center gap-3 ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}><div className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>College & branch</li>
                <li className={`flex items-center gap-3 ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}><div className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>Academic details</li>
                <li className={`flex items-center gap-3 ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}><div className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>Career goals</li>
              </ol>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>This unlocks branch-wise subjects, question bank, AI mentor, eligibility checks and more.</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>College</Label>
                  <Select value={form.collegeId} onValueChange={(v) => setForm({ ...form, collegeId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
                    <SelectContent>
                      {colleges.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Engineering branch</Label>
                  <Select value={form.branchId} onValueChange={(v) => setForm({ ...form, branchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.code} — {b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!form.collegeId || !form.branchId} className="gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>CGPA</Label>
                    <Input type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Active backlogs</Label>
                    <Input type="number" min="0" value={form.activeBacklogs} onChange={(e) => setForm({ ...form, activeBacklogs: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>History backlogs</Label>
                    <Input type="number" min="0" value={form.historyBacklogs} onChange={(e) => setForm({ ...form, historyBacklogs: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation year</Label>
                    <Input type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                  <Button onClick={() => setStep(3)} className="gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Career goal</Label>
                  <Select value={form.careerGoal} onValueChange={(v) => setForm({ ...form, careerGoal: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CAREER_GOALS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target job</Label>
                  <Select value={form.targetJob} onValueChange={(v) => setForm({ ...form, targetJob: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TARGET_JOBS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                  <Button onClick={submit} disabled={loading} className="gap-2">{loading ? 'Saving…' : <>Complete setup <ArrowRight className="h-4 w-4" /></>}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
