import React, { useMemo, useState } from 'react';
import { Users, Check } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS } from '../data/mockData';

const RecruitmentEngine: React.FC = () => {
  const { addCampaign } = useResearch();
  const [campaignName, setCampaignName] = useState('Q2 Billing & Seats Discovery');
  const [role, setRole] = useState('Senior Product Designer');
  const [skills, setSkills] = useState('Figma, Design Systems, B2B SaaS');
  const [experience, setExperience] = useState('Senior / Lead');
  const [region, setRegion] = useState('Remote Global');
  const [goal, setGoal] = useState(25);
  const [launched, setLaunched] = useState(false);

  const estimatedPool = useMemo(() => {
    const base = region === 'Remote Global' ? 68 : region === 'North America' ? 42 : 34;
    const expMod = experience === 'Executive' ? -18 : experience === 'Senior / Lead' ? -6 : 12;
    const skillCount = skills.split(',').filter((s) => s.trim()).length;
    return Math.max(12, base + expMod - skillCount * 4);
  }, [region, experience, skills]);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;
    addCampaign({
      name: campaignName.trim(),
      targetRole: role.trim() || 'Product Professional',
      skills: skills.trim() || 'General SaaS',
      region,
      status: 'Sourcing',
      goal,
    });
    setLaunched(true);
    window.setTimeout(() => setLaunched(false), 3000);
  };

  return (
    <form
      onSubmit={handleLaunch}
      className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--sys-outline-variant)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--sys-on-surface)]">
            Audience Targeting Builder
          </h2>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
            Define persona filters to estimate available verified panelists and launch sourcing.
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
          Pool: 12,400 verified members
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="campaign-name"
              className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
            >
              Campaign Name
            </label>
            <input
              id="campaign-name"
              type="text"
              required
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full h-10 px-3.5 text-sm sys-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="target-role"
                className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Primary Role
              </label>
              <input
                id="target-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="target-skills"
                className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Skills & Tools
              </label>
              <input
                id="target-skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="target-exp"
                className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Seniority
              </label>
              <select
                id="target-exp"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full h-10 px-3 text-sm sys-input"
              >
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior / Lead">Senior / Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="target-region"
                className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Region
              </label>
              <select
                id="target-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-10 px-3 text-sm sys-input"
              >
                <option value="Remote Global">Remote Global</option>
                <option value="North America">North America</option>
                <option value="Europe & UK">Europe & UK</option>
                <option value="APAC">APAC</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="target-goal"
                className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Participant Goal
              </label>
              <input
                id="target-goal"
                type="number"
                min={5}
                max={200}
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full h-10 px-3.5 text-sm font-mono sys-input tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Match Estimator */}
        <div className="lg:col-span-5 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                Estimated Match Pool
              </span>
              <Users className="w-4 h-4 text-[var(--sys-primary)]" />
            </div>

            <div className="tabular-nums">
              <p className="text-3xl font-bold font-mono text-[var(--sys-on-surface)]">
                {estimatedPool} matches
              </p>
              <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                Est. fill time: {estimatedPool > goal * 1.5 ? 'Under 12 hours' : '24–36 hours'} · 94% show-up reliability
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {[ASSETS.avatarSarah, ASSETS.avatarMarcus, ASSETS.avatarElena].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Matched verified panelist"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[var(--sys-surface-low)]"
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--sys-on-surface-tertiary)] tabular-nums">
                +{estimatedPool - 3} more verified panelists
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[42px] px-5 py-2.5 text-sm sys-btn-primary inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            {launched ? (
              <>
                <Check className="w-4 h-4" />
                <span>Campaign Launched</span>
              </>
            ) : (
              <span>Launch Sourcing Campaign</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RecruitmentEngine;
