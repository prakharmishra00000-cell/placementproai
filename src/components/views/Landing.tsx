'use client';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bot, IdCard, Building, FileText, Briefcase, Trophy, Users, BarChart3,
  Cpu, Cog, CircuitBoard, GraduationCap, Shield, Map, Target, MessageSquare, FlaskConical, Sparkles, CheckCircle2, ArrowRight, BookOpen
} from 'lucide-react';

const FEATURES = [
  { icon: GraduationCap, title: 'Engineering Learning Hub', desc: 'Branch-wise subjects, units, topics and learning materials across all 28+ engineering disciplines.' },
  { icon: BookOpen, title: 'Comprehensive Question Bank', desc: '20+ question types with detailed explanations, formulas, and adaptive mastery tracking.' },
  { icon: Bot, title: 'AI Placement Copilot', desc: 'Context-aware career mentor that knows your branch, semester, CGPA and target role.' },
  { icon: IdCard, title: 'Skill Digital Twin', desc: 'A continuously updated skill profile with proficiency, evidence and verification status.' },
  { icon: Shield, title: 'Proof-of-Skill Passport', desc: 'Portable credentials you can share with employers, with QR-verified evidence.' },
  { icon: Building, title: 'Company Placement Simulator', desc: 'Replay the entire recruitment journey — aptitude, technical, GD, technical/HR interviews.' },
  { icon: MessageSquare, title: 'AI Interview Lab', desc: 'Text + voice mock interviews with explainable evaluation criteria across 7 interview types.' },
  { icon: Briefcase, title: 'Job Portal with Eligibility Engine', desc: 'Real job listings with a rule-based eligibility engine that explains every decision.' },
  { icon: Target, title: 'Skill Gap Analysis', desc: 'Compare your skills against any target role and get a learning path to close the gap.' },
  { icon: Users, title: 'Alumni Mentorship', desc: 'Verified alumni network offering mentorship, resume reviews and mock interviews.' },
  { icon: BarChart3, title: 'College Analytics', desc: 'Branch-wise placement rates, recruitment trends and curriculum gap insights.' },
  { icon: Trophy, title: 'Daily Challenges & Gamification', desc: 'Daily challenges across aptitude, reasoning, programming and core engineering.' },
];

const STATS = [
  { value: '28+', label: 'Engineering branches' },
  { value: '180+', label: 'Subjects covered' },
  { value: '20+', label: 'Question types' },
  { value: '9', label: 'Indian languages' },
];

const BRANCH_LOGOS = ['CSE','IT','ECE','EEE','ME','CE','CHE','BT','BME','AE','AT','PE','IE','MTE','MNE','AGE','PEE','ICE','MTR','RAE','ENV','MRE','FT','TE','PEX','CER','GE','EE'];

export default function Landing() {
  const setView = useApp((s) => s.setView);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              <span className="text-lg">P</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold">PlacementPro <span className="text-primary">AI</span></div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Engineering Career OS</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-8 text-sm">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-muted-foreground hover:text-foreground">Features</button>
            <button onClick={() => document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' })} className="text-muted-foreground hover:text-foreground">Branches</button>
            <button onClick={() => setView('pricing')} className="text-muted-foreground hover:text-foreground">Pricing</button>
            <button onClick={() => setView('login')} className="text-muted-foreground hover:text-foreground">Sign in</button>
          </nav>
          <div className="flex-1" />
          <Button onClick={() => setView('register')} className="gap-2">Get started <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1"><Sparkles className="h-3 w-3" /> AI-Powered Engineering Career OS</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              From <span className="text-primary">classroom</span> to <span className="text-primary">career</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The unified platform bridging engineering education and industry employment. For every engineering branch — not just Computer Science. Learn, practice, prove skills, prepare for placements and get hired.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setView('register')} className="gap-2">Start free <ArrowRight className="h-4 w-4" /></Button>
              <Button size="lg" variant="outline" onClick={() => setView('login')}>Sign in</Button>
            </div>
            <div className="mt-10 grid grid-cols-4 gap-4 max-w-md">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-primary">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[Bot, IdCard, Building, Target, MessageSquare, Briefcase].map((Icon, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">{['AI Copilot','Skill Twin','Placement Sim','Skill Gap','Interview Lab','Job Portal'][i]}</div>
                  <div className="text-xs text-muted-foreground mt-1">{['Mentor that knows you','Verified skill profile','Simulate recruitment','Match target jobs','Practice interviews','Apply with confidence'][i]}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline">Platform Modules</Badge>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold">Everything an engineering student needs</h2>
          <p className="mt-4 text-muted-foreground">20+ integrated modules working through one unified student profile and skill graph.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Branches */}
      <section id="branches" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline">For every engineer</Badge>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold">28+ engineering branches</h2>
          <p className="mt-4 text-muted-foreground">CSE, ECE, EEE, ME, CE, CHE and 22+ more. Every branch gets branch-wise subjects, question bank and industry prep.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {BRANCH_LOGOS.map((code) => (
            <div key={code} className="rounded-lg border bg-card p-3 text-center">
              <div className="font-bold text-sm">{code}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{BRANCH_LABEL[code]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <Card className="overflow-hidden">
          <CardContent className="p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-background to-background">
            <div className="max-w-2xl">
              <h3 className="text-2xl lg:text-3xl font-bold">Start your engineering career journey today</h3>
              <p className="mt-3 text-muted-foreground">Free for students. Premium AI tools for serious aspirants. Enterprise plans for colleges and recruiters.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setView('register')} className="gap-2">Create account <ArrowRight className="h-4 w-4" /></Button>
                <Button size="lg" variant="outline" onClick={() => setView('pricing')}>View pricing</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center text-sm">P</div>
              PlacementPro AI
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-md">Engineering Career Operating System — built for Indian engineering students and beyond. Demonstration platform.</p>
          </div>
          <div className="text-xs text-muted-foreground sm:text-right">
            <div>© 2026 PlacementPro AI</div>
            <div className="mt-1">Multi-tenant SaaS • AI-powered • Branch-aware</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const BRANCH_LABEL: Record<string, string> = {
  CSE: 'Computer Science', IT: 'Information Tech', ECE: 'Electronics & Comm', EEE: 'Electrical & Electronics',
  EE: 'Electrical', ME: 'Mechanical', CE: 'Civil', CHE: 'Chemical', BT: 'Biotechnology', BME: 'Biomedical',
  AE: 'Aerospace', AT: 'Automobile', PE: 'Production', IE: 'Industrial', MTE: 'Metallurgical', MNE: 'Mining',
  AGE: 'Agricultural', PEE: 'Petroleum', ICE: 'Instrumentation', MTR: 'Mechatronics', RAE: 'Robotics',
  ENV: 'Environmental', MRE: 'Marine', FT: 'Food Tech', TE: 'Textile', PEX: 'Polymer', CER: 'Ceramic', GE: 'Genetic',
};
