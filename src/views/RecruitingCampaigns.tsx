import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import RecruitmentEngine from '../components/RecruitmentEngine';
import { useResearch } from '../contexts/ResearchContext';

const RecruitingCampaigns: React.FC = () => {
  const { campaigns } = useResearch();
  const [reliabilityThreshold, setReliabilityThreshold] = useState(94);
  const [recalibrated, setRecalibrated] = useState(false);

  const handleRecalibrate = () => {
    setReliabilityThreshold(96);
    setRecalibrated(true);
    window.setTimeout(() => setRecalibrated(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
          Recruiting Campaigns
        </h1>
        <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
          Configure target personas and monitor live invite-to-confirmed sourcing funnels.
        </p>
      </div>

      <RecruitmentEngine />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Funnels */}
        <div className="lg:col-span-8 space-y-4">
          {campaigns.map((camp) => {
            const pct = Math.min(100, Math.round((camp.confirmed / Math.max(camp.goal, 1)) * 100));
            return (
              <section
                key={camp.id}
                className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-5 tabular-nums"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono text-[var(--sys-on-surface-tertiary)]">
                      {camp.code} · {camp.region}
                    </p>
                    <h3 className="text-base font-bold text-[var(--sys-on-surface)] mt-0.5">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      {camp.targetRole} · {camp.skills}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--sys-success-fg)' }}
                  >
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                    <p className="text-xs text-[var(--sys-on-surface-tertiary)]">Invited</p>
                    <p className="text-xl font-bold font-mono text-[var(--sys-on-surface)] mt-1">
                      {camp.invited.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                    <p className="text-xs text-[var(--sys-on-surface-tertiary)]">Screened</p>
                    <p className="text-xl font-bold font-mono text-[var(--sys-primary)] mt-1">
                      {camp.screened}
                    </p>
                  </div>
                  <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                    <p className="text-xs text-[var(--sys-on-surface-tertiary)]">Confirmed</p>
                    <p
                      className="text-xl font-bold font-mono mt-1"
                      style={{ color: 'var(--sys-success-fg)' }}
                    >
                      {camp.confirmed} / {camp.goal}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[var(--sys-on-surface-secondary)]">
                    <span>Quota Progress</span>
                    <span className="font-mono font-semibold text-[var(--sys-on-surface)]">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--sys-surface-container)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--sys-primary)] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Panel Quality Health Card */}
        <aside className="lg:col-span-4 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-5 tabular-nums">
          <div>
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Panel Quality Gate</h2>
            <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
              Minimum reliability threshold applied to incoming screener responses.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-[var(--sys-on-surface)]">
                {reliabilityThreshold}%
              </span>
              <span className="text-xs text-[var(--sys-primary)] font-semibold">
                Verified Baseline
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--sys-surface-container)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--sys-primary)]"
                style={{ width: `${reliabilityThreshold}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-[var(--sys-on-surface-tertiary)] leading-relaxed">
            Automatically filters duplicate respondents, speeders, and low-attendance profiles before slot confirmation.
          </p>

          <button
            type="button"
            onClick={handleRecalibrate}
            className="w-full min-h-[40px] px-4 py-2 text-xs sys-btn-secondary inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{recalibrated ? 'Quality Gate Updated (96%)' : 'Tighten Quality Gate'}</span>
          </button>
        </aside>
      </div>
    </div>
  );
};

export default RecruitingCampaigns;
