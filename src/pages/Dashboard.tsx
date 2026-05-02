import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function StatCard({ title, value, change, trend = "up", subtitle, link }: any) {
  const CardContent = (
    <div className="bg-white p-6 border border-slate-200 flex flex-col h-full hover:bg-slate-50 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
         <ArrowUpRight size={48} className={trend === 'up' ? "text-emerald-500" : "text-rose-500"} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</div>
        {link && <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />}
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-4xl font-extrabold tracking-tight font-mono text-slate-900">{value}</div>
        <div className={cn(
          "flex items-center text-xs font-black px-2 py-1 rounded",
          trend === 'up' ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
        )}>
          {trend === 'up' ? "+" : "-"}{change}
        </div>
      </div>
      {subtitle && <div className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{subtitle}</div>}
    </div>
  );

  if (link) {
    return <Link to={link} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}

export default function Dashboard() {
  const { agents, performance, qaReviews, sessions, focusMode, setFocusMode } = useStore();
  const needsAttention = agents.filter(m => m.metrics.qaScore < 85 || m.metrics.csat < 85);

  const teamCsat = Math.round(agents.reduce((sum, a) => sum + a.metrics.csat, 0) / (agents.length || 1));
  const teamQa = Math.round(agents.reduce((sum, a) => sum + a.metrics.qaScore, 0) / (agents.length || 1));

  return (
    <div className={cn("max-w-7xl mx-auto space-y-8 pb-12 transition-all duration-500", focusMode ? "px-6" : "px-0")}>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-blue-600"></div>
             {focusMode ? "Coach Focus" : "Team Performance"} <span className="font-serif italic font-normal text-slate-400 ml-1">{focusMode ? "Terminal" : "Overview"}</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {focusMode ? "High-velocity team management interface." : "Aggregated operational metrics for current period."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setFocusMode(!focusMode);
              toast.info(focusMode ? "Standard View restored." : "Coach Focus Mode activated.");
            }} 
            className={cn(
              "flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all text-xs font-black uppercase tracking-widest",
              focusMode 
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {focusMode ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            Focus Mode
          </button>
          {!focusMode && (
            <div className="flex gap-3">
               <button onClick={() => toast.success("PDF Report generated.")} className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                Export Audit
              </button>
              <Link to="/qa" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 transition-all active:scale-95">
                New Evaluation
              </Link>
            </div>
          )}
        </div>
      </div>

      {focusMode ? (
        /* SIMPLIFIED / FOCUS MODE CONTENT */
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Compact Stats Row */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Assets", val: agents.length, color: "text-slate-900" },
                { label: "Agg CSAT", val: `${teamCsat}%`, color: "text-blue-600" },
                { label: "Avg Audit", val: teamQa, color: teamQa < 85 ? "text-rose-600" : "text-emerald-600" },
                { label: "Escalated", val: needsAttention.length, color: needsAttention.length > 0 ? "text-rose-600" : "text-emerald-600" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                   <span className={cn("text-xl font-mono font-black", stat.color)}>{stat.val}</span>
                </div>
              ))}
           </div>

           {/* High Density Technician Grid */}
           <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Technician Priority Matrix</h2>
                 <Link to="/team" className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Full Roster &rarr;</Link>
              </div>
              <div className="divide-y divide-slate-100">
                 {agents.sort((a,b) => a.metrics.qaScore - b.metrics.qaScore).map(rep => (
                   <div key={rep.id} className="p-4 px-8 flex items-center gap-8 hover:bg-slate-50 transition-all group/row">
                      <div className="flex items-center gap-4 w-64 shrink-0">
                         <img src={rep.avatar} className="w-10 h-10 rounded-xl grayscale group-hover/row:grayscale-0 transition-all border border-slate-200" alt="" />
                         <div>
                            <div className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{rep.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{rep.role}</div>
                         </div>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-8">
                         <div className="space-y-1">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Audit Score</div>
                            <div className={cn("text-lg font-mono font-black leading-none", rep.metrics.qaScore < 85 ? "text-rose-600" : "text-slate-900")}>
                               {rep.metrics.qaScore}
                            </div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">CSAT Delta</div>
                            <div className={cn("text-lg font-mono font-black leading-none", rep.metrics.csat < 85 ? "text-amber-600" : "text-slate-900")}>
                               {rep.metrics.csat}%
                            </div>
                         </div>
                         <div className="space-y-1">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">AHT Profile</div>
                            <div className="text-lg font-mono font-black leading-none text-slate-400">
                               {rep.metrics.aht}
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2">
                         <Link to="/qa" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all opacity-0 group-hover/row:opacity-100">
                            Audit
                         </Link>
                         <Link to="/coaching" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all opacity-0 group-hover/row:opacity-100">
                            Coach
                         </Link>
                         <Link to={`/team/${rep.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <ArrowUpRight size={18} />
                         </Link>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Active Tasks Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0f172a] p-8 rounded-3xl text-white">
                 <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Pending Sessions</h3>
                 <div className="space-y-3">
                    {sessions.filter(s => s.status === 'scheduled').slice(0, 3).map(s => (
                      <div key={s.id} className="p-4 bg-slate-800 rounded-2xl flex items-center justify-between border border-slate-700 hover:border-blue-500/50 transition-all group pointer-events-auto">
                         <div>
                            <div className="text-sm font-bold mb-0.5">{s.rep}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.type}</div>
                         </div>
                         <Link to="/coaching" className="p-2 bg-slate-700 rounded-xl group-hover:bg-blue-600 transition-colors">
                            <ArrowUpRight size={16} />
                         </Link>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white border border-slate-200 p-8 rounded-3xl">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Escalated Drafts</h3>
                 <div className="space-y-3">
                    {qaReviews.filter(r => r.status === 'draft').slice(0, 3).map(r => (
                      <div key={r.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 hover:border-amber-200 transition-all group">
                         <div>
                            <div className="text-sm font-bold text-slate-900 mb-0.5">{r.repName}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{r.ticket}</div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="text-lg font-mono font-black text-amber-600">{r.score}</div>
                            <Link to="/qa" className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-amber-400 text-slate-400 group-hover:text-amber-600 transition-all">
                               <ArrowUpRight size={16} />
                            </Link>
                         </div>
                      </div>
                    ))}
                    {qaReviews.filter(r => r.status === 'draft').length === 0 && (
                      <div className="text-[10px] text-slate-400 italic py-8 border-dashed border-2 border-slate-100 rounded-2xl flex items-center justify-center">No escalated drafts.</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        /* STANDARD MODE CONTENT */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden shadow-sm">
        <StatCard 
          title="Technician Roster" 
          value={agents.length} 
          change="1" 
          trend="up" 
          subtitle="Managed Assets" 
          link="/team"
        />
        <StatCard 
          title="Aggregated CSAT" 
          value={`${teamCsat}%`} 
          change="1.2%" 
          trend="up" 
          subtitle="Target threshold: 90%" 
          link="/team"
        />
        <StatCard 
          title="Avg Audit Score" 
          value={teamQa} 
          change="2.1%" 
          trend="down" 
          subtitle="Quality Floor: 85" 
          link="/qa"
        />
        <StatCard 
          title="Skill Saturation" 
          value="84%" 
          change="5%" 
          trend="up" 
          subtitle="Competency Map" 
          link="/skills"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
               <BarChart3 size={16} className="text-blue-600" />
               Performance Velocity
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">CSAT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">QA</span>
              </div>
            </div>
          </div>
          <div className="p-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  domain={[70, 100]} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="csat" stroke="#2563EB" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="qa" stroke="#10B981" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} />
                <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Coaching Calendar Widget */}
          <div className="bg-[#0f172a] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Coaching Protocol</h2>
                <p className="text-xl font-bold tracking-tight">Active Agenda</p>
              </div>
              <Link to="/coaching" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 transition-all">
                 <ArrowUpRight size={20} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {sessions.filter(s => s.status === 'scheduled').slice(0, 3).map(session => (
                <div key={session.id} className="p-4 bg-slate-800/40 border border-slate-700 hover:border-blue-500/50 transition-all rounded-2xl group/item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-tighter group-hover/item:text-blue-400 transition-colors font-mono">{session.date}</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="font-bold text-sm mb-1">{session.rep}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{session.type}</div>
                </div>
              ))}
              {sessions.filter(s => s.status === 'scheduled').length === 0 && (
                <div className="text-xs text-slate-500 py-4 italic">No scheduled operations pending.</div>
              )}
            </div>
            
            <Link to="/coaching" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all active:scale-95 shadow-lg">
              <Clock size={14} />
              Launch Session
            </Link>
          </div>

          {/* Critical Attention Reps */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl group/focus">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-2">
                 <AlertCircle size={14} className="text-rose-500" />
                 Escalated Focus
               </h2>
               <Link to="/team" className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Audit All</Link>
            </div>
            <div className="space-y-4">
              {needsAttention.slice(0, 4).map(rep => (
                <Link to={`/team/${rep.id}`} key={rep.id} className="flex items-center justify-between group/rep p-1 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <img src={rep.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-slate-50 filter grayscale group-hover/rep:grayscale-0 transition-all" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-tight group-hover/rep:text-blue-600 transition-colors tracking-tight">{rep.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 w-fit px-1.5 rounded mt-0.5">Critical Delta</span>
                    </div>
                  </div>
                  <div className="text-xs font-black tabular-nums font-mono text-rose-600 bg-rose-50 px-2 py-1 rounded shadow-sm border border-rose-100">
                    {rep.metrics.qaScore}
                  </div>
                </Link>
              ))}
              {needsAttention.length === 0 && (
                <div className="text-[10px] text-slate-400 italic py-2 font-medium">All units performing within nominal variance.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Audit Log Feed */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="space-y-1">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Operational Audit Stream</h2>
             <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Real-time technician evaluation feed</p>
          </div>
          <Link to="/qa" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] hover:text-slate-900 transition-colors">Access Archives &rarr;</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {qaReviews.slice(0, 6).map(qa => (
            <div key={qa.id} className="px-8 py-5 flex items-center gap-6 hover:bg-slate-50 transition-all cursor-pointer group/row">
              <div className="w-1.5 h-10 bg-slate-200 rounded-full group-hover/row:bg-blue-600 transition-colors"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 tracking-tight">{qa.repName || qa.rep}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded uppercase">{qa.ticket}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest flex items-center gap-3">
                  <span>{qa.date}</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span className="font-serif italic capitalize text-[11px] font-normal tracking-normal text-slate-500 lowercase">By {qa.reviewer || 'System'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-3xl font-black tabular-nums font-mono tracking-tighter leading-none mb-1",
                  qa.score >= 90 ? "text-emerald-600" :
                  qa.score >= 80 ? "text-amber-600" : "text-rose-600"
                )}>
                  {qa.score}
                </div>
                <div className="text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">Score</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-50/50 flex justify-center">
           <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">Load Extended Logs</button>
        </div>
      </div>

        </>
      )}
    </div>
  );
}
