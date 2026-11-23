import heroStudioImg from '../assets/images/hero_research_studio_1795415834003.jpg';
import checkoutUiImg from '../assets/images/study_checkout_ui_1795415836203.jpg';
import avatarSarahImg from '../assets/images/avatar_sarah_chen_1795415838235.jpg';
import avatarMarcusImg from '../assets/images/avatar_marcus_miller_1795415839488.jpg';
import avatarElenaImg from '../assets/images/avatar_elena_rodriguez_1795415907409.jpg';

export const ASSETS = {
  heroStudio: heroStudioImg,
  checkoutUi: checkoutUiImg,
  avatarSarah: avatarSarahImg,
  avatarMarcus: avatarMarcusImg,
  avatarElena: avatarElenaImg,
} as const;

export function resolveAvatarUrl(rawUrl: string | undefined, personName?: string): string {
  const hay = `${rawUrl || ''} ${personName || ''}`.toLowerCase();
  if (hay.includes('marcus')) return ASSETS.avatarMarcus;
  if (hay.includes('elena')) return ASSETS.avatarElena;
  if (hay.includes('sarah')) return ASSETS.avatarSarah;
  if (
    rawUrl &&
    (rawUrl === ASSETS.avatarSarah ||
      rawUrl === ASSETS.avatarMarcus ||
      rawUrl === ASSETS.avatarElena ||
      rawUrl.startsWith('data:') ||
      rawUrl.startsWith('blob:'))
  ) {
    return rawUrl;
  }
  return ASSETS.avatarSarah;
}


export type StudyStatus = 'Draft' | 'Live' | 'Completed';
export type StudyMethod = 'Moderated Interview' | 'First-Click Test' | 'Five-Second Test' | 'Usability Study';

export interface Project {
  id: string;
  name: string;
  method: StudyMethod;
  status: StudyStatus;
  participants: number;
  targetParticipants: number;
  timeToInsight: string;
  neutralityScore: number;
  completionRate: number;
  lastUpdated: string;
  objective: string;
  primaryQuestion: string;
}

export interface InsightItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Opportunity' | 'Positive';
  timestamp: string;
  clipTime: string;
  participantName: string;
  mentions: number;
  promotedToTask?: boolean;
}

export interface ThemeMetric {
  name: string;
  count: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  role: string;
  company: string;
  experience: string;
  joined: string;
  location: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  reliability: number;
  sessionsCompleted: number;
  shortlisted: boolean;
  tags: string[];
  recentNote: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  title: string;
  avatar: string;
  email: string;
  status: 'Active' | 'Invited';
  lastActive: string;
}

export interface ResearchSession {
  id: string;
  projectId: string;
  studyName: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  scheduledAt: string;
  duration: string;
  status: 'Scheduled' | 'Live' | 'Completed';
  privacyShield: boolean;
  highlightsCount: number;
  summary: string;
}

export interface ResearchTask {
  id: string;
  title: string;
  studyName: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  subject: string;
  studyName: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  messages: {
    id: string;
    author: string;
    time: string;
    body: string;
    isSelf?: boolean;
  }[];
}

