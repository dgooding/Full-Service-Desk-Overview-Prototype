import React from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Target,
  Maximize2,
  Info,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const FunctionSection = ({ id, icon: Icon, title, description, children }: any) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
        <Icon size={28} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{title}</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{description}</p>
      </div>
    </div>
    <div className="prose prose-slate max-w-none prose-sm text-slate-600 font-medium leading-loose">
      {children}
    </div>
  </motion.div>
);

export default function SiteFunctionHelp() {
  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Link to="/help" className="flex items-center gap-2 p-2 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 transition-all hover:shadow-sm">
          <ArrowLeft size={14} />
          Back to Center
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
          Function Deep-Dive
        </div>
      </div>

      <header className="space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Site Function Guide</h1>
        <p className="text-slate-500 font-medium text-lg">A technical guide to every blueprint and circuit in the LeadCoach environment.</p>
      </header>

      <div className="sticky top-4 z-[45] bg-white/80 backdrop-blur-md p-3 border border-slate-200 rounded-2xl shadow-xl flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Go to:</span>
        <button onClick={() => document.getElementById('dash')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap">Dashboard</button>
        <button onClick={() => document.getElementById('focus')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap">Focus Mode</button>
        <button onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap">Team Ops</button>
        <button onClick={() => document.getElementById('qa')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap">QA Audit</button>
        <button onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap">Matrix</button>
      </div>

      <div className="space-y-12">
        <FunctionSection id="dash" icon={LayoutDashboard} title="Command Center" description="Overview Intelligence Dashboard">
          <p>
            The Command Center provides a real-time HUD of four principal performance indices: Team Strength, Quality Index, Coach Backlog, and Critical Alerts.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
            <li className="bg-slate-50 p-4 rounded-2xl border border-white flex gap-3">
              <TrendingUp className="text-brand-600 shrink-0" size={18} />
              <span>Velocity chart displays MO-Mo Quality Index trends vs enterprise benchmarks.</span>
            </li>
            <li className="bg-slate-50 p-4 rounded-2xl border border-white flex gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
              <span>Priority Matrix automatically surfaces reps with sub-80% quality scores for intervention.</span>
            </li>
          </ul>
        </FunctionSection>

        <FunctionSection id="focus" icon={Maximize2} title="Command Focus Mode" description="Performance Optimization HUD">
          <p>
            Focus Mode (accessed via Header Toggle) reduces interface noise to concentrate on live data. The sidebar collapses, animations accelerate, and grids become higher-density.
          </p>
          <div className="bg-slate-900 p-6 rounded-3xl text-white flex gap-6 items-center">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Info size={24} className="text-brand-400" />
            </div>
            <p className="text-sm font-medium leading-relaxed">
              Recommended for full-screen monitoring during peak ticket volume or live coaching sessions where context-switching must be minimized.
            </p>
          </div>
        </FunctionSection>

        <FunctionSection id="team" icon={Users} title="Team Operations" description="Technician Portfolio Management">
          <p>
            The Operations view lists all active resources. Each card features real-time CSAT, QA, and AHT metrics.
          </p>
          <h4 className="text-slate-800 font-bold mb-2">Key Interactions:</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              <span>Filter by connection status (Online, In-Call, Away).</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              <span>Click 'View Profile' to enter the Rep Intelligence view for deep-dive metrics.</span>
            </div>
          </div>
        </FunctionSection>

        <FunctionSection id="qa" icon={CheckSquare} title="Quality Assurance Audit" description="Structured Interaction Evaluation">
          <p>
            The QA interface utilizes a weighted assessment blueprint across 6 critical categories from Greeting to Documentation.
          </p>
          <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 italic text-brand-700">
            "Every audit committed is instantly calculated into the Representative's Quality Index and synced to the Performance Velocity chart."
          </div>
        </FunctionSection>

        <FunctionSection id="skills" icon={Target} title="Competency Matrix" description="Skill Inventory HUD">
          <p>
            A high-density grid tracking proficiency levels from 1 (Trainee) to 5 (Expert) across all enterprise skillsets.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden mt-6">
            <div className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">Heuristic Data Model</div>
            <div className="p-6 text-sm">
              Proficiency markers are adjusted through structural audits. Reps who maintain &gt;95% QA in a category for 30 days are automatically flagged for mentor-track evaluation.
            </div>
          </div>
        </FunctionSection>
      </div>

      <div className="bg-brand-600 p-10 rounded-[3rem] text-white text-center space-y-6">
        <h2 className="text-3xl font-black tracking-tight">Still seeking clarity?</h2>
        <p className="text-brand-100 max-w-xl mx-auto font-medium">
          Our technical blueprint is constantly evolving. If a function is not documented here, please reach out via the Internal Support Terminal.
        </p>
        <button className="px-10 py-4 bg-white text-brand-600 rounded-2xl font-black text-sm hover:bg-brand-50 transition-all shadow-xl shadow-brand-700/20 active:scale-95">
          Sync with Support
        </button>
      </div>
    </div>
  );
}