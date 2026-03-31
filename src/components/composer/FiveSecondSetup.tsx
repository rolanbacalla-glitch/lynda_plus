import React, { useState } from 'react';

interface FiveSecondConfig {
  duration?: number;
  instructions?: string;
}

interface FiveSecondSetupProps {
  onChange: (config: FiveSecondConfig) => void;
  config?: FiveSecondConfig;
}

const FiveSecondSetup: React.FC<FiveSecondSetupProps> = ({ onChange, config }) => {
  const [duration, setDuration] = useState(config?.duration || 5);
  const [instructions, setInstructions] = useState(config?.instructions || '');

  const handleChange = (field: keyof FiveSecondConfig, value: string | number) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-10 flex flex-col items-center justify-center text-center group hover:border-brand-300 hover:bg-brand-50/20 transition-all cursor-pointer min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-rounded text-slate-400 group-hover:text-brand-600">image</span>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Click to upload screenshot</h4>
          <p className="text-xs text-slate-500 font-medium max-w-[200px]">Supports PNG, JPG, or Figma frames. Max 10MB.</p>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Test Duration</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {[5, 10, 20].map((d) => (
                <button
                  key={d}
                  onClick={() => { setDuration(d); handleChange('duration', d); }}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${duration === d ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {d} Seconds
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Participant Prompt</label>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300"
              rows={4}
              placeholder="e.g. 'What do you remember about the main call to action?'"
              value={instructions}
              onChange={(e) => { setInstructions(e.target.value); handleChange('instructions', e.target.value); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveSecondSetup;
