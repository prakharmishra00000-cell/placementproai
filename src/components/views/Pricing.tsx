'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const setView = useApp((s) => s.setView);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/plans').then(r => r.json()).then(j => setPlans(j.plans || [])).catch(() => {});
    // fallback
    setPlans([
      { code: 'FREE', name: 'Free', tier: 'FREE', priceMonthly: 0, priceYearly: 0, features: '["Basic learning","Limited assessments","Basic student profile"]' },
      { code: 'STUDENT_PRO', name: 'Student Premium', tier: 'STUDENT_PREMIUM', priceMonthly: 299, priceYearly: 2999, features: '["AI career mentor","Advanced assessments","Resume and interview tools","Advanced analytics"]' },
      { code: 'COLLEGE_STARTER', name: 'College Starter', tier: 'COLLEGE_STARTER', priceMonthly: 4999, priceYearly: 49999, features: '["Student management","Learning modules","Basic placement analytics"]' },
      { code: 'COLLEGE_PRO', name: 'College Professional', tier: 'COLLEGE_PROFESSIONAL', priceMonthly: 14999, priceYearly: 149999, features: '["AI tools","Placement management","Advanced analytics","Question bank admin"]' },
      { code: 'COLLEGE_ENT', name: 'College Enterprise', tier: 'COLLEGE_ENTERPRISE', priceMonthly: 49999, priceYearly: 499999, features: '["White-label","Custom integrations","Advanced permissions","Enterprise reporting"]' },
      { code: 'RECRUITER', name: 'Recruiter', tier: 'RECRUITER', priceMonthly: 4999, priceYearly: 49999, features: '["Candidate discovery","Assessments","Recruitment management"]' },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 gap-4">
          <button onClick={() => setView('landing')} className="flex items-center gap-2 font-bold">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center text-lg">P</div>
            <span>PlacementPro AI</span>
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <button onClick={() => setView('landing')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 justify-center">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </button>
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">Free for students. Premium for serious aspirants. Enterprise plans for colleges and recruiters.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isFree = p.priceMonthly === 0;
            return (
              <Card key={p.code} className={isFree ? 'border-primary' : ''}>
                <CardHeader>
                  <Badge variant="outline">{p.tier}</Badge>
                  <CardTitle className="mt-2">{p.name}</CardTitle>
                  <CardDescription>
                    {isFree ? (
                      <span className="text-2xl font-bold text-primary">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-primary">₹{p.priceMonthly.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-muted-foreground"> /month</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {(typeof p.features === 'string' ? JSON.parse(p.features) : p.features).map((f: string) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" variant={isFree ? 'default' : 'outline'} onClick={() => setView('register')}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
