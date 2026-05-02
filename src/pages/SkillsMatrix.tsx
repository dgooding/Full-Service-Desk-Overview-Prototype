import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Award, Search, SlidersHorizontal } from 'lucide-react';

const SKILLS = [
  "Active Directory",
  "VPN Troubleshooting",
  "O365 & Exchange",
  "Mac / Jamf",
  "Hardware & Periphs",
  "VIP Support"
];

const SKILL_LEVELS: Record<number, { label: string, color: string }> = {
  1: { label: "Novice", color: "bg-slate-200 text-slate-700" },
  2: { label: "Beginner", color: "bg-rose-100 text-rose-700" },
  3: { label: "Competent", color: "bg-amber-100 text-amber-700" },
  4: { label: "Proficient", color: "bg-blue-100 text-blue-700" },
  5: { label: "Expert", color: "bg-emerald-100 text-emerald-700" }
};

export default function SkillsMatrix() {
  const { agents } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Generate random skills for agents if they don't have them in our mock
  const agentsWithSkills = agents.map(agent => {
    // Deterministic random based on ID for demo purposes
    const idNum = parseInt(agent.id.replace(/\D/g, '')) || Math.random() * 1000;
    
    return {
      ...agent,
      skills: SKILLS.reduce((acc, skill, idx) => {
        // Generate a stable random score 1-5
        const score = (Math.floor((idNum + idx * 17) % 5) + 1);
        acc[skill] = score;
        return acc;
      }, {} as Record<string, number>)
    };
  });

  const filteredAgents = agentsWithSkills.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Skills Matrix</h1>
          <p className="text-slate-500 text-sm mt-1">Track competencies to identify coaching opportunities and subject matter experts.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search agent..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider bg-slate-50 sticky left-0 z-10 w-64 border-r border-slate-100">Agent</th>
              {SKILLS.map(skill => (
                <th key={skill} className="px-6 py-4 font-semibold tracking-wider text-center">{skill}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAgents.map(rep => (
              <tr key={rep.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={rep.avatar} alt={rep.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    <div>
                      <div className="font-semibold text-slate-900">{rep.name}</div>
                      <div className="text-xs text-slate-500">{rep.role}</div>
                    </div>
                  </div>
                </td>
                {SKILLS.map(skill => {
                  const score = rep.skills[skill];
                  const level = SKILL_LEVELS[score];
                  return (
                    <td key={skill} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" title="Click to view/edit skill">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${level.color}`}>
                          {score}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:block">
                          {level.label}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredAgents.length === 0 && (
              <tr>
                <td colSpan={SKILLS.length + 1} className="px-6 py-8 text-center text-slate-500">
                  No agents found matching '{searchTerm}'.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-6 justify-center text-sm">
        <span className="font-semibold text-slate-600 uppercase tracking-wider text-xs">Legend:</span>
        {Object.entries(SKILL_LEVELS).map(([score, level]) => (
          <div key={score} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${level.color}`}>
              {score}
            </div>
            <span className="text-slate-600 font-medium">{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
