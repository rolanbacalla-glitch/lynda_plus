import React from 'react';

const Sessions: React.FC = () => {
  return (
    <div className="animate-fade-in py-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Sessions</h1>
          <p className="text-slate-500 font-medium">Scheduled research sessions and interview recordings.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 hover:scale-105 transition-all">Schedule Session</button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden text-center py-20">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-rounded text-slate-300 text-4xl font-light">videocam</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No upcoming sessions</h2>
        <p className="text-slate-400 max-w-sm mx-auto">Schedule your first interview session or upload a recording to get started.</p>
      </div>
    </div>
  );
};

export default Sessions;
