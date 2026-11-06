'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import { Building2, Users, Briefcase, Target, TrendingUp, ClipboardCheck, GraduationCap, Award } from 'lucide-react';

export default function CollegeAdmin() {
  const user = useApp((s) => s.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/college').then(r => r.json()).then(j => {
      if (j.error) { toast.error(j.error); }
      setData(j);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading college dashboard…</div>;
  if (!data) return <div className="text-center py-12 text-muted-foreground">No data available.</div>;

  const branchWise = Object.entries(data.branchWise || {}).map(([k, v]) => ({ name: k, students: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Building2 className="h-7 w-7 text-primary" /> College Overview</h1>
        <p className="text-muted-foreground mt-1">{user?.collegeId ? 'Your college' : 'No college assigned'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Total students</div><div className="text-2xl font-bold mt-1">{data.totals?.students}</div></div><Users className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Placement drives</div><div className="text-2xl font-bold mt-1">{data.totals?.drives}</div></div><Briefcase className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Applications</div><div className="text-2xl font-bold mt-1">{data.totals?.applications}</div></div><ClipboardCheck className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Placement rate</div><div className="text-2xl font-bold mt-1">{data.totals?.placementRate}%</div></div><TrendingUp className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Branch-wise student distribution</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Placement status breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(data.statusCounts || {}).map(([k, v]: any) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1"><span>{k}</span><span className="font-medium">{v}</span></div>
                  <Progress value={(v / (data.totals?.applications || 1)) * 100} className="h-2" />
                </div>
              ))}
              {Object.keys(data.statusCounts || {}).length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Students ({data.students?.length})</CardTitle>
          <CardDescription>Manage enrolled students across all branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Branch</th><th className="py-2 pr-3">Sem</th><th className="py-2 pr-3">CGPA</th><th className="py-2 pr-3">Grad Year</th><th className="py-2 pr-3">Backlogs</th><th className="py-2 pr-3">Target Job</th><th className="py-2 pr-3">Opted-in</th>
                </tr>
              </thead>
              <tbody>
                {data.students?.map((s: any) => (
                  <tr key={s.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-3 font-medium">{s.name}</td>
                    <td className="py-2 pr-3">{s.branch}</td>
                    <td className="py-2 pr-3">{s.semester}</td>
                    <td className="py-2 pr-3">{s.cgpa?.toFixed(1)}</td>
                    <td className="py-2 pr-3">{s.graduationYear}</td>
                    <td className="py-2 pr-3">{s.activeBacklogs}</td>
                    <td className="py-2 pr-3">{s.targetJob}</td>
                    <td className="py-2 pr-3">{s.optedIn ? <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700">Yes</Badge> : <span className="text-muted-foreground">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Recent placement drives</CardTitle></CardHeader>
        <CardContent>
          {data.drives?.length > 0 ? (
            <div className="space-y-2">
              {data.drives.map((d: any) => (
                <div key={d.id} className="rounded-lg border p-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{d.title}</div>
                    <Badge variant="outline">{d.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{d.company?.name} • {d.visitDate ? new Date(d.visitDate).toLocaleDateString() : 'TBD'}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-6">No placement drives yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
