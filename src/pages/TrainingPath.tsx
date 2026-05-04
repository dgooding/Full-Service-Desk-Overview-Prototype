import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ArrowLeft, PlayCircle, CheckCircle2, Circle, Clock, BookOpen, Target, ExternalLink, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function TrainingPath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents } = useStore();
  
  const [activeModule, setActiveModule] = useState<any | null>(null);

  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <h2 className="text-2xl font-bold text-slate-800">Agent not found</h2>
        <button onClick={() => navigate('/team')} className="text-brand-600 hover:underline mt-4">Return to Team</button>
      </div>
    );
  }

  const modules = [
    {
      id: 1,
      title: "Introduction to Fleet Claims",
      duration: "15 min",
      status: "completed",
      type: "video"
    },
    {
      id: 2,
      title: "Identifying Third-Party Liability",
      duration: "25 min",
      status: "in-progress",
      type: "interactive"
    },
    {
      id: 3,
      title: "Subrogation Basics & Escalation Paths",
      duration: "40 min",
      status: "locked",
      type: "course"
    },
    {
      id: 4,
      title: "Complex Claims Simulation",
      duration: "60 min",
      status: "locked",
      type: "assessment"
    }
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate(`/team/${agent.id}`)} className="flex items-center gap-2 p-2 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 transition-all hover:shadow-sm">
          <ArrowLeft size={14} />
          Back to {agent.name.split(' ')[0]}'s Profile
        </button>
        <div className="px-3 py-1.5 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-100">
          Personalized Path
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Target size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4 text-brand-200 text-sm font-bold uppercase tracking-widest">
                <BookOpen size={16} />
                Suggested Focus Curriculum
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-3">Complex Claims & Subrogation</h1>
              <p className="text-brand-100 max-w-xl text-sm leading-relaxed">
                Curated specifically for {agent.name} based on AI analysis of recent ticket resolution patterns and AHT spikes during fleet claim incidents.
              </p>
            </div>
            
            <div className="flex items-center gap-8 bg-white/10 px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-sm shrink-0">
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-brand-200 mb-1">Total Duration</p>
                <div className="flex items-center gap-2 text-xl font-black">
                  <Clock size={20} />
                  2h 20m
                </div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-brand-200 mb-1">Progress</p>
                <div className="flex items-center gap-2 text-xl font-black">
                  25%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Learning Modules</h3>
          
          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <motion.div 
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                delay={idx * 0.1}
                className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between transition-all",
                  mod.status === 'completed' ? "bg-emerald-50 border-emerald-100" :
                  mod.status === 'in-progress' ? "bg-white border-brand-200 shadow-md ring-4 ring-brand-50" :
                  "bg-slate-50 border-slate-100 opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    mod.status === 'completed' ? "bg-emerald-200 text-emerald-700" :
                    mod.status === 'in-progress' ? "bg-brand-100 text-brand-600" :
                    "bg-slate-200 text-slate-400"
                  )}>
                    {mod.status === 'completed' ? <CheckCircle2 size={20} /> :
                     mod.status === 'in-progress' ? <PlayCircle size={20} className="animate-pulse" /> :
                     <Circle size={20} />}
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-bold text-sm",
                      mod.status === 'completed' ? "text-emerald-900" :
                      mod.status === 'in-progress' ? "text-brand-900" :
                      "text-slate-500"
                    )}>
                      {mod.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs font-bold uppercase tracking-wider">
                      <span className={cn(
                        mod.status === 'completed' ? "text-emerald-600" :
                        mod.status === 'in-progress' ? "text-brand-600" :
                        "text-slate-400"
                      )}>
                        {mod.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {mod.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => {
                      if (mod.status === 'locked') {
                        toast.error('Complete preceding modules first.');
                      } else {
                        setActiveModule(mod);
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus:outline-none flex items-center gap-2",
                      mod.status === 'completed' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
                      mod.status === 'in-progress' ? "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20 active:scale-95" :
                      "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {mod.status === 'completed' ? 'Review' :
                     mod.status === 'in-progress' ? 'Continue' :
                     'Locked'}
                    {mod.status !== 'locked' && <ExternalLink size={14} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveModule(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 4rem)' }}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-brand-600 text-[10px] font-black uppercase tracking-widest mb-1">
                    <BookOpen size={14} />
                    {activeModule.type}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeModule.title}</h2>
                </div>
                <button 
                  onClick={() => setActiveModule(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 bg-slate-50 flex-1 overflow-y-auto">
                <div className="aspect-video w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative group overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                  <div className="z-20 flex flex-col items-center">
                    <button className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-brand-500 transition-all active:scale-95 mb-6">
                      <Play size={32} fill="currentColor" className="ml-2" />
                    </button>
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Start Module</span>
                  </div>
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-xs font-bold flex items-center gap-2">
                    <Clock size={14} />
                    {activeModule.duration}
                  </div>
                </div>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Module Overview</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      In this module, representatives learn the crucial steps for managing complex interactions. 
                      You will examine key indicators, appropriate routing queues, and how to properly document 
                      multi-party incident records within the CRM to ensure a seamless experience for the customer.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
                <button 
                  onClick={() => setActiveModule(null)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    toast.success('Progress saved!');
                    setActiveModule(null);
                  }}
                  className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                >
                  Mark as Completed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
