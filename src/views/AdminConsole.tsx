import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  HardDrive,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Sliders,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROOT_ADMIN_EMAIL } from '../contexts/AuthContextInstance';
import {
  useResearch,
  type DataResidencyRegion,
} from '../contexts/ResearchContext';
import type { Project, ResearchSession } from '../data/mockData';

type AdminTab = 'governance' | 'studies' | 'sessions' | 'panel' | 'access';

interface PendingDelete {
  label: string;
  description: string;
  onConfirm: () => void | Promise<void>;
}

const DATA_RESIDENCY_OPTIONS: DataResidencyRegion[] = [
  'EU-West (London)',
  'EU-Central (Frankfurt)',
  'UK-South',
];

function shortUid(uid?: string): string {
  if (!uid) return 'Local';
  return uid.length > 12 ? `${uid.slice(0, 6)}…${uid.slice(-4)}` : uid;
}

const AdminConsole: React.FC = () => {
  const { currentUser, isAdmin, isRootAdmin } = useAuth();
  const {
    projects,
    insights,
    sessions,
    participants,
    tasks,
    driveExports,
    workspaceSettings,
    adminAccounts,
    credits,
    isCloudSynced,
    updateWorkspaceSettings,
    setSynthesisHoursPool,
    updateProjectStatus,
    deleteProject,
    deleteInsight,
    updateSessionStatus,
    deleteSession,
    deleteParticipant,
    toggleTask,
    deleteTask,
    deleteDriveExport,
    grantAdminAccess,
    revokeAdminAccess,
  } = useResearch();

  const [activeTab, setActiveTab] = useState<AdminTab>('governance');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [customHours, setCustomHours] = useState<string>(() => credits.toFixed(1));
  const [copiedUid, setCopiedUid] = useState(false);

  // Grant delegated admin form
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [grantingAdmin, setGrantingAdmin] = useState(false);

  // Custom destructive confirmation modal
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const showNotice = (msg: string) => {
    setErrorFeedback(null);
    setStatusFeedback(msg);
  };

  const showError = (msg: string) => {
    setStatusFeedback(null);
    setErrorFeedback(msg);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-16">
        <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-8 space-y-5 text-center">
          <div className="w-12 h-12 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] flex items-center justify-center mx-auto text-[var(--sys-on-surface-secondary)]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[var(--sys-on-surface)]">
              Administrator Access Required
            </h1>
            <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
              The Admin Control Centre is restricted to verified workspace administrators. Sign in
              with an authorised Google account to manage global governance policies, lifecycle
              overrides, and workspace records.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 text-xs sys-btn-primary no-underline"
            >
              Return to Overview
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleToggleSetting = async (
    key:
      | 'samlSsoEnforced'
      | 'privacyShieldDefault'
      | 'britishSpellingDefault'
      | 'autoCorrectEnabledDefault',
    nextVal: boolean,
    label: string
  ) => {
    setSavingPolicy(true);
    try {
      await updateWorkspaceSettings({ [key]: nextVal });
      showNotice(`${label} ${nextVal ? 'enabled' : 'disabled'} across the workspace.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to update governance policy.');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleResidencyChange = async (region: DataResidencyRegion) => {
    setSavingPolicy(true);
    try {
      await updateWorkspaceSettings({ dataResidency: region });
      showNotice(`Primary data residency updated to ${region}.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to update data residency.');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleApplyHours = async (targetHours: number) => {
    if (Number.isNaN(targetHours) || targetHours < 0 || targetHours > 10000) {
      showError('Synthesis hours must be between 0 and 10,000.');
      return;
    }
    setSavingPolicy(true);
    try {
      await setSynthesisHoursPool(targetHours);
      setCustomHours(targetHours.toFixed(1));
      showNotice(`Workspace synthesis hours pool set to ${targetHours.toFixed(1)}h.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to update synthesis hours pool.');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid.trim() || !newAdminEmail.trim() || !newAdminName.trim()) return;
    setGrantingAdmin(true);
    try {
      await grantAdminAccess(newAdminUid.trim(), newAdminEmail.trim(), newAdminName.trim());
      setNewAdminUid('');
      setNewAdminEmail('');
      setNewAdminName('');
      showNotice('Delegated administrator privileges granted and persisted in Firestore.');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to grant admin privileges.');
    } finally {
      setGrantingAdmin(false);
    }
  };

  const handleCopyUid = async () => {
    if (!currentUser?.uid) return;
    try {
      await navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const confirmAndExecute = async () => {
    if (!pendingDelete) return;
    const action = pendingDelete;
    setPendingDelete(null);
    try {
      await action.onConfirm();
      showNotice(`${action.label} completed.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Action failed.');
    }
  };

  const openTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--sys-primary)] font-semibold">
            {isRootAdmin ? 'Root Administrator · Full Workspace Authority' : 'Delegated Administrator'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)] mt-1">
            Admin Control Centre
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Enforce security policies, override study lifecycles, moderate records across all owners,
            and authorise delegated administrators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3 py-2 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)] text-xs">
            <span className="text-[var(--sys-on-surface-tertiary)]">Signed in: </span>
            <span className="font-semibold text-[var(--sys-on-surface)]">
              {currentUser?.email}
            </span>
          </div>
          {currentUser?.uid && (
            <button
              type="button"
              onClick={() => void handleCopyUid()}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs sys-btn-secondary cursor-pointer"
              title="Copy your Firebase UID"
            >
              {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="font-mono">{copiedUid ? 'UID Copied' : shortUid(currentUser.uid)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {(statusFeedback || errorFeedback) && (
        <div
          role="status"
          className="px-4 py-3 rounded-[var(--sys-radius-md)] border flex items-center justify-between gap-3 text-xs font-medium"
          style={
            errorFeedback
              ? {
                  backgroundColor: 'var(--sys-danger-bg)',
                  borderColor: 'var(--sys-danger-fg)',
                  color: 'var(--sys-danger-fg)',
                }
              : {
                  backgroundColor: 'var(--sys-success-bg)',
                  borderColor: 'var(--sys-success-fg)',
                  color: 'var(--sys-success-fg)',
                }
          }
        >
          <span>{errorFeedback || statusFeedback}</span>
          <button
            type="button"
            onClick={() => {
              setStatusFeedback(null);
              setErrorFeedback(null);
            }}
            aria-label="Dismiss notification"
            className="p-1 opacity-80 hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4-Column Workspace KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Workspace Studies
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {projects.length}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            {projects.filter((p) => p.status === 'Live').length} live ·{' '}
            {projects.filter((p) => p.status === 'Completed').length} completed
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Sessions & Insights
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {sessions.length} / {insights.length}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            Full cross-owner visibility
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Panellists & Actions
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {participants.length} / {openTasksCount}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            {driveExports.length} Drive audit logs
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Synthesis Pool
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-primary)] mt-1.5">
            {credits.toFixed(1)}h
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            {isCloudSynced ? 'Firestore UK/EU live' : 'Local preview'}
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div
        role="tablist"
        aria-label="Admin control sections"
        className="flex flex-wrap items-center gap-1.5 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] w-fit max-w-full"
      >
        {(
          [
            { id: 'governance', label: 'Governance Policies', icon: Sliders },
            { id: 'studies', label: `Studies (${projects.length})`, icon: ShieldCheck },
            { id: 'sessions', label: `Sessions & Insights`, icon: Shield },
            { id: 'panel', label: `Panellists & Tasks`, icon: UserCheck },
            { id: 'access', label: `Drive Audit & Admins`, icon: HardDrive },
          ] as const
        ).map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs rounded-[var(--sys-radius-sm)] transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] font-semibold shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)] font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GOVERNANCE POLICIES */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  Global Security & Quality Controls
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                  Persisted to Firestore <span className="font-mono">workspaceSettings/global</span>
                  . Last updated by {workspaceSettings.updatedBy}.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[var(--sys-outline-variant)]">
              <PolicyRow
                title="SAML SSO Enforcement"
                description="Require enterprise single sign-on verification for team workspace access."
                enabled={workspaceSettings.samlSsoEnforced}
                disabled={savingPolicy}
                onToggle={(next) =>
                  void handleToggleSetting('samlSsoEnforced', next, 'SAML SSO Enforcement')
                }
              />
              <PolicyRow
                title="Mandatory Privacy Shield Default"
                description="Enable client-side PII masking automatically for every newly created study."
                enabled={workspaceSettings.privacyShieldDefault}
                disabled={savingPolicy}
                onToggle={(next) =>
                  void handleToggleSetting(
                    'privacyShieldDefault',
                    next,
                    'Privacy Shield Default'
                  )
                }
              />
              <PolicyRow
                title="British English Audit Standard"
                description="Enforce UK spelling rules across discussion guide composers and script audits."
                enabled={workspaceSettings.britishSpellingDefault}
                disabled={savingPolicy}
                onToggle={(next) =>
                  void handleToggleSetting(
                    'britishSpellingDefault',
                    next,
                    'British English Audit Standard'
                  )
                }
              />
              <PolicyRow
                title="Auto-Correct Spelling by Default"
                description="Automatically correct detected misspellings as researchers type in script editors."
                enabled={workspaceSettings.autoCorrectEnabledDefault}
                disabled={savingPolicy}
                onToggle={(next) =>
                  void handleToggleSetting(
                    'autoCorrectEnabledDefault',
                    next,
                    'Auto-Correct Default'
                  )
                }
              />
            </div>
          </section>

          <div className="lg:col-span-5 space-y-6">
            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[var(--sys-on-surface)]">
                  Data Residency Policy
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  Designate the primary UK/EU compliance zone displayed to team members and
                  auditors.
                </p>
              </div>
              <div className="space-y-2">
                {DATA_RESIDENCY_OPTIONS.map((region) => {
                  const selected = workspaceSettings.dataResidency === region;
                  return (
                    <button
                      key={region}
                      type="button"
                      disabled={savingPolicy}
                      onClick={() => void handleResidencyChange(region)}
                      className={`w-full px-3.5 py-2.5 text-left text-xs rounded-[var(--sys-radius-sm)] border flex items-center justify-between cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)] font-semibold'
                          : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                      }`}
                    >
                      <span>{region}</span>
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[var(--sys-on-surface)]">
                  Synthesis Hours Quota Management
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  Directly allocate or adjust workspace synthesis hours without billing prompts.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={savingPolicy}
                  onClick={() => void handleApplyHours(credits + 10)}
                  className="px-3 py-1.5 text-xs font-semibold sys-btn-secondary cursor-pointer"
                >
                  +10h
                </button>
                <button
                  type="button"
                  disabled={savingPolicy}
                  onClick={() => void handleApplyHours(credits + 50)}
                  className="px-3 py-1.5 text-xs font-semibold sys-btn-secondary cursor-pointer"
                >
                  +50h
                </button>
                <button
                  type="button"
                  disabled={savingPolicy}
                  onClick={() => void handleApplyHours(100)}
                  className="px-3 py-1.5 text-xs font-semibold sys-btn-secondary cursor-pointer"
                >
                  Reset to 100h
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleApplyHours(Number(customHours));
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10000"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  aria-label="Custom synthesis hours quota"
                  className="flex-1 h-9 px-3 text-xs font-mono sys-input"
                />
                <button
                  type="submit"
                  disabled={savingPolicy}
                  className="h-9 px-4 text-xs sys-btn-primary cursor-pointer whitespace-nowrap"
                >
                  Set Quota
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      {/* TAB 2: STUDIES & LIFECYCLE OVERRIDES */}
      {activeTab === 'studies' && (
        <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="p-5 border-b border-[var(--sys-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                All Workspace Studies
              </h2>
              <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                Administrators can override terminal <span className="font-mono">Completed</span>{' '}
                locks, reopen studies, or permanently delete records across any owner.
              </p>
            </div>
            <Link
              to="/dashboard/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sys-btn-primary no-underline whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Study</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] tabular-nums">
              <thead>
                <tr className="border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]/60 text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                  <th className="py-3 px-5">Study</th>
                  <th className="py-3 px-4">Owner UID</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Lifecycle Override</th>
                  <th className="py-3 px-4 text-right">Neutrality</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sys-outline-variant)] text-sm">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--sys-surface-low)]/50">
                    <td className="py-3.5 px-5">
                      <Link
                        to={`/dashboard/projects/${project.id}/insights`}
                        className="font-semibold text-[var(--sys-on-surface)] hover:text-[var(--sys-primary)] no-underline block"
                      >
                        {project.name}
                      </Link>
                      <span className="text-xs text-[var(--sys-on-surface-tertiary)]">
                        {project.participants}/{project.targetParticipants} participants · Updated{' '}
                        {project.lastUpdated}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[var(--sys-on-surface-secondary)]">
                      {shortUid(project.ownerId)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--sys-on-surface-secondary)]">
                      {project.method}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={project.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value as Project['status'];
                          updateProjectStatus(project.id, nextStatus);
                          showNotice(`Study "${project.name}" status changed to ${nextStatus}.`);
                        }}
                        aria-label={`Change status for ${project.name}`}
                        className="h-8 px-2.5 text-xs font-semibold sys-input"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--sys-on-surface)]">
                      {project.neutralityScore}%
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/dashboard/projects/${project.id}/insights`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs sys-btn-secondary no-underline"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingDelete({
                              label: `Delete study "${project.name}"`,
                              description:
                                'This permanently removes the study document from Firestore. Associated insights or sessions will no longer reference an active study.',
                              onConfirm: () => deleteProject(project.id),
                            })
                          }
                          aria-label={`Delete study ${project.name}`}
                          className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-xs text-[var(--sys-on-surface-tertiary)]"
                    >
                      No studies found in the workspace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: SESSIONS & INSIGHTS MODERATION */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Workspace Sessions ({sessions.length})
              </h2>
              <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                Override session states (including reopening completed recordings) or remove
                sessions.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] tabular-nums">
                <thead>
                  <tr className="border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]/60 text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                    <th className="py-3 px-5">Session / Study</th>
                    <th className="py-3 px-4">Panellist</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Status Override</th>
                    <th className="py-3 px-5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sys-outline-variant)] text-sm">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-[var(--sys-surface-low)]/50">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-[var(--sys-on-surface)]">
                          {session.studyName}
                        </p>
                        <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                          {session.scheduledAt} · {session.duration}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[var(--sys-on-surface-secondary)]">
                        {session.participantName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[var(--sys-on-surface-tertiary)]">
                        {shortUid(session.ownerId)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={session.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as ResearchSession['status'];
                            updateSessionStatus(session.id, nextStatus);
                            showNotice(`Session status updated to ${nextStatus}.`);
                          }}
                          aria-label={`Change status for ${session.studyName}`}
                          className="h-8 px-2.5 text-xs font-semibold sys-input"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Live">Live</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setPendingDelete({
                              label: `Delete session with ${session.participantName}`,
                              description:
                                'This permanently deletes the session record from Firestore.',
                              onConfirm: () => deleteSession(session.id),
                            })
                          }
                          aria-label={`Delete session ${session.id}`}
                          className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-xs text-[var(--sys-on-surface-tertiary)]"
                      >
                        No sessions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Synthesised Insights ({insights.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {insights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--sys-surface-low)]/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                      {ins.title}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5 line-clamp-2">
                      {ins.description}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--sys-on-surface-tertiary)] mt-1">
                      {ins.severity} · {ins.mentions} mentions · Owner: {shortUid(ins.ownerId)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        label: `Delete insight "${ins.title}"`,
                        description:
                          'This permanently deletes this insight from the workspace repository.',
                        onConfirm: () => deleteInsight(ins.id),
                      })
                    }
                    aria-label={`Delete insight ${ins.title}`}
                    className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {insights.length === 0 && (
                <p className="py-8 text-center text-xs text-[var(--sys-on-surface-tertiary)]">
                  No insights stored in the workspace.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: PANELLISTS & TASKS */}
      {activeTab === 'panel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-6 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Customer Panellists ({participants.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="p-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-[var(--sys-surface-low)]/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] truncate">
                      {p.role} · {p.company}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--sys-on-surface-tertiary)] mt-0.5">
                      {p.reliability}% reliability · Owner: {shortUid(p.ownerId)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        label: `Remove panellist "${p.name}"`,
                        description:
                          'This permanently deletes the panellist record from Firestore (GDPR right to erasure).',
                        onConfirm: () => deleteParticipant(p.id),
                      })
                    }
                    aria-label={`Remove panellist ${p.name}`}
                    className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {participants.length === 0 && (
                <p className="py-8 text-center text-xs text-[var(--sys-on-surface-tertiary)]">
                  No panellists recorded.
                </p>
              )}
            </div>
          </section>

          <section className="lg:col-span-6 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Action Items ({tasks.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 sm:px-5 flex items-start justify-between gap-3 hover:bg-[var(--sys-surface-low)]/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: 'var(--sys-success-fg)' }}
                      />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--sys-on-surface-tertiary)]" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-[var(--sys-on-surface-tertiary)]'
                            : 'text-[var(--sys-on-surface)]'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                        {task.assignee} · {task.priority} · Due {task.dueDate}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        label: `Delete action item "${task.title}"`,
                        description: 'This permanently deletes the task from Firestore.',
                        onConfirm: () => deleteTask(task.id),
                      })
                    }
                    aria-label={`Delete task ${task.title}`}
                    className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="py-8 text-center text-xs text-[var(--sys-on-surface-tertiary)]">
                  No action items in the workspace.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: DRIVE AUDIT & DELEGATED ADMINS */}
      {activeTab === 'access' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Admin Access Control */}
          <section className="lg:col-span-6 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Authorised Administrators
              </h2>
              <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                Enforced server-side by Firestore Security Rules.
              </p>
            </div>

            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {/* Root Admin (immutable) */}
              <div className="p-5 flex items-center justify-between gap-4 bg-[var(--sys-surface-low)]/40">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                    Rolan Bacalla
                  </p>
                  <p className="text-xs font-mono text-[var(--sys-on-surface-secondary)] truncate">
                    {ROOT_ADMIN_EMAIL}
                  </p>
                  <p className="text-[11px] text-[var(--sys-primary)] font-semibold mt-1">
                    Permanent Root Admin · Verified Email Rule
                  </p>
                </div>
                <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] shrink-0">
                  Locked
                </span>
              </div>

              {adminAccounts.map((admin) => (
                <div
                  key={admin.uid}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                      {admin.displayName}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] truncate">
                      {admin.email}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--sys-on-surface-tertiary)] mt-0.5">
                      UID: {admin.uid} · Granted by {admin.grantedBy}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        label: `Revoke admin access for ${admin.displayName}`,
                        description:
                          'This deletes their record from the Firestore /admins collection and immediately removes administrator write privileges.',
                        onConfirm: () => revokeAdminAccess(admin.uid),
                      })
                    }
                    className="px-3 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] cursor-pointer shrink-0"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>

            {/* Grant Delegated Admin Form */}
            <form
              onSubmit={(e) => void handleGrantAdmin(e)}
              className="p-5 border-t border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]/40 space-y-3"
            >
              <h3 className="text-xs font-bold text-[var(--sys-on-surface)]">
                Grant Delegated Administrator Rights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Full name"
                  aria-label="Admin display name"
                  className="h-9 px-3 text-xs sys-input"
                />
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Verified Google email"
                  aria-label="Admin email address"
                  className="h-9 px-3 text-xs sys-input"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={newAdminUid}
                  onChange={(e) => setNewAdminUid(e.target.value)}
                  placeholder="Firebase Auth UID (letters, numbers, _ or -)"
                  aria-label="Firebase Auth UID"
                  className="flex-1 h-9 px-3 text-xs font-mono sys-input"
                />
                <button
                  type="submit"
                  disabled={grantingAdmin}
                  className="h-9 px-4 text-xs sys-btn-primary cursor-pointer whitespace-nowrap"
                >
                  {grantingAdmin ? 'Granting…' : 'Authorise Admin'}
                </button>
              </div>
            </form>
          </section>

          {/* Drive Audit Trail */}
          <section className="lg:col-span-6 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)]">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Google Drive Audit Trail ({driveExports.length})
              </h2>
              <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                Immutable export and import logs. Administrators may purge obsolete entries.
              </p>
            </div>

            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {driveExports.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-[var(--sys-surface-low)]/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                      {rec.fileName}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] truncate">
                      {rec.studyName} · {rec.action}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--sys-on-surface-tertiary)] mt-0.5">
                      Owner: {shortUid(rec.ownerId)} · {rec.createdAtLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        label: `Purge Drive audit log "${rec.fileName}"`,
                        description:
                          'This permanently deletes the audit log entry from Firestore.',
                        onConfirm: () => deleteDriveExport(rec.id),
                      })
                    }
                    aria-label={`Purge Drive log ${rec.fileName}`}
                    className="w-8 h-8 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {driveExports.length === 0 && (
                <p className="py-10 text-center text-xs text-[var(--sys-on-surface-tertiary)]">
                  No Google Drive export or import audit records logged yet.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setPendingDelete(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-[var(--sys-radius-sm)] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'var(--sys-danger-bg)',
                  color: 'var(--sys-danger-fg)',
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2
                  id="confirm-delete-title"
                  className="text-base font-bold text-[var(--sys-on-surface)]"
                >
                  {pendingDelete.label}?
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed">
                  {pendingDelete.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmAndExecute()}
                className="px-4 py-2 text-xs font-semibold rounded-[var(--sys-radius-sm)] cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: 'var(--sys-danger-fg)',
                  color: '#ffffff',
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PolicyRowProps {
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (nextValue: boolean) => void;
}

const PolicyRow: React.FC<PolicyRowProps> = ({
  title,
  description,
  enabled,
  disabled,
  onToggle,
}) => (
  <div className="p-5 flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--sys-on-surface)]">{title}</p>
      <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onToggle(!enabled)}
      className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-[var(--sys-radius-sm)] border transition-colors cursor-pointer shrink-0 ${
        enabled
          ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
          : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-tertiary)]'
      }`}
    >
      {enabled ? 'Enabled' : 'Disabled'}
    </button>
  </div>
);

export default AdminConsole;
