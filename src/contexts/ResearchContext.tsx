import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../hooks/useAuth';
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
  resolveAvatarUrl,
  type Project,
  type InsightItem,
  type Participant,
  type TeamMember,
  type ResearchSession,
  type ResearchTask,
  type InboxMessage,
  type RecruitingCampaign,
} from '../data/mockData';

export interface DriveAuditRecord {
  id: string;
  driveFileId: string;
  fileName: string;
  mimeType: string;
  action: 'export_brief' | 'import_script' | 'attach_artifact';
  studyName: string;
  webViewLink: string;
  createdAtLabel: string;
}

interface ResearchContextValue {
  projects: Project[];
  insights: InsightItem[];
  participants: Participant[];
  teamMembers: TeamMember[];
  sessions: ResearchSession[];
  tasks: ResearchTask[];
  inbox: InboxMessage[];
  campaigns: RecruitingCampaign[];
  driveExports: DriveAuditRecord[];
  credits: number;
  isCloudSynced: boolean;
  cloudError: string | null;
  addCredits: (hours: number) => void;
  addProject: (project: Omit<Project, 'id' | 'lastUpdated'>) => Project;
  addInsight: (insight: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  promoteInsightToTask: (insightId: string) => void;
  toggleParticipantShortlist: (participantId: string) => void;
  addParticipant: (
    p: Omit<Participant, 'id' | 'joined' | 'avatar' | 'sessionsCompleted' | 'shortlisted'>
  ) => void;
  addSession: (s: Omit<ResearchSession, 'id' | 'participantAvatar' | 'highlightsCount'>) => void;
  addTask: (t: Omit<ResearchTask, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  markThreadRead: (threadId: string) => void;
  replyToThread: (threadId: string, body: string) => void;
  addInboxThread: (recipient: string, subject: string, studyName: string, body: string) => void;
  inviteTeamMember: (email: string, role: TeamMember['role']) => void;
  updateTeamRole: (memberId: string, role: TeamMember['role']) => void;
  addCampaign: (
    campaign: Omit<RecruitingCampaign, 'id' | 'code' | 'invited' | 'screened' | 'confirmed'>
  ) => void;
  logDriveExport: (record: Omit<DriveAuditRecord, 'id' | 'createdAtLabel'>) => void;
}

const STORAGE_KEY = 'lyndaplus_workspace_state_v3';

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
  driveExports: DriveAuditRecord[];
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
  driveExports: [],
  credits: 12.4,
};

function sanitizeId(prefix: string): string {
  const rand = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').slice(0, 6);
  return `${prefix}_${Date.now()}_${rand}`;
}

function clampStr(value: string | undefined, maxLen: number, fallback = ''): string {
  const s = (value ?? fallback).trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function loadLocalState(): StoredState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    const participants = (
      parsed.participants?.length ? parsed.participants : DEFAULT_STATE.participants
    ).map((p) => ({ ...p, avatar: resolveAvatarUrl(p.avatar, p.name) }));
    const teamMembers = (
      parsed.teamMembers?.length ? parsed.teamMembers : DEFAULT_STATE.teamMembers
    ).map((m) => ({ ...m, avatar: resolveAvatarUrl(m.avatar, m.name) }));
    const sessions = (parsed.sessions?.length ? parsed.sessions : DEFAULT_STATE.sessions).map(
      (s) => ({ ...s, participantAvatar: resolveAvatarUrl(s.participantAvatar, s.participantName) })
    );
    const inbox = (parsed.inbox?.length ? parsed.inbox : DEFAULT_STATE.inbox).map((msg) => ({
      ...msg,
      senderAvatar: resolveAvatarUrl(msg.senderAvatar, msg.senderName),
    }));

    return {
      projects: parsed.projects?.length ? parsed.projects : DEFAULT_STATE.projects,
      insights: parsed.insights?.length ? parsed.insights : DEFAULT_STATE.insights,
      participants,
      teamMembers,
      sessions,
      tasks: parsed.tasks?.length ? parsed.tasks : DEFAULT_STATE.tasks,
      inbox,
      campaigns: parsed.campaigns?.length ? parsed.campaigns : DEFAULT_STATE.campaigns,
      driveExports: Array.isArray(parsed.driveExports) ? parsed.driveExports : [],
      credits: typeof parsed.credits === 'number' ? parsed.credits : DEFAULT_STATE.credits,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isDemoMode } = useAuth();
  const [state, setState] = useState<StoredState>(loadLocalState);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const seededUidRef = useRef<string | null>(null);

  const isRealFirebaseUser = Boolean(
    currentUser && !isDemoMode && currentUser.uid && currentUser.uid !== 'demo-user-123'
  );
  const activeUid = isRealFirebaseUser && currentUser ? currentUser.uid : null;

  // Persist local demo state only when not cloud synced
  useEffect(() => {
    if (isRealFirebaseUser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, isRealFirebaseUser]);

  // Attach real-time Firestore listeners & seed starter workspace when signed in with Google
  useEffect(() => {
    if (!activeUid) return;

    let cancelled = false;
    const uidPrefix = activeUid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);

    const seedIfEmpty = async () => {
      if (seededUidRef.current === activeUid) return;
      seededUidRef.current = activeUid;

      try {
        const existingProjects = await getDocs(
          query(collection(db, 'projects'), where('ownerId', '==', activeUid))
        );
        if (cancelled || !existingProjects.empty) return;

        // 1. Seed projects first so relational ownsProject(projectId) passes for insights & sessions
        const projectIdMap = new Map<string, string>();
        await Promise.all(
          mockProjects.map(async (proj) => {
            const docId = `${uidPrefix}_proj_${proj.id}`;
            projectIdMap.set(proj.id, docId);
            await setDoc(doc(db, 'projects', docId), {
              ownerId: activeUid,
              name: clampStr(proj.name, 160),
              method: proj.method,
              status: proj.status,
              participants: proj.participants,
              targetParticipants: Math.max(1, proj.targetParticipants),
              timeToInsight: clampStr(proj.timeToInsight, 40, '—'),
              neutralityScore: Math.min(100, Math.max(0, proj.neutralityScore)),
              completionRate: Math.min(100, Math.max(0, proj.completionRate)),
              lastUpdated: clampStr(proj.lastUpdated, 64, 'Just now'),
              objective: clampStr(proj.objective, 1000),
              primaryQuestion: clampStr(proj.primaryQuestion, 1000),
              privacyShieldEnabled: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          })
        );

        if (cancelled) return;

        // 2. Seed insights, sessions, participants, tasks in parallel
        await Promise.all([
          ...mockInsights.map((ins) => {
            const mappedProjectId =
              projectIdMap.get(ins.projectId) || `${uidPrefix}_proj_1`;
            return setDoc(doc(db, 'insights', `${uidPrefix}_${ins.id}`), {
              ownerId: activeUid,
              projectId: mappedProjectId,
              title: clampStr(ins.title, 200),
              description: clampStr(ins.description, 1500),
              severity: ins.severity,
              timestamp: clampStr(ins.timestamp, 64, 'Today'),
              clipTime: clampStr(ins.clipTime, 20, '00:00'),
              participantName: clampStr(ins.participantName, 120, 'Participant'),
              mentions: Math.max(1, ins.mentions),
              promotedToTask: Boolean(ins.promotedToTask),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }),
          ...mockSessions.map((sess) => {
            const mappedProjectId =
              projectIdMap.get(sess.projectId) || `${uidPrefix}_proj_1`;
            return setDoc(doc(db, 'sessions', `${uidPrefix}_${sess.id}`), {
              ownerId: activeUid,
              projectId: mappedProjectId,
              studyName: clampStr(sess.studyName, 160),
              participantName: clampStr(sess.participantName, 120),
              participantRole: clampStr(sess.participantRole, 120),
              scheduledAt: clampStr(sess.scheduledAt, 80),
              duration: clampStr(sess.duration, 40),
              status: sess.status,
              privacyShield: Boolean(sess.privacyShield),
              highlightsCount: Math.max(0, sess.highlightsCount),
              summary: clampStr(sess.summary, 1000),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }),
          ...mockParticipants.map((part) =>
            setDoc(doc(db, 'participants', `${uidPrefix}_${part.id}`), {
              ownerId: activeUid,
              name: clampStr(part.name, 120),
              age: Math.min(120, Math.max(18, part.age)),
              role: clampStr(part.role, 120),
              company: clampStr(part.company, 120),
              experience: clampStr(part.experience, 60),
              joined: clampStr(part.joined, 64),
              location: clampStr(part.location, 120),
              status: part.status,
              reliability: Math.min(100, Math.max(0, part.reliability)),
              sessionsCompleted: Math.max(0, part.sessionsCompleted),
              shortlisted: Boolean(part.shortlisted),
              tags: part.tags.slice(0, 10).map((t) => clampStr(t, 48)),
              recentNote: clampStr(part.recentNote, 600),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })
          ),
          ...mockTasks.map((tk) =>
            setDoc(doc(db, 'tasks', `${uidPrefix}_${tk.id}`), {
              ownerId: activeUid,
              title: clampStr(tk.title, 240),
              studyName: clampStr(tk.studyName, 160),
              assignee: clampStr(tk.assignee, 120),
              dueDate: clampStr(tk.dueDate, 40),
              priority: tk.priority,
              completed: Boolean(tk.completed),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            })
          ),
        ]);
      } catch (err) {
        if (!cancelled) {
          setCloudError(err instanceof Error ? err.message : String(err));
          handleFirestoreError(err, OperationType.WRITE, 'projects');
        }
      }
    };

    void seedIfEmpty();

    const unsubs: (() => void)[] = [];

    unsubs.push(
      onSnapshot(
        query(collection(db, 'projects'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: Project[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: String(data.name || 'Untitled Study'),
              method: (data.method as Project['method']) || 'Usability Study',
              status: (data.status as Project['status']) || 'Draft',
              participants: Number(data.participants || 0),
              targetParticipants: Number(data.targetParticipants || 10),
              timeToInsight: String(data.timeToInsight || '—'),
              neutralityScore: Number(data.neutralityScore || 90),
              completionRate: Number(data.completionRate || 0),
              lastUpdated: String(data.lastUpdated || 'Just now'),
              objective: String(data.objective || ''),
              primaryQuestion: String(data.primaryQuestion || ''),
            };
          });
          setCloudError(null);
          setState((prev) => ({ ...prev, projects: items }));
        },
        (error) => {
          setCloudError(error.message);
          handleFirestoreError(error, OperationType.LIST, 'projects');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'insights'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: InsightItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              projectId: String(data.projectId || ''),
              title: String(data.title || ''),
              description: String(data.description || ''),
              severity: (data.severity as InsightItem['severity']) || 'Opportunity',
              timestamp: String(data.timestamp || 'Today'),
              clipTime: String(data.clipTime || '00:00'),
              participantName: String(data.participantName || 'Participant'),
              mentions: Number(data.mentions || 1),
              promotedToTask: Boolean(data.promotedToTask),
            };
          });
          setState((prev) => ({ ...prev, insights: items }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'insights');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'sessions'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: ResearchSession[] = snap.docs.map((d) => {
            const data = d.data();
            const pName = String(data.participantName || 'Participant');
            return {
              id: d.id,
              projectId: String(data.projectId || ''),
              studyName: String(data.studyName || ''),
              participantName: pName,
              participantRole: String(data.participantRole || 'Verified Panellist'),
              participantAvatar: resolveAvatarUrl(undefined, pName),
              scheduledAt: String(data.scheduledAt || 'Upcoming'),
              duration: String(data.duration || '45 min'),
              status: (data.status as ResearchSession['status']) || 'Scheduled',
              privacyShield: Boolean(data.privacyShield),
              highlightsCount: Number(data.highlightsCount || 0),
              summary: String(data.summary || ''),
            };
          });
          setState((prev) => ({ ...prev, sessions: items }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'sessions');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'participants'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: Participant[] = snap.docs.map((d) => {
            const data = d.data();
            const pName = String(data.name || 'Panellist');
            return {
              id: d.id,
              name: pName,
              age: Number(data.age || 30),
              role: String(data.role || ''),
              company: String(data.company || ''),
              experience: String(data.experience || ''),
              joined: String(data.joined || 'Today'),
              location: String(data.location || ''),
              avatar: resolveAvatarUrl(undefined, pName),
              status: (data.status as Participant['status']) || 'Active',
              reliability: Number(data.reliability || 95),
              sessionsCompleted: Number(data.sessionsCompleted || 0),
              shortlisted: Boolean(data.shortlisted),
              tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
              recentNote: String(data.recentNote || ''),
            };
          });
          setState((prev) => ({ ...prev, participants: items }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'participants');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'tasks'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: ResearchTask[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: String(data.title || ''),
              studyName: String(data.studyName || ''),
              assignee: String(data.assignee || 'Elena Rodriguez'),
              dueDate: String(data.dueDate || 'Next Week'),
              priority: (data.priority as ResearchTask['priority']) || 'Medium',
              completed: Boolean(data.completed),
            };
          });
          setState((prev) => ({ ...prev, tasks: items }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'tasks');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'driveExports'), where('ownerId', '==', activeUid)),
        (snap) => {
          const items: DriveAuditRecord[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              driveFileId: String(data.driveFileId || ''),
              fileName: String(data.fileName || ''),
              mimeType: String(data.mimeType || ''),
              action: (data.action as DriveAuditRecord['action']) || 'export_brief',
              studyName: String(data.studyName || ''),
              webViewLink: String(data.webViewLink || ''),
              createdAtLabel: 'Synced to Firestore',
            };
          });
          setState((prev) => ({ ...prev, driveExports: items }));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'driveExports');
        }
      )
    );

    return () => {
      cancelled = true;
      unsubs.forEach((fn) => fn());
    };
  }, [activeUid]);

  const addCredits = (hours: number) => {
    setState((prev) => ({ ...prev, credits: Number((prev.credits + hours).toFixed(1)) }));
  };

  const addProject = (project: Omit<Project, 'id' | 'lastUpdated'>): Project => {
    const id = sanitizeId('proj');
    const created: Project = {
      ...project,
      id,
      lastUpdated: 'Just now',
    };

    if (activeUid) {
      const path = `projects/${id}`;
      void setDoc(doc(db, 'projects', id), {
        ownerId: activeUid,
        name: clampStr(project.name, 160, 'Untitled Study'),
        method: project.method,
        status: project.status,
        participants: Math.max(0, project.participants),
        targetParticipants: Math.max(1, project.targetParticipants),
        timeToInsight: clampStr(project.timeToInsight, 40, '—'),
        neutralityScore: Math.min(100, Math.max(0, project.neutralityScore)),
        completionRate: Math.min(100, Math.max(0, project.completionRate)),
        lastUpdated: 'Just now',
        objective: clampStr(project.objective, 1000),
        primaryQuestion: clampStr(project.primaryQuestion, 1000),
        privacyShieldEnabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, path));
    } else {
      setState((prev) => ({ ...prev, projects: [created, ...prev.projects] }));
    }

    return created;
  };

  const addInsight = (insight: Omit<InsightItem, 'id' | 'timestamp'>) => {
    const id = sanitizeId('ins');
    const created: InsightItem = {
      ...insight,
      id,
      timestamp: 'Today',
    };

    if (activeUid) {
      const path = `insights/${id}`;
      void setDoc(doc(db, 'insights', id), {
        ownerId: activeUid,
        projectId: clampStr(insight.projectId, 128),
        title: clampStr(insight.title, 200, 'Finding'),
        description: clampStr(insight.description, 1500, 'Observed behaviour'),
        severity: insight.severity,
        timestamp: 'Today',
        clipTime: clampStr(insight.clipTime, 20, '00:00'),
        participantName: clampStr(insight.participantName, 120, 'Researcher Note'),
        mentions: Math.max(1, insight.mentions),
        promotedToTask: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, path));
    } else {
      setState((prev) => ({ ...prev, insights: [created, ...prev.insights] }));
    }
  };

  const promoteInsightToTask = (insightId: string) => {
    const target = state.insights.find((item) => item.id === insightId);
    if (!target || target.promotedToTask) return;
    const study = state.projects.find((p) => p.id === target.projectId);
    const taskId = sanitizeId('task');
    const newTask: ResearchTask = {
      id: taskId,
      title: clampStr(`Follow up: ${target.title}`, 240),
      studyName: clampStr(study?.name || 'Active Study', 160),
      assignee: currentUser?.displayName || 'Elena Rodriguez',
      dueDate: 'Next Week',
      priority: target.severity === 'Critical' ? 'High' : 'Medium',
      completed: false,
    };

    if (activeUid) {
      void updateDoc(doc(db, 'insights', insightId), {
        promotedToTask: true,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `insights/${insightId}`));

      void setDoc(doc(db, 'tasks', taskId), {
        ownerId: activeUid,
        title: newTask.title,
        studyName: newTask.studyName,
        assignee: clampStr(newTask.assignee, 120),
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `tasks/${taskId}`));
    } else {
      setState((prev) => ({
        ...prev,
        insights: prev.insights.map((item) =>
          item.id === insightId ? { ...item, promotedToTask: true } : item
        ),
        tasks: [newTask, ...prev.tasks],
      }));
    }
  };

  const toggleParticipantShortlist = (participantId: string) => {
    const target = state.participants.find((p) => p.id === participantId);
    if (!target) return;

    if (activeUid) {
      void updateDoc(doc(db, 'participants', participantId), {
        shortlisted: !target.shortlisted,
        updatedAt: serverTimestamp(),
      }).catch((err) =>
        handleFirestoreError(err, OperationType.UPDATE, `participants/${participantId}`)
      );
    } else {
      setState((prev) => ({
        ...prev,
        participants: prev.participants.map((p) =>
          p.id === participantId ? { ...p, shortlisted: !p.shortlisted } : p
        ),
      }));
    }
  };

  const addParticipant = (
    p: Omit<Participant, 'id' | 'joined' | 'avatar' | 'sessionsCompleted' | 'shortlisted'>
  ) => {
    const id = sanitizeId('part');
    const avatars = [ASSETS.avatarSarah, ASSETS.avatarMarcus, ASSETS.avatarElena];
    const created: Participant = {
      ...p,
      id,
      joined: 'Today',
      avatar: avatars[state.participants.length % avatars.length],
      sessionsCompleted: 0,
      shortlisted: true,
    };

    if (activeUid) {
      void setDoc(doc(db, 'participants', id), {
        ownerId: activeUid,
        name: clampStr(p.name, 120, 'Participant'),
        age: Math.min(120, Math.max(18, p.age || 30)),
        role: clampStr(p.role, 120, 'Product Role'),
        company: clampStr(p.company, 120, 'Customer Account'),
        experience: clampStr(p.experience, 60, '5 years'),
        joined: 'Today',
        location: clampStr(p.location, 120, 'London, UK'),
        status: p.status,
        reliability: Math.min(100, Math.max(0, p.reliability || 95)),
        sessionsCompleted: 0,
        shortlisted: true,
        tags: (p.tags || []).slice(0, 10).map((t) => clampStr(t, 48)),
        recentNote: clampStr(p.recentNote, 600),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `participants/${id}`));
    } else {
      setState((prev) => ({ ...prev, participants: [created, ...prev.participants] }));
    }
  };

  const addSession = (
    s: Omit<ResearchSession, 'id' | 'participantAvatar' | 'highlightsCount'>
  ) => {
    const id = sanitizeId('sess');
    const matched = state.participants.find((p) => p.name === s.participantName);
    const created: ResearchSession = {
      ...s,
      id,
      participantAvatar: matched?.avatar || resolveAvatarUrl(undefined, s.participantName),
      highlightsCount: 0,
    };

    if (activeUid) {
      void setDoc(doc(db, 'sessions', id), {
        ownerId: activeUid,
        projectId: clampStr(s.projectId, 128),
        studyName: clampStr(s.studyName, 160, 'Study'),
        participantName: clampStr(s.participantName, 120, 'Participant'),
        participantRole: clampStr(s.participantRole, 120, 'Verified Panellist'),
        scheduledAt: clampStr(s.scheduledAt, 80, 'Upcoming'),
        duration: clampStr(s.duration, 40, '45 min'),
        status: s.status,
        privacyShield: Boolean(s.privacyShield),
        highlightsCount: 0,
        summary: clampStr(s.summary, 1000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `sessions/${id}`));
    } else {
      setState((prev) => ({ ...prev, sessions: [created, ...prev.sessions] }));
    }
  };

  const addTask = (t: Omit<ResearchTask, 'id' | 'completed'>) => {
    const id = sanitizeId('task');
    const created: ResearchTask = {
      ...t,
      id,
      completed: false,
    };

    if (activeUid) {
      void setDoc(doc(db, 'tasks', id), {
        ownerId: activeUid,
        title: clampStr(t.title, 240, 'Action Item'),
        studyName: clampStr(t.studyName, 160, 'Active Study'),
        assignee: clampStr(t.assignee, 120, 'Team'),
        dueDate: clampStr(t.dueDate, 40, 'This Week'),
        priority: t.priority,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `tasks/${id}`));
    } else {
      setState((prev) => ({ ...prev, tasks: [created, ...prev.tasks] }));
    }
  };

  const toggleTask = (taskId: string) => {
    const target = state.tasks.find((t) => t.id === taskId);
    if (!target) return;

    if (activeUid) {
      void updateDoc(doc(db, 'tasks', taskId), {
        completed: !target.completed,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`));
    } else {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      }));
    }
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
      title:
        role === 'Admin'
          ? 'Research Lead'
          : role === 'Editor'
          ? 'UX Researcher'
          : 'Product Stakeholder',
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

  const logDriveExport = (record: Omit<DriveAuditRecord, 'id' | 'createdAtLabel'>) => {
    const id = sanitizeId('drv');
    const created: DriveAuditRecord = {
      ...record,
      id,
      createdAtLabel: 'Just now',
    };

    if (activeUid) {
      void setDoc(doc(db, 'driveExports', id), {
        ownerId: activeUid,
        driveFileId: clampStr(record.driveFileId, 200, 'drive_file'),
        fileName: clampStr(record.fileName, 240, 'Research Brief'),
        mimeType: clampStr(record.mimeType, 160, 'application/vnd.google-apps.document'),
        action: record.action,
        studyName: clampStr(record.studyName, 160, 'Workspace'),
        webViewLink: clampStr(record.webViewLink, 500),
        createdAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `driveExports/${id}`));
    } else {
      setState((prev) => ({ ...prev, driveExports: [created, ...prev.driveExports] }));
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        ...state,
        isCloudSynced: isRealFirebaseUser,
        cloudError,
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
        logDriveExport,
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
