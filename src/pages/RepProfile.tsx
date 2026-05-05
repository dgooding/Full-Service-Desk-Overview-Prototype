import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { 
  ArrowLeft, 
  ArrowUpRight,
  Mail, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History,
  Target,
  FileText,
  Clock,
  MoreVertical,
  Plus,
  Zap,
  Award,
  ChevronRight,
  Presentation,
  ShieldCheck,
  Settings2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { toast } from 'sonner';
import { SKILL_CATEGORIES, ALL_SKILL_IDS } from '../constants/skills';

export default function RepProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, qaReviews, performance, goals, notes, addGoal, addNote, executiveReps, logCommunication } = useStore();
  const [activeTab, setActiveTab] = useState('insights');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [coachingIssue, setCoachingIssue] = useState('FCR Issue');
  const [coachingDate, setCoachingDate] = useState('');
  const [coachingTime, setCoachingTime] = useState('');
  const [coachingLink, setCoachingLink] = useState('');

  let agent = agents.find(a => a.id === id);
  if (!agent && executiveReps) {
    const orgRep = executiveReps.find(r => r.repId === id);
    if (orgRep) {
      agent = {
        id: orgRep.repId,
        name: orgRep.fullName,
        role: "IT Service Desk T1",
        status: 'offline',
        metrics: {
          csat: orgRep.customerSat_pct,
          fcr: orgRep.firstCallResolution_pct,
          aht: `${Math.floor(orgRep.avgHandleTime_min)}m ${Math.floor((orgRep.avgHandleTime_min % 1) * 60)}s`,
          qaScore: orgRep.qualityScore
        },
        skills: { "VPN & Connectivity": 3, "Hardware Diagnostic": 4, "Software Provisioning": 3 },
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(orgRep.fullName)}&background=020617&color=ffffff`
      };
    }
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Representative not found</h2>
        <button onClick={() => navigate('/team')} className="mt-4 text-brand-600 font-bold hover:underline">
          Back to Team List
        </button>
      </div>
    );
  }

  const agentQA = qaReviews.filter(r => r.repId === id);
  const agentGoals = goals.filter(g => g.repId === id);
  const agentNotes = notes.filter(n => n.repId === id);

  // Filter skills for radar to avoid crowding
  const skillsData = SKILL_CATEGORIES.flatMap(cat => 
    cat.skills.map(s => ({
      subject: s.name,
      A: (agent?.skills as any)?.[s.id] || 0,
      fullMark: 5
    }))
  ).slice(0, 8); // Just show top 8 for the radar

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote({ repId: agent?.id || '', content: noteContent });
    setNoteContent("");
    setIsNoteModalOpen(false);
    toast.success("Internal note added successfully");
  };

  const handleSchedule1on1 = () => {
    const email = `${agent?.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `1:1 Sync - ${agent?.name}`;
    const encodedSubject = encodeURIComponent(subject);
    const body = encodeURIComponent(`Hi ${agent?.name},\n\nI'd like to schedule our next 1:1 sync. Please let me know what times work best for you this week.\n\nThanks!`);
    
    logCommunication({
      agentId: agent?.id || '',
      agentName: agent?.name || '',
      type: '1:1 Sync',
      subject
    });

    window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${body}`;
  };

  const handleTeamsInvite = () => {
    const email = `${agent?.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `Quick check-in with ${agent?.name}`;
    
    logCommunication({
      agentId: agent?.id || '',
      agentName: agent?.name || '',
      type: 'Teams Chat',
      subject
    });

    // Microsoft Teams deep link for a chat/call
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}`;
    window.open(teamsUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Opening Teams chat with ${agent?.name}`);
  };

  const handleOutlookMeeting = () => {
    const email = `${agent?.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `Strategy Session: ${agent?.name}`;
    const encodedSubject = encodeURIComponent(subject);
    const body = encodeURIComponent(`Hi ${agent?.name},\n\nI'm setting up a technical strategy session to review our current deployment benchmarks.\n\nBest regards,`);
    
    logCommunication({
      agentId: agent?.id || '',
      agentName: agent?.name || '',
      type: 'Outlook Invite',
      subject
    });

    // standard Outlook web or client trigger
    window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${body}`;
    toast.success(`Outlook invite drafted for ${agent?.name}`);
  };

  const tabs = [
    { id: 'insights', label: 'Intelligence', icon: Zap },
    { id: 'skills', label: 'Competencies', icon: ShieldCheck },
    { id: 'qa', label: 'QA Records', icon: CheckCircle2 },
    { id: 'goals', label: 'Roadmap', icon: Target },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group">
            <img 
              src={agent.avatar} 
              alt={agent.name} 
              className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-slate-50 transition-transform duration-500 group-hover:scale-105" 
            />
            <div className={cn(
              "absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
              agent.status === 'online' ? "bg-emerald-500" : 
              agent.status === 'in-call' ? "bg-brand-500" : "bg-slate-400"
            )}>
              {agent.status}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{agent.name}</h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                {agent.role}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                Employee ID: {agent.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleTeamsInvite}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#444791] rounded-lg hover:bg-[#3b3e7a] transition-all shadow-sm active:scale-95"
              >
                <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
                  <MessageCircle size={12} />
                </div>
                Teams Chat
              </button>
              <button 
                onClick={handleOutlookMeeting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0078d4] rounded-lg hover:bg-[#006cc0] transition-all shadow-sm active:scale-95"
              >
                <Mail size={14} />
                Outlook Invite
              </button>
              <button 
                onClick={handleSchedule1on1}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Quick 1:1
              </button>
              <button 
                onClick={() => setIsNoteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
              >
                <Zap size={18} />
                Feedback
              </button>
              <button 
                onClick={() => navigate(`/skills/edit/${agent?.id}`)}
                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 rounded-xl transition-all shadow-sm"
              >
                <Settings2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[120px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Calls</span>
              <span className="text-2xl font-black text-slate-800">{agent.metrics.qaScore * 3 + 15}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[120px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">QA Average</span>
              <span className="text-2xl font-black text-slate-800">{agent.metrics.qaScore}%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[120px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CSAT score</span>
              <span className="text-2xl font-black text-slate-800">{agent.metrics.csat}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Aside: Radar & Quick Contact */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              Competency Radar
            </h3>
            <div className="h-[240px] w-full flex items-center justify-center -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={skillsData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                  <Radar
                    name={agent.name}
                    dataKey="A"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="#0ea5e9"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Official Channels</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm group text-left">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-brand-400" />
                  <span className="font-medium">Direct Email</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm group text-left">
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-brand-400" />
                  <span className="font-medium">Teams Chat</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-white text-brand-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                 )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Coaching Trajectory</h4>
                        <TrendingUp size={18} className="text-emerald-500" />
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performance.slice(-5)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" hide />
                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="qa" 
                              stroke="#0ea5e9" 
                              strokeWidth={4} 
                              dot={{ r: 6, fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Recent Evolution</h4>
                      <div className="space-y-4 flex-1">
                        {agentNotes.slice(0, 2).map((note) => (
                          <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-white">
                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block mb-1">{note.date}</span>
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4">Suggested Focus: Network Infrastructure</h4>
                      <p className="text-brand-50 mb-8 max-w-xl leading-relaxed">
                        Resolution time increases by 45% when dealing with complex VPN & Connectivity issues. We recommend a focused coaching module.
                      </p>
                      <button className="px-6 py-3 bg-white text-brand-700 rounded-xl text-sm font-black hover:bg-brand-50 transition-all shadow-xl shadow-black/10">
                        Launch Training Path
                      </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 text-white opacity-10 group-hover:scale-110 transition-transform">
                      <Zap size={140} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  {SKILL_CATEGORIES.map(category => (
                    <div key={category.id} className="space-y-4">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="h-4 w-1 bg-brand-500 rounded-full"></div>
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.skills.map(skill => {
                          const level = (agent?.skills as any)?.[skill.id] || 0;
                          return (
                            <div key={skill.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 flex items-center justify-between group hover:border-brand-200 transition-colors">
                              <div>
                                <p className="text-sm font-bold text-slate-800 mb-0.5">{skill.name}</p>
                                <p className="text-[10px] font-medium text-slate-400">{skill.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={cn(
                                      "w-6 h-2 rounded-full transition-all",
                                      i <= level ? "bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]" : "bg-slate-100"
                                    )}></div>
                                  ))}
                                </div>
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-tighter",
                                  level >= 4 ? "text-brand-600" : "text-slate-400"
                                )}>
                                  Level {level}/5
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'qa' && (
                <motion.div
                  key="qa"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4">ID Reference</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4">Auditor</th>
                        <th className="px-6 py-4 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {agentQA.length > 0 ? (
                        agentQA.map((qa) => (
                          <tr key={qa.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-sm text-slate-800">{qa.ticket}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "text-sm font-black",
                                qa.score > 90 ? "text-emerald-600" : "text-slate-800"
                              )}>{qa.score}%</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{qa.reviewer}</td>
                            <td className="px-6 py-4 text-right">
                              <Link to={`/qa/${qa.id}`} className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase rounded-lg hover:bg-slate-900 hover:text-white transition-all">Audit</Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="py-20 text-center text-slate-400 italic">No records found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'goals' && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {agentGoals.map((goal) => (
                    <div key={goal.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                      <div className={cn(
                        "inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-3",
                        goal.status === 'On Track' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {goal.status}
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2">{goal.description}</h4>
                      <div className="space-y-2 pt-4">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progressValue}%` }}
                            className={cn("h-full", goal.status === 'On Track' ? "bg-emerald-500" : "bg-amber-500")}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full">
                    <button onClick={() => navigate(`/team/${agent?.id}/benchmark/new`)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-brand-600 transition-all">
                      Set Benchmark
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Internal Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsNoteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">Intelligence Log</h3>
                <button onClick={() => setIsNoteModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600"><X size={20} /></button>
              </div>
              <textarea 
                className="w-full h-40 p-5 bg-slate-50 border-none rounded-3xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 outline-none"
                placeholder="Log observation..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div className="mt-8 flex gap-3">
                <button onClick={handleAddNote} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl text-sm font-black shadow-lg hover:bg-brand-700">Commit Note</button>
                <button onClick={() => setIsNoteModalOpen(false)} className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-sm font-bold">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
