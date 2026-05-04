import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Printer, Maximize2, AlertTriangle, ArrowUpRight, 
  Target, Activity, TrendingUp, Calendar as CalendarIcon, 
  CheckCircle2, Clock, Users, ArrowRight, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function CoachingEmbed() {
  const { agents } = useStore();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Mock data for upcoming sessions tailored to IT Service Desk
  const upcomingCoaching = [
    { id: 1, agentId: agents[0]?.id, agent: agents[0]?.name || 'Sarah Chen', date: 'Today, 2:00 PM', topic: 'FCR Drop on VPN Issues', status: 'overdue' },
    { id: 2, agentId: agents[1]?.id, agent: agents[1]?.name || 'Marcus Green', date: 'Tomorrow, 10:30 AM', topic: 'De-escalation Techniques', status: 'upcoming' },
    { id: 3, agentId: agents[2]?.id, agent: agents[2]?.name || 'Alex Johnson', date: 'Wed, 1:15 PM', topic: 'Tier 2 Escalation Process', status: 'upcoming' },
    { id: 4, agentId: agents[3]?.id, agent: agents[3]?.name || 'Priya Patel', date: 'Thu, 9:00 AM', topic: 'Handle Time Optimization', status: 'upcoming' },
  ];

  // Coaching Themes
  const coachingThemes = [
    { theme: 'VPN Troubleshooting Process', count: 8, trend: 'up' },
    { theme: 'De-escalation & Empathy', count: 5, trend: 'down' },
    { theme: 'First Contact Resolution', count: 4, trend: 'stable' },
    { theme: 'Ticket Logging Accuracy', count: 3, trend: 'up' },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className={cn("space-y-8 pb-20 relative", isFullscreen ? "fixed inset-0 z-50 bg-slate-50 p-8 overflow-y-auto" : "")}>
      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">MANAGEMENT COACHING OVERVIEW</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">IT Service Desk Performance Intelligence • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Confidential Report</p>
            <div className="flex items-center gap-2 justify-end text-brand-600 font-bold">
              <Activity size={16} />
              <span>LeadCoach Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">IT Service Desk Coaching</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active action plans, scheduled 1:1s, and team coaching trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <Printer size={16} />
            Export Plan
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
          >
            <Maximize2 size={16} />
            {isFullscreen ? "Exit Focus Mode" : "Enter Coach Focus Mode"}
          </button>
        </div>
      </div>

      {/* Control Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            Sessions (MTD)
            <CalendarIcon size={14} className="text-blue-500" />
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-black text-slate-800 tracking-tight">18</span>
            <span className="text-sm font-bold text-slate-400">/ 24</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm shadow-orange-100 relative overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            Action Items Overdue
            <AlertTriangle size={14} className="text-orange-500" />
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-black text-orange-600 tracking-tight">3</span>
          </div>
          <div className="flex items-center gap-1 mt-auto">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Requires Follow-up</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm shadow-emerald-100 relative overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex justify-between">
            Post-Coaching Impact
            <TrendingUp size={14} className="text-emerald-500" />
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">+5.2%</span>
          </div>
          <div className="flex items-center gap-1 mt-auto">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Avg CSAT Increase</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm relative overflow-hidden text-white">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex justify-between">
            Top Coaching Theme
            <Target size={14} className="text-brand-400" />
          </h3>
          <div className="flex items-baseline gap-2 mb-3 mt-2">
            <span className="text-xl font-black tracking-tight leading-tight">VPN Troubleshooting</span>
          </div>
          <div className="flex items-center gap-1 mt-auto">
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">8 Active Plans</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Coaching Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-brand-500" />
              Upcoming Coaching
            </h3>
            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View Calendar
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingCoaching.map((session) => (
              <div 
                key={session.id} 
                onClick={() => session.agentId && navigate(`/team/${session.agentId}`)}
                className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-all cursor-pointer group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{session.agent}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      session.status === 'overdue' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {session.date}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{session.topic}</p>
                </div>
                <button className="self-center p-2 text-slate-400 group-hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => toast.info('Scheduling interface coming soon')}
            className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm rounded-2xl hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
          >
            + Schedule New Session
          </button>
        </div>

        {/* Team Coaching Themes */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-brand-500" />
              Team IT Themes
            </h3>
          </div>
          
          <div className="space-y-6 flex-1">
            {coachingThemes.map((theme, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-700">{theme.theme}</span>
                  <span className="text-xs font-bold text-slate-400">{theme.count} Agents Coached</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(theme.count / 10) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0 ? "bg-brand-500" : 
                      i === 1 ? "bg-orange-400" : 
                      i === 2 ? "bg-emerald-500" : "bg-blue-400"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-brand-50 rounded-2xl border border-brand-100">
            <div className="flex gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                <Target size={16} className="text-brand-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Recommended Action</h4>
                <p className="text-xs text-slate-600">Assign the "Network Connectivity Troubleshooting" module to the 8 agents struggling with VPN issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Logs List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 page-break-before">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Coaching Notes</h3>
          <button className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1 print:hidden">
            View All Notes <ArrowUpRight size={14} />
          </button>
        </div>
        
        {/* ... (rest of the logs list) ... */}
        {/* (I'll keep the existing list, but adding the summary below) */}

        <div className="space-y-3">
          {agents.slice(0, 5).map((agent, idx) => (
            <div 
              key={agent.id} 
              onClick={() => navigate(`/team/${agent.id}`)}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-brand-50 transition-all cursor-pointer border border-transparent hover:border-brand-100 group gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm font-bold text-brand-600 shrink-0 group-hover:scale-110 transition-transform">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-700 truncate">{agent.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {idx === 0 ? 'CALL REVIEW' : idx === 1 ? '1:1 CHECK-IN' : 'QA DISPUTE RESOLUTION'} • 4/{28 - idx}/2026
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:border-l sm:border-slate-200 sm:pl-4">
                <div className="text-sm text-slate-600 font-medium truncate max-w-[200px] lg:max-w-[400px]">
                  {idx === 0 ? "Discussed empathy during long outage hold times..." : 
                   idx === 1 ? "Reviewed FCR improvements from last week's action plan..." : 
                   "Clarified Escalation Tier 2 scope boundaries..."}
                </div>
                <button className="p-2 text-slate-400 group-hover:text-brand-600 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-brand-200 transition-all shrink-0 print:hidden">
                   <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden print:block mt-12 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-4">Executive Manager Summary</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Strategic Focus</h4>
            <p className="text-sm text-slate-700 leading-relaxed">The current coaching cycle is heavily focused on <span className="font-bold text-brand-600">VPN Troubleshooting Proficiency</span> following recent infrastructure updates. We are seeing a strong correlation between these sessions and the <span className="font-bold text-emerald-600">5.2% CSAT increase</span> observed this month.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Operational Risks</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>3 Critical action items are currently overdue (Avg 2.4 days)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Tier 2 Escalation process requires team-wide review</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-[10px] text-slate-400 font-medium text-center border-t border-slate-50 pt-4 italic">
          This document was automatically generated by LeadCoach Intelligence. Final approval by Service Desk Manager required.
        </div>
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsCalendarOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Coaching Calendar</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">May 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                  <button onClick={() => setIsCalendarOpen(false)} className="ml-4 p-2 text-slate-300 hover:text-slate-600 transition-all">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const session = upcomingCoaching.find(s => {
                      if (day === 17) return s.id === 1; // Today
                      if (day === 18) return s.id === 2; // Tomorrow
                      return false;
                    });
                    
                    return (
                      <div key={i} className={cn(
                        "bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors relative group",
                        day === 17 && "bg-brand-50/30"
                      )}>
                        <span className={cn(
                          "text-xs font-bold",
                          day === 17 ? "text-brand-600 w-6 h-6 bg-brand-50 flex items-center justify-center rounded-full" : "text-slate-400"
                        )}>{day}</span>
                        
                        {session && (
                          <div 
                            onClick={() => {
                              setIsCalendarOpen(false);
                              navigate(`/team/${session.agentId}`);
                            }}
                            className={cn(
                              "mt-1 p-1.5 rounded-lg text-[10px] font-bold leading-tight cursor-pointer hover:scale-105 transition-transform",
                              session.status === 'overdue' ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            )}
                          >
                            <div className="truncate">{session.agent}</div>
                            <div className="opacity-70 truncate">{session.topic}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

