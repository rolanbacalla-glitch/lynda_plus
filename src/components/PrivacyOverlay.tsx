import React from 'react';
import { ShieldCheck } from 'lucide-react';

const REDACTION_ZONES = [
  { id: 'face', label: 'Face Redacted', top: '14%', left: '10%', width: '24%', height: '38%' },
  { id: 'billing', label: 'Billing PII Masked', top: '54%', left: '46%', width: '36%', height: '24%' },
];

const PrivacyOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {REDACTION_ZONES.map((zone) => (
        <div
          key={zone.id}
          style={{
            top: zone.top,
            left: zone.left,
            width: zone.width,
            height: zone.height,
          }}
          className="absolute rounded-[var(--sys-radius-sm)] border border-white/40 backdrop-blur-xl bg-black/35 flex items-end p-2"
        >
          <span className="text-[11px] font-mono font-medium text-white bg-black/70 px-2 py-0.5 rounded-[var(--sys-radius-xs)]">
            {zone.label}
          </span>
        </div>
      ))}

      <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1.5 rounded-[var(--sys-radius-sm)] border border-white/15 inline-flex items-center gap-2 text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Privacy Shield Active</span>
      </div>
    </div>
  );
};

export default PrivacyOverlay;
