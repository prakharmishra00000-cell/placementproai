'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Register() {
  const setView = useApp((s) => s.setView);
  const setUser = useApp((s) => s.setUser);
  const setProfile = useApp((s) => s.setProfile);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [collegeId, setCollegeId] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/colleges').then(r => r.json()).then(j => setColleges(j.colleges || [])).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, collegeId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setUser(j);
      const me = await fetch('/api/auth/me');
      const mj = await me.json();
      if (mj.profile) setProfile(mj.profile);
      toast.success('Account created! Welcome to PlacementPro AI.');
      setView(role === 'STUDENT' ? 'onboarding' : 'dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-background to-muted/30 border-r">
        <button onClick={() => setView('landing')} className="flex items-center gap-2 font-bold text-left">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-lg">P</div>
          <div>PlacementPro AI</div>
        </button>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Start your engineering career journey.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">Join PlacementPro AI to access branch-wise learning, AI mentor, mock interviews, jobs and verified credentials.</p>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 PlacementPro AI</div>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <button onClick={() => setView('landing')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Get started with PlacementPro AI for free</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Arjun Sharma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" />
              </div>
              <div className="space-y-2">
                <Label>Account type</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="FACULTY">Faculty / Trainer</SelectItem>
                    <SelectItem value="ALUMNI">Alumni / Mentor</SelectItem>
                    <SelectItem value="RECRUITER">Recruiter / Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === 'STUDENT' && (
                <div className="space-y-2">
                  <Label>College</Label>
                  <Select value={collegeId} onValueChange={setCollegeId}>
                    <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
                    <SelectContent>
                      {colleges.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? 'Creating…' : <>Create account <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground justify-center">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="ml-1 text-primary hover:underline">Sign in</button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
