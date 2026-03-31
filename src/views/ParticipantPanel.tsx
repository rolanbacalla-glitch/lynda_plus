import React, { useState } from 'react';
import { mockParticipants } from '../data/mockData';
import ParticipantCard from '../components/ParticipantCard';

const ParticipantPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredParticipants = mockParticipants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-indigo-50/50 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-display text-slate-900">Participant Panel</h1>
          <p className="text-slate-500 max-w-md font-medium">Manage and target your pool of verified research participants with agentic precision.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl font-bold border border-indigo-100/50 shadow-premium hover:border-brand-600 transition-all group">
            <span className="material-symbols-rounded text-slate-600 group-hover:text-brand-600">download</span> 
            <span className="text-sm">Import CRM</span>
          </button>
          <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-[0.98]">
            <span className="material-symbols-rounded text-base">add</span>
            <span className="text-sm">Manual Add</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-600">search</span>
          <input
            type="text"
            placeholder="Search by name, role, or expertise (e.g. 'React', 'SaaS')..."
            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 placeholder-slate-400 text-sm font-medium transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 w-full lg:w-auto">
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredParticipants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
        
        {/* Recruitment Shortcut Card */}
        <button className="rounded-[32px] border-2 border-dashed border-indigo-100 hover:border-brand-600 hover:bg-brand-50/20 transition-all duration-500 group min-h-[220px] flex items-center justify-center p-8 bg-slate-50/30">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-indigo-50 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:border-brand-200 transition-all">
              <span className="material-symbols-rounded text-slate-600 group-hover:text-brand-600 text-3xl">bolt</span>
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">Smart Recruit</p>
              <p className="text-xs text-slate-500 font-medium max-w-[180px] mx-auto">Launch AI matching to find the perfect candidates</p>
            </div>
          </div>
        </button>
      </div>

      {filteredParticipants.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-rounded text-slate-300 text-4xl">search_off</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No participants found</h3>
          <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantPanel;
