import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  MessageCircle, 
  ExternalLink,
  Circle,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function TeamList() {
  const { agents } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Team Operations</h1>
          <p className="text-slate-500 font-medium">Manage technicians, monitor status, and access deep-dive profiles.</p>
        </div>
        <Link to="/team/new" className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Plus size={18} />
          Onboard Representative
        </Link>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, role or skill..." 
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {['all', 'online', 'in-call', 'away', 'offline'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                filter === f 
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20" 
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {f}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <button onClick={() => toast.info('Advanced filter panel opened')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Agent Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAgents.map((agent) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={agent.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col"
          >
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-2xl object-cover bg-slate-100 ring-4 ring-slate-50" />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center",
                    agent.status === 'online' ? "bg-emerald-500" : 
                    agent.status === 'in-call' ? "bg-brand-500" :
                    agent.status === 'away' ? "bg-amber-500" : "bg-slate-400"
                  )}>
                    <Circle size={8} fill="white" className="text-white" />
                  </div>
                </div>
                <button onClick={(e) => { e.preventDefault(); toast.info(`Options menu opened for ${agent.name}`) }} className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{agent.name}</h3>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest leading-relaxed">{agent.role}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 mb-4">
                <div className="text-center">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">CSAT</span>
                  <span className="text-lg font-black text-slate-700">{agent.metrics.csat}%</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">QA Score</span>
                  <span className={cn(
                    "text-lg font-black",
                    agent.metrics.qaScore > 90 ? "text-emerald-600" : 
                    agent.metrics.qaScore > 80 ? "text-slate-700" : "text-rose-600"
                  )}>
                    {agent.metrics.qaScore}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">AHT</span>
                  <span className="text-lg font-black text-slate-700">{agent.metrics.aht}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {Object.entries(agent.skills || {}).slice(0, 3).map(([skill]) => (
                  <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-100">
                    {skill}
                  </span >
                ))}
                {Object.keys(agent.skills || {}).length > 3 && (
                  <span className="text-[10px] font-bold text-slate-400">+{Object.keys(agent.skills || {}).length - 3} more</span>
                )}
              </div>
            </div>

            <div className="mt-auto p-4 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 shadow-sm bg-white p-1 rounded-xl">
                <button onClick={(e) => { e.preventDefault(); window.location.href = `mailto:${agent.name.toLowerCase().replace(' ', '.')}@company.com`; toast.success(`Drafting email to ${agent.name}`) }} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                  <Mail size={16} />
                </button>
                <button onClick={(e) => { e.preventDefault(); toast.success(`Opening Teams chat with ${agent.name}`) }} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                  <MessageCircle size={16} />
                </button>
              </div>
              <Link 
                to={`/team/${agent.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                View Profile
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No representatives found</h3>
          <p className="text-slate-500">Try adjusting your search filters or status</p>
        </div>
      )}
    </div>
  );
}
