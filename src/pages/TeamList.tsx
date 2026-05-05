import React, { useState, useEffect } from 'react';
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
  Plus,
  LayoutGrid,
  List,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function TeamList() {
  const { agents, logCommunication } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "simple">("grid");

  useEffect(() => {
    if (location.state?.filter) {
      setFilter(location.state.filter);
    }
  }, [location.state]);

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.role.toLowerCase().includes(search.toLowerCase());
    
    let matchesFilter = filter === 'all' || a.status === filter;
    
    if (filter === 'needs-support') {
      matchesFilter = a.metrics.qaScore < 80 || a.metrics.csat < 80;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      <Link to="/executive" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} />
        Back to Executive Dashboard
      </Link>
      
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
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <button
            onClick={() => setFilter('needs-support')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2",
              filter === 'needs-support' 
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20" 
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            )}
          >
            <AlertTriangle size={12} />
            Needs Support
          </button>
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl items-center ring-1 ring-slate-200/50">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid" ? "bg-white text-brand-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("simple")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "simple" ? "bg-white text-brand-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <button onClick={() => toast.info('Advanced filter panel opened')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Agent Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
                        const subject = "Intelligence Sync";
                        logCommunication({
                          agentId: agent.id,
                          agentName: agent.name,
                          type: 'Outlook Invite',
                          subject
                        });
                        window.location.href = `mailto:${email}?subject=${subject}`; 
                        toast.success(`Drafting email to ${agent.name}`) 
                      }} 
                      className="p-2 text-slate-400 hover:text-[#0078d4] hover:bg-blue-50 rounded-lg transition-all"
                      title="Outlook Invite"
                    >
                      <Mail size={16} />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
                        logCommunication({
                          agentId: agent.id,
                          agentName: agent.name,
                          type: 'Teams Chat',
                          subject: `Quick check-in with ${agent.name}`
                        });
                        window.open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank');
                        toast.success(`Opening Teams chat with ${agent.name}`) 
                      }} 
                      className="p-2 text-slate-400 hover:text-[#444791] hover:bg-indigo-50 rounded-lg transition-all"
                      title="Teams Chat"
                    >
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
        ) : (
          <motion.div
            key="simple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Representative</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CSAT</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">QA SCORE</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AHT</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Skills</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAgents.map((agent) => (
                    <tr 
                      key={agent.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/team/${agent.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={agent.avatar} alt="" className="w-8 h-8 rounded-lg bg-slate-100" />
                          <div>
                            <div className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors uppercase">{agent.name}</div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{agent.role.split(' ')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            agent.status === 'online' ? "bg-emerald-500" : 
                            agent.status === 'in-call' ? "bg-brand-500" :
                            agent.status === 'away' ? "bg-amber-500" : "bg-slate-400"
                          )} />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{agent.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-black text-slate-700">{agent.metrics.csat}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "text-sm font-black",
                          agent.metrics.qaScore > 90 ? "text-emerald-600" : 
                          agent.metrics.qaScore > 80 ? "text-slate-700" : "text-rose-600"
                        )}>{agent.metrics.qaScore}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-black text-slate-700">{agent.metrics.aht}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          {Object.entries(agent.skills || {}).slice(0, 2).map(([skill]) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded leading-none">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
                              logCommunication({
                                agentId: agent.id,
                                agentName: agent.name,
                                type: 'Teams Chat',
                                subject: `Quick check-in with ${agent.name}`
                              });
                              window.open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank');
                              toast.success(`Chatting with ${agent.name}`) 
                            }} 
                            className="p-1.5 text-slate-400 hover:text-[#444791] rounded-lg"
                          >
                            <MessageCircle size={14} />
                          </button>
                          <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                navigate(`/team/${agent.id}`);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
