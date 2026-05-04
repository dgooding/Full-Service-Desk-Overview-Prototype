import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { ChevronLeft, Check, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const allSkills = ["ETS", "Claims", "Agent", "Property", "Fleet"];

export default function RepSkillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, updateAgentSkill } = useStore();
  
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-xl font-bold text-slate-800">Representative not found</h2>
        <Link to="/skills" className="text-brand-600 mt-4 underline">Back to Matrix</Link>
      </div>
    );
  }

  const handleToggle = (skill: string) => {
    const currentLevel = (agent.skills as any)?.[skill] || 0;
    const newLevel = currentLevel > 0 ? 0 : 5; // Toggle between 0 and 5
    updateAgentSkill(agent.id, skill, newLevel);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} />
        Back to Competency Matrix
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6">
          <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{agent.name}</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{agent.role}</p>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Skill Certifications</h2>
          
          <div className="space-y-3">
            {allSkills.map(skill => {
              const isActive = ((agent.skills as any)?.[skill] || 0) > 0;
              return (
                <div 
                  key={skill}
                  onClick={() => handleToggle(skill)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                    isActive 
                      ? "bg-brand-50 border-brand-200" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className={cn(
                    "font-bold",
                    isActive ? "text-brand-700" : "text-slate-600"
                  )}>
                    {skill}
                  </span>
                  
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center transition-colors",
                    isActive ? "bg-brand-600 text-white" : "border-2 border-slate-200 text-transparent"
                  )}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={() => {
                toast.success('Skills updated successfully');
                navigate('/skills');
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all"
            >
              <Save size={18} />
              Save & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
