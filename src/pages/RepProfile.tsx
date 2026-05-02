import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Mail, MessageSquare, Phone, ArrowLeft, Award, Target, TrendingUp, Plus, FileText, Calendar, Check, BarChart3, BadgeInfo } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function RepProfile() {
  const { id } = useParams();
  const { agents, qaReviews, performance, goals, notes, addGoal, addNote, sessions } = useStore();
  const rep = agents.find(m => m.id === id) || agents[0]; // fallback
  const repQA = qaReviews.filter(qa => qa.repId === id || qa.repName === rep.name);
  const repGoals = goals.filter(g => g.repId === id || g.repId === rep.id);
  const repNotes = notes.filter(n => n.repId === id || n.repId === rep.id);
  const repSessions = sessions.filter(s => s.repId === id || s.rep === rep.name).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalMetric, setNewGoalMetric] = useState('');

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteFollowUp, setNewNoteFollowUp] = useState('');

  const handleAddGoal = () => {
    if (!newGoalDesc || !newGoalMetric) {
      toast.error("Goal description and target metric required.");
      return;
    }
    addGoal({
      repId: rep.id,
      description: newGoalDesc,
      targetMetric: newGoalMetric,
      progressValue: 0,
      status: "On Track"
    });
    setNewGoalDesc('');
    setNewGoalMetric('');
    setIsAddingGoal(false);
    toast.success("Operational goal synchronized.");
  };

  const handleAddNote = () => {
    if (!newNoteContent) {
      toast.error("Note content cannot be empty.");
      return;
    }
    addNote({
      repId: rep.id,
      content: newNoteContent,
      followUpDate: newNoteFollowUp || undefined
    });
    setNewNoteContent('');
    setNewNoteFollowUp('');
    setIsAddingNote(false);
    toast.success("Tactical observation logged.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <Link to="/team" className="p-3 text-slate-400 hover:text-slate-900 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:-translate-x-1">
            <ArrowLeft size={24} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Profile: <span className="font-serif italic font-normal text-slate-400 ml-1">{rep.name}</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">{rep.role} &mdash; Technician Analytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.info("Opening contact options...")} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95">
            Contact
          </button>
          <Link to="/coaching" className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 transition-all active:scale-95">
            Initialize Session
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card & Bio */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
               <TrendingUp size={120} />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <img src={rep.avatar} alt={rep.name} className="w-40 h-40 rounded-full border-[6px] border-white shadow-2xl object-cover ring-1 ring-slate-100" />
                <div className={cn(
                  "absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white shadow-lg",
                  rep.status === 'online' ? "bg-emerald-500 animate-pulse" :
                  rep.status === 'in-call' ? "bg-amber-500" :
                  rep.status === 'away' ? "bg-rose-500" : "bg-slate-300"
                )}></div>
              </div>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{rep.name}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{rep.role}</p>
              </div>

              <div className="flex gap-4 w-full pt-4">
                 <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-slate-700 capitalize">{rep.status.replace('-', ' ')}</p>
                 </div>
                 <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenure</p>
                    <p className="text-sm font-bold text-slate-700">14 Months</p>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => toast.info("Syncing with Teams...")} className="p-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-2xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><MessageSquare size={20} /></button>
                <button onClick={() => toast.info("Opening Finesse console...")} className="p-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-2xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Phone size={20} /></button>
                <a href={`mailto:${rep.name.replace(/\s+/g, '.').toLowerCase()}@example.com`} className="p-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-2xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Mail size={20} /></a>
              </div>
            </div>
          </div>

          {/* Goals Widget */}
          <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white shadow-2xl border border-slate-800">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] flex items-center gap-2">
                 <Target size={16} /> Operational Focus
               </h3>
               <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 transition-all">
                 <Plus size={18} />
               </button>
             </div>

             {isAddingGoal && (
               <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-3xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                 <input type="text" placeholder="Metric target identifier..." value={newGoalMetric} onChange={e => setNewGoalMetric(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-500" />
                 <textarea placeholder="Instructional context..." value={newGoalDesc} onChange={e => setNewGoalDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
                 <div className="flex justify-end gap-3 pt-2">
                   <button onClick={() => setIsAddingGoal(false)} className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors">Abort</button>
                   <button onClick={handleAddGoal} className="px-6 py-2.5 bg-blue-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">Sync Goal</button>
                 </div>
               </div>
             )}

             <div className="space-y-6">
                {repGoals.map(goal => (
                  <div key={goal.id} className="group/goal">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-sm tracking-tight">{goal.targetMetric}</div>
                      <div className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded", goal.status === 'On Track' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>{goal.status}</div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mb-4 line-clamp-2">{goal.description}</div>
                    <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className={cn("absolute h-full rounded-full transition-all duration-1000", goal.status === 'On Track' ? "bg-blue-500" : "bg-rose-500")} style={{ width: `${goal.progressValue}%` }}></div>
                    </div>
                    <div className="mt-2 text-right">
                       <span className="text-[10px] font-mono font-bold text-slate-500">{goal.progressValue}%</span>
                    </div>
                  </div>
                ))}
                {repGoals.length === 0 && <div className="text-xs text-slate-500 py-8 italic text-center outline-dashed outline-1 outline-slate-800 rounded-2xl">No strategic objectives assigned.</div>}
             </div>
          </div>
        </div>

        {/* Tactical Feed & Charts */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <BarChart3 size={20} className="text-blue-600" />
                 Performance Velocity
               </h3>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Customer Satisfaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Audit Precision</span>
                  </div>
               </div>
             </div>
             <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance.map(d => ({...d, csat: d.csat + (Math.random()*6 - 3), qa: d.qa + (Math.random()*6 - 3)}))} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="csat" stroke="#2563EB" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} />
                  <Line type="monotone" dataKey="qa" stroke="#10B981" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <FileText size={20} className="text-blue-600" />
                 Operational Audit Feed
               </h3>
               <Link to="/qa" className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">New Evaluation</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {repQA.map(qa => (
                <div key={qa.id} className="p-10 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 group/qa">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl font-black text-slate-900 tracking-tight">{qa.ticket}</div>
                        {qa.status === 'draft' && (
                          <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded leading-none">Draft Log</span>
                        )}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                         <span>{qa.date}</span>
                         <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                         <span className="font-serif italic capitalize text-[11px] font-normal tracking-normal text-slate-500 lowercase">Evaluated by {qa.reviewer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-4xl font-mono font-black tabular-nums tracking-tighter leading-none mb-1",
                        qa.score >= 90 ? "text-emerald-600" :
                        qa.score >= 80 ? "text-amber-600" : "text-rose-600"
                      )}>
                        {qa.score}
                      </div>
                      <div className="text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">Audit Score</div>
                    </div>
                  </div>
                  
                  {qa.categoryNotes && Object.values(qa.categoryNotes).some(v => v) && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(qa.categoryNotes).map(([catId, note]) => {
                        if (!note) return null;
                        const catDisplayName = catId.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        return (
                          <div key={catId} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-inner">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{catDisplayName}</span>
                            <span className="text-sm font-medium text-slate-600 italic leading-relaxed">"{note}"</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {qa.notes && (
                    <div className="bg-blue-600 p-8 rounded-[1.5rem] text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <MessageSquare size={48} />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-3">Coach Dan &mdash; Summary Matrix</p>
                       <p className="text-sm font-medium leading-relaxed font-serif italic text-blue-50">
                        {qa.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {repQA.length === 0 && <div className="p-20 text-center text-slate-400 italic bg-slate-50/30">No historical audit data found for this asset.</div>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                 <Target size={20} className="text-blue-600" />
                 Active Coaching History
               </h3>
               <Link to="/coaching" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Access Agenda &rarr;</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {repSessions.map(sess => {
                 const isSTAR = sess.notes?.startsWith('[STAR Log]');
                 let starData = { s: '', t: '', a: '', r: '' };
                 if (isSTAR) {
                   const match = sess.notes?.match(/S \(Situation\): ([\s\S]*?)T \(Task\): ([\s\S]*?)A \(Action\): ([\s\S]*?)R \(Result\): ([\s\S]*)/);
                   if (match) {
                     starData = { s: match[1].trim(), t: match[2].trim(), a: match[3].trim(), r: match[4].trim() };
                   }
                 }

                 return (
                   <div key={sess.id} className="p-10 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                     <div className="flex items-center justify-between mb-8">
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">{sess.type}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={12} className="text-blue-600" /> {sess.date}
                          </p>
                       </div>
                       {sess.status === 'scheduled' ? (
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest rounded-full">Scheduled</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest rounded-full">Finalized</span>
                        )}
                     </div>

                     {isSTAR ? (
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                         {[
                           { id: 'S', label: 'Situation', val: starData.s, color: 'border-l-blue-500' },
                           { id: 'T', label: 'Task', val: starData.t, color: 'border-l-emerald-500' },
                           { id: 'A', label: 'Action', val: starData.a, color: 'border-l-amber-500' },
                           { id: 'R', label: 'Result', val: starData.r, color: 'border-l-purple-500' }
                         ].map(f => (
                           <div key={f.id} className={cn("p-4 bg-white border border-slate-100 rounded-2xl shadow-sm border-l-4", f.color)}>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{f.label}</span>
                             <p className="text-xs font-medium text-slate-600 leading-relaxed italic line-clamp-4">"{f.val}"</p>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="mb-8 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                          <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed font-serif italic italic">
                           {sess.notes || 'No notes available for this session.'}
                         </p>
                       </div>
                     )}

                     {(sess.strengths || sess.growthOpportunities) && (
                        <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
                          {sess.strengths?.map(s => (
                            <span key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-xl border border-emerald-100 uppercase tracking-tighter flex items-center gap-2">
                              <Award size={12} /> {s}
                            </span>
                          ))}
                          {sess.growthOpportunities?.map(o => (
                            <span key={o} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-[9px] font-black rounded-xl border border-rose-100 uppercase tracking-tighter flex items-center gap-2">
                              <TrendingUp size={12} /> {o}
                            </span>
                          ))}
                        </div>
                      )}
                   </div>
                 );
              })}
              {repSessions.length === 0 && <div className="p-20 text-center text-slate-400 italic bg-slate-50/30">No active coaching history logged.</div>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <BadgeInfo size={20} className="text-blue-600" />
                  Tactical Observations
                </h3>
                <button onClick={() => setIsAddingNote(!isAddingNote)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">Add Note</button>
             </div>
             
             {isAddingNote && (
               <div className="p-10 border-b border-slate-100 bg-slate-50/50 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Observational Metadata</label>
                      <input type="text" placeholder="e.g. Call Quality, Knowledge Gap..." className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-bold shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Follow-up Target</label>
                      <input type="text" placeholder="MM/DD/YYYY" value={newNoteFollowUp} onChange={e => setNewNoteFollowUp(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-bold shadow-sm" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contextual Payload</label>
                   <textarea rows={4} value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} placeholder="Enter tactical observations..." className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-inner" />
                 </div>
                 <div className="flex gap-4 pt-2">
                    <button onClick={handleAddNote} className="flex-1 bg-slate-900 text-white rounded-xl py-4 text-[10px] font-black uppercase tracking-widest shadow-xl">Commit Note</button>
                    <button onClick={() => setIsAddingNote(false)} className="px-8 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Discard</button>
                 </div>
               </div>
             )}

             <div className="divide-y divide-slate-100">
               {repNotes.map(note => (
                 <div key={note.id} className="p-10 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 group/note">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-slate-200 rounded-full group-hover/note:bg-blue-600 transition-colors"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="text-slate-900">{note.author}</span> &bull; {note.date}
                        </div>
                     </div>
                     {note.followUpDate && (
                       <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-widest rounded-full">
                         <Calendar size={10} /> Sync: {note.followUpDate}
                       </div>
                     )}
                   </div>
                   <p className="text-sm font-medium text-slate-700 leading-relaxed font-serif pl-4 border-l-2 border-transparent">
                     {note.content}
                   </p>
                 </div>
               ))}
               {repNotes.length === 0 && !isAddingNote && (
                 <div className="p-20 text-center text-slate-400 italic bg-slate-50/30">No tactical observations prioritized for this technician.</div>
               )}
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}
