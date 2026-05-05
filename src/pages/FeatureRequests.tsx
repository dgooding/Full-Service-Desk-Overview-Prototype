import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Rocket, 
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useStore, RequestItem } from '../contexts/StoreContext';

type Status = 'Pending' | 'In Progress' | 'Completed';
type Type = 'Feature' | 'Report';

export default function FeatureRequests() {
  const { featureRequests: requests, addFeatureRequest, updateFeatureRequestVotes } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | Status>('All');
  
  // Form state
  const [newType, setNewType] = useState<Type>('Feature');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredRequests = requests.filter(r => filter === 'All' || r.status === filter);

  const handleVote = (id: string) => {
    updateFeatureRequestVotes(id);
    toast.success('Vote recorded');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    addFeatureRequest({
      title: newTitle,
      description: newDesc,
      type: newType,
      requester: 'Coach Daniel'
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    toast.success('Request submitted successfully');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
            <span>Platform</span>
            <span>/</span>
            <span className="text-slate-800">Requests</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Feature & Report Log</h1>
          <p className="text-slate-500 font-medium. tracking-tight">Submit requests for new features, data reports, or platform enhancements.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
        <button onClick={() => setFilter('All')} className={cn("px-4 py-2 text-sm font-bold rounded-xl transition-all", filter === 'All' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100')}>All Requests</button>
        <button onClick={() => setFilter('Pending')} className={cn("px-4 py-2 text-sm font-bold rounded-xl transition-all", filter === 'Pending' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100')}>Pending</button>
        <button onClick={() => setFilter('In Progress')} className={cn("px-4 py-2 text-sm font-bold rounded-xl transition-all", filter === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100')}>In Progress</button>
        <button onClick={() => setFilter('Completed')} className={cn("px-4 py-2 text-sm font-bold rounded-xl transition-all", filter === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100')}>Completed</button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map(req => (
            <motion.div 
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center"
            >
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[80px]">
                <button 
                  onClick={() => handleVote(req.id)}
                  className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <Rocket size={20} className="-rotate-45" />
                </button>
                <span className="text-xl font-black text-slate-900">{req.votes}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Votes</span>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg",
                    req.type === 'Feature' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                  )}>
                    {req.type}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{req.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{req.title}</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{req.description}</p>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <MessageSquare size={14} /> 0 Comments
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Clock size={14} /> {req.date}
                  </div>
                  <span className="text-xs font-bold text-slate-400">By {req.requester}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className={cn(
                  "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2",
                  req.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  req.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  'bg-amber-50 text-amber-600 border border-amber-100'
                )}>
                  {req.status === 'Completed' && <CheckCircle2 size={16} />}
                  {req.status === 'In Progress' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>}
                  {req.status === 'Pending' && <Clock size={16} />}
                  {req.status}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Lightbulb size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No requests found</h3>
            <p className="text-slate-500">There are no {filter.toLowerCase()} requests matching this filter.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-lg p-8"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">New Request</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewType('Feature')}
                      className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl border transition-all",
                        newType === 'Feature' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      )}
                    >
                      Platform Feature
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewType('Report')}
                      className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl border transition-all",
                        newType === 'Report' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      )}
                    >
                      Data Report
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400"
                    placeholder="E.g., Automated Weekly SLA Report..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Please describe the feature or report in detail..."
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all font-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95 text-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
