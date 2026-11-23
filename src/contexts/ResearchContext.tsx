import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  mockProjects,
  mockInsights,
  mockParticipants,
  mockTeamMembers,
  mockSessions,
  mockTasks,
  mockInboxMessages,
  mockCampaigns,
  ASSETS,
  type Project,
  type InsightItem,
  type Participant,
  type TeamMember,
  type ResearchSession,
  type ResearchTask,
  type InboxMessage,
  type RecruitingCampaign,
} from '../data/mockData';

interface ResearchContextValue {
  projects: Project[];
  insights: InsightItem[];
  participants: Participant[];
  teamMembers: TeamMember[];
  sessions: ResearchSession[];
  tasks: ResearchTask[];
  inbox: InboxMessage[];
  campaigns: RecruitingCampaign[];
  credits: number;
  addCredits: (hours: number) => void;
  addProject: (project: Omit<Project, 'id' | 'lastUpdated'>) => Project;
  addInsight: (insight: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  promoteInsightToTask: (insightId: string) => void;
  toggleParticipantShortlist: (participantId: string) => void;
  addParticipant: (p: Omit<Participant, 'id' | 'joined' | 'avatar' | 'sessionsCompleted' | 'shortlisted'>) => void;
  addSession: (s: Omit<ResearchSession, 'id' | 'participantAvatar' | 'highlightsCount'>) => void;
  addTask: (t: Omit<ResearchTask, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  markThreadRead: (threadId: string) => void;
  replyToThread: (threadId: string, body: string) => void;
  addInboxThread: (recipient: string, subject: string, studyName: string, body: string) => void;
  inviteTeamMember: (email: string, role: TeamMember['role']) => void;
  updateTeamRole: (memberId: string, role: TeamMember['role']) => void;
  addCampaign: (campaign: Omit<RecruitingCampaign, 'id' | 'code' | 'invited' | 'screened' | 'confirmed'>) => void;
}

const STORAGE_KEY = 'lyndaplus_workspace_state_v2';

const ResearchContext = createContext<ResearchContextValue | undefined>(undefined);

interface StoredState {
  projects: Project[];
  insights: InsightItem[];
  participants: Participant[];
  teamMembers: TeamMember[];
  sessions: ResearchSession[];
  tasks: ResearchTask[];
  inbox: InboxMessage[];
  campaigns: RecruitingCampaign[];
  credits: number;
}

const DEFAULT_STATE: StoredState = {
  projects: mockProjects,
  insights: mockInsights,
  participants: mockParticipants,
  teamMembers: mockTeamMembers,
  sessions: mockSessions,
  tasks: mockTasks,
  inbox: mockInboxMessages,
  campaigns: mockCampaigns,
  credits: 12.4,
};

function loadInitialState(): StoredState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      projects: parsed.projects?.length ? parsed.projects : DEFAULT_STATE.projects,
      insights: parsed.insights?.length ? parsed.insights : DEFAULT_STATE.insights,
      participants: parsed.participants?.length ? parsed.participants : DEFAULT_STATE.participants,
      teamMembers: parsed.teamMembers?.length ? parsed.teamMembers : DEFAULT_STATE.teamMembers,
      sessions: parsed.sessions?.length ? parsed.sessions : DEFAULT_STATE.sessions,
      tasks: parsed.tasks?.length ? parsed.tasks : DEFAULT_STATE.tasks,
      inbox: parsed.inbox?.length ? parsed.inbox : DEFAULT_STATE.inbox,
      campaigns: parsed.campaigns?.length ? parsed.campaigns : DEFAULT_STATE.campaigns,
      credits: typeof parsed.credits === 'number' ? parsed.credits : DEFAULT_STATE.credits,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoredState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const addCredits = (hours: number) => {
    setState((prev) => ({ ...prev, credits: Number((prev.credits + hours).toFixed(1)) }));
  };

  const addProject = (project: Omit<Project, 'id' | 'lastUpdated'>): Project => {
    const created: Project = {
      ...project,
      id: String(Date.now()),
      lastUpdated: 'Just now',
    };
    setState((prev) => ({ ...prev, projects: [created, ...prev.projects] }));
    return created;
  };

  const addInsight = (insight: Omit<InsightItem, 'id' | 'timestamp'>) => {
    const created: InsightItem = {
      ...insight,
      id: `i-${Date.now()}`,
      timestamp: 'Today',
    };
    setState((prev) => ({ ...prev, insights: [created, ...prev.insights] }));
  };

  const promoteInsightToTask = (insightId: string) => {
    setState((prev) => {
      const target = prev.insights.find((item) => item.id === insightId);
      if (!target || target.promotedToTask) return prev;
      const study = prev.projects.find((p) => p.id === target.projectId);
      const newTask: ResearchTask = {
        id: `tk-${Date.now()}`,
        title: `Follow up: ${target.title}`,
        studyName: study?.name || 'Active Study',
        assignee: 'Elena Rodriguez',
        dueDate: 'Next Week',
        priority: target.severity === 'Critical' ? 'High' : 'Medium',
        completed: false,
      };
      return {
        ...prev,
        insights: prev.insights.map((item) =>
          item.id === insightId ? { ...item, promotedToTask: true } : item
        ),
        tasks: [newTask, ...prev.tasks],
      };
    });
  };

  const toggleParticipantShortlist = (participantId: string) => {
    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === participantId ? { ...p, shortlisted: !p.shortlisted } : p
      ),
    }));
  };

  const addParticipant = (
    p: Omit<Participant, 'id' | 'joined' | 'avatar' | 'sessionsCompleted' | 'shortlisted'>
  ) => {
    const avatars = [ASSETS.avatarSarah, ASSETS.avatarMarcus, ASSETS.avatarElena];
    const created: Participant = {
      ...p,
      id: `p-${Date.now()}`,
      joined: 'Today',
      avatar: avatars[state.participants.length % avatars.length],
      sessionsCompleted: 0,
      shortlisted: true,
    };
    setState((prev) => ({ ...prev, participants: [created, ...prev.participants] }));
  };

  const addSession = (s: Omit<ResearchSession, 'id' | 'participantAvatar' | 'highlightsCount'>) => {
    const matched = state.participants.find((p) => p.name === s.participantName);
    const created: ResearchSession = {
      ...s,
      id: `s-${Date.now()}`,
      participantAvatar: matched?.avatar || ASSETS.avatarSarah,
      highlightsCount: 0,
    };
    setState((prev) => ({ ...prev, sessions: [created, ...prev.sessions] }));
  };

  const addTask = (t: Omit<ResearchTask, 'id' | 'completed'>) => {
    const created: ResearchTask = {
      ...t,
      id: `tk-${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({ ...prev, tasks: [created, ...prev.tasks] }));
  };

  const toggleTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const markThreadRead = (threadId: string) => {
    setState((prev) => ({
      ...prev,
      inbox: prev.inbox.map((m) => (m.id === threadId ? { ...m, unread: false } : m)),
    }));
  };

  const replyToThread = (threadId: string, body: string) => {
    if (!body.trim()) return;
    setState((prev) => ({
      ...prev,
      inbox: prev.inbox.map((m) =>
        m.id === threadId
          ? {
              ...m,
              unread: false,
              timestamp: 'Just now',
              preview: body.trim(),
              messages: [
                ...m.messages,
                {
                  id: `msg-${Date.now()}`,
                  author: 'You',
                  time: 'Just now',
                  body: body.trim(),
                  isSelf: true,
                },
              ],
            }
          : m
      ),
    }));
  };

  const addInboxThread = (recipient: string, subject: string, studyName: string, body: string) => {
    const created: InboxMessage = {
      id: `m-${Date.now()}`,
      senderName: recipient,
      senderRole: `Participant · ${studyName}`,
      senderAvatar: ASSETS.avatarElena,
      subject,
      studyName,
      preview: body,
      timestamp: 'Just now',
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          author: 'You',
          time: 'Just now',
          body,
          isSelf: true,
        },
      ],
    };
    setState((prev) => ({ ...prev, inbox: [created, ...prev.inbox] }));
  };

  const inviteTeamMember = (email: string, role: TeamMember['role']) => {
    const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const avatars = [ASSETS.avatarSarah, ASSETS.avatarMarcus, ASSETS.avatarElena];
    const created: TeamMember = {
      id: `t-${Date.now()}`,
      name: formattedName || 'New Researcher',
      role,
      title: role === 'Admin' ? 'Research Lead' : role === 'Editor' ? 'UX Researcher' : 'Product Stakeholder',
      email,
      status: 'Invited',
      lastActive: 'Invite sent',
      avatar: avatars[state.teamMembers.length % avatars.length],
    };
    setState((prev) => ({ ...prev, teamMembers: [...prev.teamMembers, created] }));
  };

  const updateTeamRole = (memberId: string, role: TeamMember['role']) => {
    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
  };

  const addCampaign = (
    campaign: Omit<RecruitingCampaign, 'id' | 'code' | 'invited' | 'screened' | 'confirmed'>
  ) => {
    const code = `CMP-${Math.floor(140 + Math.random() * 800)}`;
    const created: RecruitingCampaign = {
      ...campaign,
      id: `c-${Date.now()}`,
      code,
      invited: 180,
      screened: 12,
      confirmed: 4,
    };
    setState((prev) => ({ ...prev, campaigns: [created, ...prev.campaigns] }));
  };

  return (
    <ResearchContext.Provider
      value={{
        ...state,
        addCredits,
        addProject,
        addInsight,
        promoteInsightToTask,
        toggleParticipantShortlist,
        addParticipant,
        addSession,
        addTask,
        toggleTask,
        markThreadRead,
        replyToThread,
        addInboxThread,
        inviteTeamMember,
        updateTeamRole,
        addCampaign,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useResearch = (): ResearchContextValue => {
  const ctx = useContext(ResearchContext);
  if (!ctx) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return ctx;
};
