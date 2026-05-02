import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function StatCard({ title, value, change, trend = "up", subtitle }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
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
        <StatCard title="Team CSAT" value={`${teamCsat}%`} change="+1.2%" trend="up" subtitle="Target: 90%" />
        <StatCard title="Avg QA Score" value={teamQa} change="-2.1%" trend="down" subtitle="Target: 90" />
        <StatCard title="Average Handle Time" value="7m 42s" change="-15s" trend="up" subtitle="Target: 8m 00s" />
        <StatCard title="First Contact Res." value="76.0%" change="+3.4%" trend="up" subtitle="Target: 75%" />
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
                <Line type="dashed" dataKey="target" name="Target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          
          {/* Action Items / Coaching */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {sessions.filter(s => s.status === 'scheduled').slice(0, 3).map(session => (
                <div key={session.id} className="flex gap-3 items-start">
                  <div className="mt-0.5 p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-900">{session.rep}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{session.type}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-1">{session.date}</div>
                  </div>
                </div>
              ))}
              {sessions.filter(s => s.status === 'scheduled').length === 0 && (
                <div className="text-sm text-slate-500">No upcoming sessions.</div>
              )}
            </div>
            <Link to="/coaching" className="block text-center w-full mt-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Schedule New 1-on-1
            </Link>
          </div>

          {/* Reps Needing Attention */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-rose-500" />
              Focus Areas
            </h2>
            <div className="space-y-3">
              {needsAttention.slice(0, 5).map(rep => (
                <Link to={`/team/${rep.id}`} key={rep.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <img src={rep.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{rep.name}</span>
                  </div>
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                    QA: {rep.metrics.qaScore}
                  </div>
                </Link>
              ))}
              {needsAttention.length === 0 && (
                <div className="text-sm text-slate-500">All reps are meeting targets.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Recent QA Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent Ticket QA</h2>
          <Link to="/qa" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {qaReviews.slice(0, 5).map(qa => (
            <div key={qa.id} className="px-6 py-4 flex items-center hover:bg-slate-50 transition-colors">
              <div className="w-10">
                 {qa.score >= 90 ? <CheckCircle2 className="text-emerald-500" size={20} /> : 
                  qa.score >= 80 ? <AlertCircle className="text-amber-500" size={20} /> :
                  <AlertCircle className="text-rose-500" size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">{qa.repName || qa.rep}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 rounded">{qa.ticket}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Reviewed on {qa.date}</div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-lg font-bold",
                  qa.score >= 90 ? "text-emerald-600" :
                  qa.score >= 80 ? "text-amber-600" : "text-rose-600"
                )}>
                  {qa.score}
                </div>
              </div>
            </div>
          ))}
          {qaReviews.length === 0 && (
            <div className="px-6 py-4 text-sm text-slate-500">No recent QA reviews.</div>
          )}
        </div>
      </div>

    </div>
  );
}
