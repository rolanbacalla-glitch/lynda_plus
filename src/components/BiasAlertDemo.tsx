import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw, Wand2 } from 'lucide-react';
import { auditResearchQuestion } from '../data/biasAnalyzer';
import SpellCheckField from './SpellCheckField';

const SAMPLE_PROMPTS = [
  {
    label: 'Positive Framing',
    text: 'Explain how much you enjoyed using the new checkout experience.',
  },
  {
    label: 'Negative Priming',
    text: 'Tell me what was most frustrating about setting up team permissions.',
  },
  {
    label: 'Hypothetical Intent',
    text: 'Would you use a weekly digest email if we added it to your dashboard?',
  },
];

const BiasAlertDemo: React.FC = () => {
  const [question, setQuestion] = useState(SAMPLE_PROMPTS[0].text);
  const [rewrittenCount, setRewrittenCount] = useState(0);

  const audit = useMemo(() => auditResearchQuestion(question), [question]);

  const handleApplySuggestion = () => {
    if (!audit.suggestion) return;
    setQuestion(audit.suggestion);
    setRewrittenCount((c) => c + 1);
  };

  return (
    <section id="bias-audit" className="py-16 md:py-24 bg-[var(--sys-surface-low)] border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Explanation Column */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-medium text-[var(--sys-primary)]">
              01. Live Script Auditor
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight">
              Catch leading questions before a single participant joins.
            </h2>
            <p className="text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
              Small phrasing slips invalidate weeks of fieldwork. Test any interview or survey prompt below—LyndaPlus inspects framing, emotional priming, and hypothetical bias as you draft.
            </p>

            <div className="pt-2 space-y-3">
              <p className="text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                Load an example prompt
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((sample) => {
                  const isSelected = question === sample.text;
                  return (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setQuestion(sample.text)}
                      className={`min-h-[38px] px-3.5 py-2 text-xs font-medium rounded-[var(--sys-radius-sm)] border transition-colors whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--sys-primary-container)] text-[var(--sys-on-primary-container)] border-[var(--sys-primary)]'
                          : 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface-secondary)] border-[var(--sys-outline-variant)] hover:text-[var(--sys-on-surface)]'
                      }`}
                    >
                      {sample.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--sys-outline-variant)] grid grid-cols-2 gap-6 tabular-nums">
              <div>
                <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)]">6 Rules</p>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  Framing, priming, hypothetical & closed checks
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)]">
                  {rewrittenCount > 0 ? `${rewrittenCount} Applied` : '< 50ms'}
                </p>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  {rewrittenCount > 0 ? 'Neutral rewrites tested in session' : 'Instant inline script feedback'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Workbench */}
          <div className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="demo-bias-input"
                className="text-sm font-semibold text-[var(--sys-on-surface)]"
              >
                Research Question Draft
              </label>
              <div className="flex items-center gap-3 text-xs tabular-nums">
                <span className="text-[var(--sys-on-surface-tertiary)]">Neutrality Score</span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    color:
                      audit.status === 'biased'
                        ? 'var(--sys-danger-fg)'
                        : audit.status === 'warning'
                        ? 'var(--sys-warning-fg)'
                        : 'var(--sys-success-fg)',
                  }}
                >
                  {audit.score}/100
                </span>
              </div>
            </div>

            <SpellCheckField
              id="demo-bias-input"
              multiline
              rows={3}
              value={question}
              onChange={setQuestion}
              placeholder="Type a study question to evaluate neutrality..."
            />

            {/* Diagnostic Output Surface */}
            <div
              className="p-5 rounded-[var(--sys-radius-md)] border"
              style={{
                backgroundColor:
                  audit.status === 'biased'
                    ? 'var(--sys-danger-bg)'
                    : audit.status === 'warning'
                    ? 'var(--sys-warning-bg)'
                    : 'var(--sys-success-bg)',
                borderColor: 'var(--sys-outline-variant)',
              }}
            >
              <div className="flex items-start gap-3.5">
                {audit.status === 'neutral' ? (
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: 'var(--sys-success-fg)' }}
                  />
                ) : (
                  <AlertTriangle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{
                      color:
                        audit.status === 'biased' ? 'var(--sys-danger-fg)' : 'var(--sys-warning-fg)',
                    }}
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{
                        color:
                          audit.status === 'biased'
                            ? 'var(--sys-danger-fg)'
                            : audit.status === 'warning'
                            ? 'var(--sys-warning-fg)'
                            : 'var(--sys-success-fg)',
                      }}
                    >
                      {audit.category}
                      {audit.matchedPhrase ? ` — Flagged "${audit.matchedPhrase}"` : ''}
                    </h3>
                  </div>

                  <p className="text-sm text-[var(--sys-on-surface)] leading-relaxed">
                    {audit.explanation}
                  </p>

                  {audit.suggestion && (
                    <div className="pt-3 mt-3 border-t border-[var(--sys-outline-variant)]">
                      <p className="text-xs font-medium text-[var(--sys-on-surface-secondary)] mb-1">
                        Recommended neutral phrasing
                      </p>
                      <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                        “{audit.suggestion}”
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setQuestion(SAMPLE_PROMPTS[0].text)}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Prompt
              </button>

              {audit.suggestion ? (
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-sm sys-btn-primary whitespace-nowrap cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  Apply Neutral Rewrite
                </button>
              ) : (
                <span className="text-xs font-medium text-[var(--sys-on-surface-secondary)]">
                  Prompt meets neutral research guidelines
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiasAlertDemo;
