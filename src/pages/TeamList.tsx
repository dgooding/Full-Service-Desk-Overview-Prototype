import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { 
  Search, Filter, MoreVertical, Activity, Plus, 
  Users, TrendingUp, ShieldCheck, Clock, 
  ChevronRight, ArrowRight, UserCircle, 
  BarChart3, Calendar, MessageSquare, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TeamList() {
  const { agents, addAgent, updateAgentStatus, sessions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddAgent = () => {
    const name = prompt("Enter agent name:");
    if (!name) return;
    addAgent({
      name,
      role: 'Tier 1 Specialist',
      status: 'offline',
      metrics: { csat: 100, fcr: 100, aht: "6m 00s", qaScore: 100 },
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}${Date.now()}`
    });
  };

  // Metrics for Roster Insights
  const avgQA = Math.round(agents.reduce((acc, a) => acc + a.metrics.qaScore, 0) / agents.length);
  const avgCSAT = Math.round(agents.reduce((acc, a) => acc + a.metrics.csat, 0) / agents.length);
  const onlineCount = agents.filter(a => a.status === 'online').length;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Quick Navigation */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm h-fit sticky top-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Activity size={14} className="text-blue-500" /> QUICK NAVIGATION
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Search Technician</label>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="Enter name..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-inner focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                 <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <span className="text-xs font-black text-slate-600 group-hover:text-slate-900">ACTIVE LISTS</span>
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">{agents.length}</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <span className="text-xs font-black text-slate-600 group-hover:text-slate-900">PENDING COACHING</span>
                    <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full">{agents.length - onlineCount}</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <span className="text-xs font-black text-slate-600 group-hover:text-slate-900">SYSTEM ARCHIVE</span>
                    <ChevronRight size={14} className="text-slate-300" />
                 </button>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group/banner">
                 <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                    <ShieldCheck size={80} />
                 </div>
                 <h4 className="text-sm font-black mb-2 relative z-10">Compliance Mode</h4>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed relative z-10 mb-4">Manual override disabled by policy.</p>
                 <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                    RE-VALIDATE <ArrowRight size={12} />
                 </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Frontline Tech Roster
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-200">COACHING OPERATIONS</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Holistic performance visibility and individual developmental management.</p>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={handleAddAgent} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 active:scale-95">
                 <Plus size={18} className="text-blue-400" />
                 EXPAND ROSTER
               </button>
            </div>
          </div>

          {/* Main Roster List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAgents.map(rep => {
              const lastSession = [...sessions].filter(s => s.repId === rep.id && s.status === 'completed').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
              
              return (
                <div key={rep.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                       <div className="relative">
                         <img src={rep.avatar} alt={rep.name} className="w-20 h-20 rounded-[2rem] border-4 border-white shadow-xl ring-1 ring-slate-100 object-cover" />
                         <div className={cn(
                           "absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full shadow-sm shadow-black/10",
                           rep.status === 'online' ? "bg-emerald-500" : rep.status === 'away' ? "bg-amber-500" : "bg-slate-300"
                         )}></div>
                       </div>
                       <div>
                         <Link to={`/team/${rep.id}`} className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight block mb-1">
                           {rep.name}
                         </Link>
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{rep.role}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-tighter">ID: {rep.id.toUpperCase()}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MessageSquare size={16} /></button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Calendar size={16} /></button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100 group/metric transition-colors hover:bg-white hover:border-blue-200">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Avg. QA Accuracy</span>
                       <div className="flex items-center justify-between">
                          <span className={cn("text-2xl font-black", rep.metrics.qaScore >= 90 ? "text-emerald-600" : "text-amber-600")}>{rep.metrics.qaScore}%</span>
                          <div className="h-2 w-12 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600" style={{ width: `${rep.metrics.qaScore}%` }}></div>
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100 group/metric transition-colors hover:bg-white hover:border-emerald-200">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Customer CSAT</span>
                       <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900">{rep.metrics.csat}%</span>
                          <TrendingUp size={16} className="text-emerald-500" />
                       </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden group/footer">
                     <div className="absolute right-0 top-0 p-4 opacity-10 text-white group-hover/footer:rotate-12 transition-transform">
                        <Activity size={40} />
                     </div>
                     <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">RECENT SESSION STATUS</span>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                           {lastSession ? 'VALIDATED' : 'PENDING LOG'}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                               <Clock size={14} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-white uppercase tracking-tighter">{lastSession ? lastSession.date : 'N/A'}</span>
                               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Last Diagnostic</span>
                            </div>
                         </div>
                         <Link to={`/team/${rep.id}`} className="px-4 py-2 bg-white text-slate-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-50 transition-colors">
                            DETAILS
                         </Link>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roster Insights Section: Now at bottom */}
          <div className="pt-12 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-8 ml-2">ROSTER INSIGHTS & CAPACITY</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Users size={30} />
                 </div>
                 <div>
                    <div className="text-3xl font-black text-slate-900">{agents.length}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIVE TECH PERSONAS</div>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                    <TrendingUp size={30} />
                 </div>
                 <div>
                    <div className="text-3xl font-black text-slate-900">{avgQA}%</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TEAM ACCURACY RATING</div>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-xl">
                    <ShieldCheck size={30} />
                 </div>
                 <div>
                    <div className="text-3xl font-black text-slate-900">{onlineCount}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVE COVERAGE RATIO</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Status Footer */}
      <div className="mt-12 bg-slate-900 rounded-3xl p-6 flex items-center justify-between text-white border border-slate-800">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black tracking-widest uppercase">Live Status: Operational</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Last sync verified at {new Date().toLocaleTimeString()}</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roster Integrity</span>
               <span className="text-xs font-bold text-white">100% Validated</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 p-2.5 flex items-center justify-center text-blue-400">
               <Activity size={24} />
            </div>
         </div>
      </div>
    </div>
  );
}
