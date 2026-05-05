import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, MessageSquare, 
  Target, TrendingUp, CheckCircle2, Clock,
  FileText, Shield, Zap, Info, Share2, Mail
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function CoachingSessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { agents, logCommunication } = useStore();

  // Parse agent ID from session ID (format: CS-agentId-idx)
  const agentId = sessionId?.split('-')[1];
  const agent = agents.find(a => a.id === agentId) || agents[0] || { name: 'Alex Johnson', id: '1' };

  // Generate dynamic-ish session data based on the agent
  const session = {
    id: sessionId || 'CS-9921',
    date: 'April 28, 2026',
    time: '2:00 PM - 2:45 PM',
    agentName: agent.name,
    coachName: 'Coach Dan',
    type: agent.id === '1' ? 'First Contact Resolution Focus' : 'Process Compliance Review',
    focusArea: agent.id === '1' ? 'VPN Troubleshooting & FCR' : 'Tier 2 Escalation Accuracy',
    status: 'Completed',
    summary: `Detailed review of ${agent.name.split(' ')[0]}'s recent performance. Primary focus was on ${agent.id === '1' ? 'VPN connectivity issues' : 'escalation documentation standards'}. Overall trends show improvement, though specific technical gaps remain in specialized areas.`,
    positives: [
      'Excellent intake empathy reflected in CSAT comments',
      'Consistent adherence to ticketing categorization rules',
      'High level of peer collaboration during peak hours'
    ],
    improvements: [
      `Needs to focus on the new "Internal Knowledge Base" for ${agent.id === '1' ? 'Network' : 'Security'} tickets`,
      'Average hold time slightly above team baseline (+45s)',
      'Documentation missing specific hardware serial steps in 2 instances'
    ],
    nextSteps: [
      { task: `Complete ${agent.id === '1' ? 'Advanced Networking' : 'Security Protocol'} Module`, dueDate: 'May 5, 2026', status: 'pending' },
      { task: 'Shadow Tier 2 Lead for 2 hours', dueDate: 'May 8, 2026', status: 'pending' }
    ],
    metrics: [
      { label: 'Quality Score', value: '92%', target: '90%', trend: 'up' },
      { label: 'Avg Handle Time', value: '11m 45s', target: '10m', trend: 'down' },
      { label: 'Tech Capability', value: '88%', target: '85%', trend: 'up' }
    ]
  };

  const handleShareSummary = () => {
    const email = `${agent.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const subject = `Coaching Session Summary - ${session.date}`;
    const body = encodeURIComponent(`Hi ${agent.name},\n\nHere is the summary from our recent coaching session on ${session.date}.\n\nFocus Area: ${session.focusArea}\n\nNext Steps:\n${session.nextSteps.map(s => `- ${s.task} (Due: ${s.dueDate})`).join('\n')}\n\nBest regards,\nCoach Daniel`);
    
    logCommunication({
      agentId: agent.id,
      agentName: agent.name,
      type: 'Email',
      subject
    });

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    toast.success(`Summary drafted for ${agent.name}`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/coaching')}
          className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-brand-600 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Session Detail</h1>
          <p className="text-sm text-slate-500 mt-1">{session.type} • {session.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button 
            onClick={handleShareSummary}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95"
          >
            <Mail size={14} />
            Share Summary
          </button>
          <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {session.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
              <div className="flex -space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl">
                  {session.agentName[0]}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl">
                  D
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{session.agentName} & {session.coachName}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={14} />
                    {session.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={14} />
                    {session.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  Executive Summary
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {session.summary}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 text-emerald-700">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    Key Strengths
                  </h4>
                  <ul className="space-y-3">
                    {session.positives.map((pos, idx) => (
                      <li key={idx} className="flex gap-3 text-sm font-bold bg-emerald-50/50 p-3 rounded-2xl">
                        <Zap size={14} className="shrink-0 mt-0.5" />
                        {pos}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 text-orange-700">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} />
                    Opportunities
                  </h4>
                  <ul className="space-y-3">
                    {session.improvements.map((imp, idx) => (
                      <li key={idx} className="flex gap-3 text-sm font-bold bg-orange-50/50 p-3 rounded-2xl">
                        <Info size={14} className="shrink-0 mt-0.5" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target size={18} className="text-brand-500" />
              Agreed Next Steps
            </h3>
            <div className="space-y-3">
              {session.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">{step.task}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: {step.dueDate}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm">
                    Mark Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Performance Context */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Session Impact Metrics</h3>
            <div className="space-y-8">
              {session.metrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-400">{metric.label}</span>
                    <span className={cn(
                      "text-lg font-black",
                      metric.trend === 'down' ? "text-orange-400" : "text-emerald-400"
                    )}>{metric.value}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      metric.trend === 'down' ? "bg-orange-500" : "bg-emerald-500"
                    )} style={{ width: '70%', transitionDelay: `${idx * 200}ms` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Performance</span>
                    <span>Target: {metric.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Historical Context</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Last Coaching: 4/14/2026</p>
                <p className="text-[13px] font-medium text-slate-800 italic">"Representative struggling with specific Tier 2 handover protocols. Focus on proper documentation."</p>
              </div>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
                Compare with Previous
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
