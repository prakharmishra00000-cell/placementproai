'use client';
import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import AppShell from '@/components/AppShell';

export default function Home() {
  const user = useApp((s) => s.user);
  const setUser = useApp((s) => s.setUser);
  const setProfile = useApp((s) => s.setProfile);
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const theme = useApp((s) => s.theme);

  // Bootstrap theme on mount
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Bootstrap session on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth/me');
        const j = await r.json();
        if (j.user) {
          setUser(j.user);
          if (j.profile) setProfile(j.profile);
          // If on landing or auth view, push to dashboard
          const cur = useApp.getState().view;
          if (cur === 'landing' || cur === 'login' || cur === 'register') {
            setView('dashboard');
          }
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppShell />;
}
