import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Mail, MessageSquare, Phone, ArrowLeft, Award, Target, TrendingUp, Plus, FileText, Calendar, Check } from 'lucide-react';
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
  const repSessions = sessions.filter(s => s.repId === id || s.rep === rep.name);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalMetric, setNewGoalMetric] = useState('');

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteFollowUp, setNewNoteFollowUp] = useState('');

  const handleAddGoal = () => {
    if (!newGoalDesc || !newGoalMetric) {
      toast.error("Please fill out both goal fields.");
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
  };

  const handleAddNote = () => {
    if (!newNoteContent) {
      toast.error("Please provide note content.");
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
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/team" className="p-2 text-slate-400 hover:text-slate-800 bg-white rounded-lg border border-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Profile</h1>
          </div>
        </div>
        <Link to="/coaching" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors text-center w-fit">
          Schedule Session
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0 relative">
          <img src={rep.avatar} alt={rep.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
          <div className={cn(
            "absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white",
            rep.status === 'online' ? "bg-emerald-500" :
            rep.status === 'in-call' ? "bg-amber-500" :
            rep.status === 'away' ? "bg-rose-500" : "bg-slate-300"
          )}></div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{rep.name}</h2>
              <div className="text-slate-500 font-medium">{rep.role}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.info("Initiating Teams Chat...")} className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50" title="Teams Chat"><MessageSquare size={18} /></button>
              <button onClick={() => toast.info("Opening Finesse Call Modal...")} className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 inline-block" title="Call via Finesse"><Phone size={18} /></button>
              <a href={`mailto:${rep.name.replace(/\s+/g, '.').toLowerCase()}@example.com`} className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 inline-block" title="Send Email"><Mail size={18} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">CSAT</div>
               <div className="text-2xl font-bold font-mono text-slate-800">{rep.metrics.csat}%</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">QA Score</div>
               <div className={cn("text-2xl font-bold font-mono text-slate-800", rep.metrics.qaScore < 85 && "text-rose-600")}>{rep.metrics.qaScore}</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">FCR</div>
               <div className="text-2xl font-bold font-mono text-slate-800">{rep.metrics.fcr}%</div>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">AHT</div>
               <div className="text-2xl font-bold font-mono text-slate-800">{rep.metrics.aht}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Performance Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance.map(d => ({...d, csat: d.csat + (Math.random()*10 - 5), qa: d.qa + (Math.random()*10 - 5)}))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="csat" name="CSAT" stroke="#2563EB" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="qa" name="QA" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals & Focus */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
               <Target size={16} className="text-blue-500" /> Current Goals
             </h3>
             <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
               <Plus size={16} />
             </button>
           </div>

           {isAddingGoal && (
             <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
               <div>
                 <input type="text" placeholder="Goal Description" value={newGoalDesc} onChange={e => setNewGoalDesc(e.target.value)} className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-md outline-none focus:border-blue-500" />
               </div>
               <div>
                 <input type="text" placeholder="Target Metric (e.g. AHT < 6m)" value={newGoalMetric} onChange={e => setNewGoalMetric(e.target.value)} className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded-md outline-none focus:border-blue-500" />
               </div>
               <div className="flex justify-end gap-2">
                 <button onClick={() => setIsAddingGoal(false)} className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700">Cancel</button>
                 <button onClick={handleAddGoal} className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
               </div>
             </div>
           )}

           <div className="space-y-4 overflow-y-auto flex-1 h-0 min-h-[16rem]">
              {repGoals.map(goal => (
                <div key={goal.id} className={cn("p-3 rounded-lg border", goal.status === 'On Track' ? "bg-slate-50 border-slate-200" : "bg-rose-50 border-rose-200")}>
                  <div className="font-semibold text-sm text-slate-900">{goal.targetMetric}</div>
                  <div className="text-xs text-slate-600 mt-1">{goal.description}</div>
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5">
                    <div className={cn("h-1.5 rounded-full", goal.status === 'On Track' ? "bg-blue-600" : "bg-rose-500")} style={{ width: `${goal.progressValue}%` }}></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-medium">
                    <span className={goal.status === 'On Track' ? "text-slate-500" : "text-rose-600"}>{goal.status}</span>
                    <span className="text-slate-500">{goal.progressValue}%</span>
                  </div>
                </div>
              ))}
              {repGoals.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No active goals.</div>}
           </div>
        </div>
      </div>
      
      {/* Recent QA specific to rep */}
      {repQA.length > 0 && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent QA Evaluations</h2>
            <Link to="/qa" className="text-sm text-blue-600 hover:text-blue-700 font-medium">New Evaluation</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {repQA.map(qa => (
              <div key={qa.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50">
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{qa.ticket}</div>
                  <div className="text-xs text-slate-500">Evaluated on {qa.date} by {qa.reviewer}</div>
                  {qa.notes && <div className="text-sm text-slate-600 mt-2 p-2 bg-slate-50 border border-slate-100 rounded">{qa.notes}</div>}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Score</div>
                    <div className={cn("font-bold text-lg text-slate-800", qa.score < 85 && "text-rose-600", qa.score >= 90 && "text-emerald-600")}>{qa.score}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching Notes & Follow-ups */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Coaching Notes & Follow-ups</h2>
          <button onClick={() => setIsAddingNote(!isAddingNote)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Note
          </button>
        </div>
        
        {isAddingNote && (
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Note / Feedback</label>
                <textarea rows={3} value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} placeholder="E.g. Discussed ticket INC123, rep did well but..." className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date (Optional)</label>
                <input type="date" value={newNoteFollowUp} onChange={e => setNewNoteFollowUp(e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 max-w-xs" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Note</button>
                <button onClick={() => setIsAddingNote(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {repNotes.map(note => (
            <div key={note.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{note.author}</span> • <span>{note.date}</span>
                </div>
                {note.followUpDate && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium rounded-md">
                    <Calendar size={12} /> Follow-up: {note.followUpDate}
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-700">{note.content}</p>
            </div>
          ))}
          {repNotes.length === 0 && !isAddingNote && (
            <div className="p-8 text-center text-slate-500 text-sm">No coaching notes for this agent yet.</div>
          )}
        </div>
      </div>

      {/* Coaching Sessions */}
      {repSessions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Coaching Sessions</h2>
            <Link to="/coaching" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {repSessions.map(sess => (
              <div key={sess.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-slate-900 flex items-center gap-2">
                    {sess.type}
                    {sess.status === 'scheduled' ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] uppercase font-bold rounded-full">Scheduled</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] uppercase font-bold rounded-full">Completed</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> {sess.date}</div>
                </div>
                {sess.notes && (
                  <div className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{sess.notes}</div>
                )}
                {sess.actionItems && sess.actionItems.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sess.actionItems.map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">&bull; {item}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
