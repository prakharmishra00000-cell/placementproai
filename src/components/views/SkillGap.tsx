'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Target, ArrowRight, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function SkillGap() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<string>('');

  const load = () => {
    setLoading(true);
    fetch('/api/skillgap').then(r => r.json()).then(j => {
      setData(j);
      setTarget(j.targetRole || '');
    }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const changeTarget = async (role: string) => {
    setTarget(role);
    await fetch('/api/skillgap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetRole: role }) });
    load();
    toast.success(`Target role updated to ${role}`);
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Analyzing skill gap…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Target className="h-7 w-7 text-primary" /> Skill Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">Compare your verified skills against target role requirements</p>
        </div>
        <div className="space-y-1 w-full sm:w-72">
          <label className="text-xs text-muted-foreground">Target role</label>
          <Select value={target} onValueChange={changeTarget}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {data?.roleOptions?.map((r: string) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Required</div><div className="text-2xl font-bold mt-1">{data?.requiredSkills?.length || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Existing</div><div className="text-2xl font-bold mt-1 text-emerald-600">{data?.existingSkills?.length || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Missing</div><div className="text-2xl font-bold mt-1 text-amber-600">{data?.missingSkills?.length || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Readiness</div><div className="text-2xl font-bold mt-1">{data?.readinessPct || 0}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Readiness score</CardTitle><CardDescription>Based on overlap between your verified skills and target role requirements</CardDescription></CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span>{data?.readinessPct || 0}% ready for {target}</span>
            <span className="text-muted-foreground">{data?.matchedSkills?.length || 0} of {data?.requiredSkills?.length || 0} skills matched</span>
          </div>
          <Progress value={data?.readinessPct || 0} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> Matched skills</CardTitle></CardHeader>
          <CardContent>
            {data?.matchedSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.matchedSkills.map((s: string) => <Badge key={s} variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{s}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">No matched skills yet. Add skills in Skill Digital Twin.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-amber-600"><XCircle className="h-5 w-5" /> Missing skills</CardTitle></CardHeader>
          <CardContent>
            {data?.missingSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.missingSkills.map((s: string) => <Badge key={s} variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300">{s}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">No missing skills — you are 100% ready!</p>}
          </CardContent>
        </Card>
      </div>

      {data?.learningPaths?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Suggested learning paths</CardTitle><CardDescription>Recommended resources to close your skill gaps</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {data.learningPaths.map((lp: any) => (
              <div key={lp.skill} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{lp.skill}</h3>
                  <Badge variant="outline" className="text-xs gap-1"><Clock className="h-3 w-3" /> {lp.estimatedHours}h</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {lp.resources.map((r: string) => <li key={r} className="flex items-center gap-1"><ArrowRight className="h-3 w-3" /> {r}</li>)}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
