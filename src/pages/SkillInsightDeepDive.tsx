import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  TrendingUp, 
  Zap, 
  Award,
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

export default function SkillInsightDeepDive() {
  const { insightId } = useParams();
  const { agents } = useStore();

  const mockTrendData = [
    { date: 'Oct 1', growth: 4, gaps: 8, topScore: 82 },
    { date: 'Oct 8', growth: 6, gaps: 7, topScore: 85 },
    { date: 'Oct 15', growth: 5, gaps: 5, topScore: 86 },
    { date: 'Oct 22', growth: 8, gaps: 4, topScore: 89 },
    { date: 'Oct 29', growth: 10, gaps: 3, topScore: 92 },
    { date: 'Nov 5', growth: 12, gaps: 2, topScore: 95 },
  ];

  const insightConfigs = {
    growth: {
      title: 'Capability Growth',
      description: 'Monthly improvement tracking across core competencies.',
      icon: TrendingUp,
      color: 'emerald',
      value: '+12%',
      subtitle: 'MoM Average',
      chartType: 'line',
      chartDataKey: 'growth',
      listTitle: 'Fastest Growing Categories',
      items: [
        { id: 1, name: 'Privacy & Protocol', value: '+12%', context: 'Focus area since Q3' },
        { id: 2, name: 'Resolution Speed', value: '+8%', context: 'New tool adoption' },
        { id: 3, name: 'Knowledge Base', value: '+6%', context: 'Consistent training' },
      ]
    },
    gaps: {
      title: 'Skill Gap Alerts',
      description: 'Identified areas requiring immediate training attention or certified experts.',
      icon: Zap,
      color: 'amber',
      value: '5',
      subtitle: 'Total Reps Needed',
      chartType: 'area',
      chartDataKey: 'gaps',
      listTitle: 'Critical Shortages',
      items: [
        { id: 1, name: 'Advanced Fleet', value: '3 Reps Needed', context: 'High volume expected' },
        { id: 2, name: 'System Integration', value: '2 Reps Needed', context: 'Recent platform update' },
      ]
    },
    'top-contributor': {
      title: 'Top Contributor',
      description: 'Recognition for maximum proficiency levels reached across multiple categories.',
      icon: Award,
      color: 'brand',
      value: 'SL',
      subtitle: 'Samantha Lee',
      chartType: 'bar',
      chartDataKey: 'topScore',
      listTitle: 'Expert Categories (Samantha Lee)',
      items: [
        { id: 1, name: 'ETS', value: 'Expert', context: '98% CSAT' },
        { id: 2, name: 'Claims', value: 'Expert', context: 'Sub-4m AHT' },
        { id: 3, name: 'Agent', value: 'Expert', context: 'Peer mentor' },
        { id: 4, name: 'Property', value: 'Expert', context: 'Zero escalations' },
      ]
    }
  };

  const config = insightConfigs[insightId as keyof typeof insightConfigs];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Activity size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-800">Insight not found</h2>
        <Link to="/skills" className="text-brand-600 font-bold hover:underline mt-2">Return to Matrix</Link>
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
      <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} />
        Back to Skills Matrix
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
          <div className="text-6xl font-black text-slate-900 tracking-tighter mb-4">{config.value}</div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">{config.subtitle}</div>
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
            <p className="text-xs font-medium text-slate-500 mt-1">Detailed breakdown analysis.</p>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Metric/Category</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {config.items.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-700">{item.value}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
