'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bot, IdCard, Target, Briefcase, MessageSquare, FileText, Trophy, BarChart3,
  ArrowRight, GraduationCap, Shield, Building, Calendar, TrendingUp, Award, BookOpen
} from 'lucide-react';
const QUICK = [
  { view: 'ai-copilot', label: 'AI Copilot', icon: Bot, color: 'bg-violet-500/10 text-violet-600' },
  { view: 'skill-gap', label: 'Skill Gap', icon: Target, color: 'bg-amber-500/10 text-amber-600' },
  { view: 'job-portal', label: 'Jobs', icon: Briefcase, color: 'bg-emerald-500/10 text-emerald-600' },
  { view: 'interview-lab', label: 'Mock Interview', icon: MessageSquare, color: 'bg-rose-500/10 text-rose-600' },
  { view: 'resume-builder', label: 'Resume', icon: FileText, color: 'bg-sky-500/10 text-sky-600' },
  { view: 'daily-challenges', label: "Today's Challenge", icon: Trophy, color: 'bg-orange-500/10 text-orange-600' },
];

export default function Dashboard() {
  const user = useApp((s) => s.user);
  const profile = useApp((s) => s.profile);
  const setView = useApp((s) => s.setView);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetch('/api/analytics/student').then(r => r.json()).then(setData).catch(() => {});
    }
  }, [user]);

  // Non-student dashboards: redirect them to their dedicated view via effect
  useEffect(() => {
    if (!user) return;
    if (user.role === 'SUPER_ADMIN') setView('super-admin');
    else if (user.role === 'COLLEGE_ADMIN') setView('college-admin');
    else if (user.role === 'PLACEMENT_OFFICER') setView('placement-officer');
    else if (user.role === 'RECRUITER') setView('recruiter');
  }, [user, setView]);

  if (!user) return null;

  if (user.role !== 'STUDENT' && user.role !== 'FACULTY' && user.role !== 'ALUMNI' && user.role !== 'SUPPORT') {
    return <div className="text-center py-12 text-muted-foreground">Redirecting…</div>;
  }

  if (user.role === 'FACULTY' || user.role === 'ALUMNI' || user.role === 'SUPPORT') {
    return <GenericDashboard />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">{profile?.branch?.name || 'Engineering'} • Semester {profile?.semester} • CGPA {profile?.cgpa?.toFixed(1)} • Target: {profile?.targetJob || 'Not set'}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Job Readiness" value={`${data?.skillGap?.readinessPct ?? 0}%`} icon={Target} trend="Skill match" />
        <StatCard title="Tests Taken" value={data?.stats?.testsTaken ?? 0} icon={BarChart3} trend="All-time" />
        <StatCard title="Avg Accuracy" value={`${data?.stats?.avgAccuracy ?? 0}%`} icon={TrendingUp} trend="Across all tests" />
        <StatCard title="Applications" value={data?.stats?.applicationsCount ?? 0} icon={Briefcase} trend="Jobs applied" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <button key={q.view} onClick={() => setView(q.view as any)} className="rounded-lg border bg-card p-4 text-left hover:bg-accent transition-colors">
                <div className={`h-10 w-10 rounded-lg ${q.color} grid place-items-center mb-3`}><Icon className="h-5 w-5" /></div>
                <div className="font-medium text-sm">{q.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill gap summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Career Readiness for {data?.skillGap?.targetRole || profile?.targetJob || 'Software Engineer'}</CardTitle>
            <CardDescription>Based on your verified skills vs target role requirements</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.skillGap ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Readiness</span>
                    <span className="font-medium">{data.skillGap.readinessPct}%</span>
                  </div>
                  <Progress value={data.skillGap.readinessPct} className="h-2" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-emerald-600 mb-2">MATCHED SKILLS ({data.skillGap.existingSkills?.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {data.skillGap.existingSkills?.map((s: string) => (
                        <Badge key={s} variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-600 mb-2">MISSING SKILLS ({data.skillGap.missingSkills?.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {data.skillGap.missingSkills?.map((s: string) => (
                        <Badge key={s} variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setView('skill-gap')} variant="outline" className="gap-2">View learning path <ArrowRight className="h-4 w-4" /></Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading skill analysis…</p>
            )}
          </CardContent>
        </Card>

        {/* Career roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Career Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.roadmap ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall progress</span>
                  <span className="font-medium">{Math.round(data.roadmap.progress * 100)}%</span>
                </div>
                <Progress value={data.roadmap.progress * 100} className="h-2" />
                <div className="space-y-2 mt-4">
                  {data.roadmap.milestones?.map((m: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`h-5 w-5 rounded-full grid place-items-center text-xs ${m[1] ? 'bg-primary text-primary-foreground' : 'border'}`}>{m[1] ? '✓' : i + 1}</div>
                      <span className={m[1] ? 'line-through text-muted-foreground' : ''}>{m[0]}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setView('career-roadmap')} variant="outline" size="sm" className="w-full gap-2 mt-3">Open roadmap <ArrowRight className="h-4 w-4" /></Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roadmap yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent applications + score trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplications.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium text-sm">{a.jobTitle}</div>
                      <div className="text-xs text-muted-foreground">{a.company} • {a.location}</div>
                    </div>
                    <Badge variant="outline">{a.status}</Badge>
                  </div>
                ))}
                <Button onClick={() => setView('application-tracker')} variant="outline" size="sm" className="w-full gap-2">View all <ArrowRight className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">No applications yet</p>
                <Button onClick={() => setView('job-portal')} size="sm" className="gap-2">Browse jobs <ArrowRight className="h-4 w-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Recent Test Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.scoreTrend?.length > 0 ? (
              <div className="space-y-3">
                {data.scoreTrend.slice(-5).map((t: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-sm w-20">{t.label}</div>
                    <Progress value={t.accuracy} className="h-2 flex-1" />
                    <div className="text-sm font-medium w-12 text-right">{t.accuracy}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">No tests taken yet</p>
                <Button onClick={() => setView('practice-test')} size="sm" className="gap-2">Take a test <ArrowRight className="h-4 w-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's challenge banner */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground grid place-items-center flex-shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Don&apos;t break your streak!</h3>
            <p className="text-sm text-muted-foreground">Solve today&apos;s daily challenge to earn 10 points and keep your momentum.</p>
          </div>
          <Button onClick={() => setView('daily-challenges')} className="gap-2">Solve now <ArrowRight className="h-4 w-4" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string; value: any; icon: any; trend: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{trend}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenericDashboard() {
  const user = useApp((s) => s.user)!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-1">Role: {user.role.replace('_', ' ')}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4"><BookOpen className="h-6 w-6" /></div>
          <h2 className="font-bold">Your dashboard</h2>
          <p className="text-sm text-muted-foreground mt-2">This account type ({user.role}) has limited dashboard features. Contact your college admin for full access.</p>
        </CardContent>
      </Card>
    </div>
  );
}
