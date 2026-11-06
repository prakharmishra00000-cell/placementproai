'use client';
import { useApp, T, View } from '@/lib/store';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, GraduationCap, BookOpen, ClipboardCheck, Calculator,
  Bot, IdCard, Map, Target, Building, MessageSquare, FileText, Briefcase,
  Rocket, FlaskConical, Trophy, Users, BarChart3, Bell, Settings as SettingsIcon,
  LogOut, Menu, Moon, Sun, Globe, Shield, Sparkles,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LANGUAGES } from '@/lib/store';
import { useLazy } from '@/lib/use-lazy';

type NavItem = { view: View; label: string; icon: LucideIcon };

const STUDENT_NAV: NavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'learning', label: 'Learning Hub', icon: GraduationCap },
  { view: 'question-bank', label: 'Question Bank', icon: BookOpen },
  { view: 'practice-test', label: 'Practice Test', icon: ClipboardCheck },
  { view: 'aptitude', label: 'Aptitude Center', icon: Calculator },
  { view: 'ai-copilot', label: 'AI Placement Copilot', icon: Bot },
  { view: 'skill-twin', label: 'Skill Digital Twin', icon: IdCard },
  { view: 'skill-passport', label: 'Skill Passport', icon: Shield },
  { view: 'career-roadmap', label: 'Career Roadmap', icon: Map },
  { view: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
  { view: 'company-simulator', label: 'Company Simulator', icon: Building },
  { view: 'interview-lab', label: 'Interview Lab', icon: MessageSquare },
  { view: 'resume-builder', label: 'Resume Builder', icon: FileText },
  { view: 'job-portal', label: 'Job Portal', icon: Briefcase },
  { view: 'application-tracker', label: 'My Applications', icon: Rocket },
  { view: 'project-marketplace', label: 'Projects', icon: Rocket },
  { view: 'virtual-labs', label: 'Virtual Labs', icon: FlaskConical },
  { view: 'daily-challenges', label: 'Daily Challenges', icon: Trophy },
  { view: 'alumni', label: 'Alumni Network', icon: Users },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'settings', label: 'Settings', icon: SettingsIcon },
];

const COLLEGE_ADMIN_NAV: NavItem[] = [
  { view: 'college-admin', label: 'College Overview', icon: LayoutDashboard },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'settings', label: 'Settings', icon: SettingsIcon },
];

