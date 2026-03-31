import React, { useState, useEffect } from 'react';

const PrivacyOverlay: React.FC = () => {
  const [activeDetections, setActiveDetections] = useState([
    { id: 1, label: 'FACE', top: '15%', left: '25%', width: '120px', height: '140px' },
    { id: 2, label: 'ID_CARD', top: '65%', left: '45%', width: '180px', height: '100px' }
  ]);

  // Simulate movement/jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDetections(prev => prev.map(d => ({
        ...d,
        top: `${parseFloat(d.top) + (Math.random() * 0.4 - 0.2)}%`,
        left: `${parseFloat(d.left) + (Math.random() * 0.4 - 0.2)}%`
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl">
      {activeDetections.map((det) => (
        <div 
          key={det.id}
          className="absolute border-2 border-brand-500/50 transition-all duration-300 ease-linear flex flex-col justify-end p-2"
          style={{ 
            top: det.top, 
            left: det.left, 
            width: det.width, 
            height: det.height,
            backgroundColor: 'rgba(79, 70, 229, 0.05)'
          }}
        >
          {/* Masking Blur */}
          <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/10" />
          
          {/* Label Tag */}
          <span className="relative z-10 bg-brand-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest w-fit mb-1 shadow-sm">
            {det.label} • REDACTED
          </span>
          
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-300 shadow-[0_0_8px_rgba(79,70,229,0.5)] animate-scan-slow opacity-50" />
        </div>
      ))}

      {/* Global Status Indicator */}
      <div className="absolute bottom-6 left-6 bg-slate-900/90 text-white px-4 py-2 rounded-xl backdrop-blur-md border border-slate-700/50 flex items-center gap-3 shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Shield: ACTIVE</span>
      </div>
    </div>
  );
};

export default PrivacyOverlay;
