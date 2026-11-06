'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, BookOpen, ArrowRight, ChevronRight } from 'lucide-react';

export default function LearningHub() {
  const profile = useApp((s) => s.profile);
  const setView = useApp((s) => s.setView);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semester, setSemester] = useState<number>(profile?.semester || 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.branchId) return;
    setLoading(true);
    fetch(`/api/subjects?branchId=${profile.branchId}&semester=${semester}`)
      .then(r => r.json())
      .then(j => setSubjects(j.subjects || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile?.branchId, semester]);

  // Also fetch common subjects (aptitude, reasoning, verbal)
  const [common, setCommon] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/subjects?isCommon=true')
      .then(r => r.json())
      .then(j => setCommon(j.subjects || []))
      .catch(() => {});
  }, []);

  if (!profile?.branchId) {
    return <div className="text-center py-12 text-muted-foreground">Complete your profile to access learning materials.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground mt-1">{profile.branch?.name} • Regulation {profile.regulation || 'R2021'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Semester</span>
          <Select value={String(semester)} onValueChange={(v) => setSemester(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Branch Subjects</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">No subjects configured for this semester yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer" >
                <button onClick={() => setView('subject', { subjectId: s.id })} className="text-left w-full h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">{s.code}</Badge>
                      <Badge variant="secondary" className="text-xs">{s.category}</Badge>
                    </div>
                    <h3 className="font-semibold mt-2">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Semester {s.semester} • {s.credits} credits</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>{s.units?.length || 0} units</span>
                      <span>{s.questions?.length || 0} questions</span>
                    </div>
                    <div className="mt-3 flex items-center text-primary text-xs font-medium gap-1">
                      Open <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Common Placement Prep</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {common.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <button onClick={() => setView('subject', { subjectId: s.id })} className="text-left w-full h-full">
                <CardContent className="p-4">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">Common to all branches</Badge>
                  <h3 className="font-semibold mt-2">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{s.questions?.length || 0} practice questions</p>
                  <div className="mt-3 flex items-center text-primary text-xs font-medium gap-1">
                    Open <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
