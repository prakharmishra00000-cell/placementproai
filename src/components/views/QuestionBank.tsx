'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, ClipboardCheck, Filter } from 'lucide-react';

export default function QuestionBank() {
  const viewParams = useApp((s) => s.viewParams);
  const profile = useApp((s) => s.profile);
  const setView = useApp((s) => s.setView);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    subjectId: viewParams?.subjectId || '',
    difficulty: '',
    branchId: profile?.branchId || '',
  });
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.subjectId) params.set('subjectId', filters.subjectId);
    if (filters.branchId) params.set('branchId', filters.branchId);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    params.set('limit', '100');
    fetch(`/api/questions?${params}`)
      .then(r => r.json())
      .then(j => setQuestions(j.questions || []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-6">
      <button onClick={() => setView('learning')} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Learning Hub
      </button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><BookOpen className="h-7 w-7 text-primary" /> Question Bank</h1>
        <p className="text-muted-foreground mt-1">{questions.length} questions available</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Difficulty</label>
          <Select value={filters.difficulty} onValueChange={(v) => setFilters({ ...filters, difficulty: v === 'ALL' ? '' : v })}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All difficulties" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All difficulties</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filters.subjectId && (
          <Button variant="ghost" onClick={() => setFilters({ ...filters, subjectId: '' })} size="sm">Clear subject filter</Button>
        )}
        <div className="flex-1" />
        <Button onClick={() => setView('practice-test', { subjectId: filters.subjectId })} className="gap-2">
          <ClipboardCheck className="h-4 w-4" /> Take practice test
        </Button>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}
        </div>
      ) : questions.length === 0 ? (
        <Card><CardContent className="p-12 text-center">
          <Filter className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No questions match the current filters.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="outline" className="text-xs">{q.subject?.code}</Badge>
                      <Badge variant="secondary" className="text-xs">{q.type}</Badge>
                      <Badge variant="secondary" className={`text-xs ${q.difficulty === 'HARD' || q.difficulty === 'EXPERT' ? 'bg-red-500/10 text-red-700' : q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-700' : 'bg-emerald-500/10 text-emerald-700'}`}>{q.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                      {q.verificationStatus === 'VERIFIED' && <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700">Verified</Badge>}
                    </div>
                    <p className="font-medium">{q.text}</p>
                    {openId === q.id && (
                      <div className="mt-3 space-y-2 p-3 rounded-lg bg-muted/50 text-sm">
                        {q.options && q.options !== '[]' && (() => {
                          const opts = JSON.parse(q.options);
                          const correct = JSON.parse(q.correctAnswer);
                          return (
                            <div className="space-y-1">
                              {opts.map((o: string, idx: number) => (
                                <div key={idx} className={`p-2 rounded ${correct.includes(idx) ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium' : ''}`}>
                                  {String.fromCharCode(65 + idx)}. {o} {correct.includes(idx) && '✓'}
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                        {(!q.options || q.options === '[]') && (
                          <div><span className="text-muted-foreground">Answer:</span> <span className="font-medium">{q.correctAnswer}</span></div>
                        )}
                        {q.explanation && <div className="mt-2 p-2 rounded bg-background border-l-2 border-primary"><span className="text-xs font-medium text-primary">EXPLANATION</span><div className="mt-1">{q.explanation}</div></div>}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => setOpenId(openId === q.id ? null : q.id)}>
                      {openId === q.id ? 'Hide answer' : 'Show answer & explanation'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
