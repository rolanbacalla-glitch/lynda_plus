import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { ASSETS } from '../data/mockData';

interface StudySection {
  id: string;
  type: 'five-second' | 'first-click' | 'survey';
  title: string;
  duration?: number;
  prompt: string;
  image?: string;
}

const PREVIEW_SECTIONS: StudySection[] = [
  {
    id: '1',
    type: 'five-second',
    title: 'Initial Impression (Five-Second Test)',
    duration: 5,
    prompt: 'What stood out most about the checkout screen you just viewed?',
    image: ASSETS.checkoutUi,
  },
  {
    id: '2',
    type: 'first-click',
    title: 'Navigation Task (First-Click Test)',
    prompt: 'Click where you would confirm your subscription total and complete payment.',
    image: ASSETS.checkoutUi,
  },
  {
    id: '3',
    type: 'survey',
    title: 'Open Reflection',
    prompt: 'Walk us through anything that felt unclear or unexpected during this test.',
  },
];

const StudyPreview: React.FC = () => {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [recallText, setRecallText] = useState('');
  const [surveyText, setSurveyText] = useState('');
  const [clickCoords, setClickCoords] = useState<{ xPct: number; yPct: number } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const navigate = useNavigate();
  const current = PREVIEW_SECTIONS[sectionIdx];
  const showStimulus = current.type === 'five-second' && timeLeft > 0;

  useEffect(() => {
    if (!showStimulus) return;
    const timer = window.setTimeout(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [showStimulus, timeLeft]);

  const handleNext = useCallback(() => {
    if (sectionIdx < PREVIEW_SECTIONS.length - 1) {
      const nextIdx = sectionIdx + 1;
      const nextSection = PREVIEW_SECTIONS[nextIdx];
      setSectionIdx(nextIdx);
      setTimeLeft(nextSection.type === 'five-second' ? nextSection.duration || 5 : 0);
    } else {
      setIsFinished(true);
    }
  }, [sectionIdx]);

  const handleFirstClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setClickCoords({ xPct, yPct });
  };

  if (isFinished) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-8 text-center space-y-5">
          <CheckCircle2
            className="w-10 h-10 mx-auto"
            style={{ color: 'var(--sys-success-fg)' }}
          />
          <h1 className="text-2xl font-bold text-[var(--sys-on-surface)]">Study Preview Complete</h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
            Your simulated participant responses
            {clickCoords ? ` (including First-Click at ${clickCoords.xPct}%, ${clickCoords.yPct}%)` : ''} have been verified.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSectionIdx(0);
                setTimeLeft(PREVIEW_SECTIONS[0].duration || 5);
                setRecallText('');
                setSurveyText('');
                setClickCoords(null);
                setIsFinished(false);
              }}
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Again</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
            >
              <span>Return to Overview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Runner Progress Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--sys-outline-variant)]">
        <div className="space-y-1">
          <p className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
            Step {sectionIdx + 1} of {PREVIEW_SECTIONS.length} · Participant Preview Mode
          </p>
          <h1 className="text-lg font-bold text-[var(--sys-on-surface)]">{current.title}</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/create')}
          className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs sys-btn-secondary cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Preview</span>
        </button>
      </div>

      {/* Five-Second Block */}
      {current.type === 'five-second' && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
          {showStimulus ? (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--sys-on-surface-secondary)]">
                  Observe the interface carefully
                </span>
                <span className="font-mono font-bold text-[var(--sys-primary)] tabular-nums">
                  {timeLeft}s remaining
                </span>
              </div>
              <div className="rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] aspect-video bg-[var(--sys-surface-low)]">
                <img
                  src={current.image}
                  alt="Five-second visual stimulus"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-5 py-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--sys-primary)]">Recall Phase</p>
                <h2 className="text-xl font-bold text-[var(--sys-on-surface)]">{current.prompt}</h2>
              </div>
              <textarea
                rows={4}
                value={recallText}
                onChange={(e) => setRecallText(e.target.value)}
                placeholder="Write what you remember..."
                className="w-full p-4 text-sm sys-input resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTimeLeft(5)}
                  className="text-xs font-semibold text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)] cursor-pointer"
                >
                  Replay 5s stimulus
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
                >
                  <span>Next Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* First-Click Block */}
      {current.type === 'first-click' && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[var(--sys-on-surface)]">{current.prompt}</h2>
            <p className="text-xs text-[var(--sys-on-surface-secondary)]">
              Click directly on the prototype below to record your first-click coordinate.
            </p>
          </div>

          <div
            onClick={handleFirstClick}
            className="relative rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline)] aspect-video cursor-crosshair bg-[var(--sys-surface-low)]"
          >
            <img
              src={current.image}
              alt="First-click task target"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            {clickCoords && (
              <div
                style={{ left: `${clickCoords.xPct}%`, top: `${clickCoords.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white bg-[var(--sys-primary)] shadow-md"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
              {clickCoords
                ? `Recorded click at X: ${clickCoords.xPct}%, Y: ${clickCoords.yPct}%`
                : 'Awaiting click on image...'}
            </span>
            <button
              type="button"
              disabled={!clickCoords}
              onClick={handleNext}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer disabled:opacity-40"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Open Survey Block */}
      {current.type === 'survey' && (
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-5">
          <h2 className="text-xl font-bold text-[var(--sys-on-surface)]">{current.prompt}</h2>
          <textarea
            rows={4}
            value={surveyText}
            onChange={(e) => setSurveyText(e.target.value)}
            placeholder="Share your feedback..."
            className="w-full p-4 text-sm sys-input resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
            >
              <span>Submit Study Preview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPreview;
