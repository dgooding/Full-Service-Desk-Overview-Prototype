import React, { useState, useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import { ArrowLeft, BarChart2, TrendingUp, PieChart, Download, FileText, Users, Eye, Target, Clock, Activity, Zap, ChevronRight, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
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
  const { agents, qaReviews, executiveReps } = useStore();
  const [activeTab, setActiveTab] = useState<'executive' | 'efficiency' | 'sla' | 'talent' | 'agents'>('executive');

  const topReps = useMemo(() => {
    return [...executiveReps].sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore).slice(0, 5);
  }, [executiveReps]);

  const underReps = useMemo(() => {
    return [...executiveReps].sort((a, b) => a.overallPerformanceScore - b.overallPerformanceScore).slice(0, 5);
  }, [executiveReps]);

  const stats = useMemo(() => {
    if (!executiveReps || executiveReps.length === 0) return null;
    
    const totalReps = executiveReps.length;
    const avgFcr = executiveReps.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / totalReps;
    const avgCsat = executiveReps.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / totalReps;
    const avgSla = executiveReps.reduce((acc, curr) => acc + curr.slaCompliance_pct, 0) / totalReps;
    const totalBacklog = executiveReps.reduce((acc, curr) => acc + curr.backlogTickets, 0);
    const avgAht = executiveReps.reduce((acc, curr) => acc + curr.avgHandleTime_min, 0) / totalReps;
    
    // Estimated Cost analysis
    const costPerMin = 0.85; // $0.85 per minute staffing cost
    const avgCostPerTicket = avgAht * costPerMin;
    const totalMonthlyCost = (executiveReps.reduce((acc, curr) => acc + curr.ticketsResolved_MTD, 0) * avgCostPerTicket);

    return {
      totalReps,
      avgFcr,
      avgCsat,
      avgSla,
      totalBacklog,
      avgAht,
      avgCostPerTicket,
      totalMonthlyCost
    };
  }, [executiveReps]);

  const teamComparisonData = useMemo(() => {
    const teams = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    return teams.map(team => {
      const teamReps = executiveReps.filter(r => r.team === team);
      const count = teamReps.length || 1;
      return {
        name: team,
        fcr: teamReps.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / count,
        csat: teamReps.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / count,
        sla: teamReps.reduce((acc, curr) => acc + curr.slaCompliance_pct, 0) / count,
      };
    });
  }, [executiveReps]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportRaw = () => {
    const headers = ['Rep ID', 'Name', 'Team', 'FCR%', 'CSAT%', 'QA Score', 'AHT (min)', 'SLA%', 'Backlog'];
    const rows = executiveReps.map(rep => [
      rep.repId,
      `"${rep.fullName}"`,
      rep.team,
      rep.firstCallResolution_pct,
      rep.customerSat_pct,
      rep.qualityScore,
      rep.avgHandleTime_min,
      rep.slaCompliance_pct,
      rep.backlogTickets
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `operational_intelligence_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate('/executive')} 
            className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors text-xs font-bold uppercase tracking-widest mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Operational Intelligence</h1>
          <p className="text-slate-500 font-medium tracking-tight">Multi-dimensional performance reporting and strategic analysis.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <FileText size={18} />
            Export PDF
          </button>
          <button onClick={handleExportRaw} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all">
            <Download size={18} />
            Export Raw Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] w-fit">
        {[
          { id: 'executive', label: 'Executive Summary', icon: <Eye size={16} /> },
          { id: 'efficiency', label: 'Workforce Efficiency', icon: <TrendingUp size={16} /> },
          { id: 'sla', label: 'Service & Compliance', icon: <Shield size={16} /> },
          { id: 'talent', label: 'Talent Distribution', icon: <Users size={16} /> },
          { id: 'agents', label: 'Agent Performance', icon: <BarChart2 size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-[1.25rem] text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-brand-600 shadow-sm ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'executive' && (
            <div className="space-y-8">
              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportKPICard label="Global CSAT" value={`${stats.avgCsat.toFixed(1)}%`} subValue="+2.1% v. Previous" icon={<PieChart className="text-brand-600" />} />
                <ReportKPICard label="FCR Rate" value={`${stats.avgFcr.toFixed(1)}%`} subValue="Stable" icon={<Target className="text-emerald-600" />} />
                <ReportKPICard label="AHT" value={`${stats.avgAht.toFixed(1)}m`} subValue="-12s improvement" icon={<Clock className="text-amber-600" />} />
                <ReportKPICard label="Capacity" value={`${Math.round(85)}%`} subValue="Utilization" icon={<Activity className="text-blue-600" />} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart2 size={20} className="text-brand-600" />
                    Team Performance Index
                  </h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                        <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 700, fontSize: '12px' }} />
                        <Bar dataKey="csat" name="CSAT %" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="fcr" name="FCR %" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sla" name="SLA %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-2">Executive Outlook</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">System performance is currently optimized. High-tier talent density is at an all-time high ({Math.round((executiveReps.filter(r => r.performanceTier === '🟢 Elite').length / stats.totalReps) * 100)}%).</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">SLA Health</div>
                          <div className="text-lg font-black text-white">99.2% Accuracy</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Zap size={24} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency GAIN</div>
                          <div className="text-lg font-black text-white">+14.2% MoM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 relative z-10 cursor-pointer" onClick={() => setActiveTab('efficiency')}>
                    <span className="text-xs font-black text-brand-400 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                      View Efficiency Breakdown
                      <ChevronRight size={14} />
                    </span>
                  </div>
                  {/* Design element */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl opacity-50" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'efficiency' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportKPICard label="Cost / Contact" value={`$${stats.avgCostPerTicket.toFixed(2)}`} subValue="-$0.42 improvement" icon={<Zap className="text-brand-600" />} />
                <ReportKPICard label="Annual Savings" value={`$142k`} subValue="Projected via FCR" icon={<TrendingUp className="text-emerald-600" />} />
                <ReportKPICard label="FTE Overhead" value={`$${(stats.totalMonthlyCost / 1000).toFixed(1)}k`} subValue="Monthly Managed" icon={<BarChart2 className="text-indigo-600" />} />
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Workforce Capacity & Cost Analysis</h3>
                    <p className="text-slate-500 font-medium">Analyzing the correlation between resolution speed and operational expenditure.</p>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline AHT</div>
                      <div className="text-lg font-black text-slate-900">12.5 min</div>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-right">
                      <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Current AHT</div>
                      <div className="text-lg font-black text-brand-600">{stats.avgAht.toFixed(1)} min</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      Our current average handle time (AHT) of <span className="font-bold text-slate-900">{stats.avgAht.toFixed(1)} minutes</span> is significantly below the industry baseline of 12.5 minutes, resulting in a direct cost reduction of <span className="font-bold text-emerald-600">~22% per interaction</span>.
                    </p>
                    <div className="space-y-4">
                      <EfficiencyProgress label="FCR Contribution" value={stats.avgFcr} color="indigo" />
                      <EfficiencyProgress label="Automation Adherence" value={82} color="brand" />
                      <EfficiencyProgress label="KB Utilization" value={91} color="emerald" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-64 object-cover rounded-2xl shadow-lg mix-blend-multiply opacity-20 grayscale absolute inset-0 m-8"
                      alt=""
                    />
                    <div className="relative z-10">
                      <div className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] mb-4">Strategic Insight</div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Optimizing FCR by 2% would yield an additional $24,000 in monthly capacity.</h4>
                      <button className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all">
                        Simulate Goal Impact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportKPICard label="SLA Compliance" value={`${stats.avgSla.toFixed(1)}%`} subValue="Above Target" icon={<Shield className="text-brand-600" />} />
                <ReportKPICard label="Live Backlog" value={stats.totalBacklog} subValue="Tickets Open" icon={<Clock className="text-amber-600" />} />
                <ReportKPICard label="Breach Rate" value={`${(100 - stats.avgSla).toFixed(1)}%`} subValue="Down 0.4%" icon={<AlertTriangle className="text-rose-600" />} />
                <ReportKPICard label="Recovery Index" value="94.2" subValue="High Priority" icon={<Activity className="text-blue-600" />} />
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-8">Service Level Integrity by Team</h3>
                <div className="space-y-6">
                  {teamComparisonData.map(team => (
                    <div key={team.name} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                      <div className="w-24 text-sm font-black text-slate-400 uppercase tracking-widest">{team.name}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Compliance</span>
                          <span className="text-xs font-black text-slate-900">{team.sla.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-500",
                              team.sla >= 90 ? "bg-emerald-500" : team.sla >= 85 ? "bg-brand-500" : "bg-rose-500"
                            )}
                            style={{ width: `${team.sla}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <div className={cn(
                          "text-sm font-black",
                          team.sla >= 90 ? "text-emerald-600" : "text-brand-600"
                        )}>
                          {team.sla >= 90 ? 'HEALTHY' : 'WITHIN VAR'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'talent' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ReportKPICard label="Elite Tier" value={executiveReps.filter(r => r.performanceTier === '🟢 Elite').length} subValue="Agents" icon={<Zap className="text-emerald-500" />} />
                <ReportKPICard label="Strong" value={executiveReps.filter(r => r.performanceTier === '🔵 Strong').length} subValue="Agents" icon={<CheckCircle2 className="text-brand-500" />} />
                <ReportKPICard label="Developing" value={executiveReps.filter(r => r.performanceTier === '🟡 Developing').length} subValue="Agents" icon={<TrendingUp className="text-amber-500" />} />
                <ReportKPICard label="At Risk" value={executiveReps.filter(r => r.performanceTier === '🔴 Needs Support').length} subValue="In Coaching" icon={<AlertTriangle className="text-rose-500" />} />
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Talent Maturation Curve</h3>
                    <p className="text-slate-500 mb-8">We've seen a <span className="font-bold text-slate-900">12% migration</span> from 'Developing' to 'Strong' in the last quarter, largely driven by optimized coaching sessions.</p>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600">
                             <TrendingUp size={20} />
                           </div>
                           <div>
                             <div className="text-xs font-black text-emerald-700 uppercase tracking-widest">Promotion Ready</div>
                             <div className="text-lg font-black text-slate-900">14 Candidates</div>
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-600">
                             <Clock size={20} />
                           </div>
                           <div>
                             <div className="text-xs font-black text-amber-700 uppercase tracking-widest">In Maturation</div>
                             <div className="text-lg font-black text-slate-900">32 Agents</div>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                    <h4 className="text-lg font-bold mb-6">Talent Distribution (MTD)</h4>
                    <div className="space-y-8">
                       <TalentStat label="Elite Performers" value={Math.round((executiveReps.filter(r => r.performanceTier === '🟢 Elite').length / stats.totalReps) * 100)} color="#10B981" />
                       <TalentStat label="Core Proficiency" value={Math.round(((executiveReps.filter(r => r.performanceTier === '🔵 Strong').length + executiveReps.filter(r => r.performanceTier === '🟡 Developing').length) / stats.totalReps) * 100)} color="#4F46E5" />
                       <TalentStat label="Requiring Support" value={Math.round((executiveReps.filter(r => r.performanceTier === '🔴 Needs Support').length / stats.totalReps) * 100)} color="#F43F5E" />
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-800">
                      <p className="text-xs text-slate-500 leading-relaxed italic">
                        "Workforce health is currently rated 'Optimal'. Recommended focus for next month: Tier 2 shadowing for 'Developing' group."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'agents' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performers */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    Top Performance Specialists
                  </h3>
                  <div className="space-y-4">
                    {topReps.map((rep) => (
                      <div key={rep.repId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={`https://i.pravatar.cc/100?u=${rep.repId}`} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white" alt="" />
                          <div>
                            <div className="font-bold text-slate-900">{rep.fullName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{rep.team} Team</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-600">{rep.overallPerformanceScore}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Power Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Opportunities */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-rose-500" />
                    Strategic Coaching Opportunities
                  </h3>
                  <div className="space-y-4">
                    {underReps.map((rep) => (
                      <div key={rep.repId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-rose-100 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={`https://i.pravatar.cc/100?u=${rep.repId}`} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white" alt="" />
                          <div>
                            <div className="font-bold text-slate-900">{rep.fullName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{rep.team} Team</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-rose-600">{rep.overallPerformanceScore}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Audit Alert</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Cross-Agent Metric Correlation</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={executiveReps.slice(0, 15)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="fullName" hide />
                      <YAxis hide domain={[0, 100]} />
                      <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Area type="monotone" dataKey="qualityScore" name="Quality %" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="customerSat_pct" name="CSAT %" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="firstCallResolution_pct" name="FCR %" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-8 mt-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Quality</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">CSAT</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">FCR</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ReportKPICard({ label, value, subValue, icon }: { label: string, value: string | number, subValue: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
        {subValue.includes('+') ? <TrendingUp size={12} className="text-emerald-500" /> : subValue.includes('-') ? <TrendingUp size={12} className="text-rose-500 rotate-180" /> : null}
        {subValue}
      </div>
    </div>
  );
}

function EfficiencyProgress({ label, value, color }: { label: string, value: number, color: string }) {
  const colorMap: any = {
    indigo: "bg-indigo-600",
    brand: "bg-brand-600",
    emerald: "bg-emerald-600",
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-slate-900">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full", colorMap[color])}
        />
      </div>
    </div>
  );
}

function TalentStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-sm font-black">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

