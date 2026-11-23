import React, { useEffect } from 'react';
import { X, Check, CreditCard } from 'lucide-react';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const CREDIT_PACKS = [
  {
    id: 'quick',
    amount: 5,
    price: '£19',
    rate: '£3.80 / hr',
    label: 'Single Study Pack',
    desc: 'Covers 5 hours of live recording & transcript synthesis.',
    featured: false,
  },
  {
    id: 'team',
    amount: 20,
    price: '£69',
    rate: '£3.45 / hr',
    label: 'Sprint Research Pack',
    desc: 'Ideal for weekly continuous discovery and highlight reels.',
    featured: true,
  },
  {
    id: 'scale',
    amount: 100,
    price: '£299',
    rate: '£2.99 / hr',
    label: 'Quarterly Scale Pack',
    desc: 'Best value for multi-squad research operations.',
    featured: false,
  },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, onPurchase }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="credits-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="credits-modal-title"
                className="text-xl font-bold text-[var(--sys-on-surface)]"
              >
                Add Synthesis Hours
              </h2>
              <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
                Credits apply immediately to transcription, Privacy Shield redaction, and thematic synthesis.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-10 h-10 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tabular-nums">
            {CREDIT_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => onPurchase(pack.amount)}
                className={`text-left p-5 rounded-[var(--sys-radius-md)] border transition-colors flex flex-col justify-between gap-4 cursor-pointer ${
                  pack.featured
                    ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                    : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface)] hover:border-[var(--sys-outline)]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">{pack.label}</span>
                    {pack.featured && <Check className="w-4 h-4 shrink-0" />}
                  </div>
                  <p className="text-2xl font-bold font-mono">+{pack.amount} hrs</p>
                  <p className="text-xs opacity-80">
                    {pack.price} · {pack.rate}
                  </p>
                </div>
                <p className="text-xs leading-relaxed opacity-85">{pack.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--sys-on-surface-tertiary)]">
            <span className="inline-flex items-center gap-2 text-[var(--sys-on-surface-secondary)] font-medium">
              <CreditCard className="w-4 h-4" />
              Unused hours roll over across billing cycles
            </span>
            <span>Instant workspace provisioning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
