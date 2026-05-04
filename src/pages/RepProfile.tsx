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
  Presentation
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

export default function RepProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, qaReviews, performance, goals, notes, addGoal, addNote } = useStore();
  const [activeTab, setActiveTab] = useState('insights');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [coachingIssue, setCoachingIssue] = useState('FCR Issue');
  const [coachingDate, setCoachingDate] = useState('');
  const [coachingTime, setCoachingTime] = useState('');
  const [coachingLink, setCoachingLink] = useState('');

  const agent = agents.find(a => a.id === id);
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

  const radarData = Object.entries(agent.skills || {}).map(([subject, value]) => ({
    subject,
    A: value,
    fullMark: 5,
  }));

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote({ repId: agent.id, content: noteContent });
    setNoteContent("");
    setIsNoteModalOpen(false);
    toast.success("Internal note added successfully");
  };

  const handleSchedule1on1 = () => {
    const subject = encodeURIComponent(`1:1 Sync - ${agent.name}`);
    const body = encodeURIComponent(`Hi ${agent.name},\n\nI'd like to schedule our next 1:1 sync. Please let me know what times work best for you this week.\n\nThanks!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleScheduleCoachingSubmit = () => {
    if (!coachingDate || !coachingTime) {
      toast.error('Please select date and time');
      return;
    }
    const subject = encodeURIComponent(`Coaching Session - ${coachingIssue}`);
    const body = encodeURIComponent(`Hi ${agent.name},\n\nI've scheduled a coaching session to go over: ${coachingIssue}.\nDate: ${coachingDate}\nTime: ${coachingTime}\nFollow-up Link: ${coachingLink}\n\nPlease let me know if this works for you.\n\nBest,`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsCoachingModalOpen(false);
    toast.success('Coaching session email drafted!');
  };

  const tabs = [
    { id: 'insights', label: 'Intelligence', icon: Zap },
    { id: 'qa', label: 'QA Records', icon: CheckCircle2 },
    { id: 'goals', label: 'Roadmap', icon: Target },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Abstract Background Element */}
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
                onClick={handleSchedule1on1}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Schedule 1:1
              </button>
              <button 
                onClick={() => setIsCoachingModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Schedule Coaching
              </button>
              <button 
                onClick={() => setIsNoteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
              >
                <MessagesSquare size={18} />
                Instant Feedback
              </button>
              <button 
                onClick={() => setIsNoteModalOpen(true)}
                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 rounded-xl transition-all shadow-sm"
              >
                <Plus size={20} />
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
        {/* Left Aside: Skills & Quick Stats */}
        <div className="col-span-1 space-y-6">
          {/* Skills Radar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              Competency Radar
            </h3>
            <div className="h-[240px] w-full flex items-center justify-center -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
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
            <div className="mt-4 space-y-2">
              {Object.entries(agent.skills || {}).map(([skill, val]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{skill}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={cn(
                        "w-2 h-1 rounded-full transition-colors",
                        i <= (val as number) ? "bg-brand-500" : "bg-slate-100"
                      )}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Official Channels</h3>
            <div className="space-y-4">
              <button onClick={() => { window.location.href = `mailto:${agent.name.toLowerCase().replace(' ', '.')}@company.com`; toast.success(`Drafting email to ${agent.name}`) }} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm group">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-brand-400" />
                  <span className="font-medium">Direct Email</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => toast.success(`Opening Teams chat with ${agent.name}`)} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm group">
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-brand-400" />
                  <span className="font-medium">Teams Chat</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-[10px] text-slate-400 font-medium">Last active connection:</p>
              <p className="text-xs font-bold mt-1">2 mins ago @ Terminal 4-B</p>
            </div>
          </div>
        </div>

        {/* Right Main Content: Tabs */}
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
            <button
              onClick={() => navigate('/coaching')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            >
              <Presentation size={18} />
              Coaching
            </button>
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
                  {/* Overview Cards */}
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
                            <XAxis 
                              dataKey="month" 
                              hide 
                            />
                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="qa" 
                              stroke="#0ea5e9" 
                              strokeWidth={4} 
                              dot={{ r: 6, fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2 }}
                              activeDot={{ r: 8, strokeWidth: 0 }}
                              animationDuration={1500}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-4 text-xs font-medium text-slate-500">Consistent upward trend in quality index over the last 5 audit cycles.</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Recent Evolution</h4>
                      <div className="space-y-4 flex-1">
                        {agentNotes.slice(0, 2).map((note) => (
                          <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{note.date}</span>
                              <FileText size={14} className="text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{note.content}</p>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => toast.info('Log Journal opening...')} className="mt-4 w-full py-2.5 text-brand-600 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-50 rounded-xl transition-colors">
                        View Log Journal
                      </button>
                    </div>
                  </div>

                  {/* Skills Heat Map placeholder or other intelligence */}
                  <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 rounded-3xl text-white">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                        <Target size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">Suggested Focus: Complex Claims</h4>
                        <p className="text-brand-100 text-sm opacity-80">AI Analysis of ticket resolution patterns</p>
                      </div>
                    </div>
                    <p className="text-brand-50 mb-8 max-w-xl leading-relaxed">
                      {agent.name} is excelling in standard property queries but resolution time increases by 45% when dealing with multi-party fleet claims. We recommend a focused coaching module on "Subrogation Basics".
                    </p>
                    <Link to={`/training/${agent.id}`} className="inline-flex flex-row items-center justify-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-xl text-sm font-black hover:bg-brand-50 transition-all shadow-xl shadow-black/10 text-center">
                      Launch Training Path
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
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
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Reference</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditor</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {agentQA.length > 0 ? (
                        agentQA.map((qa) => (
                          <tr key={qa.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-800">{qa.ticket}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      qa.score > 90 ? "bg-emerald-500" : 
                                      qa.score > 80 ? "bg-brand-500" : "bg-rose-500"
                                    )} 
                                    style={{ width: `${qa.score}%` }}
                                  />
                                </div>
                                <span className={cn(
                                  "text-sm font-black",
                                  qa.score > 90 ? "text-emerald-600" : "text-slate-800"
                                )}>
                                  {qa.score}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-slate-500 uppercase">{qa.reviewer}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-slate-400">{qa.date}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link 
                                to={`/qa/${qa.id}`}
                                className="inline-flex py-1.5 px-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              >
                                View Detailed Audit
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">No QA records found for this representative yet.</td>
                        </tr>
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
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toast.info('Goal options opened')} className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                      </div>
                      <div className="mb-4">
                        <div className={cn(
                          "inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-3",
                          goal.status === 'On Track' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {goal.status}
                        </div>
                        <h4 className="font-bold text-slate-800 tracking-tight leading-snug mb-2">{goal.description}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Target size={14} />
                          Target: {goal.targetMetric}
                        </p>
                      </div>
                      <div className="space-y-2 pt-4 border-t border-slate-50">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">Progress Momentum</span>
                          <span className="text-slate-800">{goal.progressValue}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progressValue}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              goal.status === 'On Track' ? "bg-emerald-500" : "bg-amber-500"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full">
                    <Link to={`/team/${id}/benchmark/new`} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-200 hover:bg-brand-600 transition-all active:scale-95">
                      <Plus size={18} />
                      Set Performance Benchmark
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Coaching Modal */}
      <AnimatePresence>
        {isCoachingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsCoachingModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                    <Presentation size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Schedule Coaching</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{agent.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsCoachingModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Issue</label>
                  <select 
                    value={coachingIssue}
                    onChange={(e) => setCoachingIssue(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 font-medium px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none shadow-inner"
                  >
                    <option value="FCR Issue">First Contact Resolution Drop</option>
                    <option value="CSAT Drop">CSAT Score Decline</option>
                    <option value="Long Handle Time">Extended Average Handle Time</option>
                    <option value="Tone/Empathy">Tone and Empathy Improvement</option>
                    <option value="Process Adherence">Process Adherence Issues</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date</label>
                    <input 
                      type="date"
                      value={coachingDate}
                      onChange={(e) => setCoachingDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-medium px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Time</label>
                    <input 
                      type="time"
                      value={coachingTime}
                      onChange={(e) => setCoachingTime(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 font-medium px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Follow-up Link / Resource (Optional)</label>
                  <input 
                    type="url"
                    value={coachingLink}
                    onChange={(e) => setCoachingLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 text-slate-800 font-medium px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button 
                  onClick={() => setIsCoachingModalOpen(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleCoachingSubmit}
                  className="flex-1 py-3.5 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 active:scale-[0.98] transition-all"
                >
                  Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                    <History size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Intelligence Log</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Internal notation</p>
                  </div>
                </div>
                <button onClick={() => setIsNoteModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <textarea 
                className="w-full h-40 p-5 bg-slate-50 border-none rounded-3xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300"
                placeholder="Log observation, pattern or coaching context..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={handleAddNote}
                  className="flex-1 py-4 bg-brand-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                >
                  Commit Note
                </button>
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessagesSquare(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M14 9V5a2 2 0 0 0-2-2l-7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
      <path d="M15 13v5a2 2 0 0 0 2 2h4l2 2V13a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2Z" />
    </svg>
  )
}

function X(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
