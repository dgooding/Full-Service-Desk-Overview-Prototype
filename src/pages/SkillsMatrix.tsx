import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  Target, 
  Search, 
  Info, 
  TrendingUp, 
  ChevronRight, 
  Award, 
  ShieldCheck,
  Zap,
  Globe,
  Settings2,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const allSkills = ["ETS", "Claims", "Agent", "Property", "Fleet"];

export default function SkillsMatrix() {
  const { agents } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Competency Matrix</h1>
          <p className="text-slate-500 font-medium tracking-tight">Enterprise-wide skill inventory and proficiency tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Competency Matrix export started. Check your downloads.')} className="flex items-center justify-center p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <Download size={20} />
          </button>
          <button onClick={() => toast.info('Benchmark configuration modal opened')} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/30 hover:scale-[1.02] transition-all">
            <Settings2 size={18} />
            Define Benchmarks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Matrix Header Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resource..." 
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Proficiency Legend:</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-brand-500"></div>
               <span className="text-[10px] font-bold text-slate-600 uppercase">Certified</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               <span className="text-[10px] font-bold text-slate-600 uppercase">Uncertified</span>
            </div>
          </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="sticky left-0 z-10 bg-slate-50/50 px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[240px]">Representative</th>
                {allSkills.map(skill => (
                  <th key={skill} className="px-4 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[100px]">{skill}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => navigate(`/skills/rep/${agent.id}`)}>
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/30 px-6 py-5 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={agent.avatar} alt="" className="w-10 h-10 rounded-xl bg-slate-100 object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-none mb-1 group-hover:text-brand-600 transition-colors">{agent.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  {allSkills.map(skill => {
                    const level = agent.skills ? (agent.skills as any)[skill] || 0 : 0;
                    const isCertified = level > 0;
                    return (
                      <td key={skill} className="px-4 py-5 text-center">
                        <div className="flex flex-col items-center gap-1.5 group/skill">
                          {isCertified ? (
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-brand-500 text-white shadow-sm ring-2 ring-white">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-300 ring-2 ring-white">
                               -
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

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            Resource matrix is synchronized every 24 hours based on completed quality audits and training modules.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Enterprise Average: 3.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/skills/insights/growth">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Capability Growth</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Privacy & Protocol</span>
                <span className="text-xs font-black text-emerald-600">+12% MoM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Resolution Speed</span>
                <span className="text-xs font-black text-brand-600">+8% MoM</span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/skills/insights/gaps">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Skill Gap Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Advanced Fleet</span>
                <span className="text-xs font-black text-amber-600">3 Reps Needed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">System Integration</span>
                <span className="text-xs font-black text-amber-600">2 Reps Needed</span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/skills/insights/top-contributor">
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 overflow-hidden relative hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer h-full">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 text-white rounded-lg">
                  <Award size={20} />
                </div>
                <h3 className="font-bold">Top Contributor</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-black">
                  SL
                </div>
                <div>
                  <h4 className="text-sm font-bold">Samantha Lee</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert in 4 Categories</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award size={120} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
