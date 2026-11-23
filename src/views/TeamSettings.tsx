import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Lock,
  Moon,
  ShieldCheck,
  Sun,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useResearch } from '../contexts/ResearchContext';
import { useTheme } from '../contexts/ThemeContext';
import type { TeamMember } from '../data/mockData';

const ROLE_GUIDE: { name: TeamMember['role']; desc: string }[] = [
  {
    name: 'Admin',
    desc: 'Full workspace authority: manage governance policies, data residency, lifecycle overrides, seats, and delegated admins.',
  },
  {
    name: 'Editor',
    desc: 'Create studies, moderate live sessions, and promote insights to tracked action items.',
  },
  {
    name: 'Viewer',
    desc: 'Watch highlight reels, inspect synthesis reports, and leave comments.',
  },
];

const TeamSettings: React.FC = () => {
  const { isAdmin, isRootAdmin, currentUser } = useAuth();
  const {
    teamMembers,
    workspaceSettings,
    inviteTeamMember,
    updateTeamRole,
    removeTeamMember,
    updateWorkspaceSettings,
  } = useResearch();
  const { theme, setTheme } = useTheme();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Editor');
  const [savingPolicy, setSavingPolicy] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !inviteEmail.trim()) return;
    inviteTeamMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setInviteRole('Editor');
    setIsInviteOpen(false);
  };

  const handleTogglePolicy = async (
    key: 'samlSsoEnforced' | 'privacyShieldDefault',
    next: boolean
  ) => {
    if (!isAdmin) return;
    setSavingPolicy(true);
    try {
      await updateWorkspaceSettings({ [key]: next });
    } finally {
      setSavingPolicy(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Team & Workspace Settings
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Manage researcher permissions, security controls, and interface appearance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {isAdmin && (
            <Link
              to="/dashboard/admin"
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap no-underline"
            >
              <span>Admin Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Authority Banner */}
      <div className="px-4 py-3 rounded-[var(--sys-radius-md)] sys-surface-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)] shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-[var(--sys-on-surface-tertiary)] shrink-0" />
          )}
          <span className="text-[var(--sys-on-surface-secondary)]">
            {isAdmin ? (
              <>
                Signed in as{' '}
                <strong className="text-[var(--sys-on-surface)]">
                  {isRootAdmin ? 'Root Administrator' : 'Workspace Administrator'}
                </strong>{' '}
                ({currentUser?.email}). You have full authority over workspace roles, security
                policies, and records.
              </>
            ) : (
              <>
                Workspace governance controls are read-only for standard accounts. Sign in with an
                authorised administrator account to modify roles or policies.
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Roster */}
        <section className="lg:col-span-8 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Workspace Members</h2>
            <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
              {teamMembers.length} seats used
            </span>
          </div>

          <div className="divide-y divide-[var(--sys-outline-variant)]">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-[var(--sys-radius-sm)] object-cover border border-[var(--sys-outline-variant)] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-tertiary)] truncate">
                      {member.email} · {member.lastActive}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {isAdmin ? (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateTeamRole(member.id, e.target.value as TeamMember['role'])
                        }
                        aria-label={`Change role for ${member.name}`}
                        className="h-9 px-3 text-xs font-semibold sys-input"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        aria-label={`Remove ${member.name}`}
                        title={`Remove ${member.name}`}
                        className="w-9 h-9 rounded-[var(--sys-radius-sm)] border border-[var(--sys-outline-variant)] inline-flex items-center justify-center text-[var(--sys-danger-fg)] hover:bg-[var(--sys-danger-bg)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-[var(--sys-on-surface-secondary)] px-2.5 py-1.5 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                      {member.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar: Appearance, Role Guide & Compliance */}
        <div className="lg:col-span-4 space-y-6">
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-4">
            <h2 className="text-sm font-bold text-[var(--sys-on-surface)]">Appearance</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-[var(--sys-radius-md)] border inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  theme === 'light'
                    ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                    : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-secondary)]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-[var(--sys-radius-md)] border inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                    : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-secondary)]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </section>

          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-4">
            <h2 className="text-sm font-bold text-[var(--sys-on-surface)]">Role Permissions</h2>
            <div className="space-y-3.5">
              {ROLE_GUIDE.map((r) => (
                <div key={r.name}>
                  <p className="text-xs font-semibold text-[var(--sys-primary)]">{r.name}</p>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed mt-0.5">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-3">
            <h2 className="text-sm font-bold text-[var(--sys-on-surface)] inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)]" />
              <span>Security Governance</span>
            </h2>
            <div className="text-xs space-y-2 text-[var(--sys-on-surface-secondary)]">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--sys-outline-variant)]">
                <span>SAML SSO Enforcement</span>
                {isAdmin ? (
                  <button
                    type="button"
                    disabled={savingPolicy}
                    onClick={() =>
                      void handleTogglePolicy(
                        'samlSsoEnforced',
                        !workspaceSettings.samlSsoEnforced
                      )
                    }
                    className="font-mono font-semibold underline cursor-pointer"
                    style={{
                      color: workspaceSettings.samlSsoEnforced
                        ? 'var(--sys-success-fg)'
                        : 'var(--sys-on-surface-tertiary)',
                    }}
                  >
                    {workspaceSettings.samlSsoEnforced ? 'Active' : 'Disabled'}
                  </button>
                ) : (
                  <span
                    className="font-mono font-semibold"
                    style={{
                      color: workspaceSettings.samlSsoEnforced
                        ? 'var(--sys-success-fg)'
                        : 'var(--sys-on-surface-tertiary)',
                    }}
                  >
                    {workspaceSettings.samlSsoEnforced ? 'Active' : 'Disabled'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--sys-outline-variant)]">
                <span>Privacy Shield Default</span>
                {isAdmin ? (
                  <button
                    type="button"
                    disabled={savingPolicy}
                    onClick={() =>
                      void handleTogglePolicy(
                        'privacyShieldDefault',
                        !workspaceSettings.privacyShieldDefault
                      )
                    }
                    className="font-mono font-semibold underline cursor-pointer"
                    style={{
                      color: workspaceSettings.privacyShieldDefault
                        ? 'var(--sys-success-fg)'
                        : 'var(--sys-on-surface-tertiary)',
                    }}
                  >
                    {workspaceSettings.privacyShieldDefault ? 'Enabled' : 'Disabled'}
                  </button>
                ) : (
                  <span
                    className="font-mono font-semibold"
                    style={{
                      color: workspaceSettings.privacyShieldDefault
                        ? 'var(--sys-success-fg)'
                        : 'var(--sys-on-surface-tertiary)',
                    }}
                  >
                    {workspaceSettings.privacyShieldDefault ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Data Residency</span>
                <span className="font-mono font-semibold text-[var(--sys-on-surface)]">
                  {workspaceSettings.dataResidency}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Invite Modal (Admin only) */}
      {isAdmin && isInviteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsInviteOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleInvite}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="invite-modal-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
                Invite Team Member
              </h2>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="invite-email"
                  className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
                >
                  Work Email
                </label>
                <input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.co.uk"
                  className="w-full h-11 px-3.5 text-sm sys-input"
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                  Workspace Role
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Viewer', 'Editor', 'Admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInviteRole(r)}
                      className={`min-h-[40px] text-xs font-semibold rounded-[var(--sys-radius-sm)] border cursor-pointer transition-colors ${
                        inviteRole === r
                          ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                          : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-secondary)]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs sys-btn-primary cursor-pointer">
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamSettings;
