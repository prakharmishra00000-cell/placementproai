'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Briefcase, Target, Plus, Sparkles, Activity, Shield } from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];

export default function SuperAdmin() {
  const [data, setData] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'colleges' | 'users' | 'plans'>('overview');
  const [form, setForm] = useState({ name: '', shortName: '', domain: '', city: '', state: '', plan: 'FREE' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/analytics/superadmin').then(r => r.json()).then(setData).catch(() => {});
    fetch('/api/admin/colleges').then(r => r.json()).then(j => setColleges(j.colleges || [])).catch(() => {});
    fetch('/api/admin/users').then(r => r.json()).then(j => setUsers(j.users || [])).catch(() => {});
  }, []);

  const createCollege = async () => {
    if (!form.name || !form.domain) return toast.error('Name and domain required');
    setCreating(true);
    try {
      const r = await fetch('/api/admin/colleges', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      toast.success('College created');
      setForm({ name: '', shortName: '', domain: '', city: '', state: '', plan: 'FREE' });
      fetch('/api/admin/colleges').then(r => r.json()).then(j => setColleges(j.colleges || []));
      fetch('/api/analytics/superadmin').then(r => r.json()).then(setData);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  if (!data) return <div className="text-center py-12 text-muted-foreground">Loading super admin dashboard…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Shield className="h-7 w-7 text-primary" /> Platform Overview</h1>
        <p className="text-muted-foreground mt-1">PlacementPro AI — Multi-tenant SaaS Platform Operations</p>
      </div>

      <div className="flex gap-2 border-b">
        {[
          ['overview', 'Overview'],
          ['colleges', 'Colleges'],
          ['users', 'Users'],
          ['plans', 'Subscription Plans'],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === k ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Colleges</div><div className="text-2xl font-bold mt-1">{data.totals?.colleges}</div></div><Building2 className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Users</div><div className="text-2xl font-bold mt-1">{data.totals?.users}</div></div><Users className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Active students</div><div className="text-2xl font-bold mt-1">{data.totals?.students}</div></div><Target className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">AI conversations</div><div className="text-2xl font-bold mt-1">{data.totals?.aiConversations}</div></div><Activity className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Job listings</div><div className="text-2xl font-bold mt-1">{data.totals?.jobs}</div></div><Briefcase className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Companies</div><div className="text-2xl font-bold mt-1">{data.totals?.companies}</div></div><Building2 className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Placement drives</div><div className="text-2xl font-bold mt-1">{data.totals?.drives}</div></div><Briefcase className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex justify-between"><div><div className="text-xs text-muted-foreground">Daily challenges</div><div className="text-2xl font-bold mt-1">{data.totals?.challenges}</div></div><Activity className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Users by role</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={Object.entries(data.roleCounts || {}).map(([k, v]: any) => ({ name: k.replace('_', ' '), value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                      {Object.entries(data.roleCounts || {}).map(([k, v], i: number) => <Cell key={k} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Colleges by plan</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(data.planCounts || {}).map(([k, v]: any) => ({ name: k, count: v }))}>
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
        </>
      )}

      {tab === 'colleges' && (
        <>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create new college</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="National Institute of Technology, ..." /></div>
                <div className="space-y-1.5"><Label>Short name</Label><Input value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} placeholder="NIT ..." /></div>
                <div className="space-y-1.5"><Label>Domain</Label><Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="nit-..." /></div>
                <div className="space-y-1.5"><Label>Plan</Label>
                  <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    <option value="FREE">FREE</option>
                    <option value="STARTER">STARTER</option>
                    <option value="PROFESSIONAL">PROFESSIONAL</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>
                <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              </div>
              <Button onClick={createCollege} disabled={creating} className="gap-2"><Plus className="h-4 w-4" /> {creating ? 'Creating…' : 'Create college'}</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>All colleges ({colleges.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-left text-xs text-muted-foreground">
                    <tr><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">City</th><th className="py-2 pr-3">Plan</th><th className="py-2 pr-3">Users</th><th className="py-2 pr-3">Students</th></tr>
                  </thead>
                  <tbody>
                    {colleges.map((c) => (
                      <tr key={c.id} className="border-b">
                        <td className="py-2 pr-3"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.domain}</div></td>
                        <td className="py-2 pr-3">{c.city}, {c.state}</td>
                        <td className="py-2 pr-3"><Badge variant="outline">{c.plan}</Badge></td>
                        <td className="py-2 pr-3">{c._count?.users || 0}</td>
                        <td className="py-2 pr-3">{c._count?.students || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'users' && (
        <Card>
          <CardHeader><CardTitle>Platform users ({users.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">College</th><th className="py-2 pr-3">Branch</th><th className="py-2 pr-3">Joined</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2 pr-3 font-medium">{u.name}</td>
                      <td className="py-2 pr-3 text-xs">{u.email}</td>
                      <td className="py-2 pr-3"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                      <td className="py-2 pr-3 text-xs">{u.college?.name || '—'}</td>
                      <td className="py-2 pr-3 text-xs">{u.studentProfile?.branch?.name || '—'}</td>
                      <td className="py-2 pr-3 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'plans' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.plans?.map((p: any) => (
            <Card key={p.id}>
              <CardHeader><Badge variant="outline">{p.tier}</Badge><CardTitle className="mt-2">{p.name}</CardTitle><CardDescription>{p.priceMonthly === 0 ? 'Free' : `₹${p.priceMonthly} / month`}</CardDescription></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs">
                  {(typeof p.features === 'string' ? JSON.parse(p.features) : p.features).map((f: string) => <li key={f} className="flex items-start gap-2">✓ {f}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
