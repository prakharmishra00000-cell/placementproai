// src/lib/store.ts - client app state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type View =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'onboarding'
  | 'learning'
  | 'subject'
  | 'question-bank'
  | 'practice-test'
  | 'aptitude'
  | 'ai-copilot'
  | 'career-council'
  | 'skill-twin'
  | 'skill-passport'
  | 'career-roadmap'
  | 'skill-gap'
  | 'company-simulator'
  | 'interview-lab'
  | 'resume-builder'
  | 'job-portal'
  | 'application-tracker'
  | 'project-marketplace'
  | 'virtual-labs'
  | 'daily-challenges'
  | 'alumni'
  | 'analytics'
  | 'notifications'
  | 'settings'
  | 'college-admin'
  | 'placement-officer'
  | 'recruiter'
  | 'super-admin'
  | 'pricing';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  collegeId: string | null;
};

type AppState = {
  user: SessionUser | null;
  profile: any | null;
  view: View;
  viewParams: any;
  language: string;
  theme: 'light' | 'dark';
  // setters
  setUser: (u: SessionUser | null) => void;
  setProfile: (p: any | null) => void;
  setView: (v: View, params?: any) => void;
  setLanguage: (l: string) => void;
  setTheme: (t: 'light' | 'dark') => void;
  logout: () => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      view: 'landing',
      viewParams: null,
      language: 'en',
      theme: 'light',
      setUser: (u) => set({ user: u }),
      setProfile: (p) => set({ profile: p }),
      setView: (v, params = null) => set({ view: v, viewParams: params }),
      setLanguage: (l) => set({ language: l }),
      setTheme: (t) => {
        if (typeof document !== 'undefined') {
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
        set({ theme: t });
      },
      logout: () => {
        fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null, profile: null, view: 'landing' });
      },
    }),
    { name: 'placementpro-app' }
  )
);

// Translations (lightweight, key strings only)
export const T: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    features: 'Features',
    branches: 'Engineering Branches',
    pricing: 'Pricing',
    login: 'Log in',
    register: 'Get started',
    dashboard: 'Dashboard',
    learning: 'Learning Hub',
    questionBank: 'Question Bank',
    practiceTest: 'Practice Test',
    aptitude: 'Aptitude Center',
    aiCopilot: 'AI Placement Copilot',
    skillTwin: 'Skill Digital Twin',
    skillPassport: 'Skill Passport',
    careerRoadmap: 'Career Roadmap',
    skillGap: 'Skill Gap Analysis',
    companySim: 'Company Simulator',
    interviewLab: 'Interview Lab',
    resumeBuilder: 'Resume Builder',
    jobPortal: 'Job Portal',
    apps: 'Applications',
    projects: 'Projects',
    labs: 'Virtual Labs',
    challenges: 'Daily Challenges',
    alumni: 'Alumni Network',
    analytics: 'Analytics',
    settings: 'Settings',
    logout: 'Log out',
  },
  hi: {
    home: 'होम',
    features: 'विशेषताएँ',
    branches: 'इंजीनियरिंग शाखाएँ',
    pricing: 'मूल्य निर्धारण',
    login: 'लॉग इन',
    register: 'शुरू करें',
    dashboard: 'डैशबोर्ड',
    learning: 'लर्निंग हब',
    questionBank: 'प्रश्न बैंक',
    practiceTest: 'अभ्यास परीक्षा',
    aptitude: 'एप्टीट्यूड केंद्र',
    aiCopilot: 'एआई प्लेसमेंट सहयोगी',
    skillTwin: 'स्किल डिजिटल ट्विन',
    skillPassport: 'स्किल पासपोर्ट',
    careerRoadmap: 'करियर रोडमैप',
    skillGap: 'स्किल गैप विश्लेषण',
    companySim: 'कंपनी सिम्युलेटर',
    interviewLab: 'इंटरव्यू लैब',
    resumeBuilder: 'रिज्यूमे बिल्डर',
    jobPortal: 'जॉब पोर्टल',
    apps: 'आवेदन',
    projects: 'प्रोजेक्ट्स',
    labs: 'वर्चुअल लैब',
    challenges: 'दैनिक चुनौतियाँ',
    alumni: 'एलुमनाई नेटवर्क',
    analytics: 'एनालिटिक्स',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
  },
};

export const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'हिन्दी'],
  ['or', 'ଓଡ଼ିଆ'],
  ['bn', 'বাংলা'],
  ['ta', 'தமிழ்'],
  ['te', 'తెలుగు'],
  ['kn', 'ಕನ್ನಡ'],
  ['ml', 'മലയാളം'],
  ['mr', 'मराठी'],
  ['gu', 'ગુજરાતી'],
];
