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
  Info,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight
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
  Area,
  Cell
} from 'recharts';
import { SKILL_CATEGORIES } from '../constants/skills';

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
        { id: 1, name: 'Claims Systems', value: '+18.4%', context: 'New automated workflow' },
        { id: 2, name: 'Fleet Ops', value: '+12.1%', context: 'Telematics integration' },
        { id: 3, name: 'ETS Workflows', value: '+9.5%', context: 'Regional expansion' },
        { id: 4, name: 'Agent Portal', value: '+6.2%', context: 'UI refresh training' },
      ]
    },
    gaps: {
      title: 'Skill Gap Alerts',
      description: 'Identified areas requiring immediate training attention or certified experts.',
      icon: Zap,
      color: 'amber',
      value: '4',
      subtitle: 'Critical Deficits',
      chartType: 'area',
      chartDataKey: 'gaps',
      listTitle: 'Priority Domain Initiatives',
      items: [
        { id: 1, name: 'Property Mgmt', value: 'Level 4+ Required', context: '3 Reps below benchmark' },
        { id: 2, name: 'Claims Privacy', value: 'Expert Required', context: 'Audit compliance risk' },
        { id: 3, name: 'Fleet Diagnostic', value: '2 Reps Needed', context: 'Service backlog' },
        { id: 4, name: 'ETS Emergency', value: 'Level 3 Required', context: 'Night shift coverage' },
      ]
    },
    'top-contributor': {
      title: 'Talent Ranking',
      description: 'Performance leaders based on normalized competency index.',
      icon: Award,
      color: 'brand',
      value: '98',
      subtitle: 'Avg Index Score',
      chartType: 'bar',
      chartDataKey: 'topScore',
      listTitle: 'Top Performing Technical Resources',
      items: agents.slice(0, 5).map((a, i) => ({
        id: a.id,
        name: a.name,
        value: `${98 - (i * 3)}.4`,
        context: a.role
      }))
    }
  };

  const config = insightConfigs[insightId as keyof typeof insightConfigs];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2.5rem] border border-slate-200 mt-10 shadow-sm">
        <Activity size={48} className="text-slate-200 mb-4" />
        <h2 className="text-xl font-black text-slate-800">Operational Insight Not Located</h2>
        <p className="text-slate-500 font-medium mb-6">The report context you requested is invalid or has expired.</p>
        <Link to="/skills" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all">
          Return to Matrix
        </Link>
      </div>
    );
  }

  const Icon = config.icon;
  const colorMap: Record<string, { main: string, soft: string, border: string, text: string }> = {
    emerald: { main: 'bg-emerald-600', soft: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
    brand: { main: 'bg-brand-600', soft: 'bg-brand-50', border: 'border-brand-200', text: 'text-brand-600' },
    amber: { main: 'bg-amber-600', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' }
  };

  const colors = colorMap[config.color];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest group">
          <div className="p-1.5 rounded-lg group-hover:bg-brand-50 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Competency Matrix
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <History size={14} />
          Refresh Interval: 2h
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("bg-white p-10 rounded-[2.5rem] border shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden", colors.border)}
        >
          <div className={cn("p-5 rounded-3xl mb-6 shadow-sm border", colors.soft, colors.border, colors.text)}>
            <Icon size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{config.title}</h1>
          <p className="text-sm font-medium text-slate-500 mb-10 px-4 leading-relaxed max-w-sm">{config.description}</p>
          
          <div className="relative">
            <div className={cn("text-[8rem] font-black tracking-tighter leading-none opacity-5 absolute inset-0 -translate-y-1/4", colors.text)}>
              {config.value}
            </div>
            <div className={cn("text-7xl font-black tracking-tighter mb-4 relative z-10", colors.text)}>
              {config.value}
            </div>
          </div>
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{config.subtitle}</div>
          
          <div className="w-full h-px bg-slate-100 mb-8"></div>
          
          <div className="grid grid-cols-2 gap-8 w-full">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Sector Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-700">Optimal</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Confidence</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">92%</span>
                <TrendingUp size={14} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Telemetry Analysis</h2>
              <h3 className="text-xl font-bold text-white">Historical Performance Vector</h3>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button className="px-3 py-1.5 text-[10px] font-black text-white bg-white/10 rounded-lg">6W</button>
              <button className="px-3 py-1.5 text-[10px] font-black text-slate-500 hover:text-white transition-colors">3M</button>
              <button className="px-3 py-1.5 text-[10px] font-black text-slate-500 hover:text-white transition-colors">1Y</button>
            </div>
          </div>

          <div className="flex-1 min-h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {config.chartType === 'line' ? (
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey={config.chartDataKey} stroke="#10b981" strokeWidth={4} shadow="0 0 20px #10b981" dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                </LineChart>
              ) : config.chartType === 'bar' ? (
                <BarChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey={config.chartDataKey} fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                    {mockTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === mockTrendData.length - 1 ? '#0ea5e9' : '#0ea5e930'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey={config.chartDataKey} stroke="#f59e0b" fillOpacity={1} fill="url(#colorArea)" strokeWidth={4} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{config.listTitle}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Operational breakdown & recommended mitigations</p>
              </div>
              <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm">
                <Target size={20} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-10 py-6">Category/Resource</th>
                    <th className="px-10 py-6">Value Index</th>
                    <th className="px-10 py-6">Action Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {config.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          {config.chartType === 'area' ? (
                             <AlertTriangle size={16} className="text-amber-500" />
                          ) : config.chartType === 'bar' ? (
                             <Award size={16} className="text-brand-500" />
                          ) : (
                             <CheckCircle2 size={16} className="text-emerald-500" />
                          )}
                          <span className="text-sm font-black text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black",
                          config.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                          config.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-brand-50 text-brand-600"
                        )}>
                          {item.value}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-slate-500">{item.context}</span>
                           <motion.div 
                             whileHover={{ x: 5 }}
                             className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                           >
                             <ArrowRight size={14} />
                           </motion.div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <Lightbulb size={32} className="mb-6 text-brand-200" />
              <h3 className="text-xl font-black mb-2">Strategy Tip</h3>
              <p className="text-brand-100 text-sm font-medium leading-relaxed mb-6">
                Redistributing 2 "Expert" level techs from the morning shift to the swing shift would solve our current Claims processing gap.
              </p>
              <button className="px-4 py-2 bg-brand-500 hover:bg-brand-400 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                Apply Recommendation
              </button>
            </div>
            <div className="absolute -bottom-8 -right-8 text-white opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={140} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Upcoming Certs</h3>
            <div className="space-y-4">
              {[
                { name: 'Identity Audit', date: 'May 12', status: 'Ready' },
                { name: 'KCS Foundations', date: 'May 15', status: 'Upcoming' },
                { name: 'Azure Security', date: 'May 20', status: 'In-Progress' },
              ].map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-slate-800">{cert.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{cert.date}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest",
                    cert.status === 'Ready' ? "bg-emerald-100 text-emerald-600" :
                    cert.status === 'In-Progress' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
                  )}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
