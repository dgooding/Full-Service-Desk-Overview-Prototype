import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { Search, Filter, MoreVertical, Activity, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TeamList() {
  const { agents, addAgent, updateAgentStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddAgent = () => {
    const name = prompt("Enter agent name:");
    if (!name) return;
    addAgent({
      name,
      role: 'Tier 1 Specialist',
      status: 'offline',
      metrics: {
        csat: 100,
        fcr: 100,
        aht: "6m 00s",
        qaScore: 100
      },
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}${Date.now()}`
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Team</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your Service Desk agents and view performance profiles.</p>
        </div>
        <button onClick={handleAddAgent} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 w-fit">
          <Plus size={16} /> Add Agent
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-80 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Agent</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">CSAT</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">QA Score</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">AHT</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgents.map(rep => (
                <tr key={rep.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/team/${rep.id}`} className="flex items-center gap-3">
                      <img src={rep.avatar} alt={rep.name} className="w-10 h-10 rounded-full border border-slate-200" />
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{rep.name}</div>
                        <div className="text-xs text-slate-500">{rep.role}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="text-sm bg-transparent border-none appearance-none outline-none cursor-pointer hover:bg-slate-100 px-2 py-1 rounded"
                      value={rep.status}
                      onChange={e => updateAgentStatus(rep.id, e.target.value as any)}
                    >
                      <option value="online">🟢 Online</option>
                      <option value="in-call">🟡 In Call</option>
                      <option value="away">🔴 Away</option>
                      <option value="offline">⚪ Offline</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <span className={cn(
                      rep.metrics.csat >= 90 ? "text-emerald-600" : 
                      rep.metrics.csat >= 85 ? "text-slate-700" : "text-rose-600"
                    )}>
                      {rep.metrics.csat}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <span className={cn(
                      rep.metrics.qaScore >= 90 ? "text-emerald-600" : 
                      rep.metrics.qaScore >= 85 ? "text-slate-700" : "text-rose-600"
                    )}>
                      {rep.metrics.qaScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 font-mono text-xs">
                    {rep.metrics.aht}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/team/${rep.id}`} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="View Profile">
                        <Activity size={18} />
                      </Link>
                      <button onClick={() => navigate('/coaching')} className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors" title="Schedule Coaching">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No agents found matching '{searchTerm}'.
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
