import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  User, 
  Ticket, 
  Calendar, 
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const categories = [
  { id: 'opening', name: 'Opening & Greeting', weight: 10 },
  { id: 'authenticating', name: 'User Authentication', weight: 10 },
  { id: 'listening', name: 'Active Listening & Empathy', weight: 20 },
  { id: 'technical', name: 'Technical Knowledge', weight: 30 },
  { id: 'closing', name: 'Closing & Resolution', weight: 20 },
  { id: 'logging', name: 'Ticket Documentation', weight: 10 },
];

export default function QADetail() {
  const { qaId } = useParams();
  const { qaReviews, agents, logCommunication } = useStore();

  const review = qaReviews.find(r => r.id === qaId);
  
  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-black text-slate-800 mb-4">QA Review Not Found</h2>
        <Link to="/qa" className="text-brand-600 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const agent = agents.find(a => a.id === review.repId);

  const handleDiscuss = () => {
    if (!agent) return;
    const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `QA Review Feedback: Ticket ${review.ticket}`;
    
    logCommunication({
      agentId: agent.id,
      agentName: agent.name,
      type: 'Teams Chat',
      subject
    });

    window.open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank');
    toast.success(`Opening Teams chat with ${agent.name}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/qa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
          <ChevronLeft size={16} />
          Back to QA Dashboard
        </Link>
        <button 
          onClick={handleDiscuss}
          className="flex items-center gap-2 px-4 py-2 bg-[#444791] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:bg-[#3b3e7a] transition-all active:scale-95"
        >
          <MessageCircle size={14} />
          Discuss Review
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <img src={agent?.avatar} alt={review.repName} className="w-20 h-20 rounded-[1.5rem] border-4 border-white shadow-lg object-cover bg-slate-100" />
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{review.repName}</h1>
              <div className="text-sm font-bold text-slate-500 mt-1">{agent?.role || 'Service Representative'}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest",
              review.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
              review.status === 'needs_review' ? "bg-amber-50 text-amber-600" :
              "bg-slate-50 text-slate-600"
            )}>
              {review.status.replace('_', ' ')}
            </div>
            <span className="text-xs font-medium text-slate-400">
              Evaluated {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Ticket size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ticket Range</span>
            </div>
            <div className="text-xl font-black text-slate-800">{review.ticket}</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <User size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Reviewer</span>
            </div>
            <div className="text-xl font-black text-slate-800">{review.reviewer}</div>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/20 blur-2xl rounded-full" />
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Composite Score</span>
            </div>
            <div className={cn(
              "text-4xl font-black tracking-tighter",
              review.score >= 90 ? "text-emerald-400" :
              review.score >= 80 ? "text-brand-400" :
              "text-rose-400"
            )}>
              {review.score}%
            </div>
          </div>
        </div>

        {review.details && !review.details.overall && (
          <div className="mb-12">
            <h3 className="text-lg font-black text-slate-800 mb-6">Component Breakdown</h3>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded">Weight: {cat.weight}%</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            (review.details?.[cat.id] || 0) >= 90 ? "bg-emerald-500" :
                            (review.details?.[cat.id] || 0) >= 75 ? "bg-brand-500" : "bg-rose-500"
                          )}
                          style={{ width: `${review.details?.[cat.id] || 0}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-black text-slate-800">{review.details?.[cat.id] || 0}</span>
                    </div>
                  </div>
                  {review.categoryNotes?.[cat.id] && (
                    <div className="mt-2 pt-3 border-t border-slate-50">
                      <p className="text-xs font-medium text-slate-500 italic">
                        "{review.categoryNotes[cat.id]}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {review.details && review.details.overall !== undefined && (
           <div className="mb-12">
           <h3 className="text-lg font-black text-slate-800 mb-6">Free Form Evaluation</h3>
           <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl">
             <div>
               <span className="text-sm font-bold text-slate-700 block mb-1">Holistic Overview</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Impression Rating</span>
             </div>
             <div className="flex items-center gap-6">
               <div className="hidden sm:block w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className={cn(
                     "h-full rounded-full",
                     review.details.overall >= 90 ? "bg-emerald-500" :
                     review.details.overall >= 75 ? "bg-brand-500" : "bg-rose-500"
                   )}
                   style={{ width: `${review.details.overall || 0}%` }}
                 />
               </div>
               <span className="w-12 text-right font-black text-slate-800 text-xl">{review.details.overall || 0}</span>
             </div>
           </div>
         </div>
        )}

        {review.notes && (
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-brand-600" />
              Global Audit Feedback
            </h3>
            <div className="p-6 bg-brand-50/50 border border-brand-100 rounded-3xl">
              <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                {review.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
