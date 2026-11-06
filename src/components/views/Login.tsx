'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Student', email: 'arjun@nitrourkela.edu', password: 'student123' },
  { role: 'College Admin', email: 'admin@nitrourkela.edu', password: 'college123' },
  { role: 'Placement Officer', email: 'placement@nitrourkela.edu', password: 'placement123' },
  { role: 'Faculty', email: 'faculty@nitrourkela.edu', password: 'faculty123' },
  { role: 'Recruiter', email: 'recruiter@technova.com', password: 'recruiter123' },
  { role: 'Super Admin', email: 'admin@placementpro.ai', password: 'admin123' },
];

export default function Login() {
  const setView = useApp((s) => s.setView);
  const setUser = useApp((s) => s.setUser);
  const setProfile = useApp((s) => s.setProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Login failed');
      setUser(j);
      // Fetch profile
      const me = await fetch('/api/auth/me');
      const mj = await me.json();
      if (mj.profile) setProfile(mj.profile);
      toast.success('Welcome back!');
      setView('dashboard');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email); setPassword(acc.password);
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: acc.password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setUser(j);
      const me = await fetch('/api/auth/me');
      const mj = await me.json();
      if (mj.profile) setProfile(mj.profile);
      toast.success(`Logged in as ${acc.role}`);
      setView('dashboard');
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
          <h2 className="text-3xl font-bold leading-tight">Welcome back.<br />Your engineering career awaits.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">Log in to continue learning, practicing, and tracking your placement journey.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-lg bg-card border p-3"><div className="text-2xl font-bold text-primary">28+</div><div className="text-xs text-muted-foreground">Engineering branches</div></div>
            <div className="rounded-lg bg-card border p-3"><div className="text-2xl font-bold text-primary">20+</div><div className="text-xs text-muted-foreground">Question types</div></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 PlacementPro AI — Engineering Career Operating System</div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <button onClick={() => setView('landing')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to home
            </button>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Sign in to your PlacementPro AI account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? 'Signing in…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-xs text-muted-foreground mb-2 text-center">Or try a demo account</div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <Button key={a.role} size="sm" variant="outline" onClick={() => quickLogin(a)} disabled={loading}>
                    {a.role}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground justify-center">
            Don&apos;t have an account?{' '}
            <button onClick={() => setView('register')} className="ml-1 text-primary hover:underline">Register</button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
