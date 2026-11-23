import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, EyeOff, FileSearch, Layers } from 'lucide-react';
import { ASSETS } from '../data/mockData';

const AgenticInsight: React.FC = () => {
  return (
    <section id="capabilities" className="py-16 md:py-24 border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
            02. Core Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight mb-4">
            Built around the real bottlenecks of product research.
          </h2>
          <p className="text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
            Every stage connects directly—from drafting unbiased prompts to running compliant live sessions and exporting evidence tied to your engineering backlog.
          </p>
        </div>

        {/* Asymmetric Bento Grid (col-span-7 + col-span-5, then col-span-5 + col-span-7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Marquee Synthesis & Prototype Testing */}
          <div className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)]">
                  01 / Study Composer & First-Click Tests
                </span>
                <Layers className="w-4 h-4 text-[var(--sys-primary)]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--sys-on-surface)]">
                Combine five-second recall, first-click maps, and moderated interviews
              </h3>
              <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                Run quantitative click-density validation alongside qualitative interviews in one study container—no stitching spreadsheets across separate tools.
              </p>
            </div>

            <div className="rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] aspect-[16/9] bg-[var(--sys-surface-low)]">
              <img
                src={ASSETS.checkoutUi}
                alt="Checkout prototype undergoing first-click usability testing"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: In-Session Privacy Shield */}
          <div className="lg:col-span-5 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)]">
                  02 / Compliance Guardrails
                </span>
                <EyeOff className="w-4 h-4 text-[var(--sys-primary)]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--sys-on-surface)]">
                In-buffer Privacy Shield for regulated teams
              </h3>
              <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                Automatically masks participant faces, billing details, and ID documents before video frames reach storage—enabling fintech and healthcare usability testing without legal hold-ups.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--sys-outline-variant)] text-sm">
              <div className="flex items-center justify-between py-2 border-b border-[var(--sys-outline-variant)]">
                <span className="text-[var(--sys-on-surface-secondary)]">Biometric face redaction</span>
                <span className="font-mono text-xs font-semibold text-[var(--sys-on-surface)]">In-buffer</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--sys-outline-variant)]">
                <span className="text-[var(--sys-on-surface-secondary)]">Payment & ID screen blur</span>
                <span className="font-mono text-xs font-semibold text-[var(--sys-on-surface)]">Automated</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--sys-on-surface-secondary)]">Data residency options</span>
                <span className="font-mono text-xs font-semibold text-[var(--sys-on-surface)]">EU / UK / US</span>
              </div>
            </div>
          </div>

          {/* Card 3: Thematic Evidence & Backlog Links */}
          <div className="lg:col-span-12 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--sys-on-surface-tertiary)]">
                <FileSearch className="w-4 h-4 text-[var(--sys-primary)]" />
                <span>03 / Evidence-Backed Synthesis</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--sys-on-surface)]">
                Turn raw session hours into timestamped highlights and engineering tasks
              </h3>
              <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                Every synthesized insight links directly to the exact video clip, participant context, and mention count—so product managers can promote validated friction points into sprint tasks in one click.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm sys-btn-secondary whitespace-nowrap shrink-0 no-underline self-start md:self-center"
            >
              <span>Inspect Sample Study</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenticInsight;
