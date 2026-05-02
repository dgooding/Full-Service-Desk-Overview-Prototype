import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Search, Save, Check, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const qaCategories = [
  {
    id: "greeting",
    name: "Opening & Greeting",
    maxScore: 10,
    criteria: "Properly verified user, professional greeting, empathy."
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting Steps",
    maxScore: 40,
    criteria: "Followed KBA, logical isolation of the issue, asked probing questions."
  },
  {
    id: "resolution",
    name: "Resolution & Closure",
    maxScore: 30,
    criteria: "Resolved the issue or escalated correctly. Offered further assistance."
  },
  {
    id: "documentation",
    name: "Ticket Documentation",
    maxScore: 20,
    criteria: "Clear work notes, categorized correctly, CI selected."
  }
];

export default function TicketQA() {
  const { agents, addQAReview } = useStore();
  const navigate = useNavigate();

  const [selectedRepId, setSelectedRepId] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({
    greeting: 10,
    troubleshooting: 40,
    resolution: 30,
    documentation: 20
  });
  const [categoryNotes, setCategoryNotes] = useState<Record<string, string>>({
    greeting: "",
    troubleshooting: "",
    resolution: "",
    documentation: ""
  });
  
  const totalScore = (Object.values(scores) as number[]).reduce((a, b) => a + (b || 0), 0);

  const handleSubmit = () => {
    if (!selectedRepId || !ticketNumber) {
      toast.error("Please identify the technician and include a ticket reference.");
      return;
    }
    const agent = agents.find(a => a.id === selectedRepId);
    if (!agent) return;

    addQAReview({
      repId: agent.id,
      repName: agent.name,
      ticket: ticketNumber,
      score: totalScore,
      reviewer: "Coach Dan",
      status: "completed",
      details: scores,
      categoryNotes: categoryNotes,
      notes,
    });
    
    toast.success(`Audit submission for ${agent.name} finalized.`);
    navigate(`/team/${agent.id}`);
  };

  const handleSaveDraft = () => {
    if (!selectedRepId || !ticketNumber) {
      toast.error("Technician and ticket reference required for draft state.");
      return;
    }
    const agent = agents.find(a => a.id === selectedRepId);
    if (!agent) return;

    addQAReview({
      repId: agent.id,
      repName: agent.name,
      ticket: ticketNumber,
      score: totalScore,
      reviewer: "Coach Dan",
      status: "draft",
      details: scores,
      categoryNotes: categoryNotes,
      notes,
    });

    toast.success("Operational draft synchronized.");
    navigate('/team');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-blue-600"></div>
             Operational <span className="font-serif italic font-normal text-slate-400 ml-1">Audit Log</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Capture technician performance metrics and technical observations.</p>
        </div>
        <div className="bg-slate-900 p-1 px-4 rounded-xl border border-slate-700 shadow-xl flex items-center gap-4">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Total</div>
           <div className={cn(
             "text-2xl font-mono font-black tabular-nums",
             totalScore >= 90 ? "text-emerald-400" :
             totalScore >= 80 ? "text-amber-400" : "text-rose-400"
           )}>
             {totalScore}<span className="text-slate-600 text-sm ml-1">/100</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Metadata & Rubric */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-2 border-slate-900 pl-3">Session Metadata</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Target Technician</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                    value={selectedRepId}
                    onChange={e => setSelectedRepId(e.target.value)}
                  >
                    <option value="">Select Asset...</option>
                    {agents.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Incident Reference</label>
                  <input 
                    type="text" 
                    placeholder="INC-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-mono font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none uppercase"
                    value={ticketNumber}
                    onChange={e => setTicketNumber(e.target.value)}
                  />
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
               <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Quality Dimension Matrix</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {qaCategories.map(cat => (
                <div key={cat.id} className="p-8 group hover:bg-slate-50/50 transition-all">
                  <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{cat.name}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest md:hidden">Max: {cat.maxScore}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{cat.criteria}</p>
                    </div>
                    
                    <div className="w-full md:w-32 shrink-0 flex flex-col justify-start items-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Allocated</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          min="0"
                          max={cat.maxScore}
                          value={scores[cat.id]}
                          onChange={e => setScores({...scores, [cat.id]: parseInt(e.target.value) || 0})}
                          className="w-16 bg-white border border-slate-300 rounded-xl py-3 text-center text-xl font-mono font-black text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none shadow-sm transition-all"
                        />
                        <span className="text-slate-300 font-black text-sm font-mono mt-1">/ {cat.maxScore}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                       <ShieldAlert size={12} className="text-slate-400" />
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dimension Observations</label>
                    </div>
                    <textarea
                      rows={2}
                      value={categoryNotes[cat.id] || ""}
                      onChange={e => setCategoryNotes({...categoryNotes, [cat.id]: e.target.value})}
                      placeholder={`Document technical specific observations for ${cat.name.toLowerCase()}...`}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Overall Strategy & Actions */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Check size={80} />
             </div>
             <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-6">Strategic Feedback</h3>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Overall Assessment</label>
                   <textarea 
                     rows={8}
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                     placeholder="Synthesize the audit results into actionable feedback..."
                     className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-inner text-white placeholder:text-slate-500"
                   />
                </div>
                
                <div className="pt-4 space-y-4">
                   <button 
                     onClick={handleSubmit} 
                     className="w-full bg-blue-600 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                   >
                     Submit Evaluation
                   </button>
                   <button 
                     onClick={handleSaveDraft} 
                     className="w-full bg-transparent border border-slate-700 text-slate-400 rounded-2xl py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white hover:border-slate-500 active:scale-95 transition-all"
                   >
                     Save as Draft
                   </button>
                </div>
                
                <button 
                  onClick={() => navigate(-1)} 
                  className="w-full text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] hover:text-slate-400 transition-colors"
                >
                  Discard Operations
                </button>
             </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl group/info">
             <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg group-hover:rotate-12 transition-transform">
                   <ShieldAlert size={18} />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compliance Warning</p>
                   <p className="text-xs font-bold text-slate-600 leading-relaxed">
                     Finalized audits are synchronized with the central repository. Post-submission modifications are restricted to administrator bypass.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}
