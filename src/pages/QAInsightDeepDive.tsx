import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Activity,
  History,
  Info
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
  Line,
  AreaChart,
  Area
} from 'recharts';

export default function QAInsightDeepDive() {
  const { insightId } = useParams();
  const { qaReviews, agents, performance } = useStore();

  const totalReviews = qaReviews.length;
  const completedReviews = qaReviews.filter(r => r.status === 'completed');
  const actionReviews = qaReviews.filter(r => r.status === 'needs_review');
  const avgQAScore = totalReviews > 0 ? Math.round(qaReviews.reduce((sum, r) => sum + r.score, 0) / totalReviews) : 0;

  const mockTrendData = [
    { date: 'Oct 1', score: 82, completed: 5, action: 2 },
    { date: 'Oct 8', score: 85, completed: 8, action: 1 },
    { date: 'Oct 15', score: 81, completed: 12, action: 3 },
    { date: 'Oct 22', score: 86, completed: 9, action: 0 },
    { date: 'Oct 29', score: 88, completed: 15, action: 1 },
    { date: 'Nov 5', score: avgQAScore, completed: completedReviews.length, action: actionReviews.length },
  ];

  const insightConfigs = {
    average: {
      title: 'Average QA Score',
      description: 'Historical trend of holistic quality evaluations across all service representatives.',
      icon: CheckCircle2,
      color: 'emerald',
      value: `${avgQAScore}%`,
      trend: '+1.2%',
      chartType: 'line',
      chartDataKey: 'score',
      listTitle: 'Top Performers',
      items: [...agents].sort((a, b) => (b.metrics.qaScore || 0) - (a.metrics.qaScore || 0)).slice(0, 5)
    },
    completed: {
      title: 'Completed Reviews',
      description: 'Volume of finalized and verified quality audits completed over time.',
      icon: FileText,
      color: 'brand',
      value: completedReviews.length.toString(),
      trend: '+24%',
      chartType: 'bar',
      chartDataKey: 'completed',
      listTitle: 'Recently Completed',
      items: completedReviews.slice(0, 5)
    },
    action: {
      title: 'Reviews Needing Action',
      description: 'Audits marked as needing secondary review, appeal, or manager intervention.',
      icon: AlertCircle,
      color: 'amber',
      value: actionReviews.length.toString(),
      trend: '-2',
      chartType: 'area',
      chartDataKey: 'action',
      listTitle: 'Pending Items',
      items: actionReviews
    }
  };

  const config = insightConfigs[insightId as keyof typeof insightConfigs];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Activity size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-800">Insight not found</h2>
        <Link to="/qa" className="text-brand-600 font-bold hover:underline mt-2">Return to QA Dashboard</Link>
      </div>
    );
  }

  const Icon = config.icon;
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    brand: 'bg-brand-50 text-brand-600 border-brand-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200'
  };

  return (
    <div className="space-y-8 pb-10">
      <Link to="/qa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} />
        Back to QA Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("bg-white p-8 rounded-3xl border shadow-sm lg:w-1/3 text-center flex flex-col items-center justify-center", colorMap[config.color])}
        >
          <div className={cn("p-4 rounded-2xl mb-4 bg-white shadow-sm border", colorMap[config.color])}>
            <Icon size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{config.title}</h1>
          <p className="text-sm font-medium text-slate-500 mb-6 px-4">{config.description}</p>
          <div className="text-7xl font-black text-slate-900 tracking-tighter mb-4">{config.value}</div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white shadow-sm border",
            config.color === 'amber' ? "text-amber-600 border-amber-100" : "text-emerald-600 border-emerald-100"
          )}>
            <TrendingUp size={16} />
            {config.trend} vs Last Month
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col"
        >
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <History size={16} />
            6-Week Trend Analysis
          </h2>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {config.chartType === 'line' ? (
                <LineChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey={config.chartDataKey} stroke="#10b981" strokeWidth={4} dot={{ stroke: '#10b981', strokeWidth: 4, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : config.chartType === 'bar' ? (
                <BarChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey={config.chartDataKey} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey={config.chartDataKey} stroke="#f59e0b" fill="#fef3c7" strokeWidth={4} dot={{ stroke: '#f59e0b', strokeWidth: 4, r: 4, fill: '#fff' }} />
                </AreaChart>
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
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{config.listTitle}</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Detailed breakdown based on current metrics.</p>
          </div>
        </div>
        <div className="p-0">
          {insightId === 'average' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Agent Name</th>
                  <th className="px-6 py-4 text-center">Avg Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {config.items.map((agent: any) => (
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
                      <span className="text-sm font-black text-slate-700">{agent.metrics.qaScore}%</span>
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
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Review ID / Ticket</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {config.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No records found for this category.
                    </td>
                  </tr>
                ) : (
                  config.items.map((review: any) => (
                    <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{review.ticket}</div>
                        <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Info size={10} />
                          {review.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">{review.repName}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-black text-slate-700">{review.score}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={cn(
                          "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          review.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                          review.status === 'needs_review' ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {review.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/qa/${review.id}`} className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wide">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
