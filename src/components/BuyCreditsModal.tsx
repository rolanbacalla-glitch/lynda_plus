import React from 'react';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, onPurchase }) => {
  if (!isOpen) return null;

  const options = [
    { id: 1, amount: 5, price: "£19", label: "Quick Top-up", desc: "Best for single sessions." },
    { id: 2, amount: 20, price: "£69", label: "Researcher Pack", desc: "Popular for week-long studies.", featured: true },
    { id: 3, amount: 100, price: "£299", label: "Enterprise Scale", desc: "High-volume multimodal analysis." }
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-8 text-slate-900 font-display">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase text-brand-600">Refill AI Intelligence</h2>
              <p className="text-slate-500 font-medium tracking-tight">Purchase additional Gemini 1.5 Pro synthesis hours for your workspace.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
              <span className="material-symbols-rounded text-slate-400">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => onPurchase(option.amount)}
                className={`flex flex-col p-6 rounded-3xl text-left transition-all group ${option.featured
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20 ring-4 ring-brand-500/10 -translate-y-1'
                  : 'bg-slate-50 border border-slate-100 text-slate-800 hover:border-brand-500 hover:bg-white'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${option.featured ? 'text-brand-100' : 'text-brand-600'}`}>
                  {option.label}
                </span>
                <div className="text-3xl font-bold mb-1">+{option.amount}h</div>
                <div className={`text-sm font-bold mb-4 opacity-80 ${option.featured ? 'text-white' : 'text-slate-500'}`}>{option.price}</div>
                <p className={`text-[11px] leading-tight font-medium ${option.featured ? 'text-brand-50' : 'text-slate-400'}`}>
                  {option.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-rounded text-sm">payments</span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Secured by Stripe Enterprise</p>
            </div>
            <p className="text-[11px] font-medium text-slate-400 font-medium tracking-tight">Purchase reflects instantly on your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
