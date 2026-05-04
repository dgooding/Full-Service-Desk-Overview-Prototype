import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Save, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { toast } from 'sonner';

export default function NewBenchmark() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agents, addGoal } = useStore();
  const agent = agents.find(a => a.id === id);

  const [title, setTitle] = useState('');
  const [metric, setMetric] = useState('csat');
  const [targetScore, setTargetScore] = useState(90);
  const [timeline, setTimeline] = useState('30days');
  const [description, setDescription] = useState('');

  if (!agent) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Agent not found</h2>
        <Link to="/team" className="text-brand-600 font-medium hover:underline mt-4 inline-block">Return to Team Directory</Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        toast.error('Please enter a goal objective.');
        return;
    }
    
    let targetStr = "";
    if (metric === "qa") targetStr = `QA Score > ${targetScore}`;
    else if (metric === "csat") targetStr = `CSAT > ${targetScore}%`;
    else if (metric === "aht") targetStr = `AHT < ${targetScore}m`;
    else if (metric === "fcr") targetStr = `FCR > ${targetScore}%`;
    else targetStr = `Custom: ${targetScore}`;

    addGoal({
      repId: agent.id,
      description: title,
      targetMetric: targetStr,
      progressValue: 0,
      status: "On Track"
    });

    toast.success('Performance benchmark saved successfully!');
    navigate(`/team/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/team/${id}`} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set Performance Benchmark</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Configure a new goal or performance target for {agent.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/30 hover:scale-[1.02] transition-all"
        >
          <Save size={18} />
          Save Benchmark
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-8 space-y-8">
            <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex gap-4">
                <Target size={24} className="text-brand-600 shrink-0 mt-1" />
                <div>
                <h3 className="font-bold text-brand-900">What is a Benchmark?</h3>
                <p className="text-sm text-brand-700 mt-1 leading-relaxed">
                    Benchmarks create a quantifiable goal for agents to track their own progress against. 
                    Setting a benchmark adds a focus goal tracking card to their roadmap.
                </p>
                </div>
            </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Goal Objective</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Improve empathetic greetings on frustrated user calls"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Metric</label>
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                    >
                        <option value="qa">QA Average Score</option>
                        <option value="csat">CSAT Score</option>
                        <option value="aht">Average Handle Time</option>
                        <option value="fcr">First Contact Resolution</option>
                        <option value="custom">Custom KPI</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Value</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={targetScore}
                            onChange={(e) => setTargetScore(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Time Horizon</label>
                    <div className="flex gap-3">
                        {['14days', '30days', '90days', 'custom'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTimeline(t)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${timeline === t ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                            >
                                {t === '14days' ? '14 Days' : t === '30days' ? '30 Days' : t === '90days' ? '1 Quarter' : 'Custom'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Strategic Context (Optional)</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add notes, resources, or specific behavior changes expected..."
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium resize-none"
                    ></textarea>
                </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <AlertCircle size={16} />
                    This goal will be visible to {agent.name}
                </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
