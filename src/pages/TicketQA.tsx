import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  FileText,
  User,
  Ticket,
  Clock,
  Star,
  MessageSquare,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const categories = [
  { id: 'opening', name: 'Opening & Greeting', weight: 10 },
  { id: 'authenticating', name: 'User Authentication', weight: 10 },
  { id: 'listening', name: 'Active Listening & Empathy', weight: 20 },
  { id: 'technical', name: 'Technical Knowledge', weight: 30 },
  { id: 'closing', name: 'Closing & Resolution', weight: 20 },
  { id: 'logging', name: 'Ticket Documentation', weight: 10 },
];

export default function TicketQA() {
  const { agents, addQAReview } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedTicket = searchParams.get('ticket');
  const preselectedRep = searchParams.get('repId');
  
  const [selectedRep, setSelectedRep] = useState<string>(preselectedRep || "");
  const [ticketNumber, setTicketNumber] = useState(preselectedTicket || "");
  const [scores, setScores] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [overallNotes, setOverallNotes] = useState("");
  const [isFreeForm, setIsFreeForm] = useState(false);
  const [freeFormScore, setFreeFormScore] = useState(0);

  const totalScore = isFreeForm ? freeFormScore : categories.reduce((sum, cat) => {
    return sum + (scores[cat.id] || 0) * (cat.weight / 100);
  }, 0);

  const handleSubmit = () => {
    if (!selectedRep) {
      toast.error("Please select a target representative.");
      return;
    }
    if (!ticketNumber || ticketNumber.trim() === "") {
      toast.error("Please enter a ticket or interaction ID.");
      return;
    }

    const agent = agents.find(a => a.id === selectedRep);
    addQAReview({
      repId: selectedRep,
      repName: agent?.name || "Unknown",
      ticket: ticketNumber,
      score: Math.round(totalScore),
      reviewer: "Coach Daniel",
      status: 'completed',
      details: isFreeForm ? { overall: freeFormScore } : scores,
      categoryNotes: isFreeForm ? undefined : notes,
      notes: overallNotes
    });

    toast.success("Quality audit submitted and synced to rep profile");
    setTimeout(() => {
      navigate('/qa');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <Link to="/qa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} />
        Back to QA Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Quality Audit Interface</h1>
          <p className="text-slate-500 font-medium tracking-tight">Systematic interaction evaluation for service consistency.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setIsFreeForm(false)}
              className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", !isFreeForm ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Matrix Form
            </button>
            <button 
              onClick={() => setIsFreeForm(true)}
              className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", isFreeForm ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Free Form
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl border border-brand-100">
            <Info size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Audit Protocol v4.2 Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Audit Header & Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Representative</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all appearance-none cursor-pointer"
                  value={selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value)}
                >
                  <option value="">Select Auditor Target...</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ticket / Interaction ID</label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="e.g. INC098442"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Composite Score</span>
                <span className={cn(
                  "text-5xl font-black transition-colors",
                  totalScore > 90 ? "text-emerald-500" : 
                  totalScore > 75 ? "text-slate-800" : "text-rose-500"
                )}>
                  {Math.round(totalScore)}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalScore}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    totalScore > 90 ? "bg-emerald-500" : 
                    totalScore > 75 ? "bg-brand-600" : "bg-rose-500"
                  )}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
            >
              <Save size={18} />
              Commit Audit to Record
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quality Guidelines</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">Ensure all privacy protocol markers were met before proceeding.</p>
              </div>
              <div className="flex gap-3">
                <AlertCircle size={18} className="text-amber-400 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">Auto-fail criteria applies if the representative shared sensitive credentials.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scoring Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {isFreeForm ? "Free Form Evaluation" : "Scoring Matrix"}
              </h2>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Scale 0-100 Point</span>
              </div>
            </div>

            {isFreeForm ? (
              <div className="flex-1 flex flex-col p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-slate-800 mb-1">Overall Interaction Score</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Holistic Evaluation</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="w-40 md:w-56 appearance-none bg-slate-200 h-2 rounded-full outline-none accent-brand-600 cursor-pointer"
                        value={freeFormScore}
                        onChange={(e) => setFreeFormScore(Number(e.target.value))}
                      />
                      <div className="w-14 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-800 text-base shadow-sm ring-1 ring-slate-100 ring-offset-2">
                        {freeFormScore}
                      </div>
                    </div>
                </div>

                <div className="flex-1 min-h-[350px] flex flex-col">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 mt-2">
                    <FileText size={14} />
                    Detailed Notes
                  </h4>
                  <textarea 
                    placeholder="Enter free form notes, observations, and detailed feedback here..."
                    className="flex-1 w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none resize-none"
                    value={overallNotes}
                    onChange={(e) => setOverallNotes(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-50">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{cat.name}</h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weight: {cat.weight}%</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            className="w-32 md:w-48 appearance-none bg-slate-200 h-1.5 rounded-full outline-none accent-brand-600 cursor-pointer"
                            value={scores[cat.id]}
                            onChange={(e) => setScores(prev => ({ ...prev, [cat.id]: Number(e.target.value) }))}
                          />
                          <div className="w-12 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-800 text-sm shadow-sm ring-1 ring-slate-100 ring-offset-2">
                            {scores[cat.id]}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-3 w-3 text-slate-300" />
                        <textarea 
                          placeholder={`Observations for ${cat.name}...`}
                          className="w-full pl-9 pr-4 py-2 bg-transparent text-xs font-medium text-slate-600 border-none outline-none resize-none h-12 hover:bg-white focus:bg-white rounded-lg transition-all"
                          value={notes[cat.id] || ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [cat.id]: e.target.value }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} />
                    Global Audit Feedback
                  </h4>
                  <textarea 
                    placeholder="Overall summary, coaching highlights, and next steps..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 h-32 focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                    value={overallNotes}
                    onChange={(e) => setOverallNotes(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
