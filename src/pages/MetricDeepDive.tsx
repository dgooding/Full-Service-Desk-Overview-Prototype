import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Users, 
  Clock, 
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

export default function MetricDeepDive() {
  const { metricId } = useParams();
  const { agents, performance } = useStore();

  const metricConfig = {
    qa: {
      title: 'Team QA Average',
      description: 'Quality Assurance score analysis across all evaluated interactions.',
      icon: CheckCircle2,
      color: 'emerald',
      value: `${Math.round(agents.reduce((sum, a) => sum + (a.metrics.qaScore || 0), 0) / (agents.length || 1))}%`,
      trend: '+1.4%',
      chartType: 'line',
      chartDataKey: 'qa'
    },
    csat: {
      title: 'Average CSAT Score',
      description: 'Customer Satisfaction scores aggregated from post-interaction surveys.',
      icon: Users,
      color: 'blue',
      value: `${Math.round(agents.reduce((sum, a) => sum + (a.metrics.csat || 0), 0) / (agents.length || 1))}%`,
      trend: '+2.1%',
      chartType: 'bar',
      chartDataKey: 'csat'
    },
    aht: {
      title: 'Average Handle Time (AHT)',
      description: 'Total average duration of interactions including talk, hold, and wrap-up time.',
      icon: Clock,
      color: 'brand',
      value: '7m 14s',
      trend: '-42s better',
      chartType: 'line',
      chartDataKey: 'coachingHours' // Mocking using coaching hours as variability
    },
    fcr: {
      title: 'First Contact Resolution',
      description: 'Percentage of customer issues resolved on their very first interaction.',
      icon: Target,
      color: 'purple',
      value: `${Math.round(agents.reduce((sum, a) => sum + (a.metrics.fcr || 0), 0) / (agents.length || 1))}%`,
      trend: '+4.5%',
      chartType: 'bar',
      chartDataKey: 'csat' // Mocking
    }
  };

  const config = metricConfig[metricId as keyof typeof metricConfig];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Activity size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-800">Metric not found</h2>
        <Link to="/" className="text-brand-600 font-bold hover:underline mt-2">Return to Dashboard</Link>
      </div>
    );
  }

  const Icon = config.icon;
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    brand: 'bg-brand-50 text-brand-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  const borderMap: Record<string, string> = {
    emerald: 'border-emerald-200',
    blue: 'border-blue-200',
    brand: 'border-brand-200',
    purple: 'border-purple-200'
  };

  const sortedAgents = [...agents].sort((a, b) => {
    if (metricId === 'qa') return (b.metrics.qaScore || 0) - (a.metrics.qaScore || 0);
    if (metricId === 'csat') return (b.metrics.csat || 0) - (a.metrics.csat || 0);
    if (metricId === 'fcr') return (b.metrics.fcr || 0) - (a.metrics.fcr || 0);
    return 0; // Default generic
  });

  return (
    <div className="space-y-8 pb-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("bg-white p-8 rounded-3xl border shadow-sm md:w-1/3 text-center flex flex-col items-center justify-center", borderMap[config.color])}
        >
          <div className={cn("p-4 rounded-2xl mb-4", colorMap[config.color])}>
            <Icon size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{config.title}</h1>
          <p className="text-sm font-medium text-slate-500 mb-6 px-4">{config.description}</p>
          <div className="text-6xl font-black text-slate-900 tracking-tighter mb-4">{config.value}</div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold">
            <TrendingUp size={16} />
            {config.trend} vs Last 30 Days
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex-1"
        >
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Historical Trend (6 Months)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {config.chartType === 'line' ? (
                <LineChart data={performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey={config.chartDataKey} stroke="#0ea5e9" strokeWidth={4} dot={{ stroke: '#0ea5e9', strokeWidth: 4, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey={config.chartDataKey} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Agent Impact Breakdown</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Individual contributions to the team metric.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4 text-center">Score / Metric</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAgents.map(agent => (
                <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full border border-slate-200" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{agent.name}</div>
                        <div className="text-xs text-slate-500">{agent.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-slate-700">
                      {metricId === 'qa' && `${agent.metrics.qaScore}%`}
                      {metricId === 'csat' && `${agent.metrics.csat}%`}
                      {metricId === 'fcr' && `${agent.metrics.fcr}%`}
                      {metricId === 'aht' && agent.metrics.aht}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                      agent.status === 'online' ? "bg-emerald-100 text-emerald-700" :
                      agent.status === 'in-call' ? "bg-brand-100 text-brand-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/team/${agent.id}`} className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wide">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
