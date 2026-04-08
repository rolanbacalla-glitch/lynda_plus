import React, { useState, useEffect } from 'react';

const TIPS = [
  "Insight: Participant #48 showed 12% higher frustration than the median.",
  "Proactive: I've identified a recurring theme of 'Search Confusion'.",
  "Status: AI pipeline is 100% synchronized with live session.",
  "Tip: Try asking about the checkout flow next; there's a micro-hesitation there.",
  "Success: I've redacted 4 instances of PII in the last 2 minutes."
];

const AgenticAssistant: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % TIPS.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 mt-6">
      <div className="p-6 rounded-[32px] bg-slate-900 border border-white/10 shadow-premium-dark relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand-500/20">
              <span className="material-symbols-rounded text-sm animate-pulse">psychology</span>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest tracking-tight">Agentic Assistant</p>
          </div>
          <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400" /> Live
          </span>
        </div>

        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-xs font-bold text-white leading-relaxed line-clamp-3">
            {TIPS[currentTip]}
          </p>
        </div>

        {/* Action Button */}
        <button className="mt-4 text-[10px] font-bold text-brand-300 hover:text-brand-200 uppercase tracking-[0.15em] flex items-center gap-2 transition-colors">
          View Detail <span className="text-xs">→</span>
        </button>

        {/* Decorative Particles */}
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand-500/20 rounded-full blur-xl group-hover:bg-brand-500/40 transition-all" />
      </div>
    </div>
  );
};

export default AgenticAssistant;
