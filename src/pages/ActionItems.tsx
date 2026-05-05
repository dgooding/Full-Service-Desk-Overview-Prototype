import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, Clock, 
  CheckCircle2, User, ChevronRight,
  Filter, Search, MessageCircle
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ActionItems() {
  const navigate = useNavigate();
  const { agents, logCommunication } = useStore();

  const handleRemind = (item: any) => {
    const agent = agents.find(a => a.id === item.agentId);
    if (!agent) return;

    const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `Overdue Task: ${item.task}`;
    
    logCommunication({
      agentId: agent.id,
      agentName: agent.name,
      type: 'Teams Chat',
      subject
    });

    window.open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank');
    toast.success(`Reminder sent to ${agent.name} via Teams`);
  };

  // Sample overdue action items
  const overdueItems = [
    {
      id: 'AI-001',
      agentId: agents[0]?.id,
      agentName: agents[0]?.name || 'Alex Johnson',
      task: 'Complete VPN Troubleshooting Module',
      dueDate: '2026-04-28',
      daysOverdue: 6,
      category: 'Technical Skills',
      priority: 'high'
    },
    {
      id: 'AI-002',
      agentId: agents[1]?.id,
      agentName: agents[1]?.name || 'Marcus Green',
      task: 'Review high-escalation ticket #INC-4492',
      dueDate: '2026-04-30',
      daysOverdue: 4,
      category: 'Ticket Management',
      priority: 'medium'
    },
    {
      id: 'AI-003',
      agentId: agents[2]?.id,
      agentName: agents[2]?.name || 'Alex Johnson',
      task: 'Self-assessment on Tone & Empathy',
      dueDate: '2026-05-01',
      daysOverdue: 3,
      category: 'Soft Skills',
      priority: 'medium'
    }
  ];

  const handleResolve = (item: any) => {
    logCommunication({
      agentId: item.agentId,
      agentName: item.agentName,
      type: 'Technical Sync',
      subject: `Action Item Resolved: ${item.task}`
    });
    toast.success(`Task "${item.task}" marked as resolved`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/coaching')}
          className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overdue Action Items</h1>
          <p className="text-sm text-slate-500 mt-1">Strategic follow-ups requiring immediate administrative attention.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search items, agents, or categories..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all w-full md:w-auto justify-center">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="grid gap-4">
        {overdueItems.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-brand-200 transition-all group"
          >
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className={cn(
                "p-4 rounded-2xl shrink-0",
                item.priority === 'high' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
              )}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.id}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    item.priority === 'high' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {item.daysOverdue} Days Overdue
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{item.task}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <User size={14} className="text-slate-400" />
                    {item.agentName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    Due {item.dueDate}
                  </div>
                  <div className="hidden sm:block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button 
                onClick={() => handleRemind(item)}
                className="px-4 py-2 border border-[#444791] text-[#444791] rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <MessageCircle size={14} />
                Remind
              </button>
              <button 
                onClick={() => navigate(`/team/${item.agentId}`)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                View Agent
              </button>
              <button 
                onClick={() => handleResolve(item)}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95 flex items-center gap-2"
              >
                Mark Resolved
                <CheckCircle2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
