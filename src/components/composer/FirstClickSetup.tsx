import React, { useState } from 'react';

interface FirstClickConfig {
  task?: string;
  successCriteria?: string;
}

interface FirstClickSetupProps {
  onChange: (config: FirstClickConfig) => void;
  config?: FirstClickConfig;
}

const FirstClickSetup: React.FC<FirstClickSetupProps> = ({ onChange, config }) => {
  const [task, setTask] = useState(config?.task || '');
  const [successCriteria, setSuccessCriteria] = useState(config?.successCriteria || '');

  const handleChange = (field: keyof FirstClickConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload & Area Selection */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-10 flex flex-col items-center justify-center text-center group hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-rounded text-slate-400 group-hover:text-emerald-600">ads_click</span>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Click to upload target image</h4>
          <p className="text-xs text-slate-500 font-medium max-w-[200px]">Participants will click on this image to complete their task.</p>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">The Task</label>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
              rows={3}
              placeholder="e.g. 'Where would you click to upgrade your subscription?'"
              value={task}
              onChange={(e) => { setTask(e.target.value); handleChange('task', e.target.value); }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Internal Success Note</label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="e.g. 'Upgrade CTA in top right navigation area'"
              value={successCriteria}
              onChange={(e) => { setSuccessCriteria(e.target.value); handleChange('successCriteria', e.target.value); }}
            />
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
             <span className="material-symbols-rounded text-amber-500">info</span>
             <div className="text-[11px] text-amber-700 font-medium leading-relaxed">
               <strong>Pro Tip:</strong> Ensure your screenshot has enough visual context! Participants perform better when the UI elements are clearly visible.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstClickSetup;
