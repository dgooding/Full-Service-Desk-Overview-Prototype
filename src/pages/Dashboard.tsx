import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ArrowUpRight,
  UserCheck,
  Zap,
  Calendar,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StatCard = ({ title, value, change, icon: Icon, trend, color, delay, to }: any) => {
  const CardContent = (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl transition-colors", color)}>
          <Icon size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800 tracking-tight">{value}</span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="h-full"
    >
      {to ? <Link to={to} className="block h-full">{CardContent}</Link> : CardContent}
    </motion.div>
  );
};

export default function Dashboard() {
  const { agents, qaReviews, focusMode } = useStore();
  const navigate = useNavigate();

  const totalQA = qaReviews.length;
  const avgQAScore = Math.round(qaReviews.reduce((sum, r) => sum + r.score, 0) / (totalQA || 1));
  const activeAgents = agents.filter(a => a.status === 'online' || a.status === 'in-call').length;

  const priorityReps = [...agents]
    .sort((a, b) => (a.metrics.qaScore || 0) - (b.metrics.qaScore || 0))
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics and oversight for your service team.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.info('Dashboard filters configuration opened')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={18} className="text-slate-400" />
            Last 30 Days
          </button>
          <Link to="/reports" className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 active:scale-95">
            <Zap size={18} />
            Quick Report
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid gap-6",
          focusMode ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        <StatCard 
          title="Team QA Avg" 
          value={`${avgQAScore}%`} 
          change="+1.4%" 
          icon={CheckCircle2} 
          trend="up" 
          color="bg-emerald-50 text-emerald-600"
          delay={0.1}
          to="/metrics/qa"
        />
        <StatCard 
          title="Avg CSAT Score" 
          value={`${Math.round(agents.reduce((sum, a) => sum + (a.metrics.csat || 0), 0) / (agents.length || 1))}%`} 
          change="+2.1%" 
          icon={Users} 
          trend="up" 
          color="bg-blue-50 text-blue-600"
          delay={0.2}
          to="/metrics/csat"
        />
        <StatCard 
          title="Avg Handle Time" 
          value="7m 14s" 
          change="-42s" 
          icon={Clock} 
          trend="up" 
          color="bg-brand-50 text-brand-600"
          delay={0.3}
          to="/metrics/aht"
        />
        <StatCard 
          title="First Contact Res." 
          value={`${Math.round(agents.reduce((sum, a) => sum + (a.metrics.fcr || 0), 0) / (agents.length || 1))}%`} 
          change="+4.5%" 
          icon={CheckCircle2} 
          trend="up" 
          color="bg-purple-50 text-purple-600"
          delay={0.4}
          to="/metrics/fcr"
        />
      </motion.div>

      {/* Team Performance Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">Team Performance Metrics</h2>
            <p className="text-sm font-medium text-slate-500">Service desk key performance indicators across all active agents</p>
          </div>
          <Link to="/team" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
            View All Agents
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Agent</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">QA Score</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">CSAT</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">AHT</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">FCR</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tkt/Call Avg</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => {
                // Generate a ticket to call percentage for realism based on FCR and QA
                const tktCallAvg = (((agent.metrics.fcr || 70) / 40 + (agent.metrics.qaScore || 80) / 50) * 10).toFixed(1) + '%';
                
                return (
                  <tr key={agent.id} onClick={() => navigate(`/team/${agent.id}`)} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{agent.name}</div>
                          <div className="text-xs font-medium text-slate-500">{agent.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        agent.status === 'online' ? "bg-emerald-100 text-emerald-700" :
                        agent.status === 'in-call' ? "bg-brand-100 text-brand-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "font-bold",
                        agent.metrics.qaScore >= 90 ? "text-emerald-600" :
                        agent.metrics.qaScore >= 80 ? "text-brand-600" :
                        "text-rose-600"
                      )}>
                        {agent.metrics.qaScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {agent.metrics.csat}%
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {agent.metrics.aht}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {agent.metrics.fcr}%
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {tktCallAvg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Grid: Priority Matrix + Upcoming Table */}
      <div className={cn(
        "grid gap-6",
        focusMode ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {/* Priority Matrix */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Priority Matrix</h2>
            <button onClick={() => toast.info('Priority Matrix settings opened')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            {priorityReps.map((rep, idx) => (
              <Link 
                key={rep.id} 
                to={`/team/${rep.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-brand-100 transition-all group"
              >
                <div className="relative shrink-0">
                  <img src={rep.avatar} alt={rep.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                  <div className="absolute -top-1 -left-1 w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700 shadow-sm">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{rep.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded uppercase tracking-wider">Low Score</span>
                    <span className="text-[11px] font-medium text-slate-400">{rep.metrics.qaScore}% QA</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <Link 
            to="/team" 
            className="mt-6 w-full py-3 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 text-sm font-bold rounded-xl text-center transition-colors"
          >
            View Full Team Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
