'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BookOpen, HelpCircle, ClipboardCheck, ChevronRight } from 'lucide-react';

export default function SubjectView() {
  const viewParams = useApp((s) => s.viewParams);
  const setView = useApp((s) => s.setView);
  const [subject, setSubject] = useState<any>(null);

  useEffect(() => {
    if (viewParams?.subjectId) {
      fetch(`/api/subjects/${viewParams.subjectId}`).then(r => r.json()).then(j => setSubject(j.subject)).catch(() => {});
    }
  }, [viewParams?.subjectId]);

  if (!subject) return <div className="text-center py-12 text-muted-foreground">Loading subject…</div>;

  const questionsByTopic: Record<string, any[]> = {};
  (subject.questions || []).forEach((q: any) => {
    const t = q.topic?.name || 'General';
    if (!questionsByTopic[t]) questionsByTopic[t] = [];
    questionsByTopic[t].push(q);
  });

  return (
    <div className="space-y-6">
      <button onClick={() => setView('learning')} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Learning Hub
      </button>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{subject.code}</Badge>
          <Badge variant="secondary">{subject.category}</Badge>
          {subject.isCommon && <Badge variant="secondary" className="bg-primary/10 text-primary">Common</Badge>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mt-2">{subject.name}</h1>
        <p className="text-muted-foreground mt-1">{subject.branch?.name} • Semester {subject.semester} • {subject.credits} credits</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Button onClick={() => setView('question-bank', { subjectId: subject.id })} className="justify-start gap-3 h-auto py-4">
          <BookOpen className="h-5 w-5" /> <div className="text-left"><div className="text-sm font-medium">Question Bank</div><div className="text-xs opacity-80">{subject.questions?.length || 0} questions</div></div>
        </Button>
        <Button onClick={() => setView('practice-test', { subjectId: subject.id })} variant="outline" className="justify-start gap-3 h-auto py-4">
          <ClipboardCheck className="h-5 w-5" /> <div className="text-left"><div className="text-sm font-medium">Practice Test</div><div className="text-xs opacity-80">Timed assessment</div></div>
        </Button>
        <Button onClick={() => setView('ai-copilot', { context: `I'm studying ${subject.name}. Help me understand the key concepts.` })} variant="outline" className="justify-start gap-3 h-auto py-4">
          <HelpCircle className="h-5 w-5" /> <div className="text-left"><div className="text-sm font-medium">Ask AI</div><div className="text-xs opacity-80">Get instant help</div></div>
        </Button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Syllabus Structure</h2>
        {subject.units?.length > 0 ? (
          <Accordion type="multiple" className="border rounded-lg">
            {subject.units.map((u: any) => (
              <AccordionItem key={u.id} value={u.id}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">{u.number}</div>
                    <div>
                      <div className="font-medium">{u.title}</div>
                      <div className="text-xs text-muted-foreground">{u.topics?.length || 0} topics</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2 ml-11">
                    {u.topics?.map((t: any) => (
                      <div key={t.id} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{t.name}</div>
                          {t.subtopics?.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {t.subtopics.map((st: any) => <li key={st.id} className="ml-3">• {st.name}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Units and topics will appear here.</CardContent></Card>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Questions by topic</h2>
        <div className="space-y-3">
          {Object.entries(questionsByTopic).map(([topic, qs]) => (
            <Card key={topic}>
              <CardHeader className="pb-3"><CardTitle className="text-base">{topic}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {qs.map((q: any) => (
                  <div key={q.id} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>{q.text}</div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{q.difficulty}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