export interface RecruitingCampaign {
  id: string;
  code: string;
  name: string;
  targetRole: string;
  skills: string;
  region: string;
  status: 'Sourcing' | 'Paused' | 'Filled';
  invited: number;
  screened: number;
  confirmed: number;
  goal: number;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile Onboarding Flow',
    method: 'Usability Study',
    status: 'Live',
    participants: 36,
    targetParticipants: 48,
    timeToInsight: '1.8 hrs',
    neutralityScore: 94,
    completionRate: 75,
    lastUpdated: '2 hours ago',
    objective: 'Identify drop-off points during workspace setup and team invite steps on iOS and Android.',
    primaryQuestion: 'Walk me through your first two minutes setting up a new workspace.',
  },
  {
    id: '2',
    name: 'Checkout & Billing Redesign V2',
    method: 'First-Click Test',
    status: 'Completed',
    participants: 120,
    targetParticipants: 120,
    timeToInsight: '3.4 hrs',
    neutralityScore: 97,
    completionRate: 100,
    lastUpdated: 'Yesterday',
    objective: 'Validate address lookup clarity and monthly vs. annual billing summary comprehension.',
    primaryQuestion: 'Where would you click first to verify your monthly total before confirming payment?',
  },
  {
    id: '3',
    name: 'Enterprise Permissions Audit',
    method: 'Moderated Interview',
    status: 'Live',
    participants: 14,
    targetParticipants: 20,
    timeToInsight: '2.1 hrs',
    neutralityScore: 91,
    completionRate: 70,
    lastUpdated: '5 hours ago',
    objective: 'Understand how research ops leads delegate editor vs. viewer seats across regions.',
    primaryQuestion: 'Tell me about the last time you onboarded a cross-functional stakeholder to a live study.',
  },
  {
    id: '4',
    name: 'Pricing Page First-Impression Test',
    method: 'Five-Second Test',
    status: 'Draft',
    participants: 0,
    targetParticipants: 50,
    timeToInsight: '—',
    neutralityScore: 89,
    completionRate: 0,
    lastUpdated: '3 days ago',
    objective: 'Measure immediate tier comprehension and seat-limit clarity after 5 seconds of exposure.',
    primaryQuestion: 'What stood out most about the differences between the plans shown?',
  },
];

export const mockInsights: InsightItem[] = [
  {
    id: 'i1',
    projectId: '1',
    title: 'Address autocomplete collides with manual billing entry',
    description:
      'Participants repeatedly clicked the postal lookup field expecting manual street entry, causing a 15% drop-off before payment confirmation.',
    severity: 'Critical',
    timestamp: 'Mar 20, 2026',
    clipTime: '04:12',
    participantName: 'Sarah Chen',
    mentions: 14,
  },
  {
    id: 'i2',
    projectId: '1',
    title: 'Clear hierarchy on order summary accelerates trust',
    description:
      'Line-item tax transparency next to the primary action button reduced verification pauses by 38% compared to the legacy checkout.',
    severity: 'Positive',
    timestamp: 'Mar 21, 2026',
    clipTime: '09:40',
    participantName: 'Marcus Miller',
    mentions: 19,
  },
  {
    id: 'i3',
    projectId: '1',
    title: 'Seat-invite step skips role explanation on narrow viewports',
    description:
      'Team leads hesitated when inviting designers because Editor vs. Viewer permissions were tucked behind an unlabelled tooltip.',
    severity: 'Opportunity',
    timestamp: 'Mar 21, 2026',
    clipTime: '14:05',
    participantName: 'Elena Rodriguez',
    mentions: 8,
  },
  {
    id: 'i4',
    projectId: '2',
    title: 'Annual toggle savings copy missed by first-time buyers',
    description:
      '62% of first-click participants overlooked the billing cadence toggle until after inspecting the subtotal card.',
    severity: 'Opportunity',
    timestamp: 'Mar 19, 2026',
    clipTime: '02:55',
    participantName: 'Sarah Chen',
    mentions: 11,
  },
];

export const mockThemes: ThemeMetric[] = [
  { name: 'Checkout & Billing Clarity', count: 15, sentiment: 'Negative' },
  { name: 'Navigation & Wayfinding', count: 12, sentiment: 'Neutral' },
  { name: 'Visual Hierarchy & Trust', count: 11, sentiment: 'Positive' },
  { name: 'Workspace Onboarding', count: 8, sentiment: 'Positive' },
];

