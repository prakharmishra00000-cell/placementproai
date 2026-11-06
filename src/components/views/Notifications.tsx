'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Info, CheckCircle2, AlertTriangle, Briefcase, MessageSquare, Award } from 'lucide-react';

const ICONS: Record<string, any> = {
  INFO: Info, SUCCESS: CheckCircle2, WARNING: AlertTriangle, JOB: Briefcase, INTERVIEW: MessageSquare, OFFER: Award,
};

const COLORS: Record<string, string> = {
  INFO: 'bg-blue-500/10 text-blue-600',
  SUCCESS: 'bg-emerald-500/10 text-emerald-600',
  WARNING: 'bg-amber-500/10 text-amber-600',
  JOB: 'bg-violet-500/10 text-violet-600',
  INTERVIEW: 'bg-rose-500/10 text-rose-600',
  OFFER: 'bg-emerald-500/10 text-emerald-600',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/notifications').then(r => r.json()).then(j => setNotifications(j.notifications || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Bell className="h-7 w-7 text-primary" /> Notifications</h1>
        <p className="text-muted-foreground mt-1">{notifications.filter(n => !n.read).length} unread</p>
      </div>
      {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div> : (
        <div className="space-y-2">
          {notifications.length === 0 ? <Card><CardContent className="p-12 text-center text-sm text-muted-foreground">No notifications yet.</CardContent></Card> :
          notifications.map((n) => {
            const Icon = ICONS[n.type] || Info;
            return (
              <Card key={n.id} className={n.read ? 'opacity-60' : ''}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg ${COLORS[n.type] || COLORS.INFO} grid place-items-center flex-shrink-0`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-sm text-muted-foreground">{n.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>Mark read</Button>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
