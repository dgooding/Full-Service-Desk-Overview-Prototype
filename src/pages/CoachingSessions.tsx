import React, { useState } from 'react';
import { 
  Calendar, Plus, Clock, FileText, Check, FileEdit, 
  Sparkles, Send, Loader2, Info, ChevronRight, 
  Share2, Save, Trash2, Tag, Archive, Target,
  Star, Award, ShieldAlert, BadgeInfo, CheckCircle2, User
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const COACHING_TYPES = [
  "Ticket Quality Audit",
  "Career Development",
  "Performance Review",
  "Technical Training",
  "Behavioral / Soft Skills",
  "Quick Check-in"
];

const GROWTH_TAGS = [
  "ACTIVE LISTENING", "DE-ESCALATION", "TECHNICAL ACCURACY", "SLA MANAGEMENT",
  "DOCUMENTATION", "TOOL PROFICIENCY", "FIRST CONTACT RESOLUTION", 
  "TONE & PROFESSIONALISM", "INFORMATION GATHERING"
];

export default function CoachingSessions() {
  const { agents, sessions, addSession, completeSession } = useStore();
  
  const [activeModal, setActiveModal] = useState<'schedule' | 'log' | 'complete' | null>(null);
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [completeMode, setCompleteMode] = useState<'STAR' | 'FreeForm'>('STAR');
  const [starLog, setStarLog] = useState({ s: '', t: '', a: '', r: '' });
  const [freeNotes, setFreeNotes] = useState('');
  const [actionItemsStr, setActionItemsStr] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toLocaleDateString());
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [interactionRef, setInteractionRef] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  
  const [sessionFormData, setSessionFormData] = useState({
    repId: '',
    repName: '',
    type: 'Ticket Quality Audit',
    date: new Date().toLocaleDateString()
  });

  const resetForm = () => {
    setSessionFormData({ repId: '', repName: '', type: 'Ticket Quality Audit', date: new Date().toLocaleDateString() });
    setStarLog({ s: '', t: '', a: '', r: '' });
    setFreeNotes('');
    setInteractionRef('');
    setSelectedStrengths([]);
    setSelectedOpportunities([]);
    setActionItemsStr('');
    setFollowUpDate(new Date().toLocaleDateString());
    setFollowUpNotes('');
    setCompleteMode('STAR');
    setEditingSessionId(null);
  };

  const toggleTag = (tag: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(tag)) {
      setList(list.filter(t => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const openScheduleModal = () => {
    resetForm();
    setActiveModal('schedule');
  };

  const openLogModal = () => {
    resetForm();
    setActiveModal('log');
  };

  const openCompleteModal = (id: string, isEditing: boolean = false) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    setEditingSessionId(id);
    setSessionFormData({
      repId: session.repId,
      repName: session.rep,
      type: session.type,
      date: session.date
    });
    setInteractionRef(session.interactionRef || '');
    setSelectedStrengths(session.strengths || []);
    setSelectedOpportunities(session.growthOpportunities || []);
    
    const notesStr = session.notes || '';
    if (notesStr.startsWith('[STAR Log]')) {
      const match = notesStr.match(/S \((Situation|Situation:)\): ([\s\S]*?)T \((Task|Task:)\): ([\s\S]*?)A \((Action|Action:)\): ([\s\S]*?)R \((Result|Result:)\): ([\s\S]*)/);
      if (match) {
        setStarLog({
          s: match[2].trim(),
          t: match[4].trim(),
          a: match[6].trim(),
          r: match[8].trim()
        });
      }
      setFreeNotes('');
      setCompleteMode('STAR');
    } else {
      setFreeNotes(notesStr);
      setCompleteMode('FreeForm');
    }

    setActionItemsStr(session.actionItems?.join(', ') || '');
    setFollowUpDate(session.followUpDate || new Date().toLocaleDateString());
    setFollowUpNotes(session.followUpNotes || '');
    setActiveModal(isEditing ? 'log' : 'complete');
  };

  const handleSaveSession = () => {
    if (!sessionFormData.repId) {
      toast.error('Please select an agent/tech.');
      return;
    }
    const agent = agents.find(a => a.id === sessionFormData.repId);
    if (!agent) return;

    if (activeModal === 'schedule') {
      addSession({
        repId: agent.id,
        rep: agent.name,
        type: sessionFormData.type,
        date: sessionFormData.date,
        status: 'scheduled'
      });
      toast.success("Coaching session scheduled.");
      setActiveModal(null);
      return;
    }

    let finalNotes = '';
    if (completeMode === 'STAR') {
      finalNotes = `[STAR Log]\nS (Situation): ${starLog.s}\nT (Task): ${starLog.t}\nA (Action): ${starLog.a}\nR (Result): ${starLog.r}`;
    } else {
      finalNotes = freeNotes;
    }

    const actionItems = actionItemsStr.split(',').map(s => s.trim()).filter(Boolean);
    const sessionPayload = {
      notes: finalNotes,
      actionItems: actionItems.length > 0 ? actionItems : undefined,
      status: 'completed' as const,
      date: sessionFormData.date,
      type: sessionFormData.type,
      followUpNotes: followUpNotes || undefined,
      interactionRef: interactionRef || undefined,
      strengths: selectedStrengths.length > 0 ? selectedStrengths : undefined,
      growthOpportunities: selectedOpportunities.length > 0 ? selectedOpportunities : undefined
    };

    if (editingSessionId) {
      completeSession(editingSessionId, sessionPayload);
      toast.success("Coaching session updated.");
    } else {
      const newId = `sess-${Date.now()}`;
      addSession({
        repId: agent.id,
        rep: agent.name,
        type: sessionFormData.type,
        date: sessionFormData.date,
        status: 'completed'
      });
      setTimeout(() => completeSession(newId, sessionPayload), 50);
      toast.success("Coaching session logged.");
    }

    if (followUpDate && followUpNotes) {
      addSession({
        repId: agent.id,
        rep: agent.name,
        type: 'Follow-up Check-in',
        date: followUpDate,
        status: 'scheduled',
        notes: `Follow-up on: ${sessionFormData.type}`
      });
    }

    setActiveModal(null);
  };

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status === 'completed').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-lg">
                <FileText size={20} />
             </div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Frontline Coaching Center
               <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Lead Coach Edition</span>
             </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium ml-10">Systematic operational coaching and performance management workflow.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={openScheduleModal} className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 active:scale-95 text-xs">
            <Calendar size={18} className="text-blue-600" />
            Schedule Session
          </button>
          <button onClick={openLogModal} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 text-xs">
            <Plus size={18} className="text-blue-400" />
            NEW COACHING LOG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={16} className="text-blue-500" /> Next on Agenda
               </h2>
               <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full">{scheduledSessions.length}</span>
             </div>
             <div className="divide-y divide-slate-100/50 p-2">
                {scheduledSessions.map(sess => {
                  const rep = agents.find(m => m.name === sess.rep || m.id === sess.repId);
                  return (
                  <div key={sess.id} className="p-4 hover:bg-slate-50 rounded-2xl group transition-all cursor-pointer border border-transparent hover:border-slate-100" onClick={() => openCompleteModal(sess.id)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                         <div className="relative">
                           <img src={rep?.avatar || 'https://i.pravatar.cc/150'} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" />
                           <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full", rep?.status === 'online' ? "bg-emerald-500" : "bg-slate-300")}></div>
                         </div>
                         <div>
                           <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{sess.rep}</div>
                           <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{sess.type}</div>
                         </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); openCompleteModal(sess.id); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                        <Check size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-2.5 py-1.5 rounded-lg w-full justify-center">
                       <Calendar size={12} strokeWidth={2.5} /> {sess.date}
                    </div>
                  </div>
                )})}
                {scheduledSessions.length === 0 && (
                  <div className="p-12 text-center py-20 flex flex-col items-center gap-2">
                    <Archive className="text-slate-200" size={40} />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Queue Empty</p>
                  </div>
               )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
               <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
                    <FileText size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Coaching Activity Archive</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Digital Audit Trail</p>
                  </div>
               </div>
               <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button className="px-4 py-1.5 bg-white text-slate-900 text-[10px] font-black rounded-lg shadow-sm uppercase tracking-widest">RECENT</button>
                  <button className="px-4 py-1.5 text-slate-500 text-[10px] font-black hover:text-slate-900 transition-colors uppercase tracking-widest">Archive</button>
               </div>
             </div>
             
             <div className="divide-y divide-slate-100">
                {pastSessions.map((sess) => {
                  const isSTAR = sess.notes?.startsWith('[STAR Log]');
                  let starData = { situation: '', task: '', action: '', result: '' };
                  if (isSTAR) {
                    const match = sess.notes?.match(/S \(Situation\): ([\s\S]*?)T \(Task\): ([\s\S]*?)A \(Action\): ([\s\S]*?)R \(Result\): ([\s\S]*)/);
                    if (match) {
                      starData = {
                        situation: match[1].trim(),
                        task: match[2].trim(),
                        action: match[3].trim(),
                        result: match[4].trim()
                      };
                    }
                  }

                  return (
                    <div key={sess.id} className="p-8 hover:bg-slate-50/50 transition-all group relative border-b border-slate-50 last:border-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm shrink-0 group-hover:border-blue-200 transition-colors">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{new Date(sess.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                              <span className="text-xl font-black text-slate-900 leading-none">{new Date(sess.date).getDate() || sess.date.split('/')[1] || '?'}</span>
                           </div>
                           <div>
                              <h3 className="font-black text-slate-900 text-lg leading-tight flex items-center gap-3">
                                {sess.type}
                                {sess.interactionRef && <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded tracking-tighter">REF: {sess.interactionRef}</span>}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agent: <Link to={`/team/${sess.repId}`} className="text-blue-600 hover:underline">{sess.rep}</Link></span>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                           <button onClick={() => openCompleteModal(sess.id, true)} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                             <FileEdit size={16} />
                           </button>
                           <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>

                      {isSTAR ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm border-l-2 border-l-blue-500">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2 px-1 bg-blue-50 w-fit rounded">Situation</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">"{starData.situation}"</p>
                          </div>
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm border-l-2 border-l-emerald-500">
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-2 px-1 bg-emerald-50 w-fit rounded">Task</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">"{starData.task}"</p>
                          </div>
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm border-l-2 border-l-amber-500">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-2 px-1 bg-amber-50 w-fit rounded">Action</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 italic">"{starData.action}"</p>
                          </div>
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm border-l-2 border-l-purple-500">
                            <span className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em] block mb-2 px-1 bg-purple-50 w-fit rounded">Result</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 italic">"{starData.result}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors duration-300">
                           <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-serif">
                            {sess.notes || 'No notes provided for this session.'}
                          </p>
                        </div>
                      )}

                      {(sess.strengths || sess.growthOpportunities) && (
                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-slate-100">
                          {sess.strengths && sess.strengths.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                               {sess.strengths.map(s => (
                                 <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-tighter flex items-center gap-1.5">
                                   <Award size={12} /> {s}
                                 </span>
                               ))}
                            </div>
                          )}
                          {sess.growthOpportunities && sess.growthOpportunities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                               {sess.growthOpportunities.map(o => (
                                 <span key={o} className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-lg border border-rose-100 uppercase tracking-tighter flex items-center gap-1.5">
                                   <Target size={12} /> {o}
                                 </span>
                               ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>

      {activeModal && (activeModal === 'log' || activeModal === 'complete') && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col border border-slate-200 animate-in fade-in zoom-in duration-500 my-8">
            
            {/* Elegant Header */}
            <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-200 -rotate-2">
                  <FileText size={28} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    Performance Coaching Log
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tech Ops Workflow</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{activeModal === 'complete' ? 'Completing Scheduled' : 'Direct Log'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Main Entry Side */}
                <div className="lg:col-span-8 p-12 space-y-12 border-r border-slate-100">
                  
                  {/* Primary Selectors */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        <User size={14} className="text-blue-600" /> Frontend Tech
                      </label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 shadow-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        value={sessionFormData.repId} 
                        onChange={e => setSessionFormData({...sessionFormData, repId: e.target.value})}
                      >
                        <option value="">Select Technician...</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        <Tag size={14} className="text-blue-600" /> Coaching Vector
                      </label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 shadow-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        value={sessionFormData.type} 
                        onChange={e => setSessionFormData({...sessionFormData, type: e.target.value})}
                      >
                        {COACHING_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Ref & Date */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        <Target size={14} className="text-blue-600" /> Interaction Reference
                      </label>
                      <input 
                        type="text" 
                        placeholder="INC-XXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold shadow-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono"
                        value={interactionRef} onChange={e => setInteractionRef(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        <Calendar size={14} className="text-blue-600" /> Coaching Date
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold shadow-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                        value={sessionFormData.date} onChange={e => setSessionFormData({ ...sessionFormData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          Observation Methodology
                       </h3>
                       <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                          <button 
                            onClick={() => setCompleteMode('STAR')}
                            className={cn("px-6 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest", completeMode === 'STAR' ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600")}
                          >STAR Format</button>
                          <button 
                            onClick={() => setCompleteMode('FreeForm')}
                            className={cn("px-6 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest", completeMode === 'FreeForm' ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600")}
                          >Free Form</button>
                       </div>
                    </div>

                    {completeMode === 'STAR' ? (
                      <div className="space-y-8">
                        {[
                          { id: 's', label: 'Situation', desc: 'Context & Baseline', color: 'border-l-blue-600', bg: 'bg-blue-50/50' },
                          { id: 't', label: 'Task', desc: 'Standard Operating Procedure', color: 'border-l-emerald-600', bg: 'bg-emerald-50/50' },
                          { id: 'a', label: 'Action', desc: 'Observed Technician Steps', color: 'border-l-amber-600', bg: 'bg-amber-50/50' },
                          { id: 'r', label: 'Result', desc: 'Outcome & Customer Impact', color: 'border-l-purple-600', bg: 'bg-purple-50/50' }
                        ].map((field) => (
                           <div key={field.id} className="group/field">
                              <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-lg font-black text-slate-900 uppercase">{field.id}</span>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                   {field.label} &mdash; <span className="italic">{field.desc}</span>
                                </label>
                              </div>
                              <textarea 
                                className={cn(
                                  "w-full bg-slate-50/30 border border-slate-200 rounded-[1.5rem] p-6 text-sm font-medium outline-none transition-all min-h-[120px] leading-relaxed shadow-sm focus:ring-4 focus:bg-white placeholder:text-slate-300 border-l-4",
                                  field.color
                                )}
                                placeholder={`Enter ${field.label.toLowerCase()} details...`}
                                value={starLog[field.id as keyof typeof starLog]} 
                                onChange={e => setStarLog({ ...starLog, [field.id]: e.target.value })}
                              />
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea 
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-10 text-sm font-medium outline-none focus:ring-8 focus:ring-blue-50/30 focus:border-blue-500 focus:bg-white transition-all min-h-[500px] leading-relaxed shadow-inner font-serif"
                          placeholder="Document comprehensive observations, technical gaps, and specific feedback for the technician..."
                          value={freeNotes} onChange={e => setFreeNotes(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Growth & Follow-up Side */}
                <div className="lg:col-span-4 bg-slate-50/30 p-12 space-y-12">
                  
                  {/* Growth Matrix */}
                  <div className="space-y-8">
                     <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                       Growth Matrix
                     </h3>

                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block border-b border-emerald-100 pb-2">Core Strengths</label>
                        <div className="flex flex-wrap gap-2">
                           {GROWTH_TAGS.map(tag => (
                              <button 
                                key={tag} 
                                onClick={() => toggleTag(tag, selectedStrengths, setSelectedStrengths)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all uppercase tracking-tighter",
                                  selectedStrengths.includes(tag) 
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105" 
                                    : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300"
                                )}
                              >{tag}</button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest block border-b border-rose-100 pb-2">Opportunity Areas</label>
                        <div className="flex flex-wrap gap-2">
                           {GROWTH_TAGS.map(tag => (
                              <button 
                                key={tag} 
                                onClick={() => toggleTag(tag, selectedOpportunities, setSelectedOpportunities)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all uppercase tracking-tighter",
                                  selectedOpportunities.includes(tag) 
                                    ? "bg-rose-600 text-white border-rose-600 shadow-md scale-105" 
                                    : "bg-white text-slate-500 border-slate-200 hover:border-rose-300"
                                )}
                              >{tag}</button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Follow up Strategy */}
                  <div className="space-y-8 pt-8 border-t border-slate-200">
                     <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                       Progression Plan
                     </h3>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Follow-up Milestone</label>
                        <div className="relative group/cal">
                          <input 
                            type="text" 
                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 shadow-sm transition-all pr-12"
                            value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                            placeholder="Set date..."
                          />
                          <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Action Item Summary</label>
                        <textarea 
                          className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 shadow-sm transition-all min-h-[140px] leading-relaxed"
                          placeholder="Specific, measurable actions for the tech..."
                          value={actionItemsStr} onChange={e => setActionItemsStr(e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Submit Controls */}
                  <div className="pt-6 space-y-4">
                    <button 
                      onClick={handleSaveSession}
                      className="w-full bg-slate-900 text-white rounded-2xl py-5 px-8 font-black flex items-center justify-center gap-4 hover:bg-black shadow-2xl shadow-slate-300 active:scale-95 transition-all group"
                    >
                      <Save size={20} className="group-hover:text-blue-400 transition-colors" />
                      SUBMIT COACHING LOG
                    </button>
                    <div className="text-center">
                      <button onClick={() => setActiveModal(null)} className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">Discard Entry</button>
                    </div>
                  </div>

                  <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
                     <div className="flex items-start gap-4">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white mt-1">
                          <Sparkles size={16} />
                        </div>
                        <p className="text-[10px] text-blue-900/80 font-bold leading-relaxed">
                          Submit this log to synchronize with the Unified Tech Dashboard. Coaching data influences the Quarterly Progression Matrix.
                        </p>
                     </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'schedule' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 border border-slate-200">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Initiate Logic</h2>
                 <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-slate-900 text-4xl leading-none">&times;</button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ASSIGN FRONTEND TECH</label>
                  <select className="w-full bg-slate-100 border border-slate-200 rounded-xl p-5 text-sm font-bold shadow-inner"
                    value={sessionFormData.repId} onChange={e => setSessionFormData({...sessionFormData, repId: e.target.value})}
                  >
                    <option value="">Select Target...</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">COACHING VECTOR</label>
                  <select className="w-full bg-slate-100 border border-slate-200 rounded-xl p-5 text-sm font-bold shadow-inner"
                    value={sessionFormData.type} onChange={e => setSessionFormData({...sessionFormData, type: e.target.value})}
                  >
                    {COACHING_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CALENDAR DATE SYNC</label>
                  <input type="text" className="w-full bg-slate-100 border border-slate-200 rounded-xl p-5 text-sm font-bold shadow-inner"
                    placeholder="e.g. 05/15/2026"
                    value={sessionFormData.date} onChange={e => setSessionFormData({...sessionFormData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/30">
                 <button onClick={() => setActiveModal(null)} className="flex-1 py-5 text-slate-400 font-black uppercase text-[11px] tracking-widest hover:text-slate-900 transition-colors">ABORT</button>
                 <button onClick={handleSaveSession} className="flex-[2] py-5 px-10 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200">INITIATE SESSION</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