export const mockParticipants: Participant[] = [
  {
    id: 'p1',
    name: 'Sarah Chen',
    age: 29,
    role: 'Senior Product Designer',
    company: 'Northstar Systems',
    experience: '6 years',
    joined: 'Oct 12, 2025',
    location: 'London, UK',
    status: 'Active',
    reliability: 98,
    sessionsCompleted: 14,
    shortlisted: true,
    tags: ['Design Systems', 'B2B SaaS', 'Mobile'],
    avatar: ASSETS.avatarSarah,
    recentNote: 'Articulate on information architecture trade-offs; strong think-aloud cadence.',
  },
  {
    id: 'p2',
    name: 'Marcus Miller',
    age: 34,
    role: 'Staff Frontend Engineer',
    company: 'Fieldwork Cloud',
    experience: '9 years',
    joined: 'Nov 05, 2025',
    location: 'Toronto, CA',
    status: 'Active',
    reliability: 94,
    sessionsCompleted: 9,
    shortlisted: true,
    tags: ['React', 'Developer Tools', 'Enterprise'],
    avatar: ASSETS.avatarMarcus,
    recentNote: 'Spotted keyboard focus-order regression during Checkout V2 checkout test.',
  },
  {
    id: 'p3',
    name: 'Elena Rodriguez',
    age: 38,
    role: 'Director of Growth Marketing',
    company: 'Cinder Analytics',
    experience: '12 years',
    joined: 'Aug 20, 2025',
    location: 'Madrid, ES',
    status: 'Active',
    reliability: 91,
    sessionsCompleted: 11,
    shortlisted: false,
    tags: ['Pricing Strategy', 'PLG', 'B2B'],
    avatar: ASSETS.avatarElena,
    recentNote: 'Detailed feedback on self-serve upgrade flows and billing transparency.',
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 't1',
    name: 'Elena Rodriguez',
    role: 'Admin',
    title: 'Principal UX Researcher',
    email: 'elena@lyndaplus.co',
    status: 'Active',
    lastActive: 'Active now',
    avatar: ASSETS.avatarElena,
  },
  {
    id: 't2',
    name: 'Marcus Miller',
    role: 'Editor',
    title: 'Design Systems Architect',
    email: 'marcus@lyndaplus.co',
    status: 'Active',
    lastActive: '18m ago',
    avatar: ASSETS.avatarMarcus,
  },
  {
    id: 't3',
    name: 'Sarah Chen',
    role: 'Editor',
    title: 'Lead Product Designer',
    email: 'sarah@lyndaplus.co',
    status: 'Active',
    lastActive: '2h ago',
    avatar: ASSETS.avatarSarah,
  },
];

export const mockSessions: ResearchSession[] = [
  {
    id: 's1',
    projectId: '1',
    studyName: 'Mobile Onboarding Flow',
    participantName: 'Sarah Chen',
    participantRole: 'Senior Product Designer',
    participantAvatar: ASSETS.avatarSarah,
    scheduledAt: 'Today, 2:30 PM GMT',
    duration: '45 min',
    status: 'Live',
    privacyShield: true,
    highlightsCount: 6,
    summary: 'Live moderated walkthrough focused on initial workspace creation and invite flow.',
  },
  {
    id: 's2',
    projectId: '3',
    studyName: 'Enterprise Permissions Audit',
    participantName: 'Marcus Miller',
    participantRole: 'Staff Frontend Engineer',
    participantAvatar: ASSETS.avatarMarcus,
    scheduledAt: 'Tomorrow, 10:00 AM GMT',
    duration: '30 min',
    status: 'Scheduled',
    privacyShield: true,
    highlightsCount: 0,
    summary: 'Deep dive into role-based workspace controls and audit log expectations.',
  },
  {
    id: 's3',
    projectId: '2',
    studyName: 'Checkout & Billing Redesign V2',
    participantName: 'Elena Rodriguez',
    participantRole: 'Director of Growth Marketing',
    participantAvatar: ASSETS.avatarElena,
    scheduledAt: 'Mar 20, 4:00 PM GMT',
    duration: '38 min',
    status: 'Completed',
    privacyShield: true,
    highlightsCount: 9,
    summary: 'Completed usability benchmark with 96% task success and 3 billing clarity moments flagged.',
  },
];

