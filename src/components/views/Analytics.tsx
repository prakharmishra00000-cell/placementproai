'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, TrendingUp, ClipboardCheck, Briefcase, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function Analytics() {
  const user = useApp((s) => s.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/analytics/student';
    if (user?.role === 'COLLEGE_ADMIN' || user?.role === 'PLACEMENT_OFFICER') url = '/api/analytics/college';
    else if (user?.role === 'SUPER_ADMIN') url = '/api/analytics/superadmin';
    else if (user?.role === 'RECRUITER') url = '/api/analytics/recruiter';
    fetch(url).then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading analytics…</div>;
  if (!data) return <div className="text-center py-12 text-muted-foreground">No data available.</div>;

  // Different render per role
  if (user?.role === 'SUPER_ADMIN') return <SuperAdminAnalytics data={data} />;
  if (user?.role === 'RECRUITER') return <RecruiterAnalytics data={data} />;
  if (user?.role === 'COLLEGE_ADMIN' || user?.role === 'PLACEMENT_OFFICER') return <CollegeAnalytics data={data} />;
  return <StudentAnalytics data={data} />;
}

function StudentAnalytics({ data }: any) {
  const scoreTrend = data.scoreTrend || [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BarChart3 className="h-7 w-7 text-primary" /> My Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your progress, identify weak areas and improve placement readiness</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tests taken" value={data.stats?.testsTaken} icon={ClipboardCheck} />
        <StatCard title="Avg accuracy" value={`${data.stats?.avgAccuracy}%`} icon={TrendingUp} />
        <StatCard title="Total questions" value={data.stats?.totalQuestions} icon={Target} />
        <StatCard title="Applications" value={data.stats?.applicationsCount} icon={Briefcase} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Test score trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Skill readiness</CardTitle></CardHeader>
          <CardContent>
            {data.skillGap ? (
              <div className="space-y-3">
                <div className="text-sm">For <strong>{data.skillGap.targetRole}</strong></div>
                <Progress value={data.skillGap.readinessPct} className="h-3" />
                <div className="text-xs text-muted-foreground">{data.skillGap.readinessPct}% ready • {data.skillGap.missingSkills?.length} skills missing</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {data.skillGap.missingSkills?.map((s: string) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground">No skill gap analysis yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Application status breakdown</CardTitle></CardHeader>
        <CardContent>
          {Object.keys(data.stats?.applicationsByStatus || {}).length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(data.stats.applicationsByStatus).map(([k, v]) => ({ name: k, count: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No applications yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Roadmap progress</CardTitle></CardHeader>
        <CardContent>
          {data.roadmap ? (
            <div className="space-y-3">
              <Progress value={data.roadmap.progress * 100} className="h-3" />
              <div className="space-y-1">
                {data.roadmap.milestones?.map((m: any, i: number) => (
                  <div key={i} className="text-sm flex items-center gap-2">
                    {m[1] ? '✓' : '○'} {m[0]}
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-muted-foreground">No roadmap yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function CollegeAnalytics({ data }: any) {
  const branchWise = Object.entries(data.branchWise || {}).map(([k, v]) => ({ name: k, students: v }));
  const statusCounts = Object.entries(data.statusCounts || {}).map(([k, v]) => ({ name: k, count: v }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BarChart3 className="h-7 w-7 text-primary" /> College Analytics</h1>
        <p className="text-muted-foreground mt-1">Branch-wise outcomes, recruitment trends and institutional insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total students" value={data.totals?.students} icon={Briefcase} />
        <StatCard title="Placement drives" value={data.totals?.drives} icon={Target} />
        <StatCard title="Applications" value={data.totals?.applications} icon={ClipboardCheck} />
        <StatCard title="Placement rate" value={`${data.totals?.placementRate}%`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Branch-wise student count</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchWise}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Application status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Students ({data.students?.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Branch</th><th className="py-2 pr-3">Sem</th><th className="py-2 pr-3">CGPA</th><th className="py-2 pr-3">Target</th><th className="py-2 pr-3">Opted-in</th>
                </tr>
              </thead>
              <tbody>
                {data.students?.slice(0, 50).map((s: any) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2 pr-3 font-medium">{s.name}</td>
                    <td className="py-2 pr-3">{s.branch}</td>
                    <td className="py-2 pr-3">{s.semester}</td>
                    <td className="py-2 pr-3">{s.cgpa?.toFixed(1)}</td>
                    <td className="py-2 pr-3">{s.targetJob}</td>
                    <td className="py-2 pr-3">{s.optedIn ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecruiterAnalytics({ data }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BarChart3 className="h-7 w-7 text-primary" /> Recruiter Analytics</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Open jobs" value={data.totals?.jobs} icon={Briefcase} />
        <StatCard title="Total applications" value={data.totals?.applications} icon={ClipboardCheck} />
        <StatCard title="Talent pool" value={data.totals?.candidates} icon={Target} />
      </div>
      <Card>
        <CardHeader><CardTitle>Your job postings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.jobs?.map((j: any) => (
            <div key={j.id} className="rounded-lg border p-3">
              <div className="flex justify-between">
                <div className="font-medium">{j.title}</div>
                <Badge variant="outline">{j.applicationsCount} apps</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{j.location} • {j.jobType.replace('_', '-')}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SuperAdminAnalytics({ data }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BarChart3 className="h-7 w-7 text-primary" /> Platform Analytics</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Colleges" value={data.totals?.colleges} icon={Briefcase} />
        <StatCard title="Total users" value={data.totals?.users} icon={Target} />
        <StatCard title="Active students" value={data.totals?.students} icon={ClipboardCheck} />
        <StatCard title="AI conversations" value={data.totals?.aiConversations} icon={Trophy} />
        <StatCard title="Job listings" value={data.totals?.jobs} icon={Briefcase} />
        <StatCard title="Companies" value={data.totals?.companies} icon={Target} />
        <StatCard title="Placement drives" value={data.totals?.drives} icon={ClipboardCheck} />
        <StatCard title="Daily challenges" value={data.totals?.challenges} icon={TrendingUp} />
      </div>
      <Card>
        <CardHeader><CardTitle>Users by role</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(data.roleCounts || {}).map(([k, v]) => ({ name: k.replace('_', ' '), count: v }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Colleges by subscription plan</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={Object.entries(data.planCounts || {}).map(([k, v]) => ({ name: k, count: v }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <Card><CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-2xl font-bold mt-1">{value ?? 0}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
      </div>
    </CardContent></Card>
  );
}
