import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import ParticipantCard from '../components/ParticipantCard';
import { useResearch } from '../contexts/ResearchContext';
import type { Participant } from '../data/mockData';

const ParticipantPanel: React.FC = () => {
  const { participants, toggleParticipantShortlist, addParticipant } = useResearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Shortlisted'>('All');
  const [selected, setSelected] = useState<Participant | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('London, UK');
  const [newTags, setNewTags] = useState('SaaS, Usability');

  const filteredParticipants = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return participants.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && p.status === 'Active') ||
        (statusFilter === 'Shortlisted' && p.shortlisted);
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;
    addParticipant({
      name: newName.trim(),
      age: 32,
      role: newRole.trim(),
      company: newCompany.trim() || 'Independent',
      experience: '5 years',
      location: newLocation.trim() || 'Remote',
      status: 'Active',
      reliability: 95,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      recentNote: 'Added directly via Workspace Panel Directory.',
    });
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Participant Panel
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Verified research panellists with session reliability scores and expertise tags.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/dashboard/recruitment"
            className="inline-flex items-center min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap no-underline"
          >
            Launch Campaign
          </Link>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Participant</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--sys-on-surface-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, company, or expertise..."
            aria-label="Search participants"
            className="w-full h-11 pl-10 pr-4 text-sm sys-input"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter participants"
          className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] self-start md:self-auto"
        >
          {(['All', 'Active', 'Shortlisted'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={statusFilter === tab}
              onClick={() => setStatusFilter(tab)}
              className={`min-h-[36px] px-4 py-1 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onInspect={setSelected}
              onToggleShortlist={toggleParticipantShortlist}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest py-16 px-6 text-center space-y-3">
          <h2 className="text-base font-bold text-[var(--sys-on-surface)]">No participants found</h2>
          <p className="text-sm text-[var(--sys-on-surface-secondary)]">
            Adjust your search or add a new verified participant directly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
            }}
            className="mt-2 px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Participant Inspector Slide-Over */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Participant profile"
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md bg-[var(--sys-surface-lowest)] border-l border-[var(--sys-outline)] h-full p-6 overflow-y-auto flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                  Participant Profile
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close profile"
                  className="w-9 h-9 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selected.avatar}
                  alt={selected.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-[var(--sys-radius-md)] object-cover border border-[var(--sys-outline-variant)]"
                />
                <div>
                  <h2 className="text-xl font-bold text-[var(--sys-on-surface)]">{selected.name}</h2>
                  <p className="text-sm text-[var(--sys-on-surface-secondary)]">
                    {selected.role} · {selected.company}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)]">Reliability</p>
                  <p className="text-xl font-bold font-mono text-[var(--sys-on-surface)] mt-1">
                    {selected.reliability}%
                  </p>
                </div>
                <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)]">Completed</p>
                  <p className="text-xl font-bold font-mono text-[var(--sys-on-surface)] mt-1">
                    {selected.sessionsCompleted} sessions
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                  Researcher Notes
                </p>
                <p className="text-[var(--sys-on-surface-secondary)] leading-relaxed">
                  {selected.recentNote}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                  Domain Expertise
                </p>
                <p className="text-[var(--sys-on-surface)]">{selected.tags.join(' · ')}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex gap-2.5">
              <Link
                to="/dashboard/sessions"
                onClick={() => setSelected(null)}
                className="flex-1 min-h-[42px] px-4 py-2 text-xs sys-btn-primary flex items-center justify-center no-underline"
              >
                Schedule Interview
              </Link>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-participant-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsAddOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleAddParticipant}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="add-participant-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
                Add Participant
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full name"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <input
                type="text"
                required
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Role (e.g. Principal Product Manager)"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Company"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Location"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Expertise tags (comma separated)"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs sys-btn-primary cursor-pointer">
                Add to Panel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ParticipantPanel;