export const mockTasks: ResearchTask[] = [
  {
    id: 'tk1',
    title: 'Separate manual address entry link from postal autocomplete',
    studyName: 'Checkout & Billing Redesign V2',
    assignee: 'Sarah Chen',
    dueDate: 'Mar 25',
    priority: 'High',
    completed: false,
  },
  {
    id: 'tk2',
    title: 'Audit onboarding script for closed yes/no prompts before Wave 2',
    studyName: 'Mobile Onboarding Flow',
    assignee: 'Elena Rodriguez',
    dueDate: 'Mar 24',
    priority: 'High',
    completed: false,
  },
  {
    id: 'tk3',
    title: 'Export Privacy-Shield redacted highlight reel for Engineering review',
    studyName: 'Mobile Onboarding Flow',
    assignee: 'Marcus Miller',
    dueDate: 'Mar 27',
    priority: 'Medium',
    completed: true,
  },
  {
    id: 'tk4',
    title: 'Finalize 50-participant screener for Pricing Five-Second Test',
    studyName: 'Pricing Page First-Impression Test',
    assignee: 'Elena Rodriguez',
    dueDate: 'Mar 29',
    priority: 'Low',
    completed: false,
  },
];

export const mockInboxMessages: InboxMessage[] = [
  {
    id: 'm1',
    senderName: 'Sarah Chen',
    senderRole: 'Participant · Mobile Onboarding Flow',
    senderAvatar: ASSETS.avatarSarah,
    subject: 'Confirmed for 2:30 PM usability session',
    studyName: 'Mobile Onboarding Flow',
    preview: 'Audio and screen sharing tested cleanly. Ready to join 5 minutes early.',
    timestamp: '14m ago',
    unread: true,
    messages: [
      {
        id: 'm1-1',
        author: 'Sarah Chen',
        time: '2:11 PM',
        body: 'Hi team — I ran the browser audio check and confirmed Privacy Shield masking on my secondary monitor. I will join the session link 5 minutes early.',
      },
      {
        id: 'm1-2',
        author: 'You',
        time: '2:16 PM',
        body: 'Thanks Sarah! Everything is set on our end. We will keep the walkthrough to 45 minutes and handle the incentive payout right after.',
        isSelf: true,
      },
    ],
  },
  {
    id: 'm2',
    senderName: 'Marcus Miller',
    senderRole: 'Design Systems Architect · Internal',
    senderAvatar: ASSETS.avatarMarcus,
    subject: 'Question on Checkout V2 address validation highlight',
    studyName: 'Checkout & Billing Redesign V2',
    preview: 'Can we clip the 04:12 timestamp into the Q2 sprint brief before Thursday?',
    timestamp: '2h ago',
    unread: true,
    messages: [
      {
        id: 'm2-1',
        author: 'Marcus Miller',
        time: '12:20 PM',
        body: 'Just watched the Checkout V2 synthesis. The 04:12 clip where participants mistook the postal lookup for a full address input makes the fix obvious. Can you promote that to a High Priority task?',
      },
    ],
  },
  {
    id: 'm3',
    senderName: 'Elena Rodriguez',
    senderRole: 'Principal UX Researcher · Internal',
    senderAvatar: ASSETS.avatarElena,
    subject: 'Enterprise Permissions screener criteria approved',
    studyName: 'Enterprise Permissions Audit',
    preview: 'Updated minimum company size to 250+ seats and launched Wave 1 invitations.',
    timestamp: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'm3-1',
        author: 'Elena Rodriguez',
        time: 'Yesterday, 5:42 PM',
        body: 'Screener criteria are locked and Wave 1 invitations are out to 140 verified design ops leads. Expected fill time is under 18 hours.',
      },
    ],
  },
];

export const mockCampaigns: RecruitingCampaign[] = [
  {
    id: 'c1',
    code: 'CMP-129',
    name: 'Checkout V2 Buyer Validation',
    targetRole: 'Senior Product Designer & PM',
    skills: 'SaaS, Billing Flows, Figma',
    region: 'Europe & North America',
    status: 'Sourcing',
    invited: 1248,
    screened: 84,
    confirmed: 32,
    goal: 50,
  },
  {
    id: 'c2',
    code: 'CMP-134',
    name: 'Enterprise Permissions Leads',
    targetRole: 'Research Ops & Eng Managers',
    skills: 'RBAC, Enterprise Governance, SSO',
    region: 'Remote Global',
    status: 'Sourcing',
    invited: 420,
    screened: 38,
    confirmed: 14,
    goal: 20,
  },
];
