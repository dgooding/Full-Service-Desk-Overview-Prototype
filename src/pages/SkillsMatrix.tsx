import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  Target, 
  Search, 
  Info, 
  TrendingUp, 
  Award, 
  ShieldCheck,
  Zap,
  Globe,
  Settings2,
  Download,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS, ALL_SKILL_IDS } from '../constants/skills';

export default function SkillsMatrix() {
  const { agents, updateAgentSkill, logCommunication } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [editingSkill, setEditingSkill] = useState<{
    agentId: string;
    agentName: string;
    skillId: string;
    skillName: string;
    currentLevel: number;
  } | null>(null);

  const handleSelectLevel = (level: number) => {
    if (!editingSkill) return;

    updateAgentSkill(editingSkill.agentId, editingSkill.skillId, level);
    
    // Log the change
    const oldLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === editingSkill.currentLevel);
    const newLevelInfo = PROFICIENCY_LEVELS.find(l => l.level === level);

    logCommunication({
      agentId: editingSkill.agentId,
      agentName: editingSkill.agentName,
      type: 'Technical Sync',
      subject: `Skill Adjusted: ${editingSkill.skillName} from ${oldLevelInfo?.label} (${editingSkill.currentLevel}) to ${newLevelInfo?.label} (${level})`
    });

    toast.success(`Updated ${editingSkill.agentName}'s ${editingSkill.skillName} level to ${level}`);
    setEditingSkill(null);
  };

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterLevel === null) return matchesSearch;

    const agentSkills = a.skills || {};
    const hasSkillAtLevel = Object.values(agentSkills).some(level => level === filterLevel);
    
    return matchesSearch && hasSkillAtLevel;
  });

  const displayedCategories = activeCategory === 'all' 
    ? SKILL_CATEGORIES 
    : SKILL_CATEGORIES.filter(c => c.id === activeCategory);

  const getLevelInfo = (level: number) => {
    return PROFICIENCY_LEVELS.find(l => l.level === level) || PROFICIENCY_LEVELS[0];
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Competency Framework</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Technical Skills Matrix</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            A comprehensive inventory of workforce proficiency across core IT service desk disciplines and specialized systems.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <button 
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                activeCategory === 'all' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              All Skills
            </button>
            {SKILL_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                  activeCategory === cat.id ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
          
          <button onClick={() => toast.success('Competency Matrix export started. Check your downloads.')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all shadow-sm">
            <Download size={18} className="text-slate-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Techs', value: agents.length, icon: Globe, color: 'text-brand-600', bg: 'bg-brand-50', path: '/team' },
          { label: 'Framework Size', value: ALL_SKILL_IDS.length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50', path: '/skills/inventory' },
          { label: 'Matrix Coverage', value: '84%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/skills/insights/growth' },
          { label: 'Critical Gaps', value: '3', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', path: '/skills/insights/gaps' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all text-left"
          >
            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Matrix Content */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resource by name or role..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proficiency Index:</span>
              {filterLevel !== null && (
                <button 
                  onClick={() => setFilterLevel(null)}
                  className="text-[9px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
              {PROFICIENCY_LEVELS.map(l => (
                <button 
                  key={l.level} 
                  onClick={() => setFilterLevel(filterLevel === l.level ? null : l.level)}
                  className="group relative"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm transition-all", 
                    l.color, 
                    l.text,
                    filterLevel === null ? "opacity-100" : (filterLevel === l.level ? "ring-2 ring-brand-500 ring-offset-2 scale-110" : "opacity-25 grayscale-[0.5]")
                  )}>
                    {l.level}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                    {filterLevel === l.level ? 'UNFILTER' : l.label.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="sticky left-0 z-40 bg-slate-50/50 px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[280px]">Technical Resource</th>
                {displayedCategories.map(category => (
                  <React.Fragment key={category.id}>
                    {category.skills.map(skill => (
                      <th key={skill.id} className="px-2 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center w-[120px] min-w-[120px] align-top">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-slate-900 border-b-2 border-slate-200 pb-1 mb-1 block w-full whitespace-nowrap overflow-hidden text-ellipsis px-1">{skill.name}</span>
                          <span className="text-[8px] opacity-60 font-medium px-2">{category.name}</span>
                        </div>
                      </th>
                    ))}
                  </React.Fragment>
                ))}
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-[100px]">Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredAgents.map((agent) => {
                  const agentSkills = agent.skills || {};
                  
                  // Calculate average only over predefined skills
                  let total = 0;
                  ALL_SKILL_IDS.forEach(id => {
                    total += (agentSkills as any)[id] || 0;
                  });
                  const avgSkill = (total / ALL_SKILL_IDS.length).toFixed(1);

                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={agent.id} 
                      className="hover:bg-slate-50/50 transition-colors group" 
                    >
                      <td 
                        className="sticky left-0 z-30 bg-white group-hover:bg-slate-50/50 px-8 py-5 transition-all shadow-[8px_0_12px_-8px_rgba(0,0,0,0.05)] cursor-pointer"
                        onClick={() => navigate(`/team/${agent.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={agent.avatar} alt="" className="w-11 h-11 rounded-2xl bg-slate-100 object-cover ring-2 ring-white shadow-sm" />
                            <div className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                              agent.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                            )}></div>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1.5 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{agent.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{agent.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {displayedCategories.map(category => (
                        <React.Fragment key={category.id}>
                          {category.skills.map(skill => {
                            const level = (agentSkills as any)[skill.id] || 0;
                            const info = getLevelInfo(level);
                            
                            return (
                              <td 
                                key={skill.id} 
                                className="p-1 text-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSkill({
                                    agentId: agent.id,
                                    agentName: agent.name,
                                    skillId: skill.id,
                                    skillName: skill.name,
                                    currentLevel: level
                                  });
                                }}
                              >
                                <div className="p-1">
                                  <div className={cn(
                                    "h-12 w-full rounded-xl flex items-center justify-center transition-all duration-300 relative group/tile cursor-pointer overflow-hidden border-2",
                                    level > 0 
                                      ? cn(info.color, info.text, "border-transparent shadow-sm") 
                                      : "bg-slate-50 border-slate-100 text-slate-200 hover:border-slate-200"
                                  )}>
                                    {level > 0 ? (
                                      <span className="text-xs font-black">{level}</span>
                                    ) : (
                                      <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center text-transparent group-hover/tile:text-slate-300 group-hover/tile:border-slate-300 transition-all">
                                        <Check size={14} strokeWidth={4} />
                                      </div>
                                    )}
                                    
                                    <div className={cn(
                                      "absolute inset-0 bg-white/20 opacity-0 group-active/tile:opacity-100 transition-opacity"
                                    )} />

                                    {/* Tooltip on tile */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white rounded-lg opacity-0 group-hover/tile:opacity-100 pointer-events-none transition-all z-50 shadow-xl whitespace-nowrap">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-0.5">{skill.name}</p>
                                      <p className="text-[11px] font-bold">{level > 0 ? info.label : 'UNASSIGNED'}</p>
                                      <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Click to {level > 0 ? 'remove' : 'assign'}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </React.Fragment>
                      ))}
                      
                      <td className="px-8 py-5 text-right cursor-pointer" onClick={() => navigate(`/skills/rep/${agent.id}`)}>
                        <div className="inline-flex flex-col items-end">
                          <span className={cn(
                            "text-md font-black",
                            parseFloat(avgSkill) > 3.5 ? "text-emerald-600" : 
                            parseFloat(avgSkill) > 2.0 ? "text-brand-600" : "text-slate-400"
                          )}>
                            {avgSkill}
                          </span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 rounded-full" 
                              style={{ width: `${(parseFloat(avgSkill) / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500 rounded-lg">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Standard Set By</p>
                <p className="text-sm font-bold">Service Operations HQ</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <p className="text-xs font-medium text-slate-400 max-w-sm">
              Proficiency data is verified monthly through automated system logs and peer-reviewed technical challenges.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/skills/inventory')}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-brand-600/20 active:scale-95"
          >
            Skill Taxonomy
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Skills Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ... (existing grids) ... */}
      </div>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {editingSkill && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingSkill(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Assess Proficiency</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {editingSkill.agentName} • {editingSkill.skillName}
                  </p>
                </div>
                <button 
                  onClick={() => setEditingSkill(null)}
                  className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"
                >
                  <Settings2 size={24} />
                </button>
              </div>

              <div className="p-8 space-y-3">
                {PROFICIENCY_LEVELS.map((pref) => (
                  <button
                    key={pref.level}
                    onClick={() => handleSelectLevel(pref.level)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all group",
                      editingSkill.currentLevel === pref.level 
                        ? "border-brand-500 bg-brand-50/50" 
                        : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm",
                        pref.color,
                        pref.text
                      )}>
                        {pref.level}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{pref.label}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{(pref as any).description}</p>
                      </div>
                    </div>
                    {editingSkill.currentLevel === pref.level && (
                      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8 bg-slate-50 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-amber-500">
                  <Info size={20} />
                </div>
                <p className="text-xs font-medium text-slate-500">
                  This update will be logged to the leadership audit trail and reflect instantly on the representative's growth scorecard.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
