import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Layers, 
  Info, 
  Download,
  Filter,
  ArrowRight,
  TrendingUp,
  Target,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { SKILL_CATEGORIES } from '../constants/skills';

export default function SkillInventory() {
  const { agents } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const allSkills = SKILL_CATEGORIES.flatMap(cat => 
    cat.skills.map(skill => {
      const repsWithSkill = agents.filter(a => (a.skills as any)?.[skill.id] > 0);
      const totalLevel = repsWithSkill.reduce((acc, a) => acc + ((a.skills as any)?.[skill.id] || 0), 0);
      const avgLevel = repsWithSkill.length > 0 ? (totalLevel / repsWithSkill.length).toFixed(1) : '0.0';
      
      return {
        ...skill,
        categoryName: cat.name,
        categoryId: cat.id,
        repCount: repsWithSkill.length,
        avgLevel,
        percentCoverage: ((repsWithSkill.length / agents.length) * 100).toFixed(0)
      };
    })
  );

  const filteredSkills = allSkills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || s.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic stats based on filtered list
  const totalReps = agents.length;
  const avgCoverage = filteredSkills.length > 0 
    ? (filteredSkills.reduce((acc, s) => acc + parseInt(s.percentCoverage), 0) / filteredSkills.length).toFixed(0)
    : "0";
  const criticalGaps = filteredSkills.filter(s => parseInt(s.percentCoverage) < 50).length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest group">
          <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors text-slate-400 group-hover:text-brand-600">
            <ChevronLeft size={16} />
          </div>
          Back to Competency Matrix
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            <Download size={14} />
            Export Taxonomy
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Competency Inventory</h1>
          <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase tracking-tighter">v2.4.1</div>
        </div>
        <p className="text-slate-500 font-medium text-lg max-w-3xl leading-relaxed">
          A definitive technical catalog of skills required for the IT Service Desk environment, including proficiency benchmarks and coverage metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-brand-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Layers size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Taxonomy</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{filteredSkills.length}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {activeCategory === 'all' ? `Across ${SKILL_CATEGORIES.length} Categories` : `In Selected Domain`}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-emerald-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Coverage</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{avgCoverage}%</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Personnel Proficiency Level</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-amber-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identified Gaps</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{criticalGaps}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Skills below 50% coverage</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Workforce</span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{agents.length}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active Specialists Monitored</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation & Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button 
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeCategory === "all" 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                All Domains
              </button>
              {SKILL_CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    activeCategory === cat.id 
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search competency taxonomy..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/10 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[11px] font-serif italic text-slate-400 border-b border-slate-100">
                <th className="px-10 py-5 font-medium uppercase tracking-[0.1em]">Skill Configuration</th>
                <th className="px-10 py-5 font-medium uppercase tracking-[0.1em]">Category Mapping</th>
                <th className="px-10 py-5 font-medium uppercase tracking-[0.1em]">Workforce Coverage</th>
                <th className="px-10 py-5 font-medium uppercase tracking-[0.1em]">Avg Knowledge Depth</th>
                <th className="px-10 py-5 font-medium uppercase tracking-[0.1em] text-right">Operational Insights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 mb-0.5 group-hover:text-brand-600 transition-colors">{skill.name}</span>
                        <span className="text-xs font-medium text-slate-400 line-clamp-1 group-hover:text-slate-500 transition-colors italic">{skill.description}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{skill.categoryName}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={cn(
                               "h-full rounded-full transition-all duration-1000",
                               parseInt(skill.percentCoverage) > 80 ? "bg-emerald-500" :
                               parseInt(skill.percentCoverage) > 50 ? "bg-brand-500" : "bg-amber-500"
                             )} 
                             style={{ width: `${skill.percentCoverage}%` }}
                           ></div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 font-mono tracking-tighter">{skill.percentCoverage}%</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase truncate">({skill.repCount} Personnel)</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2.5">
                         <div className={cn(
                           "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono",
                           parseFloat(skill.avgLevel) > 3.5 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                           parseFloat(skill.avgLevel) > 2.0 ? "bg-brand-50 text-brand-600 border border-brand-100" : 
                           "bg-amber-50 text-amber-600 border border-amber-100"
                         )}>
                           {skill.avgLevel}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Rating</span>
                           <div className="flex gap-0.5">
                             {[1, 2, 3, 4, 5].map((star) => (
                               <div 
                                 key={star}
                                 className={cn(
                                   "w-1.5 h-1.5 rounded-full",
                                   star <= Math.round(parseFloat(skill.avgLevel)) 
                                     ? (parseFloat(skill.avgLevel) > 3.5 ? "bg-emerald-400" : "bg-brand-400")
                                     : "bg-slate-200"
                                 )}
                               />
                             ))}
                           </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/skills/taxonomy/${skill.id}`)}
                        className="h-10 px-5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all inline-flex items-center gap-2 group-hover:shadow-md"
                      >
                        Deep Dive
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-50 text-slate-300 rounded-full">
                        <Search size={48} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-slate-800 tracking-tight">No matches found for "{searchTerm}"</p>
                        <p className="text-sm font-medium text-slate-400">Try adjusting your search criteria or domain filter.</p>
                      </div>
                      <button 
                        onClick={() => {setSearchTerm(""); setActiveCategory("all")}}
                        className="mt-2 text-xs font-black text-brand-600 uppercase tracking-widest hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

