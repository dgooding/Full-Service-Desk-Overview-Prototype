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
  
  const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0);

  const handleSubmit = () => {
    if (!selectedRepId || !ticketNumber) {
      toast.error("Please select an agent and enter a ticket number.");
      return;
    }
    const agent = agents.find(a => a.id === selectedRepId);
    if (!agent) return;

    addQAReview({
      repId: agent.id,
      repName: agent.name,
      ticket: ticketNumber,
      score: totalScore,
      reviewer: "Current User", // In a real app, from auth
      status: "completed",
      details: scores,
      notes,
    });
    
    toast.success(`QA review for ${ticketNumber} saved successfully!`);
    navigate(`/team/${agent.id}`);
  };

  const handleSaveDraft = () => {
    if (!selectedRepId && !ticketNumber) {
      toast.warning("Nothing to save. Enter a ticket or select an agent.");
      return;
    }
    toast.success("Draft saved! You can resume this evaluation later.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">QA Review Form</h1>
        <p className="text-slate-500 text-sm mt-1">Evaluate a ticket and provide coaching feedback.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Ticket Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Agent</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={selectedRepId}
              onChange={e => setSelectedRepId(e.target.value)}
            >
              <option value="">Select Agent...</option>
              {agents.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Number (INC/REQ)</label>
            <input 
              type="text" 
              placeholder="e.g. INC0123456"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono uppercase"
              value={ticketNumber}
              onChange={e => setTicketNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Evaluation Rubric</h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">Total Score:</span>
            <div className={cn(
              "text-2xl font-bold px-3 py-1 rounded-lg",
              totalScore >= 90 ? "bg-emerald-100 text-emerald-700" :
              totalScore >= 80 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
            )}>
              {totalScore} / 100
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {qaCategories.map(cat => (
            <div key={cat.id} className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                  <span className="text-xs font-medium text-slate-500 md:hidden">Max: {cat.maxScore}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{cat.criteria}</p>
              </div>
              
              <div className="w-full md:w-32 flex flex-col justify-start shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 hidden md:block text-center">Score</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="0"
                    max={cat.maxScore}
                    value={scores[cat.id]}
                    onChange={e => setScores({...scores, [cat.id]: parseInt(e.target.value) || 0})}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-center text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="text-slate-400 font-medium text-sm">/ {cat.maxScore}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="p-6">
             <label className="block text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Overall Notes</label>
             <textarea 
               rows={4}
               value={notes}
               onChange={e => setNotes(e.target.value)}
               placeholder="Enter specific feedback, strengths, and areas for improvement..."
               className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
             />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={handleSaveDraft} className="px-5 py-2.5 text-blue-600 font-medium hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-2">
          <Save size={18} />
          Save Draft
        </button>
        <button onClick={handleSubmit} className="px-5 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <Check size={18} />
          Submit Evaluation
        </button>
      </div>

    </div>
  );
}
