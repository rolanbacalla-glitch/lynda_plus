import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import { auditResearchQuestion } from '../data/biasAnalyzer';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS, type StudyMethod } from '../data/mockData';
import SpellCheckField from '../components/SpellCheckField';

const METHODS: { value: StudyMethod; desc: string }[] = [
  { value: 'Moderated Interview', desc: 'Live video session with Privacy Shield and transcript guidance.' },
  { value: 'First-Click Test', desc: 'Measure navigation accuracy and first-click coordinates on mockups.' },
  { value: 'Five-Second Test', desc: 'Timed first-impression recall to test messaging and visual hierarchy.' },
  { value: 'Usability Study', desc: 'Multi-task walkthrough combining screen behaviour and open feedback.' },
];

const ProjectCreationWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('Workspace Billing Clarity Audit');
  const [objective, setObjective] = useState(
    'Validate whether returning admins understand seat proration before confirming an annual upgrade.'
  );
  const [method, setMethod] = useState<StudyMethod>('Usability Study');
  const [question, setQuestion] = useState(
    'Explain how much you enjoyed reviewing the new subscription checkout screen.'
  );
  const [exposureSeconds, setExposureSeconds] = useState(5);
  const [targetParticipants, setTargetParticipants] = useState(25);
  const [privacyShield, setPrivacyShield] = useState(true);
  const [voiceAnonymise, setVoiceAnonymise] = useState(false);
  const [autoCorrect, setAutoCorrect] = useState(true);

  const { addProject } = useResearch();
  const navigate = useNavigate();

  const audit = useMemo(() => auditResearchQuestion(question), [question]);

  const handlePublish = (launchPreview: boolean) => {
    const created = addProject({
      name: name.trim() || 'Untitled Research Study',
      method,
      status: 'Live',
      participants: 0,
      targetParticipants,
      timeToInsight: 'Pending',
      neutralityScore: audit.score,
      completionRate: 0,
      objective: objective.trim(),
      primaryQuestion: question.trim(),
    });
    if (launchPreview) {
      navigate('/dashboard/preview');
    } else {
      navigate(`/dashboard/projects/${created.id}/insights`);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header & Stepper */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Study Composer
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Draft neutral research questions, configure test blocks, and launch with built-in guardrails.
          </p>
        </div>

        <ol className="grid grid-cols-3 gap-3">
          {[
            { num: 1 as const, label: '01. Objective & Bias Audit' },
            { num: 2 as const, label: '02. Method & Guardrails' },
            { num: 3 as const, label: '03. Target & Launch' },
          ].map((s) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;
            return (
              <li key={s.num}>
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`w-full text-left p-3.5 rounded-[var(--sys-radius-md)] border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                      : isDone
                      ? 'bg-[var(--sys-surface-lowest)] border-[var(--sys-outline)] text-[var(--sys-on-surface)]'
                      : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-tertiary)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{s.label}</span>
                    {isDone && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Step 1: Objective & Live Bias Audit */}
      {step === 1 && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--sys-outline-variant)]">
            <span className="text-xs text-[var(--sys-on-surface-tertiary)]">
              British English spellcheck runs locally in your browser (zero API cost).
            </span>
            <button
              type="button"
              onClick={() => setAutoCorrect((prev) => !prev)}
              className="text-xs font-semibold text-[var(--sys-primary)] hover:underline cursor-pointer"
            >
              Auto-correct: {autoCorrect ? 'On' : 'Off'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="study-name"
              className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
            >
              Study Title
            </label>
            <SpellCheckField
              id="study-name"
              value={name}
              onChange={setName}
              autoCorrectEnabled={autoCorrect}
              placeholder="e.g. Navigation Usability Audit"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="study-objective"
              className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
            >
              Research Objective
            </label>
            <SpellCheckField
              id="study-objective"
              value={objective}
              onChange={setObjective}
              autoCorrectEnabled={autoCorrect}
              placeholder="What product decision will this study inform?"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="primary-question"
                className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
              >
                Primary Research Question
              </label>
              <span
                className="text-xs font-mono font-semibold tabular-nums"
                style={{
                  color:
                    audit.status === 'biased'
                      ? 'var(--sys-danger-fg)'
                      : audit.status === 'warning'
                      ? 'var(--sys-warning-fg)'
                      : 'var(--sys-success-fg)',
                }}
              >
                Neutrality {audit.score}/100
              </span>
            </div>
            <SpellCheckField
              id="primary-question"
              multiline
              rows={3}
              value={question}
              onChange={setQuestion}
              autoCorrectEnabled={autoCorrect}
              placeholder="Write your main participant prompt..."
            />

            {/* Live Bias Audit Feedback */}
            <div
              className="p-4 rounded-[var(--sys-radius-md)] border space-y-2"
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
              <div className="flex items-start gap-3">
                {audit.status === 'neutral' ? (
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: 'var(--sys-success-fg)' }}
                  />
                ) : (
                  <AlertTriangle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{
                      color:
                        audit.status === 'biased' ? 'var(--sys-danger-fg)' : 'var(--sys-warning-fg)',
                    }}
                  />
                )}
                <div className="flex-1 space-y-1.5">
                  <p
                    className="text-xs font-semibold"
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
                    {audit.matchedPhrase ? ` — "${audit.matchedPhrase}"` : ''}
                  </p>
                  <p className="text-xs text-[var(--sys-on-surface)] leading-relaxed">
                    {audit.explanation}
                  </p>
                  {audit.suggestion && (
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-[var(--sys-on-surface)]">
                        Suggested: “{audit.suggestion}”
                      </p>
                      <button
                        type="button"
                        onClick={() => setQuestion(audit.suggestion!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        Apply Rewrite
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="min-h-[40px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 min-h-[40px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
            >
              <span>Continue to Method</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Methodology & Guardrails */}
      {step === 2 && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
              Select Primary Methodology
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {METHODS.map((item) => {
                const active = method === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMethod(item.value)}
                    className={`text-left p-4 rounded-[var(--sys-radius-md)] border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                        : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface)] hover:border-[var(--sys-outline)]'
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.value}</p>
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {method === 'Five-Second Test' && (
            <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--sys-on-surface)]">
                  Visual Exposure Duration
                </span>
                <span className="text-xs font-mono font-semibold text-[var(--sys-primary)] tabular-nums">
                  {exposureSeconds} seconds
                </span>
              </div>
              <div className="flex gap-2">
                {[3, 5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setExposureSeconds(sec)}
                    className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-[var(--sys-radius-sm)] border cursor-pointer ${
                      exposureSeconds === sec
                        ? 'bg-[var(--sys-primary)] text-[var(--sys-on-primary)] border-[var(--sys-primary)]'
                        : 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface-secondary)] border-[var(--sys-outline-variant)]'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {(method === 'First-Click Test' || method === 'Five-Second Test') && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                Attached Prototype Stimulus
              </p>
              <div className="rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] aspect-[16/9] max-h-60 bg-[var(--sys-surface-low)]">
                <img
                  src={ASSETS.checkoutUi}
                  alt="Checkout prototype attached to study"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="p-5 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sys-on-surface)]">
              <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)]" />
              <span>Privacy & Compliance Guardrails</span>
            </div>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[var(--sys-on-surface)]">
                  In-Buffer Privacy Shield (Face & Billing PII Masking)
                </p>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                  Automatically redacts personal identifiers before video frames are written.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacyShield}
                onChange={(e) => setPrivacyShield(e.target.checked)}
                className="w-4 h-4 accent-[var(--sys-primary)]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[var(--sys-on-surface)]">
                  Audio Voice Anonymisation
                </p>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                  Neutralise participant vocal timbre for external stakeholder sharing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={voiceAnonymise}
                onChange={(e) => setVoiceAnonymise(e.target.checked)}
                className="w-4 h-4 accent-[var(--sys-primary)]"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 min-h-[40px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
            >
              <span>Continue to Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Target Audience & Launch Summary */}
      {step === 3 && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="target-count"
              className="block text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
            >
              Target Participant Quota
            </label>
            <div className="flex items-center gap-4">
              <input
                id="target-count"
                type="range"
                min={5}
                max={100}
                step={5}
                value={targetParticipants}
                onChange={(e) => setTargetParticipants(Number(e.target.value))}
                className="flex-1 accent-[var(--sys-primary)]"
              />
              <span className="font-mono text-sm font-bold text-[var(--sys-on-surface)] w-24 text-right tabular-nums">
                {targetParticipants} people
              </span>
            </div>
          </div>

          <div className="rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] divide-y divide-[var(--sys-outline-variant)] text-sm">
            <div className="p-4 flex justify-between gap-4">
              <span className="text-[var(--sys-on-surface-tertiary)]">Study Title</span>
              <span className="font-semibold text-[var(--sys-on-surface)] text-right">{name}</span>
            </div>
            <div className="p-4 flex justify-between gap-4">
              <span className="text-[var(--sys-on-surface-tertiary)]">Method</span>
              <span className="font-semibold text-[var(--sys-on-surface)]">{method}</span>
            </div>
            <div className="p-4 flex justify-between gap-4">
              <span className="text-[var(--sys-on-surface-tertiary)]">Script Neutrality</span>
              <span className="font-mono font-semibold text-[var(--sys-primary)] tabular-nums">
                {audit.score}/100 ({audit.category})
              </span>
            </div>
            <div className="p-4 flex justify-between gap-4">
              <span className="text-[var(--sys-on-surface-tertiary)]">Privacy Shield</span>
              <span className="font-semibold text-[var(--sys-on-surface)]">
                {privacyShield ? 'Enabled' : 'Disabled'}
                {voiceAnonymise ? ' + Voice Masking' : ''}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handlePublish(true)}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Publish & Preview Runner</span>
              </button>
              <button
                type="button"
                onClick={() => handlePublish(false)}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
              >
                <span>Publish Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCreationWizard;
