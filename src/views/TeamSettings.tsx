import React, { useState } from 'react';
import { Moon, ShieldCheck, Sun, UserPlus, X } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import { useTheme } from '../contexts/ThemeContext';
import type { TeamMember } from '../data/mockData';

const ROLE_GUIDE: { name: TeamMember['role']; desc: string }[] = [
  { name: 'Admin', desc: 'Manage billing, SSO policies, data residency, and workspace seats.' },
  { name: 'Editor', desc: 'Create studies, moderate live sessions, and promote insights to tasks.' },
  { name: 'Viewer', desc: 'Watch highlight reels, inspect synthesis reports, and leave comments.' },
];

const TeamSettings: React.FC = () => {
  const { teamMembers, inviteTeamMember, updateTeamRole } = useResearch();
  const { theme, setTheme } = useTheme();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteTeamMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setInviteRole('Editor');
    setIsInviteOpen(false);
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

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
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

                <div className="flex items-center gap-3 shrink-0">
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
              <div className="flex justify-between py-1.5 border-b border-[var(--sys-outline-variant)]">
                <span>SAML SSO Enforcement</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--sys-success-fg)' }}>
                  Active
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--sys-outline-variant)]">
                <span>Privacy Shield Default</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--sys-success-fg)' }}>
                  Enabled
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Data Residency</span>
                <span className="font-mono font-semibold text-[var(--sys-on-surface)]">EU-West</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
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
                  placeholder="colleague@company.com"
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
