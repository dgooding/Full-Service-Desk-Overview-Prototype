import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Target, CheckCircle2, TrendingUp, AlertTriangle, 
  Search, Filter, ChevronLeft, ChevronRight, Download, 
  Printer, MoreHorizontal, User, MapPin, Calendar, 
  Clock, Shield, ArrowUpRight, Zap, X, Activity, FileText, CheckSquare, TrendingDown,
  BarChart as BarChartIcon, Lightbulb
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
  AreaChart, Area, LineChart, Line, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ExecutiveRep } from '../lib/executiveData';
import { toast } from 'sonner';
import { useStore } from '../contexts/StoreContext';

import { useNavigate } from 'react-router-dom';

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { executiveReps } = useStore();
  const [data, setData] = useState<ExecutiveRep[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [supervisorFilter, setSupervisorFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");

  // Table State
  const [sortConfig, setSortConfig] = useState<{ key: keyof ExecutiveRep, direction: 'asc' | 'desc' }>({ 
    key: 'overallPerformanceScore', 
    direction: 'desc' 
  });

  // Modals
  const [highlightRep, setHighlightRep] = useState<{ rep: ExecutiveRep, title: string, type: 'top' | 'bottom' } | null>(null);

  useEffect(() => {
    if (executiveReps && executiveReps.length > 0) {
      setData(executiveReps);
      setLoading(false);
    }
  }, [executiveReps]);

  const filteredData = useMemo(() => {
    return data.filter(rep => {
      const matchesSearch = rep.fullName.toLowerCase().includes(search.toLowerCase()) || 
                             rep.repId.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter === "All" || rep.team === teamFilter;
      const matchesShift = shiftFilter === "All" || rep.shift === shiftFilter;
      const matchesLocation = locationFilter === "All" || rep.location === locationFilter;
      const matchesSupervisor = supervisorFilter === "All" || rep.supervisor === supervisorFilter;
      const matchesTier = tierFilter === "All" || rep.performanceTier.includes(tierFilter);
      
      return matchesSearch && matchesTeam && matchesShift && matchesLocation && matchesSupervisor && matchesTier;
    }).sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, search, teamFilter, shiftFilter, locationFilter, supervisorFilter, tierFilter, sortConfig]);

  const kpis = useMemo(() => {
    if (filteredData.length === 0) return {
      total: 0, fcr: 0, csat: 0, quality: 0, sla: 0, backlog: 0, escalation: 0, elite: 0, needsSupport: 0, aht: 0, tickets: 0
    };
    
    return {
      total: filteredData.length,
      fcr: filteredData.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / filteredData.length,
      csat: filteredData.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / filteredData.length,
      quality: filteredData.reduce((acc, curr) => acc + curr.qualityScore, 0) / filteredData.length,
      sla: filteredData.reduce((acc, curr) => acc + curr.slaCompliance_pct, 0) / filteredData.length,
      backlog: filteredData.reduce((acc, curr) => acc + curr.backlogTickets, 0),
      escalation: filteredData.reduce((acc, curr) => acc + curr.escalationRate_pct, 0) / filteredData.length,
      aht: filteredData.reduce((acc, curr) => acc + curr.avgHandleTime_min, 0) / filteredData.length,
      tickets: filteredData.reduce((acc, curr) => acc + curr.ticketsResolved_MTD, 0),
      elite: filteredData.filter(r => r.performanceTier === '🟢 Elite').length,
      needsSupport: filteredData.filter(r => r.performanceTier === '🔴 Needs Support').length,
    };
  }, [filteredData]);

  const [roiPeriod, setRoiPeriod] = useState<'MTD' | 'Annual'>('MTD');

  const roiStats = useMemo(() => {
    // Loaded cost include infrastructure, benefits, and management overhead
    const costPerMin = 1.45; 
    const baselineAHT = 12.8; // Industry median
    const riskMitigationFactor = 25000; // Estimated liability avoided per 1% SLA breach prevention
    
    const timeSavingsPerTicket = Math.max(0, baselineAHT - kpis.aht);
    const directSavings = kpis.tickets * timeSavingsPerTicket * costPerMin;
    
    // FCR adds indirect value by preventing secondary call load
    const fcrValue = (kpis.fcr / 100) * kpis.tickets * (costPerMin * 8); 
    
    const riskValue = kpis.sla >= 90 ? (kpis.sla - 85) * riskMitigationFactor : 0;
    
    const totalYield = directSavings + fcrValue + riskValue;
    const finalSavings = roiPeriod === 'Annual' ? totalYield * 12 : totalYield;
    
    const efficiencyGain = Math.round(((baselineAHT - kpis.aht) / baselineAHT) * 100);

    return {
      savings: finalSavings,
      efficiency: efficiencyGain
    };
  }, [kpis, roiPeriod]);

  const handleSort = (key: keyof ExecutiveRep) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const teamData = useMemo(() => {
    const teams = [
      { id: 'Alpha', target: 82, color: '#4F46E5' },
      { id: 'Bravo', target: 85, color: '#10B981' },
      { id: 'Charlie', target: 88, color: '#F59E0B' },
      { id: 'Delta', target: 78, color: '#6366F1' },
      { id: 'Echo', target: 84, color: '#EC4899' }
    ];
    
    return teams.map(t => {
      const reps = data.filter(r => r.team === t.id);
      const avgFcr = reps.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / (reps.length || 1);
      const avgCsat = reps.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / (reps.length || 1);
      const avgQuality = reps.reduce((acc, curr) => acc + curr.qualityScore, 0) / (reps.length || 1);
      
      // Artificial variance to make it less "flat"
      const score = parseFloat(((avgFcr * 0.4 + avgCsat * 0.3 + avgQuality * 0.3)).toFixed(1));
      const variance = score - t.target;
      
      return { 
        name: t.id, 
        score, 
        target: t.target,
        fcr: parseFloat(avgFcr.toFixed(1)),
        csat: parseFloat(avgCsat.toFixed(1)),
        quality: parseFloat(avgQuality.toFixed(1)),
        gap: parseFloat(variance.toFixed(1)),
        color: t.color,
        status: variance >= 0 ? 'Exceeding' : variance > -5 ? 'Meeting' : 'Underperforming'
      };
    });
  }, [data]);

  const slaTrendData = useMemo(() => [
    { month: 'Jan', sla: 88.2, target: 90 },
    { month: 'Feb', sla: 89.5, target: 90 },
    { month: 'Mar', sla: 91.2, target: 90 },
    { month: 'Apr', sla: 90.1, target: 90 },
    { month: 'May', sla: kpis.sla, target: 90 },
  ], [kpis.sla]);

  const tierChartData = useMemo(() => {
    const tiers = ['🟢 Elite', '🔵 Strong', '🟡 Developing', '🔴 Needs Support'];
    return tiers.map(tier => ({
      name: tier.split(' ')[1],
      value: filteredData.filter(r => r.performanceTier === tier).length,
      color: tier.startsWith('🟢') ? '#10B981' : tier.startsWith('🔵') ? '#3B82F6' : tier.startsWith('🟡') ? '#F59E0B' : '#EF4444'
    }));
  }, [filteredData]);

  const top10Reps = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
      .slice(0, 10)
      .map(r => ({ name: r.fullName, score: r.overallPerformanceScore }));
  }, [filteredData]);

  const resetFilters = () => {
    setSearch("");
    setTeamFilter("All");
    setShiftFilter("All");
    setLocationFilter("All");
    setSupervisorFilter("All");
    setTierFilter("All");
  };

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(rep => Object.values(rep).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "it_service_desk_performance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export successful");
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 print:hidden">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-800">Executive Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium tracking-tight">IT Frontline Service Desk — Strategic Performance Overview</p>
          <p className="hidden print:block text-xs text-slate-400 mt-2 font-bold">Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-indigo-100 transition-all"
          >
            <BarChartIcon size={18} />
            Performance Reports
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => navigate('/executive/summary')}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
          >
            <Printer size={18} />
            Generate Summary
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <KPICard 
          label="Total Reps" 
          value={kpis.total} 
          icon={<Users size={16} />} 
          color="blue" 
          onClick={() => navigate('/executive/reps')}
        />
        <KPICard 
          label="Avg FCR" 
          value={`${kpis.fcr.toFixed(1)}%`} 
          icon={<Target size={16} />} 
          color="emerald" 
          onClick={() => navigate('/executive/reps', { state: { sortBy: 'firstCallResolution_pct' } })}
        />
        <KPICard 
          label="Avg CSAT" 
          value={`${kpis.csat.toFixed(1)}%`} 
          icon={<Zap size={16} />} 
          color="amber" 
          onClick={() => navigate('/executive/reps', { state: { sortBy: 'customerSat_pct' } })}
        />
        <KPICard 
          label="Avg SLA" 
          value={`${kpis.sla.toFixed(1)}%`} 
          icon={<CheckSquare size={16} />} 
          color="indigo" 
          onClick={() => navigate('/executive/reps', { state: { sortBy: 'qualityScore' } })}
        />
        <KPICard 
          label="Avg QA Score" 
          value={`${kpis.quality.toFixed(1)}%`} 
          icon={<CheckCircle2 size={16} />} 
          color="indigo" 
          onClick={() => navigate('/executive/reps', { state: { sortBy: 'qualityScore' } })}
        />
        <KPICard 
          label="Open Backlog" 
          value={kpis.backlog} 
          icon={<FileText size={16} />} 
          color="blue" 
          onClick={() => navigate('/executive/reps')}
        />
        <KPICard 
          label="Escalation Rate" 
          value={`${kpis.escalation.toFixed(1)}%`} 
          icon={<TrendingDown size={16} />} 
          color="rose" 
          onClick={() => navigate('/executive/reps', { state: { sortBy: 'overallPerformanceScore' } })}
        />
        <KPICard 
          label="Needs Support" 
          value={kpis.needsSupport} 
          icon={<AlertTriangle size={16} />} 
          color="rose" 
          onClick={() => navigate('/executive/reps', { state: { filter: 'Support' } })}
        />
      </div>

      {/* Strategic Summary for Print */}
      <div className="hidden print:grid grid-cols-2 gap-8 mb-8 border-y border-slate-100 py-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={20} />
            Strategic Success Indicators
          </h2>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p className="text-sm font-medium text-slate-700 leading-relaxed font-sans">
              The service desk is currently meeting all core KPIs for the fiscal period. 
              The <span className="font-bold text-indigo-700">{kpis.elite} agents</span> in the Elite performance tier represent a mature workforce capable of handling complex technical escalations. 
              Customer satisfaction has remained resilient at <span className="font-bold text-indigo-700">{kpis.csat.toFixed(1)}%</span>.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-brand-600">
            <Activity size={20} />
            Operational Continuity & Risk
          </h2>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p className="text-sm font-medium text-slate-700 leading-relaxed font-sans">
              SLA compliance is tracking within acceptable variance. 
              Current backlog stands at <span className="font-bold text-slate-900">{kpis.backlog} tickets</span>, with a focus on improving First Call Resolution ({kpis.fcr.toFixed(1)}%) to reduce secondary ticket pressure. 
              Resource allocation is currently rated <span className="font-bold text-emerald-600">Stable</span>.
            </p>
          </div>
        </div>
      </div>


      {/* Strategic Oversight Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Strategic Health Matrix</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Operational impact and sentiment analysis</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Stable Outlook</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <Shield className="text-brand-600" size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Operational Continuity</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Service level compliance is currently at <span className="text-slate-900 font-bold">{kpis.sla.toFixed(1)}%</span>. 
                  Resourcing levels are optimal for the current ticket volume of <span className="text-slate-900 font-bold">{kpis.backlog}</span>.
                </p>
                <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${kpis.sla}%` }} />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <Activity className="text-emerald-600" size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Quality Index</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Overall customer satisfaction is tracking at <span className="text-slate-900 font-bold">{kpis.csat.toFixed(1)}%</span>. 
                  Quality assurance audits show a <span className="text-emerald-600 font-bold">+2.4%</span> improvement over the previous period.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Above Benchmark</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                Elite Performance Tier
              </h3>
              <div className="space-y-4">
                {[...filteredData].sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore).slice(0, 5).map((rep) => (
                  <div key={rep.repId} className="flex items-center justify-between p-4 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group" onClick={() => navigate(`/team/${rep.repId}`)}>
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?u=${rep.repId}`} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-200 transition-all" alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{rep.fullName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{rep.team} Team</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">{rep.overallPerformanceScore}%</div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
            >
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" />
                Strategic Risk Areas
              </h3>
              <div className="space-y-4">
                {[...filteredData].sort((a, b) => a.overallPerformanceScore - b.overallPerformanceScore).slice(0, 5).map((rep) => (
                  <div key={rep.repId} className="flex items-center justify-between p-4 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group" onClick={() => navigate(`/team/${rep.repId}`)}>
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?u=${rep.repId}`} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-rose-200 transition-all" alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{rep.fullName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{rep.team} Team</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-rose-600">{rep.overallPerformanceScore}%</div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase">Alert</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                    <Zap size={20} />
                  </span>
                  Service Excellence ROI
                </h2>
                <button 
                  onClick={() => setRoiPeriod(prev => prev === 'MTD' ? 'Annual' : 'MTD')}
                  className="text-[10px] font-black text-brand-400 group-hover:text-brand-300 uppercase tracking-[0.2em] bg-brand-500/10 px-4 py-2 rounded-full border border-brand-500/20 hover:bg-brand-500/20 transition-all cursor-pointer animate-pulse-slow"
                >
                  Fiscal Period: <span className="text-white">{roiPeriod}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 underline decoration-slate-700 decoration-dotted underline-offset-4 cursor-help" title="Based on AHT reduction vs. Industry standard of 12.5min">
                    Cost Savings
                  </div>
                  <div className="text-3xl font-black text-emerald-400">${(roiStats.savings / 1000).toFixed(1)}k</div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">via Efficiency Gains & FCR Optimization</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 underline decoration-slate-700 decoration-dotted underline-offset-4 cursor-help" title="Workforce utilization vs. Industrial output targets">
                    Workforce Efficiency
                  </div>
                  <div className="text-3xl font-black text-brand-400">+{roiStats.efficiency}%</div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">v. Industrial Baseline of 12.5m AHT</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 underline decoration-slate-700 decoration-dotted underline-offset-4 cursor-help" title="Overall SLA adherence and compliance monitoring accuracy">
                    Risk Mitigation
                  </div>
                  <div className="text-3xl font-black text-amber-400">{kpis.sla.toFixed(1)}%</div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">SLA Compliance Reliability</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 underline decoration-slate-700 decoration-dotted underline-offset-4 cursor-help" title="Percentage of specialists in the top performance tier">
                    Human Capital
                  </div>
                  <div className="text-3xl font-black text-white">{kpis.elite}</div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">Elite Tier Specialists Leveraged</div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                           <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="" />
                        </div>
                      ))}
                   </div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     Top Performers contributing to {Math.round((kpis.elite / kpis.total) * 100)}% of elite ROI
                   </div>
                </div>
                <button 
                  onClick={() => navigate('/reports')}
                  className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  View Detail ROI Breakdown
                </button>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full"
          >
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Strategic Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {tierChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 mt-8">
              {tierChartData.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{tier.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{Math.round((tier.value / kpis.total) * 100)}%</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-brand-50 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-brand-600" />
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Executive Insight</span>
              </div>
              <p className="text-xs font-medium text-brand-700 leading-relaxed italic">
                "The force is currently healthy with {Math.round(((kpis.elite + filteredData.filter(r => r.performanceTier.includes('Strong')).length) / kpis.total) * 100)}% of personnel operating at or above target proficiency."
              </p>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-before-page print:mt-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm print:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BarChartIcon size={18} className="text-brand-600" />
              Operational Efficiency by Team
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-brand-200" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Baseline</span>
              </div>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 800, fill: '#64748B' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} 
                  domain={[60, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 min-w-[220px] backdrop-blur-xl bg-opacity-95">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400">{d.name} Team Analytics</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-400">Efficiency Index:</span>
                              <span className="text-base font-black text-emerald-400">{d.score}%</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                              <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FCR</p>
                                <p className="text-sm font-bold">{d.fcr}%</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CSAT</p>
                                <p className="text-sm font-bold">{d.csat}%</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-white/10 mt-1">
                              <div className="flex justify-between items-center">
                                <div className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                  d.gap >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                                )}>
                                  {d.gap >= 0 ? "Exceeding" : "Under Target"}
                                </div>
                                <span className="text-sm font-black text-white">
                                  {d.gap > 0 ? `+${d.gap}` : d.gap}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={28}>
                  {teamData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
                <Line 
                    type="stepAfter" 
                    dataKey="target" 
                    stroke="#94A3B8" 
                    strokeWidth={2} 
                    strokeDasharray="6 4" 
                    dot={false}
                    name="Benchmark"
                  />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-brand-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Strategic Baseline Calibration: Optimized</span>
            </div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Global Delta: +2.1%
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm print:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Service Level Compliance Trend (SLA)
            </h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-xl">
               <Activity size={14} className="text-brand-600" />
               <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Real-time Drift Analysis</span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slaTrendData}>
                <defs>
                  <linearGradient id="colorSla" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} 
                  domain={[80, 100]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 min-w-[180px] backdrop-blur-xl bg-opacity-95">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">{d.month} Performance</p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-400">SLA Compliance:</span>
                              <span className="text-sm font-black text-emerald-400">{d.sla.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-400">Target Range:</span>
                              <span className="text-sm font-black text-white">{d.target}%+</span>
                            </div>
                            <div className="pt-1.5 border-t border-white/10 mt-1.5 flex justify-between items-center">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Status:</span>
                              <span className={cn(
                                "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                                d.sla >= d.target ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                              )}>
                                {d.sla >= d.target ? "Compliant" : "At Risk"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="natural" 
                  dataKey="sla" 
                  stroke="#4F46E5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSla)" 
                  name="SLA Compliance"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#F43F5E" 
                  strokeWidth={2} 
                  strokeDasharray="8 8" 
                  dot={false}
                  name="Breach Threshold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-10 mt-6 pt-6 border-t border-slate-50">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actual Compliance ({kpis.sla.toFixed(1)}%)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-rose-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SLA Minimum (90.0%)</span>
             </div>
          </div>
        </div>
      </div>


      {/* Performer Modals */}
      <AnimatePresence>
        {highlightRep && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setHighlightRep(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl relative z-10 w-full max-w-xl overflow-hidden"
            >
              <div className={cn(
                "h-32 flex items-center justify-center relative",
                highlightRep.type === 'top' ? "bg-emerald-600" : "bg-rose-600"
              )}>
                <button 
                  onClick={() => setHighlightRep(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-all"
                >
                  <X size={20} />
                </button>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl shadow-xl">
                  {highlightRep.type === 'top' ? "🏆" : "⚠️"}
                </div>
              </div>
              
              <div className="p-10 text-center">
                <div className="mb-8">
                  <div className="flex justify-center mb-4">
                    <img src={`https://i.pravatar.cc/150?u=${highlightRep.rep.repId}`} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-xl" alt="" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{highlightRep.rep.fullName}</h2>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">{highlightRep.rep.team} Team • {highlightRep.rep.repId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <HighlightStat label="Overall Score" value={`${highlightRep.rep.overallPerformanceScore}%`} />
                  <HighlightStat label="Resolution Speed" value={highlightRep.rep.avgHandleTime_min + 'min'} />
                  <HighlightStat label="FCR Rate" value={highlightRep.rep.firstCallResolution_pct + '%'} />
                  <HighlightStat label="CSAT" value={highlightRep.rep.customerSat_pct + '%'} />
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                    {highlightRep.type === 'top' ? (
                      `"${highlightRep.rep.fullName} leads the desk with a ${highlightRep.rep.overallPerformanceScore}% overall performance score, ${highlightRep.rep.firstCallResolution_pct}% first-call resolution, and ${highlightRep.rep.customerSat_pct}% customer satisfaction."`
                    ) : (
                      `"${highlightRep.rep.fullName} is currently at ${highlightRep.rep.overallPerformanceScore}% overall. Key areas for coaching: Resolution Speed (${highlightRep.rep.avgHandleTime_min}m) and Adherence (${highlightRep.rep.adherence_pct}%)."`
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <button 
                    onClick={() => {
                      setHighlightRep(null);
                      navigate(`/team/${highlightRep.rep.repId}`);
                    }}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                  >
                    View Full Profile
                  </button>
                  <button 
                    onClick={() => setHighlightRep(null)}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Dismiss Overview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="hidden print:flex fixed bottom-0 left-0 right-0 p-8 justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 bg-white">
        <span>Confidential — For Internal Use Only</span>
        <span>Page 1 of 1</span>
      </footer>
    </div>
  );
}

function KPICard({ label, value, icon, color, onClick }: { label: string, value: string | number, icon: React.ReactNode, color: string, onClick?: () => void }) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left transition-all group",
        onClick && "hover:border-brand-500 hover:shadow-md active:scale-[0.98] cursor-pointer",
        "print:bg-slate-50 print:border-slate-200 print:shadow-none"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center mb-4 border transition-colors", 
        colorMap[color],
        onClick && "group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600"
      )}>
        {icon}
      </div>
      <div className="text-2xl font-black text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{label}</div>
        {onClick && <ArrowUpRight size={12} className="text-slate-300 group-hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />}
      </div>
    </button>
  );
}

function SortHeader({ label, k, activeSort, onSort, className }: { label: string, k: string, activeSort: any, onSort: () => void, className?: string }) {
  const isActive = activeSort.key === k;
  return (
    <th 
      onClick={onSort}
      className={cn(
        "px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand-600 transition-colors group",
        className
      )}
    >
      <div className={cn("flex items-center gap-1", className?.includes('center') && "justify-center", className?.includes('right') && "justify-end")}>
        {label}
        <TrendingUp 
          size={12} 
          className={cn(
            "transition-all",
            isActive ? "opacity-100 text-brand-600" : "opacity-0 group-hover:opacity-50",
            isActive && activeSort.direction === 'asc' ? "rotate-180" : ""
          )} 
        />
      </div>
    </th>
  );
}

function HighlightStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="text-xl font-black text-slate-900">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}
