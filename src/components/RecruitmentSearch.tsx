import React from 'react';

const RecruitmentSearch: React.FC = () => {
  return (
    <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-premium border border-indigo-100/50 p-2 pl-8 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-500 group/search">
      {/* Location */}
      <div className="flex-1 px-5 py-3 border-r border-indigo-50 hover:bg-indigo-50/30 rounded-l-full cursor-pointer transition-colors group/loc">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5 group-hover/loc:text-brand-600 transition-colors">Location</p>
        <p className="text-[13px] font-semibold text-slate-900 truncate">Rinjani, Indonesia</p>
      </div>

      {/* Check In */}
      <div className="flex flex-1 px-5 py-3 border-r border-indigo-50 hover:bg-indigo-50/30 cursor-pointer transition-colors items-center justify-between group/in">
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5 group-hover/in:text-brand-600 transition-colors">Check In</p>
          <p className="text-[13px] font-semibold text-slate-900">27/01/2025</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg group-hover/in:bg-indigo-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-600 group-hover/in:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Check Out */}
      <div className="flex flex-1 px-5 py-3 border-r border-indigo-50 hover:bg-indigo-50/30 cursor-pointer transition-colors items-center justify-between group/out">
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5 group-hover/out:text-brand-600 transition-colors">Check Out</p>
          <p className="text-[13px] font-semibold text-slate-900">30/01/2025</p>
        </div>
        <div className="p-1.5 bg-slate-50 rounded-lg group-hover/out:bg-indigo-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-600 group-hover/out:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* People */}
      <div className="flex-2 px-6 py-3 hover:bg-indigo-50/30 cursor-pointer transition-colors group/ppl">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5 group-hover/ppl:text-brand-600 transition-colors">People</p>
        <p className="text-[13px] font-semibold text-slate-900">5 People, 1 Child</p>
      </div>

      {/* Search Button */}
      <button className="bg-slate-950 hover:bg-brand-600 text-white p-4 rounded-full ml-3 transition-all duration-300 shadow-lg hover:shadow-brand-500/25 active:scale-95 group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default RecruitmentSearch;