const PLACEMENT_OFFICER_NAV: NavItem[] = [
  { view: 'placement-officer', label: 'Placement Overview', icon: LayoutDashboard },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const RECRUITER_NAV: NavItem[] = [
  { view: 'recruiter', label: 'Recruiter Dashboard', icon: LayoutDashboard },
  { view: 'job-portal', label: 'Job Postings', icon: Briefcase },
];

const SUPER_ADMIN_NAV: NavItem[] = [
  { view: 'super-admin', label: 'Platform Overview', icon: LayoutDashboard },
  { view: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
  { view: 'pricing', label: 'Subscription Plans', icon: Sparkles },
];

function getNavForRole(role: string): NavItem[] {
  if (role === 'SUPER_ADMIN') return SUPER_ADMIN_NAV;
  if (role === 'COLLEGE_ADMIN') return COLLEGE_ADMIN_NAV;
  if (role === 'PLACEMENT_OFFICER') return PLACEMENT_OFFICER_NAV;
  if (role === 'RECRUITER') return RECRUITER_NAV;
  return STUDENT_NAV;
}

export default function AppShell() {
  const user = useApp((s) => s.user);
  const profile = useApp((s) => s.profile);
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const logout = useApp((s) => s.logout);
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const [unread, setUnread] = useState(0);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const poll = async () => {
      try {
        const r = await fetch('/api/notifications');
        const j = await r.json();
        if (active && j.unread !== undefined) setUnread(j.unread);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 60000);
    return () => { active = false; clearInterval(id); };
  }, [user]);

  // Public views (no auth required)
  const isPublic = view === 'landing' || view === 'login' || view === 'register' || view === 'pricing';
  if (isPublic && !user) {
    return <ViewRenderer view={view} />;
  }

  // Auth required
  if (!user) {
    return <ViewRenderer view="login" />;
  }

  // Onboarding check
  const isStudent = user.role === 'STUDENT';
  if (isStudent && (!profile?.branchId) && view !== 'onboarding' && view !== 'settings' && view !== 'logout') {
    return <ViewRenderer view="onboarding" />;
  }

  const nav = getNavForRole(user.role);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent nav={nav} active={view} onSelect={(v) => { setView(v); setOpenMobile(false); }} />
            </SheetContent>
          </Sheet>

          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 font-bold">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              <span className="text-lg">P</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-base font-bold">PlacementPro <span className="text-primary">AI</span></div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Engineering Career OS</div>
            </div>
          </button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Language"><Globe className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map(([code, name]) => (
                <DropdownMenuItem key={code} onClick={() => setLanguage(code)} className={language === code ? 'bg-accent' : ''}>
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" aria-label="Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setView('notifications')}>
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">{unread}</span>
              )}
            </div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user.name.split(' ').map(s => s[0]).slice(0, 2).join('')}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm leading-tight">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground">{user.role.replace('_', ' ')}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView('settings')}><SettingsIcon className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('analytics')}><BarChart3 className="mr-2 h-4 w-4" /> Analytics</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden lg:flex w-64 border-r bg-card/30 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent nav={nav} active={view} onSelect={setView} />
        </aside>
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <ViewRenderer view={view} />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ nav, active, onSelect }: { nav: NavItem[]; active: string; onSelect: (v: View) => void }) {
  const user = useApp((s) => s.user);
  const profile = useApp((s) => s.profile);
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b">
        <button onClick={() => onSelect('dashboard')} className="flex items-center gap-2 font-bold text-left">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
            <span className="text-lg">P</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold">PlacementPro <span className="text-primary">AI</span></div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">Engineering Career OS</div>
          </div>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 max-h-96 lg:max-h-none">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onSelect(item.view)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <div className="rounded-lg bg-muted/50 p-3 text-xs">
          <div className="font-medium">{user?.name}</div>
          <div className="text-muted-foreground">{user?.role.replace('_', ' ')}</div>
          {profile?.branch && <div className="text-muted-foreground mt-1">{profile.branch.name}</div>}
          {user?.role === 'STUDENT' && !profile?.branchId && (
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => onSelect('onboarding')}>
              Complete profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const VIEW_LOADERS: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  landing: () => import('@/components/views/Landing'),
  login: () => import('@/components/views/Login'),
  register: () => import('@/components/views/Register'),
  pricing: () => import('@/components/views/Pricing'),
  onboarding: () => import('@/components/views/Onboarding'),
  dashboard: () => import('@/components/views/Dashboard'),
  learning: () => import('@/components/views/LearningHub'),
  subject: () => import('@/components/views/SubjectView'),
  'question-bank': () => import('@/components/views/QuestionBank'),
  'practice-test': () => import('@/components/views/PracticeTest'),
  aptitude: () => import('@/components/views/Aptitude'),
  'ai-copilot': () => import('@/components/views/AiCopilot'),
  'career-council': () => import('@/components/views/AiCopilot'),
  'skill-twin': () => import('@/components/views/SkillTwin'),
  'skill-passport': () => import('@/components/views/SkillPassport'),
  'career-roadmap': () => import('@/components/views/CareerRoadmap'),
  'skill-gap': () => import('@/components/views/SkillGap'),
  'company-simulator': () => import('@/components/views/CompanySimulator'),
  'interview-lab': () => import('@/components/views/InterviewLab'),
  'resume-builder': () => import('@/components/views/ResumeBuilder'),
  'job-portal': () => import('@/components/views/JobPortal'),
  'application-tracker': () => import('@/components/views/Applications'),
  'project-marketplace': () => import('@/components/views/ProjectMarketplace'),
  'virtual-labs': () => import('@/components/views/VirtualLabs'),
  'daily-challenges': () => import('@/components/views/DailyChallenges'),
  alumni: () => import('@/components/views/Alumni'),
  analytics: () => import('@/components/views/Analytics'),
  notifications: () => import('@/components/views/Notifications'),
  settings: () => import('@/components/views/Settings'),
  'college-admin': () => import('@/components/views/CollegeAdmin'),
  'placement-officer': () => import('@/components/views/PlacementOfficer'),
  recruiter: () => import('@/components/views/Recruiter'),
  'super-admin': () => import('@/components/views/SuperAdmin'),
};

function ViewRenderer({ view }: { view: string }) {
  const loader = VIEW_LOADERS[view] || VIEW_LOADERS.dashboard;
  const Comp = useLazy(loader);
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Comp />
    </div>
  );
}
