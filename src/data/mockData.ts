export interface Project {
  id: string;
  name: string;
  status: 'Draft' | 'Live' | 'Completed';
  participants: number;
  timeToInsight: string;
  nps: number;
  lastUpdated: string;
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  role: string;
  experience: string;
  joined: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  reliability: number;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: 'online' | 'editing' | 'offline';
}

export const mockProjects: Project[] = [
  { id: '1', name: 'Mobile Onboarding Flow', status: 'Live', participants: 48, timeToInsight: '2h', nps: 74, lastUpdated: '2 hours ago' },
  { id: '2', name: 'Checkout Redesign V2', status: 'Completed', participants: 120, timeToInsight: '4h', nps: 82, lastUpdated: 'Yesterday' },
  { id: '3', name: 'New Dashboard Exploration', status: 'Draft', participants: 0, timeToInsight: '-', nps: 0, lastUpdated: '3 days ago' },
];

export const mockInsights = [
  {
    id: 'i1',
    projectId: '1',
    title: 'Frustration with Checkout Flow',
    description: 'Users consistently struggle with the address validation step, leading to a 15% drop-off.',
    type: 'Critical',
    timestamp: '2024-03-20',
  },
  {
    id: 'i2',
    projectId: '1',
    title: 'Positive Sentiment on Visual Design',
    description: 'The new "Airy Intelligence" theme is perceived as premium and trustworthy.',
    type: 'Positive',
    timestamp: '2024-03-21',
  },
];

export const mockThemes = [
  { name: 'Navigation', count: 12, sentiment: 'Neutral' },
  { name: 'Visual Design', count: 8, sentiment: 'Positive' },
  { name: 'Checkout Process', count: 15, sentiment: 'Negative' },
  { name: 'Onboarding', count: 5, sentiment: 'Positive' },
];

export const mockParticipants: Participant[] = [
  { 
    id: 'p1', 
    name: 'Sarah Chen', 
    age: 28, 
    role: 'Product Designer', 
    experience: '5 years', 
    joined: '2025-10-12', 
    status: 'Active',
    reliability: 98,
    tags: ['UX Expert', 'SaaS', 'Mobile'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' 
  },
  { 
    id: 'p2', 
    name: 'Marcus Miller', 
    age: 34, 
    role: 'Software Engineer', 
    experience: '8 years', 
    joined: '2025-11-05', 
    status: 'Active',
    reliability: 92,
    tags: ['React', 'Node.js', 'Scaling'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' 
  },
  { 
    id: 'p3', 
    name: 'Elena Rodriguez', 
    age: 42, 
    role: 'Marketing Manager', 
    experience: '12 years', 
    joined: '2025-08-20', 
    status: 'Inactive',
    reliability: 85,
    tags: ['Growth', 'Strategy', 'B2B'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' 
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 't1', name: 'Bagas Mahpie', role: 'Lead Researcher', email: 'bagas@lynda.co', status: 'online', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 't2', name: 'Sir Dandy', role: 'UX Analyst', email: 'dandy@lynda.co', status: 'offline', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 't3', name: 'Jhon Tosan', role: 'Product Mgr', email: 'jhon@lynda.co', status: 'editing', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
];
