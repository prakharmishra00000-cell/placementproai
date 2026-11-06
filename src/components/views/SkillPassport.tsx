'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Share2, Award, BadgeCheck, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export default function SkillPassport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/passport').then(r => r.json()).then(j => setData(j)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading passport…</div>;

  const p = data?.passport;
  if (!p) return <div className="text-center py-12 text-muted-foreground">No passport available. Complete your profile.</div>;

  const verifiedCount = (p.skills || []).filter((s: any) => s.verifiedBy && s.verifiedBy !== 'SELF').length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Shield className="h-7 w-7 text-primary" /> Skill Passport</h1>
        <p className="text-muted-foreground mt-1">Portable, verifiable credential you can share with employers</p>
      </div>

      {/* Passport card */}
      <Card className="overflow-hidden border-2 border-primary/30">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-xl">{p.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</div>
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.email}</div>
              </div>
            </div>
            <Badge className="gap-1"><Shield className="h-3 w-3" /> Verified</Badge>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Branch" value={p.branch} />
            <Info label="College" value={p.college} />
            <Info label="Semester" value={`Semester ${p.semester}`} />
            <Info label="Graduation year" value={String(p.graduationYear)} />
            <Info label="CGPA" value={String(p.cgpa)} />
            <Info label="Skills verified" value={`${verifiedCount}/${p.skills?.length || 0}`} />
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">SKILLS</div>
            <div className="flex flex-wrap gap-2">
              {(p.skills || []).map((s: any) => (
                <Badge key={s.id} variant={s.verifiedBy && s.verifiedBy !== 'SELF' ? 'default' : 'outline'} className="gap-1">
                  {s.verifiedBy && s.verifiedBy !== 'SELF' && <BadgeCheck className="h-3 w-3" />}{s.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">CREDENTIALS</div>
            {p.credentials?.length > 0 ? (
              <div className="space-y-2">
                {p.credentials.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-2 rounded-lg border p-3">
                    <Award className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.issuer} • {new Date(c.issuedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No credentials yet.</p>
            )}
          </div>

          <div className="border-t pt-4 grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Passport ID</div>
              <div className="font-mono break-all">{p.id}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Issued at</div>
              <div>{new Date(p.issuedAt).toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2" onClick={() => {
          const text = `PlacementPro AI Skill Passport — ${p.name}, ${p.branch}, CGPA ${p.cgpa}. Skills: ${(p.skills || []).map((s: any) => s.name).join(', ')}.`;
          navigator.clipboard.writeText(text);
          toast.success('Passport summary copied to clipboard');
        }}><Share2 className="h-4 w-4" /> Share summary</Button>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}><Download className="h-4 w-4" /> Print / Save PDF</Button>
        <Button variant="outline" className="gap-2" onClick={() => toast.info('QR verification would generate a scannable link here.')}><QrCode className="h-4 w-4" /> Show QR</Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5">{value || '—'}</div>
    </div>
  );
}
