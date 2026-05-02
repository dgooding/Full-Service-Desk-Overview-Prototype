import React, { useState } from 'react';
import { Calendar, Plus, Clock, FileText, Check, FileEdit } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function CoachingSessions() {
  const { agents, sessions, addSession, completeSession } = useStore();
  
  // activeModal: 'schedule' = just schedule a future session
  // activeModal: 'log' = create a brand new completed session right now
  // activeModal: 'complete' = finish an existing scheduled session
  const [activeModal, setActiveModal] = useState<'schedule' | 'log' | 'complete' | null>(null);
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [completeMode, setCompleteMode] = useState<'STAR' | 'FreeForm'>('STAR');
  const [starLog, setStarLog] = useState({ s: '', t: '', a: '', r: '' });
  const [freeNotes, setFreeNotes] = useState('');
  const [actionItemsStr, setActionItemsStr] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  const [sessionFormData, setSessionFormData] = useState({
    repId: '',
    repName: '',
    type: 'Performance Review',
    date: new Date().toLocaleDateString()
  });

  const resetForm = () => {
    setSessionFormData({ repId: '', repName: '', type: 'Performance Review', date: new Date().toLocaleDateString() });
    setStarLog({ s: '', t: '', a: '', r: '' });
    setFreeNotes('');
    setActionItemsStr('');
    setFollowUpDate('');
    setCompleteMode('STAR');
    setEditingSessionId(null);
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
      } else {
        setStarLog({ s: '', t: '', a: '', r: '' });
      }
      setFreeNotes('');
      setCompleteMode('STAR');
    } else {
      setStarLog({ s: '', t: '', a: '', r: '' });
      setFreeNotes(notesStr);
      setCompleteMode('FreeForm');
    }

    setActionItemsStr(session.actionItems?.join(', ') || '');
    setFollowUpDate('');
    setActiveModal(isEditing ? 'log' : 'complete'); // using 'log' modal layout for editing
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
        date: sessionFormData.date || new Date().toLocaleDateString(),
        status: 'scheduled'
      });
      toast.success("Coaching session scheduled successfully!");
      setActiveModal(null);
      return;
    }

    // For 'log' or 'complete'
    let finalNotes = '';
    if (completeMode === 'STAR') {
      finalNotes = `[STAR Log]\nS (Situation): ${starLog.s}\nT (Task): ${starLog.t}\nA (Action): ${starLog.a}\nR (Result): ${starLog.r}`;
    } else {
      finalNotes = freeNotes;
    }

    const actionItems = actionItemsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (activeModal === 'complete' && editingSessionId) {
      completeSession(editingSessionId, {
        notes: finalNotes,
        actionItems: actionItems.length > 0 ? actionItems : undefined,
        status: 'completed',
        date: sessionFormData.date,
        type: sessionFormData.type
      });
      toast.success("Scheduled session completed and notes saved.");
    } else if (activeModal === 'log') {
      if (editingSessionId) {
        // We are editing an already completed session
        completeSession(editingSessionId, {
          notes: finalNotes,
          actionItems: actionItems.length > 0 ? actionItems : undefined,
          date: sessionFormData.date,
          type: sessionFormData.type
        });
        toast.success("Coaching session updated.");
      } else {
        // Brand new completed session
        const newSessionId = `sess-${Date.now()}`;
        addSession({
          repId: agent.id,
          rep: agent.name,
          type: sessionFormData.type,
          date: sessionFormData.date || new Date().toLocaleDateString(),
          status: 'completed'
        });
        // Now update it with notes immediately
        setTimeout(() => {
          completeSession(newSessionId, {
            notes: finalNotes,
            actionItems: actionItems.length > 0 ? actionItems : undefined
          });
        }, 50);
        toast.success("Coaching session logged successfully.");
      }
    }

    if (followUpDate) {
      addSession({
        repId: agent.id,
        rep: agent.name,
        type: 'Follow-up Check-in',
        date: followUpDate,
        status: 'scheduled'
      });
      toast.success(`Follow-up scheduled for ${followUpDate}`);
    }

    setActiveModal(null);
  };

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coaching & Development</h1>
          <p className="text-slate-500 text-sm mt-1">Schedule 1-on-1s and document coaching feedback using STAR.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={openScheduleModal} className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50 shadow-sm transition-colors flex items-center gap-2">
            <Calendar size={18} />
            Schedule
          </button>
          <button onClick={openLogModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
            <Plus size={18} />
            Log Coaching Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-5 border-b border-slate-100 bg-slate-50/50">
               <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                 <Calendar size={16} /> Upcoming Sessions
               </h2>
             </div>
             <div className="divide-y divide-slate-100 divide-dashed p-2">
                {scheduledSessions.map(sess => {
                  const rep = agents.find(m => m.name === sess.rep || m.id === sess.repId);
                  return (
                  <div key={sess.id} className="p-3 hover:bg-slate-50 rounded-lg group transition-colors block">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                         <img src={rep?.avatar || 'https://i.pravatar.cc/150'} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                         <div>
                           <div className="text-sm font-semibold text-slate-900">{sess.rep}</div>
                           <div className="text-xs text-slate-500">{sess.type}</div>
                         </div>
                      </div>
                      <button onClick={() => openCompleteModal(sess.id)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md" title="Complete Session">
                        <Check size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1.5 rounded w-fit">
                       <Clock size={14} /> {sess.date}
                    </div>
                  </div>
                )})}
                {scheduledSessions.length === 0 && <div className="p-4 text-sm text-slate-500 text-center">No upcoming sessions.</div>}
             </div>
          </div>
        </div>

        {/* Recent & Archive */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
               <h2 className="text-lg font-semibold text-slate-800">Recent Coaching Logs</h2>
               <div className="flex gap-2">
                 <select className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-600">
                    <option>All Techs / Agents</option>
                    {agents.map(m => <option key={m.id}>{m.name}</option>)}
                 </select>
               </div>
             </div>
             
             <div className="divide-y divide-slate-100">
                {pastSessions.map((sess) => (
                  <div key={sess.id} className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 text-sm">{sess.type}</h3>
                        <span className="text-xs text-slate-400">{sess.date}</span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1 mb-3">
                        <Link to={`/team/${sess.repId}`} className="font-medium hover:text-blue-600">{sess.rep}</Link>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {sess.notes || 'No notes provided for this session.'}
                      </p>
                      {sess.actionItems && sess.actionItems.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Action Items</h4>
                          <div className="flex flex-wrap gap-2">
                            {sess.actionItems.map((item, idx) => (
                               <span key={idx} className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-md font-medium">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex items-center gap-4">
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1" onClick={() => openCompleteModal(sess.id, true)}>
                          <FileEdit size={14} /> Edit Log
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pastSessions.length === 0 && <div className="p-6 text-slate-500">No completed sessions.</div>}
             </div>
          </div>
        </div>

      </div>

      {activeModal && activeModal === 'schedule' && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Schedule Upcoming Session</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Agent / Tech</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                  value={sessionFormData.repId} onChange={e => setSessionFormData({...sessionFormData, repId: e.target.value})}
                >
                  <option value="">Select Agent...</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                  value={sessionFormData.type} onChange={e => setSessionFormData({...sessionFormData, type: e.target.value})}
                >
                  <option>Performance Review</option>
                  <option>Career Development</option>
                  <option>Quick Check-in</option>
                  <option>QA Debrief</option>
                  <option>Disciplinary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                <input type="text" placeholder="e.g. Wednesday, 2:00 PM" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                  value={sessionFormData.date} onChange={e => setSessionFormData({...sessionFormData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveSession} className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Schedule</button>
            </div>
          </div>
        </div>
      )}

      {activeModal && (activeModal === 'log' || activeModal === 'complete') && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                {activeModal === 'complete' ? 'Complete Scheduled Coaching' : (editingSessionId ? 'Edit Coaching Log' : 'Log New Coaching Session')}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Core Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent / Tech</label>
                  <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none font-medium"
                    value={sessionFormData.repId} onChange={e => setSessionFormData({...sessionFormData, repId: e.target.value})}
                    disabled={activeModal === 'complete'}
                  >
                    <option value="">Select...</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Session Type</label>
                  <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none font-medium"
                    value={sessionFormData.type} onChange={e => setSessionFormData({...sessionFormData, type: e.target.value})}
                  >
                    <option>Performance Review</option>
                    <option>Career Development</option>
                    <option>Quick Check-in</option>
                    <option>QA Debrief</option>
                    <option>Behavioral Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                  <input type="text"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none font-medium"
                    value={sessionFormData.date} onChange={e => setSessionFormData({...sessionFormData, date: e.target.value})}
                  />
                </div>
              </div>

              {/* Toggle Area */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCompleteMode('STAR')}
                    className={`pb-2 text-sm font-semibold transition-colors relative top-[9px] ${completeMode === 'STAR' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    STAR Method Log
                  </button>
                  <button 
                    onClick={() => setCompleteMode('FreeForm')}
                    className={`pb-2 text-sm font-semibold transition-colors relative top-[9px] ${completeMode === 'FreeForm' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Free-form Notes
                  </button>
                </div>
              </div>

              {/* Form Areas */}
              {completeMode === 'STAR' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800 flex items-center gap-2">
                       <span className="bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center rounded-md text-xs">S</span> Situation
                    </label>
                    <p className="text-xs text-slate-500 mb-2">Describe the context, location, or background.</p>
                    <textarea 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y min-h-[90px]"
                      placeholder="e.g. During yesterday's high volume shift..."
                      value={starLog.s} onChange={e => setStarLog({ ...starLog, s: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800 flex items-center gap-2">
                       <span className="bg-emerald-100 text-emerald-700 w-6 h-6 flex items-center justify-center rounded-md text-xs">T</span> Task
                    </label>
                    <p className="text-xs text-slate-500 mb-2">What was the specific challenge or goal?</p>
                    <textarea 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:emerald:border-emerald-500 focus-visible:ring-1 focus:ring-emerald-500 outline-none transition-all resize-y min-h-[90px]"
                      placeholder="e.g. Needed to de-escalate an angry caller..."
                      value={starLog.t} onChange={e => setStarLog({ ...starLog, t: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800 flex items-center gap-2">
                       <span className="bg-amber-100 text-amber-700 w-6 h-6 flex items-center justify-center rounded-md text-xs">A</span> Action
                    </label>
                    <p className="text-xs text-slate-500 mb-2">What specific action did the tech take?</p>
                    <textarea 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-y min-h-[90px]"
                      placeholder="e.g. The tech actively listened and applied the LEARN framework..."
                      value={starLog.a} onChange={e => setStarLog({ ...starLog, a: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800 flex items-center gap-2">
                       <span className="bg-purple-100 text-purple-700 w-6 h-6 flex items-center justify-center rounded-md text-xs">R</span> Result
                    </label>
                    <p className="text-xs text-slate-500 mb-2">What was the outcome or impact?</p>
                    <textarea 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-y min-h-[90px]"
                      placeholder="e.g. The customer calmed down and rated 5/5 at the end."
                      value={starLog.r} onChange={e => setStarLog({ ...starLog, r: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-800 text-base">Comprehensive Notes</label>
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-lg p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y min-h-[240px] leading-relaxed"
                    placeholder="Enter detailed free-form coaching notes here..."
                    value={freeNotes} onChange={e => setFreeNotes(e.target.value)}
                  />
                </div>
              )}

              <hr className="border-slate-100 my-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Action Items <span className="text-slate-400 font-normal">(comma separated)</span></label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Read KB101, Shadow Bob for 1hr"
                    value={actionItemsStr} onChange={e => setActionItemsStr(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Schedule Follow-up Connection</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Next Tuesday at 1:00 PM"
                    value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Creates a new calendar event for you and the tech.</p>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveSession} className="px-6 py-2.5 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                Save & Complete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

