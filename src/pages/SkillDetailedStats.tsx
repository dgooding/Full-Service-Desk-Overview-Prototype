import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Award, 
  Zap,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../constants/skills';

export default function SkillDetailedStats() {
  const { skillId } = useParams();
  const { agents } = useStore();
  const navigate = useNavigate();

  const skillInfo = SKILL_CATEGORIES.flatMap(c => c.skills).find(s => s.id === skillId);
  const category = SKILL_CATEGORIES.find(c => c.skills.some(s => s.id === skillId));

  if (!skillInfo || !category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <Layers size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Skill Reference Not Found</h2>
        <Link to="/skills/inventory" className="mt-4 text-brand-600 font-bold hover:underline">Back to Inventory</Link>
      </div>
    );
  }

  const qualifiedReps = agents.filter(a => (a.skills as any)?.[skillId!] > 0)
    .sort((a, b) => ((b.skills as any)?.[skillId!] || 0) - ((a.skills as any)?.[skillId!] || 0));

  const levelDistribution = [1, 2, 3, 4, 5].map(lvl => ({
    level: `L${lvl}`,
    count: agents.filter(a => (a.skills as any)?.[skillId!] === lvl).length,
    color: PROFICIENCY_LEVELS.find(p => p.level === lvl)?.color.replace('bg-', '') || 'brand-500'
  }));

  const pieData = [
    { name: 'Certified', value: qualifiedReps.length, fill: '#0ea5e9' },
    { name: 'Unassigned', value: agents.length - qualifiedReps.length, fill: '#f1f5f9' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/skills/inventory" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest group">
          <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Taxonomy
        </Link>
        <div className="px-4 py-1.5 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
          Ref: {skillId}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 flex items-start gap-8">
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-slate-900/10">
              <ShieldCheck size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                  {category.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Competency Detail</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">{skillInfo.name}</h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                {skillInfo.description}
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Expertise</p>
               <p className="text-2xl font-black text-slate-800">{qualifiedReps.length}</p>
               <span className="text-[10px] font-bold text-emerald-600 tracking-tight">Active Resources</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Maturity</p>
               <p className="text-2xl font-black text-slate-800">
                 {(qualifiedReps.reduce((acc, a) => acc + ((a.skills as any)?.[skillId!] || 0), 0) / (qualifiedReps.length || 1)).toFixed(1)}
               </p>
               <span className="text-[10px] font-bold text-slate-400 tracking-tight">Out of 5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Layers size={18} className="text-brand-500" />
            Proficiency Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {levelDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.count > 0 ? '#0ea5e9' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(lvl => (
               <div key={lvl} className="flex flex-col items-center">
                 <div className={cn("w-full h-1 rounded-full mb-1.5", lvl <= 3 ? "bg-brand-100" : "bg-emerald-100")}></div>
                 <span className="text-[9px] font-black text-slate-400">L{lvl}</span>
               </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Users size={18} className="text-brand-500" />
              Qualified Technical Resources
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{qualifiedReps.length} Reps Verified</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Rep Name</th>
                  <th className="px-8 py-5">Current Rank</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">View Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {qualifiedReps.map((rep) => {
                  const level = (rep.skills as any)?.[skillId!];
                  const info = PROFICIENCY_LEVELS.find(p => p.level === level) || PROFICIENCY_LEVELS[0];
                  
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <img src={rep.avatar} className="w-8 h-8 rounded-xl bg-slate-100 object-cover" alt="" />
                           <div>
                             <p className="text-sm font-black text-slate-800 leading-none mb-1">{rep.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{rep.role}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} className={cn("w-4 h-1 rounded-full", i <= level ? "bg-brand-500" : "bg-slate-100")}></div>
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter">Level {level} - {info.label}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2">
                           <div className={cn("w-1.5 h-1.5 rounded-full", rep.status === 'online' ? "bg-emerald-500" : "bg-slate-300")}></div>
                           <span className="text-xs font-bold text-slate-600 uppercase">{rep.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => navigate(`/team/${rep.id}`)}
                          className="p-2 bg-slate-100 text-slate-400 hover:bg-brand-600 hover:text-white rounded-lg transition-all"
                        >
                          <ChevronLeft size={16} className="rotate-180" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {qualifiedReps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                       <Zap size={32} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-sm font-bold text-slate-400">No resources have been certified in this skill yet.</p>
                       <button 
                        onClick={() => navigate('/skills')}
                        className="mt-4 text-xs font-black text-brand-600 uppercase tracking-widest hover:underline"
                       >
                         Assign First Resource
                       </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
           <div className="relative z-10">
             <TrendingUp size={32} className="mb-6 text-emerald-200" />
             <h3 className="text-xl font-black mb-2">Coverage Optimization</h3>
             <p className="text-emerald-50 text-sm font-medium leading-relaxed mb-8">
               Your team is currently at 65% coverage for {skillInfo.name}. Adding 2 more T1 resources would reach the operational safety threshold.
             </p>
             <button className="px-6 py-3 bg-white text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
               Analyze Training Requirements
             </button>
           </div>
           <div className="absolute -bottom-10 -right-10 text-white opacity-10 group-hover:scale-110 transition-transform">
             <ShieldCheck size={160} />
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between group relative overflow-hidden">
           <div className="relative z-10">
              <Award size={32} className="mb-6 text-brand-400" />
              <h3 className="text-xl font-black mb-2">Expert Resource</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">
                {qualifiedReps[0] ? `${qualifiedReps[0].name} is the primary subject matter expert for this competency.` : 'No SME designated.'}
              </p>
              {qualifiedReps[0] && (
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <img src={qualifiedReps[0].avatar} className="w-12 h-12 rounded-xl" alt="" />
                  <div>
                    <p className="font-bold">{qualifiedReps[0].name}</p>
                    <p className="text-xs text-brand-400 font-black uppercase tracking-widest">Level 5 Master</p>
                  </div>
                </div>
              )}
           </div>
           <div className="absolute -bottom-12 -right-12 text-white opacity-[0.03] group-hover:rotate-12 transition-transform">
             <Award size={200} />
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Framework Attributes</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500">Tier Status</span>
               <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-black rounded uppercase">Strategic</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500">Refresh Cycle</span>
               <span className="text-xs font-black text-slate-800">90 Days</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500">Rec. Certification</span>
               <span className="text-xs font-black text-slate-800">Azure AZ-900</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
