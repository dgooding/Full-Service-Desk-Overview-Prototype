import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  Award, Search, SlidersHorizontal, ChevronUp, ChevronDown, 
  CheckCircle2, Target, Zap, Shield, HelpCircle, Info, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const SKILLS = [
  "Active Directory",
  "VPN Troubleshooting",
  "O365 & Exchange",
  "Mac / Jamf",
  "Hardware & Periphs",
  "VIP Support"
];

const SKILL_LEVELS: Record<number, { label: string, color: string, description: string, badge: string }> = {
  1: { label: "Novice", color: "bg-slate-100 text-slate-500", description: "Exposure only", badge: "bg-slate-200" },
  2: { label: "Beginner", color: "bg-rose-50 text-rose-600", description: "Assistance needed", badge: "bg-rose-100" },
  3: { label: "Competent", color: "bg-amber-50 text-amber-600", description: "Standard tickets", badge: "bg-amber-100" },
  4: { label: "Proficient", color: "bg-blue-50 text-blue-600", description: "Senior support", badge: "bg-blue-100" },
  5: { label: "Expert", color: "bg-emerald-50 text-emerald-700", description: "SME / Tech Lead", badge: "bg-emerald-100" }
};

export default function SkillsMatrix() {
  const { agents, updateAgentSkill } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCell, setActiveCell] = useState<{ agentId: string, skill: string } | null>(null);

  const agentsWithSkills = agents.map(agent => {
    const skills = agent.skills || SKILLS.reduce((acc, skill, idx) => {
      const idNum = parseInt(agent.id.replace(/\D/g, '')) || 0;
      const score = (Math.floor((idNum + idx * 17) % 5) + 1);
      acc[skill] = score;
      return acc;
    }, {} as Record<string, number>);
    
    return { ...agent, skills };
  });

  const filteredAgents = agentsWithSkills.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleLevelUpdate = (agentId: string, skill: string, newLevel: number) => {
    if (newLevel < 1 || newLevel > 5) return;
    updateAgentSkill(agentId, skill, newLevel);
    toast.success(`Updated ${skill} competency level.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Competency Blueprint
            <span className="text-[10px] bg-slate-900 text-white font-black px-2 py-0.5 rounded uppercase tracking-widest">SME Edition</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">A technical capability map of the frontline diagnostic vectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Persona..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none w-full md:w-64 transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all">
             <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Skills Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(SKILL_LEVELS).map(([score, level]) => (
          <div key={score} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow group">
             <div className="flex items-center justify-between mb-3">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm border shadow-inner", level.color)}>
                  {score}
                </div>
                <span className={cn("text-[9px] font-black uppercase tracking-[0.15em]", level.color.replace('bg-', 'text-').replace('-50', '-700'))}>
                  {level.label}
                </span>
             </div>
             <p className="text-[11px] font-bold text-slate-400 leading-tight italic">"{level.description}"</p>
          </div>
        ))}
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="p-10 font-black text-slate-400 uppercase tracking-[0.25em] text-[10px] sticky left-0 z-20 w-80 bg-[#0f172a] border-r border-slate-800">
                   TECH PERSONA / VECTORS
                </th>
                {SKILLS.map(skill => (
                  <th key={skill} className="px-10 py-8 font-black text-white uppercase tracking-widest text-[10px] text-center border-r border-slate-800 min-w-[200px] whitespace-nowrap bg-[#1e293b] relative overflow-hidden group/th">
                    <div className="relative z-10">{skill}</div>
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/th:opacity-100 transition-opacity"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgents.map(rep => (
                <tr key={rep.id} className="hover:bg-blue-50/10 transition-colors group">
                  <td className="p-8 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 shadow-[10px_0_15px_-15px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={rep.avatar} alt="" className="w-14 h-14 rounded-[1.5rem] border-2 border-white shadow-xl ring-1 ring-slate-100 object-cover" />
                        <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white", rep.status === 'online' ? "bg-emerald-500" : "bg-slate-300")}></div>
                      </div>
                      <div>
                        <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight text-lg leading-none mb-1.5">{rep.name}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{rep.role}</div>
                      </div>
                    </div>
                  </td>
                  {SKILLS.map(skill => {
                    const score = rep.skills?.[skill] || 1;
                    const level = SKILL_LEVELS[score];
                    const isActive = activeCell?.agentId === rep.id && activeCell?.skill === skill;

                    return (
                      <td 
                        key={skill} 
                        className={cn(
                          "p-0 text-center border-r border-slate-50 transition-all relative overflow-hidden",
                          isActive ? "bg-blue-50/30" : ""
                        )}
                        onMouseEnter={() => setActiveCell({ agentId: rep.id, skill })}
                        onMouseLeave={() => setActiveCell(null)}
                      >
                        <div className="h-full min-h-[120px] flex flex-col items-center justify-center p-6">
                           <div className={cn(
                            "w-14 h-14 rounded-3xl flex items-center justify-center font-black text-2xl mb-3 transition-all shadow-sm border-2 transform group-hover:scale-110",
                            level.color,
                            score === 5 ? "shadow-emerald-200 ring-4 ring-emerald-50 border-emerald-300" : "border-transparent"
                          )}>
                            {score === 5 ? <Award size={28} className="text-emerald-600" strokeWidth={3} /> : score}
                          </div>
                          
                          <div className={cn(
                             "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                             level.color,
                             "border-slate-200/50"
                          )}>
                            {level.label}
                          </div>

                          {isActive && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#0f172a] p-1.5 rounded-2xl shadow-2xl z-30 animate-in fade-in slide-in-from-right-4 duration-300 border border-slate-700">
                               <button 
                                onClick={(e) => { e.stopPropagation(); handleLevelUpdate(rep.id, skill, score + 1); }}
                                disabled={score >= 5}
                                className="p-2.5 hover:bg-slate-800 text-blue-400 rounded-xl disabled:opacity-20 transition-colors"
                                title="Promote Skill"
                               >
                                 <Plus size={20} strokeWidth={3} />
                               </button>
                               <button 
                                onClick={(e) => { e.stopPropagation(); handleLevelUpdate(rep.id, skill, score - 1); }}
                                disabled={score <= 1}
                                className="p-2.5 hover:bg-slate-800 text-rose-400 rounded-xl disabled:opacity-20 transition-colors"
                                title="Demote Skill"
                               >
                                 <ChevronDown size={20} strokeWidth={3} />
                               </button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footnote */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex items-center justify-between gap-10">
         <div className="flex items-start gap-6 max-w-2xl">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20 rotate-6">
               <Info size={30} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
               <h3 className="text-xl font-bold mb-2">Matrix Synchronization Architecture</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Competency scores are validated via monthly diagnostic assessments and peer-review performance audits. Tier 3 promotions require 
                  Level 5 Expert status in at least 4 primary vectors.
               </p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-3 shrink-0 active:scale-95">
            <Target size={18} className="text-blue-600" /> DOWNLOAD BLUEPRINT
         </button>
      </div>

    </div>
  );
}
