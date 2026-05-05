import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { ChevronLeft, Check, Save, Info, Award, User, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../constants/skills';

export default function RepSkillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, updateAgentSkill } = useStore();
  
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 mt-10">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <User size={32} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Representative not found</h2>
        <p className="text-slate-500 mb-6 font-medium">The resource record could not be located in the current directory.</p>
        <Link to="/skills" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20">Back to Matrix</Link>
      </div>
    );
  }

  const handleLevelSelect = (skillId: string, level: number) => {
    updateAgentSkill(agent.id, skillId, level);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest group">
          <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Competency Matrix
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-600 rounded-full border border-brand-100">
           <Award size={14} />
           <span className="text-[10px] font-black uppercase tracking-widest">Editing Mode</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <img src={agent.avatar} alt={agent.name} className="w-28 h-28 rounded-3xl border-4 border-white/10 shadow-2xl object-cover" />
          </div>
          <div className="relative z-10 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-3xl font-black tracking-tight">{agent.name}</h1>
              <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest self-center md:self-auto">
                {agent.status}
              </span>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">{agent.role}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase">QA Avg</span>
                <span className="text-sm font-bold">{agent.metrics.qaScore}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase">Tenure</span>
                <span className="text-sm font-bold">1.4 yrs</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-5 text-white">
            <Settings2 size={240} />
          </div>
        </div>
        
        <div className="p-10 space-y-10">
          <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-1">Proficiency Guidelines</p>
              <p className="text-xs font-medium opacity-80 leading-relaxed">
                Rank the resource on a scale of 0-5. 0 indicates no exposure, 3 indicates autonomous competency, and 5 indicates subject matter expertise capable of teaching others.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {SKILL_CATEGORIES.map(category => (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-brand-600 rounded-full"></div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{category.name}</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {category.skills.map(skill => {
                    const currentLevel = (agent.skills as any)?.[skill.id] || 0;
                    return (
                      <div key={skill.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-lg transition-all group/skill">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-5 flex-1">
                            <button
                              onClick={() => handleLevelSelect(skill.id, currentLevel > 0 ? 0 : 3)}
                              className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 shrink-0 group/check",
                                currentLevel > 0 
                                  ? "bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-200" 
                                  : "bg-white border-slate-200 text-slate-200 hover:border-slate-300 hover:text-slate-300"
                              )}
                            >
                              <Check size={28} className={cn("transition-transform", currentLevel > 0 ? "scale-100" : "scale-75 group-hover/check:scale-90")} />
                            </button>
                            <div>
                              <h3 className="font-black text-slate-800 text-lg mb-0.5">{skill.name}</h3>
                              <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-sm">{skill.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Proficiency Level</span>
                            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                              {PROFICIENCY_LEVELS.map(l => (
                                <button
                                  key={l.level}
                                  onClick={() => handleLevelSelect(skill.id, l.level)}
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all relative group/btn",
                                    currentLevel === l.level 
                                      ? cn(l.color, l.text, "shadow-md ring-2 ring-white scale-110 z-10") 
                                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                  )}
                                  title={l.label}
                                >
                                  {l.level}
                                  {currentLevel === l.level && (
                                    <motion.div 
                                      layoutId={`active-skill-${skill.id}`}
                                      className="absolute -inset-1 rounded-2xl border-2 border-brand-500 pointer-events-none"
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
              <p className="text-sm font-black text-slate-700">May 05, 2026 by Coach Daniel</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => navigate('/skills')}
                className="flex-1 md:flex-none px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toast.success(`Competency profile for ${agent.name} updated.`);
                  navigate('/skills');
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save size={18} />
                Persist Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
