import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Circle, ShieldCheck, Square } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS } from '../data/mockData';
import PrivacyOverlay from '../components/PrivacyOverlay';

const ParticipantRecording: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useResearch();
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [shieldActive, setShieldActive] = useState(true);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
          Recording Booth
        </h1>
        <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
          {project.name} · Pre-flight privacy check & session capture
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-[var(--sys-radius-lg)] overflow-hidden border border-[var(--sys-outline-variant)] bg-black">
            <img
              src={ASSETS.heroStudio}
              alt="Camera pre-flight feed"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
            {shieldActive && <PrivacyOverlay />}

            <div className="absolute bottom-4 left-4 z-30 bg-black/75 text-white px-3.5 py-2 rounded-[var(--sys-radius-sm)] border border-white/15 font-mono text-xs tabular-nums">
              {isRecording ? `REC ${formatTime(elapsedTime)}` : 'Standby · Camera Ready'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs sys-btn-primary cursor-pointer"
              >
                <Circle className="w-3.5 h-3.5 fill-current" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRecording(false);
                  navigate(`/dashboard/projects/${project.id}/insights`);
                }}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs font-semibold rounded-[var(--sys-radius-md)] text-white cursor-pointer"
                style={{ backgroundColor: 'var(--ref-danger)' }}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop & Synthesize</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShieldActive((s) => !s)}
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{shieldActive ? 'Disable Privacy Mask' : 'Enable Privacy Mask'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/sessions')}
              className="min-h-[42px] px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        <aside className="lg:col-span-4 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-5">
          <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Pre-Flight Checklist</h2>
          <ul className="space-y-3 text-sm text-[var(--sys-on-surface-secondary)]">
            {[
              'Biometric face redaction active in buffer',
              'Billing & document screen regions masked',
              'Encrypted EU-West upload stream verified',
              'Automatic post-session transcript synthesis',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[var(--sys-primary)] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ParticipantRecording;
