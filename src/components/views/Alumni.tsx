'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Users, MessageSquare, Building2, MapPin, Award } from 'lucide-react';

export default function Alumni() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<{ id: string; name: string } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/alumni').then(r => r.json()).then(j => setAlumni(j.alumni || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const sendRequest = async () => {
    if (!message) return toast.error('Write a message');
    try {
      const r = await fetch('/api/mentorship', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniId: request!.id, message }),
      });
      if (!r.ok) throw new Error((await r.json()).error);
      toast.success('Mentorship request sent');
      setRequest(null);
      setMessage('');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Users className="h-7 w-7 text-primary" /> Alumni Network</h1>
        <p className="text-muted-foreground mt-1">Connect with verified alumni for mentorship, resume reviews and mock interviews</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {alumni.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">{a.user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{a.user?.name}</div>
                      {a.availableForMentorship && <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700">Available</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Award className="h-3 w-3" /> {a.branchCode} • Class of {a.graduationYear}</div>
                    {a.currentRole && a.currentCompany && (
                      <div className="text-sm mt-1 flex items-center gap-1"><Building2 className="h-3 w-3" /> {a.currentRole} at {a.currentCompany}</div>
                    )}
                    {a.industry && <Badge variant="secondary" className="text-xs mt-1">{a.industry}</Badge>}
                    {a.bio && <p className="text-sm text-muted-foreground mt-2">{a.bio}</p>}
                    {a.availableForMentorship && (
                      <Button size="sm" variant="outline" className="mt-3 gap-2" onClick={() => setRequest({ id: a.id, name: a.user.name })}>
                        <MessageSquare className="h-3.5 w-3.5" /> Request mentorship
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {request && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4" onClick={() => setRequest(null)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle>Request mentorship from {request.name}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Introduce yourself and what you'd like help with…" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setRequest(null)}>Cancel</Button>
                <Button onClick={sendRequest} className="gap-2">Send request</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
