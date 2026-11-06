'use client';
// use-lazy: load and render a dynamic component
import { useEffect, useState } from 'react';

export function useLazy(loader: () => Promise<{ default: React.ComponentType }>) {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let active = true;
    loader().then((m) => { if (active) setComp(() => m.default); }).catch(() => {});
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader]);
  if (!Comp) {
    return function Loading() {
      return (
        <div className="min-h-[60vh] grid place-items-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Loading…</span>
          </div>
        </div>
      );
    };
  }
  return Comp;
}
