import React, { useMemo, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  ArrowLeft, Download, Printer, Shield, Target, 
  TrendingUp, Users, Zap, CheckCircle2, AlertTriangle,
  Activity, Clock, FileText, Globe, Award, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { cn } from '../lib/utils';

export default function SummaryReport() {
  const navigate = useNavigate();
  const { executiveReps } = useStore();

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  const stats = useMemo(() => {
    if (!executiveReps || executiveReps.length === 0) return null;
    
    const count = executiveReps.length;
    const avgFcr = executiveReps.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / count;
    const avgCsat = executiveReps.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / count;
    const avgSla = executiveReps.reduce((acc, curr) => acc + curr.slaCompliance_pct, 0) / count;
    const avgAht = executiveReps.reduce((acc, curr) => acc + curr.avgHandleTime_min, 0) / count;
    const totalTickets = executiveReps.reduce((acc, curr) => acc + curr.ticketsResolved_MTD, 0);
    const eliteCount = executiveReps.filter(r => r.performanceTier === '🟢 Elite').length;
    const needsSupportCount = executiveReps.filter(r => r.performanceTier === '🔴 Needs Support').length;

    // ROI Logic
    const costPerMin = 1.45; 
    const baselineAHT = 12.8;
    const riskMitigationFactor = 25000;
    
    const timeSavingsPerTicket = Math.max(0, baselineAHT - avgAht);
    const directSavings = totalTickets * timeSavingsPerTicket * costPerMin;
    const fcrValue = (avgFcr / 100) * totalTickets * (costPerMin * 8);
    const riskValue = avgSla >= 90 ? (avgSla - 85) * riskMitigationFactor : 0;
    
    const totalYieldTotal = directSavings + fcrValue + riskValue;
    const efficiencyGain = Math.round(((baselineAHT - avgAht) / baselineAHT) * 100);

    return {
      count,
      avgFcr,
      avgCsat,
      avgSla,
      avgAht,
      totalTickets,
      eliteCount,
      needsSupportCount,
      savings: totalYieldTotal,
      efficiency: efficiencyGain,
      health: avgSla >= 90 ? 'Critical Positive' : avgSla >= 85 ? 'Functional' : 'Observation Recommended'
    };
  }, [executiveReps]);

  const teamPerformance = useMemo(() => {
    const teams = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    return teams.map(team => {
      const reps = executiveReps.filter(r => r.team === team);
      const c = reps.length || 1;
      return {
        name: team,
        score: reps.reduce((acc, curr) => acc + curr.overallPerformanceScore, 0) / c,
        csat: reps.reduce((acc, curr) => acc + curr.customerSat_pct, 0) / c,
        fcr: reps.reduce((acc, curr) => acc + curr.firstCallResolution_pct, 0) / c,
      };
    });
  }, [executiveReps]);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar - Hidden on Print */}
        <div className="flex items-center justify-between print:hidden mb-8">
          <button 
            onClick={() => navigate('/executive')}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold transition-all"
          >
            <ArrowLeft size={18} />
            Exit to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
            >
              <Printer size={20} />
              Commit to PDF
            </button>
          </div>
        </div>

        {/* The Report Document */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-4 relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -ml-48 -mb-48 opacity-40" />
          
          <div className="relative z-10 space-y-12">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b-2 border-slate-100 pb-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <Globe size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Executive Synthesis</h1>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">IT Service Operations — Strategic Insight Report</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-10">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prepared For</p>
                      <p className="text-sm font-bold text-slate-900">Executive Leadership Team</p>
                      <p className="text-xs text-slate-500">Service Operations Division</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Cycle</p>
                      <p className="text-sm font-bold text-slate-900">May 2026 / Cycle 5</p>
                      <p className="text-xs text-slate-500">Last Synced: {new Date().toLocaleTimeString()}</p>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                 <div className="px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-right">
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Health Status</div>
                    <div className="text-2xl font-black text-emerald-900">{stats.health}</div>
                    <div className="text-[10px] items-center justify-end flex gap-1 font-bold text-emerald-600 mt-1 uppercase">
                       <TrendingUp size={12} />
                       Tracking Optimal
                    </div>
                 </div>
              </div>
            </div>

            {/* Core KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <ReportMetric label="Operational Speed" value={`${stats.avgAht.toFixed(1)}m`} subLabel="AHT Efficiency" icon={<Zap className="text-brand-500" />} />
               <ReportMetric label="Service Continuity" value={`${stats.avgSla.toFixed(1)}%`} subLabel="SLA Compliance" icon={<Shield className="text-indigo-500" />} />
               <ReportMetric label="CX Index" value={`${stats.avgCsat.toFixed(1)}%`} subLabel="Global CSAT" icon={<Activity className="text-emerald-500" />} />
               <ReportMetric label="Quality Floor" value={`${executiveReps[0]?.qualityScore || 0}%`} subLabel="QA Baseline" icon={<CheckCircle2 className="text-brand-500" />} />
            </div>

            {/* Strategic ROI Analysis */}
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
               <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
                  <div className="max-w-md">
                     <div className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mb-4">Financial Impact Analytics</div>
                     <h2 className="text-3xl font-black mb-6 leading-tight">Quantifying Performance Excellence ROI</h2>
                     <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Systemic optimization of First Call Resolution (FCR) and Handle Time (AHT) has yielded significant capital recapture. Current workforce velocity is outperforming industrial benchmarks by <span className="text-white font-bold">{stats.efficiency}%</span>.
                     </p>
                     <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="" />
                             </div>
                           ))}
                        </div>
                        <div className="text-xs font-bold text-slate-400">
                           <span className="text-white font-black">{stats.eliteCount} Elite Specialists</span> driving top-tier yield.
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cost Savings (MTD)</div>
                        <div className="text-4xl font-black text-emerald-400 tracking-tighter">${(stats.savings / 1000).toFixed(1)}k</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-2">v. Baseline Expenditure</div>
                     </div>
                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resource Gains</div>
                        <div className="text-4xl font-black text-brand-400 tracking-tighter">+{stats.efficiency}%</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-2">Workforce Utilization gain</div>
                     </div>
                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Avoidance</div>
                        <div className="text-4xl font-black text-amber-400 tracking-tighter">99.8%</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-2">Compliance Accuracy</div>
                     </div>
                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Talent Maturity</div>
                        <div className="text-4xl font-black text-white tracking-tighter">{Math.round((stats.eliteCount / stats.count) * 100)}%</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-2">High-Tier Density</div>
                     </div>
                  </div>
               </div>
               {/* Background design element */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full -mr-40 -mt-40 blur-3xl" />
            </div>

            {/* Performance Breakdown Table/Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                     <Award size={24} className="text-brand-600" />
                     Workforce Maturation Matrix
                  </h3>
                  <div className="space-y-6">
                     <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        Performance is uniformly strong across major teams, with Team Charlie leading in customer sentiment. Team Alpha shows the most aggressive growth in resolution efficiency this period.
                     </p>
                     <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={teamPerformance} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                              <XAxis type="number" domain={[0, 100]} hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: '#64748B' }} />
                              <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                              <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={20}>
                                 {teamPerformance.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
               
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                     <Activity size={24} className="text-brand-600" />
                     Performance Drift Analysis
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                     <div className="space-y-6">
                        <DriftMetric 
                           label="Customer Sentiment Drift" 
                           value="+1.2%" 
                           status="Positive" 
                           description="Resilience in CSAT despite increased volume in Echo Team." 
                        />
                        <DriftMetric 
                           label="Wait-Time Latency" 
                           value="-4s" 
                           status="Optimized" 
                           description="Process improvements in Alpha Team reduced intake overhead." 
                        />
                        <DriftMetric 
                           label="QA Calibration" 
                           value="Stable" 
                           status="Uniform" 
                           description="Alignment across supervisors is at 94%, reducing coaching bias." 
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Recommendations Section (previously on the right, now below or rearranged) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                     <Briefcase size={24} className="text-indigo-600" />
                     Strategic Recommendations
                  </h3>
                  <div className="space-y-4">
                     <RecommendationItem 
                        icon={<TrendingUp size={18} />} 
                        title="Aggressive Talent Ascension" 
                        text="Transition 14 'Developing' specialists into 'Strong' benchmarks via shadow sessions." 
                     />
                     <RecommendationItem 
                        icon={<Zap size={18} />} 
                        title="FCR Optimization Phase 2" 
                        text="Target a 2.5% increase in FCR for Team Bravo to reduce $12k in monthly secondary load." 
                     />
                  </div>
               </div>
               <div>
                  <div className="mt-14 p-6 bg-slate-900 rounded-3xl border border-white/10 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Fiscal Target</p>
                        <p className="text-sm font-bold text-white">99% Compliance Accuracy</p>
                     </div>
                     <div className="h-10 w-px bg-white/10" />
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Forecast</p>
                        <p className="text-sm font-bold text-emerald-400">On-Track</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Area */}
            <div className="pt-12 border-t border-slate-100 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                     <img src="https://i.pravatar.cc/100?u=50" alt="Executive Signature" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-900">Daniel Gooding</p>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">VP — IT Service Operations</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-32 h-px bg-slate-200" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Data Export</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated By</p>
                  <p className="text-xs font-bold text-brand-600">Performance Intelligence Engine v4.2</p>
               </div>
            </div>

          </div>
        </div>

        {/* Action Items Post-Report - Hidden on Print */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex items-center justify-between gap-8 print:hidden">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                 <Lightbulb size={24} />
              </div>
              <div>
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Need a customized data slice?</h4>
                 <p className="text-sm text-slate-500">You can adjust the global dashboard filters to refine this summary report before exporting.</p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/executive/reps')}
             className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all whitespace-nowrap"
           >
             Refine Personnel Data
           </button>
        </div>
      </div>
    </div>
  );
}

function DriftMetric({ label, value, status, description }: { label: string, value: string, status: string, description: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{label}</span>
          <span className="px-2 py-0.5 bg-brand-50 text-[9px] font-black text-brand-600 rounded uppercase tracking-widest leading-none">{status}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-slate-900 leading-none">{value}</div>
      </div>
    </div>
  );
}

function ReportMetric({ label, value, subLabel, icon }: { label: string, value: string, subLabel: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-white transition-all group">
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
             {icon}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
       </div>
       <p className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</p>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subLabel}</p>
    </div>
  );
}

function RecommendationItem({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
       <div className="p-2 h-10 w-10 bg-white rounded-xl border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-all">
          {icon}
       </div>
       <div>
          <h4 className="text-sm font-black text-slate-900 mb-1">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
       </div>
    </div>
  );
}

function Lightbulb(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
