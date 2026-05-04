import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowLeft, BarChart2, TrendingUp, PieChart, Download, FileText, Users, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

export default function Reports() {
  const navigate = useNavigate();
  const { performance, agents, qaReviews } = useStore();
  const [viewMode, setViewMode] = useState<'macro' | 'agent'>('agent');

  const activeAgents = agents.filter(a => a.status === 'online' || a.status === 'in-call').length;

  const barData = agents.slice(0, 5).map(a => ({
    name: a.name.split(' ')[0],
    csat: a.metrics.csat,
    qa: a.metrics.qaScore
  }));

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportRaw = () => {
    const headers = ['Agent Name', 'Role', 'Total Vol', 'Total Calls', 'Tkt/Call Avg', 'CSAT', 'FCR Rate', 'QA Score', 'AHT', 'Audits YTD'];
    const rows = agents.map(agent => {
      const totalVolume = agent.metrics.qaScore * 42 + 412;
      const totalCalls = agent.metrics.qaScore * 3 + 15;
      const tktCallAvg = (((agent.metrics.fcr || 70) / 40 + (agent.metrics.qaScore || 80) / 50) * 10).toFixed(1) + '%';
      const audits = qaReviews.filter(r => r.rep === agent.name).length;
      return [
        `"${agent.name}"`,
        `"${agent.role}"`,
        totalVolume,
        totalCalls,
        `"${tktCallAvg}"`,
        `${agent.metrics.csat}%`,
        `${agent.metrics.fcr}%`,
        `${agent.metrics.qaScore}%`,
        `"${agent.metrics.aht}"`,
        audits
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'performance_intelligence_raw_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 p-2 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 transition-all hover:shadow-sm">
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <FileText size={18} />
            Export to PDF
          </button>
          <button onClick={handleExportRaw} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} />
            Export RAW Data
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Performance Intelligence</h1>
          <p className="text-slate-500 font-medium tracking-tight">Macro-level aggregation of team inputs, outputs, and quality trends.</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('agent')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
              viewMode === 'agent' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Users size={16} />
            Agent View
          </button>
          <button 
            onClick={() => setViewMode('macro')}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
              viewMode === 'macro' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Eye size={16} />
            Macro View
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'macro' ? (
          <motion.div 
            key="macro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* CEO Level Summary */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Executive Desk View</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 border-b border-slate-700/50 pb-8 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Volume</p>
                    <p className="text-3xl font-black text-white">24,592</p>
                    <p className="text-sm text-emerald-400 mt-1 flex items-center font-medium"><TrendingUp size={14} className="mr-1"/> +12%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global CSAT</p>
                    <p className="text-3xl font-black text-white">
                      {Math.round(agents.reduce((a, b) => a + (b.metrics.csat || 0), 0) / (agents.length || 1))}%
                    </p>
                    <p className="text-sm text-emerald-400 mt-1 flex items-center font-medium"><TrendingUp size={14} className="mr-1"/> +2.4%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">FCR Rate</p>
                    <p className="text-3xl font-black text-white">
                      {Math.round(agents.reduce((a, b) => a + (b.metrics.fcr || 0), 0) / (agents.length || 1))}%
                    </p>
                    <p className="text-sm text-amber-400 mt-1 flex items-center font-medium">Flat</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Handle Time</p>
                    <p className="text-3xl font-black text-white">8m 14s</p>
                    <p className="text-sm text-emerald-400 mt-1 flex items-center font-medium">-12s</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cost / Contact</p>
                    <p className="text-3xl font-black text-white">$4.92</p>
                    <p className="text-sm text-emerald-400 mt-1 flex items-center font-medium">- $0.15</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Uptime</p>
                    <p className="text-3xl font-black text-white">99.99%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <BarChart2 size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Audits YTD</p>
                        <p className="text-xl font-black text-white">{qaReviews.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <PieChart size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workforce Utilization</p>
                        <p className="text-xl font-black text-white">{Math.round((activeAgents / agents.length) * 100) || 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Assurance</p>
                        <p className="text-xl font-black text-white">
                          {Math.round(agents.reduce((a, b) => a + (b.metrics.qaScore || 0), 0) / (agents.length || 1))}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6">Historical Quality Curve</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorQaRep" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="qa" stroke="#0ea5e9" strokeWidth={4} fill="url(#colorQaRep)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6">Top Performers Distribution</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '20px' }} />
                      <Bar dataKey="csat" name="CSAT Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="qa" name="QA Score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800">Agent Performance Breakdown</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{agents.length} Total Reps</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-4 px-8 text-xs font-bold text-slate-500 uppercase tracking-widest">Agent</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Total Vol</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Total Calls</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Tkt/Call Avg</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">CSAT</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">FCR Rate</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">QA Score</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">AHT</th>
                    <th className="py-4 px-8 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Audits YTD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agents.map((agent) => {
                    const totalVolume = agent.metrics.qaScore * 42 + 412; // Simulated relative volume
                    const totalCalls = agent.metrics.qaScore * 3 + 15;
                    const tktCallAvg = (((agent.metrics.fcr || 70) / 40 + (agent.metrics.qaScore || 80) / 50) * 10).toFixed(1) + '%';
                    const audits = qaReviews.filter(r => r.rep === agent.name).length;
                    
                    return (
                      <tr key={agent.id} onClick={() => navigate(`/team/${agent.id}`)} className="hover:bg-slate-50/50 cursor-pointer transition-colors group">
                        <td className="py-4 px-8">
                          <div className="flex items-center gap-3">
                            <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{agent.name}</p>
                              <p className="text-xs text-slate-500">{agent.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-slate-700">{totalVolume.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-slate-700">{totalCalls}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-slate-700">{tktCallAvg}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold",
                            agent.metrics.csat >= 90 ? "bg-emerald-50 text-emerald-700" :
                            agent.metrics.csat >= 80 ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          )}>
                            {agent.metrics.csat}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold",
                            agent.metrics.fcr >= 80 ? "bg-emerald-50 text-emerald-700" :
                            agent.metrics.fcr >= 70 ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          )}>
                            {agent.metrics.fcr}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={cn(
                            "text-sm font-bold",
                            agent.metrics.qaScore >= 90 ? "text-emerald-600" :
                            agent.metrics.qaScore >= 80 ? "text-amber-600" :
                            "text-red-600"
                          )}>
                            {agent.metrics.qaScore}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-medium text-slate-600">{agent.metrics.aht}</span>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <span className="text-sm font-bold text-slate-700">{audits}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

