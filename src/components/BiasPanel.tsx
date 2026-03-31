import React from 'react';

interface BiasMetric {
  id: string;
  text: string;
  status: 'Neutral' | 'Leading' | 'Biased';
  score: number;
}

const BiasPanel: React.FC = () => {
  const [appliedDetections, setAppliedDetections] = React.useState<string[]>([]);

  const handleApply = (id: string) => {
    setAppliedDetections([...appliedDetections, id]);
  };

  const metrics: BiasMetric[] = [
    { id: '1', text: "How much do you love this feature?", status: 'Leading', score: 28 },
    { id: '2', text: "Describe your frustration with the checkout.", status: 'Biased', score: 42 },
    { id: '3', text: "Walk me through your thought process when...", status: 'Neutral', score: 96 }
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-8 space-y-8 animate-fade-in group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">Observer Bias Detector</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time script auditing</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm transition-transform group-hover:rotate-12 duration-500">
          <span className="material-symbols-rounded">shield_with_heart</span>
        </div>
      </div>

      {/* Global Neutrality Meter */}
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <span>Overall Neutrality</span>
          <span className="text-rose-500">{appliedDetections.length > 0 ? '88% RESONANCE' : '62% RESONANCE'}</span>
        </div>
        <div className="h-2 bg-slate-50 rounded-full border border-slate-100 overflow-hidden p-0.5">
          <div className={`h-full bg-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(244,114,182,0.4)] ${appliedDetections.length > 0 ? 'w-[88%]' : 'w-[62%]'}`} />
        </div>
      </div>

      {/* Real-time Detections */}
      <div className="space-y-4">
         {metrics.map((metric) => {
           const isApplied = appliedDetections.includes(metric.id);
           return (
             <div key={metric.id} className={`p-4 rounded-2xl border transition-all duration-500 ${
               metric.status === 'Neutral' || isApplied
               ? 'bg-emerald-50/20 border-emerald-100/50' 
               : 'bg-rose-50/20 border-rose-100/50 scale-[0.98]'
             }`}>
               <div className="flex justify-between gap-4 mb-2">
                 <p className={`text-sm font-bold leading-tight transition-all duration-500 ${isApplied ? 'text-emerald-700' : 'text-slate-800'}`}>
                   {isApplied ? `Refined: "What are your first impressions of this feature?"` : metric.text}
                 </p>
                 <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                   metric.status === 'Neutral' || isApplied ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                 }`}>
                   {isApplied ? 'NEUTRALISED' : metric.status}
                 </span>
               </div>
               
               {metric.status !== 'Neutral' && !isApplied && (
                 <button 
                  onClick={() => handleApply(metric.id)}
                  className="w-full flex items-center justify-center gap-2 mt-3 p-2 bg-white rounded-lg border border-rose-100 hover:border-brand-300 hover:text-brand-600 transition-all text-[10px] font-black uppercase tracking-widest text-rose-500 group/btn"
                 >
                   <span className="material-symbols-rounded text-base group-hover/btn:rotate-180 transition-transform duration-500">magic_button</span>
                   Apply Auto-Correct
                 </button>
               )}
             </div>
           );
         })}
      </div>

      <button className="w-full py-4 rounded-2xl text-slate-900 font-bold bg-slate-50 border border-slate-100 hover:bg-white hover:border-brand-100 transition-all text-xs uppercase tracking-widest shadow-sm">
        Recalibrate Model
      </button>
    </div>
  );
};

export default BiasPanel;
