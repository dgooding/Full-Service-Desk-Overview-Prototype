import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function StatCard({ title, value, change, trend = "up", subtitle, link }: any) {
  const CardContent = (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="flex items-center justify-between mb-1">
        <div className="text-slate-500 text-sm font-medium">{title}</div>
        {link && <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />}
      </div>
      <div className="flex items-end justify-between mt-1">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className={cn(
          "flex items-center text-sm font-medium",
          trend === 'up' ? "text-emerald-600" : "text-rose-600"
        )}>
          {trend === 'up' ? <ArrowUpRight size={16} className="mr-0.5"/> : <ArrowDownRight size={16} className="mr-0.5"/>}
          {change}
        </div>
      </div>
      {subtitle && <div className="text-xs text-slate-400 mt-2">{subtitle}</div>}
    </div>
  );

  if (link) {
    return <Link to={link}>{CardContent}</Link>;
  }

  return CardContent;
}

export default function Dashboard() {
  const { agents, performance, qaReviews, sessions } = useStore();
  const needsAttention = agents.filter(m => m.metrics.qaScore < 85 || m.metrics.csat < 85);

  const teamCsat = Math.round(agents.reduce((sum, a) => sum + a.metrics.csat, 0) / (agents.length || 1));
  const teamQa = Math.round(agents.reduce((sum, a) => sum + a.metrics.qaScore, 0) / (agents.length || 1));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Performance Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Metrics aggregated for the last 30 days.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success("PDF Report generated & downloaded successfully.")} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
            Export Report
          </button>
          <Link to="/qa" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
            New QA Review
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Team Roster" 
          value={agents.length} 
          change="+1" 
          trend="up" 
          subtitle="Managed Techs" 
          link="/team"
        />
        <StatCard 
          title="Team CSAT" 
          value={`${teamCsat}%`} 
          change="+1.2%" 
          trend="up" 
          subtitle="Target: 90%" 
          link="/team"
        />
        <StatCard 
          title="Avg QA Score" 
          value={teamQa} 
          change="-2.1%" 
          trend="down" 
          subtitle="Target: 90" 
          link="/qa"
        />
        <StatCard 
          title="Skills Coverage" 
          value="84%" 
          change="+5%" 
          trend="up" 
          subtitle="Competency Map" 
          link="/skills"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">CSAT vs QA Score Trend</h2>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} domain={[70, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="csat" name="CSAT %" stroke="#2563EB" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="qa" name="QA Score" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          
          {/* Action Items / Coaching */}
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-100 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Next Engagements</h2>
              <Link to="/coaching" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Full Agenda</Link>
            </div>
            <div className="space-y-5">
              {sessions.filter(s => s.status === 'scheduled').slice(0, 3).map(session => (
                <div key={session.id} className="flex gap-4 items-start group">
                  <div className="mt-0.5 p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-3 group-last:border-0">
                    <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{session.rep}</div>
                    <div className="text-[11px] text-slate-500 font-medium mb-1">{session.type}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50/50 px-2 py-0.5 rounded">
                      <Clock size={10} />
                      {session.date}
                    </div>
                  </div>
                </div>
              ))}
              {sessions.filter(s => s.status === 'scheduled').length === 0 && (
                <div className="text-sm text-slate-500 italic py-4">No upcoming sessions.</div>
              )}
            </div>
            <Link to="/coaching" className="block text-center w-full mt-2 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all">
              Initialize New Session
            </Link>
          </div>

          {/* Reps Needing Attention */}
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-rose-100/20 border border-rose-100 relative overflow-hidden group/focus">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <AlertCircle size={14} className="text-rose-500" />
                Critical Focus
              </h2>
              <Link to="/team" className="text-[10px] font-bold text-rose-600 hover:rose-700 transition-colors flex items-center gap-0.5">
                View Roster <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="space-y-3">
              {needsAttention.slice(0, 5).map(rep => (
                <Link to={`/team/${rep.id}`} key={rep.id} className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={rep.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-none mb-1">{rep.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Needs Assistance</span>
                    </div>
                  </div>
                  <div className="text-xs font-black tabular-nums text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                    {rep.metrics.qaScore}
                  </div>
                </Link>
              ))}
              {needsAttention.length === 0 && (
                <div className="text-sm text-slate-500 italic py-2">All assets performing within parameters.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Recent QA Feed */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-200 overflow-hidden group/qa">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Performance Audits</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live feed of ticket evaluations and coaching feedback.</p>
          </div>
          <Link to="/qa" className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider group">
            Audit Archive
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {qaReviews.slice(0, 5).map(qa => (
            <div key={qa.id} className="px-6 py-4 flex items-center hover:bg-slate-50/80 transition-colors">
              <div className="w-10">
                 {qa.score >= 90 ? <CheckCircle2 className="text-emerald-500" size={22} /> : 
                  qa.score >= 80 ? <AlertCircle className="text-amber-500" size={22} /> :
                  <AlertCircle className="text-rose-500" size={22} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900">{qa.repName || qa.rep}</span>
                  <span className="text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded tracking-tighter uppercase">{qa.ticket}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium italic">Evaluated on {qa.date} by {qa.reviewer || 'System'}</div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-xl font-black tabular-nums tracking-tighter",
                  qa.score >= 90 ? "text-emerald-600" :
                  qa.score >= 80 ? "text-amber-600" : "text-rose-600"
                )}>
                  {qa.score}
                </div>
                <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Score</div>
              </div>
            </div>
          ))}
          {qaReviews.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-500 italic font-serif">
              No recent audit data available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
