import React from 'react';
import { 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  Settings, 
  Info,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  FileText,
  MousePointer2,
  List,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AnnotationProps {
  number: number;
  title: string;
  description: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
}

const DASHBOARD_ANNOTATIONS: AnnotationProps[] = [
  { 
    number: 1, 
    title: "Sidebar Navigation", 
    description: "Main menu to switch between all sections of the app.",
    position: { top: '35%', left: '4%' }
  },
  { 
    number: 2, 
    title: "Live Sync Indicator", 
    description: "Shows real-time data syncing is active.",
    position: { top: '6%', left: '22%' }
  },
  { 
    number: 3, 
    title: "KPI Cards", 
    description: "Current performance metrics with trend arrows and targets. Green = positive change.",
    position: { top: '18%', left: '45%' }
  },
  { 
    number: 4, 
    title: "CSAT vs QA Score Trend Graph", 
    description: "6-month historical comparison of customer satisfaction and quality scores.",
    position: { top: '55%', left: '40%' }
  },
  { 
    number: 5, 
    title: "Next Engagements", 
    description: "Upcoming coaching sessions, reviews, and quick 'Initialize New Session' action.",
    position: { top: '30%', right: '8%' }
  },
  { 
    number: 6, 
    title: "Critical Focus", 
    description: "Agents who need immediate coaching attention with their current scores.",
    position: { top: '65%', right: '8%' }
  },
  { 
    number: 7, 
    title: "Recent Performance Audits", 
    description: "Live feed of recent evaluations and feedback.",
    position: { bottom: '10%', left: '40%' }
  },
  { 
    number: 8, 
    title: "User Profile", 
    description: "Current coach's information at the bottom.",
    position: { bottom: '6%', left: '5%' }
  },
];

const SECTIONS = [
  { id: 'introduction', label: 'Platform Introduction', icon: BookOpen },
  { id: 'dashboard', label: 'Dashboard Systems', icon: LayoutDashboard },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'skills', label: 'Competency Framework', icon: Award },
  { id: 'qa', label: 'Quality Assurance', icon: CheckCircle },
  { id: 'coaching', label: 'Impact Coaching', icon: MessageSquare },
];

export default function SiteFunctionHelp() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Sticky Local Navigation */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">LC</div>
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Operations Manual</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Documentation Index</h2>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group"
                  >
                    <section.icon size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Version 2.4.0</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                This document contains confidential operational procedures for the LeadCoach platform.
              </p>
              <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                Print for Training
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
            <span>Library</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span>Operational Guides</span>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-blue-600">Site Function Manual</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-20">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
              LeadCoach <br />
              <span className="text-blue-600">Operations Manual</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              This comprehensive technical document outlines the workflow, interface logic, and performance systems of the LeadCoach dashboard.
            </p>
          </div>

          <div className="space-y-32">
            {/* Section: Introduction */}
            <section id="introduction" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Chapter 01</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Platform Introduction</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                  LeadCoach is a sophisticated performance orchestration engine designed for high-velocity customer experience teams. The platform bridges the gap between raw ticket data and human behavioral change through three core pillars:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                  <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <TrendingUp size={32} className="text-blue-600 mb-6" />
                    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Visibility</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Real-time KPI aggregation and trend analysis across all team tiers.</p>
                  </div>
                  <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <Target size={32} className="text-emerald-600 mb-6" />
                    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Alignment</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Systematic skill mapping ensuring agents meet specific competency levels.</p>
                  </div>
                  <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <ShieldCheck size={32} className="text-purple-600 mb-6" />
                    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Integrity</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Auditable QA workflows and documented coaching session history.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Dashboard */}
            <section id="dashboard" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Chapter 02</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Dashboard Technical Interface</h2>
              
              <div className="space-y-12">
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  The primary command center provides a "North Star" view of team health. Navigate the 8 critical components of the interface below:
                </p>

                {/* Annotated Diagram */}
                <div className="relative bg-[#f1f5f9] rounded-[3rem] border border-slate-200 p-12 shadow-inner group/mock overflow-hidden">
                  <div className="bg-white w-full rounded-[2rem] border border-slate-200 shadow-2xl flex overflow-hidden aspect-video relative transform transition-transform duration-1000">
                     {/* Mock Sidebar */}
                     <div className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 gap-6 shrink-0 relative z-10">
                       <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"></div>
                       <div className="w-12 h-px bg-slate-100"></div>
                       {[Award, LayoutDashboard, Users, CheckCircle, MessageSquare].map((Icon, i) => (
                         <div key={i} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", i === 1 ? "bg-blue-50 text-blue-600" : "bg-white text-slate-300")}>
                           <Icon size={20} />
                         </div>
                       ))}
                       <div className="mt-auto w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm mb-2"></div>
                     </div>

                     <div className="flex-1 flex flex-col bg-[#f8fafc]">
                        <div className="h-14 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
                           <div className="w-32 h-3 bg-slate-100 rounded-full"></div>
                           <div className="w-24 h-4 bg-emerald-50 rounded-full border border-emerald-100"></div>
                        </div>
                        <div className="p-8 space-y-8 flex-1 overflow-hidden">
                           <div className="grid grid-cols-4 gap-4">
                              {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 shadow-sm p-4"></div>)}
                           </div>
                           <div className="grid grid-cols-3 gap-6">
                              <div className="col-span-2 h-64 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                                 <div className="w-full h-full bg-slate-50/50 flex items-end gap-1 p-4">
                                    {Array.from({length: 12}).map((_, i) => <div key={i} className="flex-1 bg-blue-400/20 border-t-2 border-blue-400/50" style={{ height: `${30 + Math.random() * 50}%` }}></div>)}
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <div className="h-32 bg-white rounded-3xl border border-slate-100 shadow-md"></div>
                                 <div className="h-32 bg-white rounded-3xl border border-rose-50 border-l-4 border-l-rose-500 shadow-md"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Red Arrows / Callouts Pins */}
                  {DASHBOARD_ANNOTATIONS.map((anno) => (
                    <motion.div 
                      key={anno.number}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className="absolute z-20"
                      style={anno.position}
                    >
                      <div className="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-[0_0_30px_rgba(225,29,72,0.6)] ring-4 ring-white">
                        {anno.number}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 border-t border-slate-100 pt-16">
                  {DASHBOARD_ANNOTATIONS.map((anno) => (
                    <div key={anno.number} className="flex gap-6">
                      <div className="shrink-0 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                        {anno.number}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-2">{anno.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{anno.description}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer hover:underline">
                           View Extension Reference <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: My Team */}
            <section id="team" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Chapter 03</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Team Portfolio Management</h2>
              
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                       <div className="flex items-center gap-2 text-blue-600 mb-4">
                          <Users size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Module Summary</span>
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Dynamic Agent Lifecycle Tracking</h3>
                       <p className="text-slate-500 font-medium leading-relaxed mb-8">
                          The "My Team" workspace is designed for rapid identity validation and performance context retrieval. Click any agent card to pivot from high-level stats into a granular timeline of their growth.
                       </p>
                       <ul className="space-y-4">
                          {[
                             { label: 'Real-time Presence', desc: 'Sync status indicators tied to LDAP/SAML.' },
                             { label: 'Growth Delta', desc: 'Calculation of performance lift over the last 30 days.' },
                             { label: 'Compliance Tagging', desc: 'Auto-verification of QA audit frequency.' }
                          ].map((feat, i) => (
                             <li key={i} className="flex gap-4">
                                <div className="mt-1 w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shrink-0">
                                   <ChevronRight size={12} className="text-blue-600" />
                                </div>
                                <div>
                                   <span className="font-bold text-slate-900 text-sm block">{feat.label}</span>
                                   <span className="text-xs text-slate-500 font-medium">{feat.desc}</span>
                                </div>
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="relative">
                       <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center h-full">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-500 mb-6">
                             <FileText size={32} />
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Resource Link</h4>
                          <p className="text-xs text-slate-500 font-medium mb-6 px-4">
                             Download the "Agent Onboarding Template" to standardize your initial team configuration.
                          </p>
                          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                             Download Technical PDF
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </section>

             {/* Section: Skills */}
             <section id="skills" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Chapter 04</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Competency Framework Matrix</h2>
              
              <div className="prose prose-slate max-w-none">
                 <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                   The Competency Matrix utilizes a 5-point validated scoring system. Each point represents a distinct behavioral milestone in agent proficiency.
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 not-prose">
                    {[
                      { l: 1, n: 'Novice', c: 'bg-slate-50 text-slate-400 border-slate-100' },
                      { l: 2, n: 'Emerging', c: 'bg-blue-50 text-blue-600 border-blue-100' },
                      { l: 3, n: 'Competent', c: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                      { l: 4, n: 'Advanced', c: 'bg-amber-50 text-amber-600 border-amber-100' },
                      { l: 5, n: 'Expert', c: 'bg-rose-50 text-rose-600 border-rose-100' },
                    ].map((lv) => (
                      <div key={lv.l} className={cn("p-6 rounded-2xl border-2 text-center", lv.c)}>
                        <div className="text-4xl font-black mb-2 leading-none">{lv.l}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest leading-none">{lv.n}</div>
                      </div>
                    ))}
                 </div>

                 <div className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                       <ShieldCheck size={20} className="text-slate-900" />
                       <span className="font-black text-slate-900 uppercase tracking-tight text-base">Impact Validation Rule</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Skills cannot be advanced more than 1 level per 24-hour cycle. Any "Expert" promotion requires a secondary validation audit by the Quality Lead to ensure operational standard alignment.
                    </p>
                 </div>
              </div>
            </section>
          </div>

          {/* Footer Assistance */}
          <div className="mt-32 p-16 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-blue-500/40">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <LayoutDashboard size={300} />
             </div>
             <div className="relative z-10 max-w-xl text-center md:text-left">
                <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Need further assistance?</h2>
                <p className="text-lg text-blue-100 font-medium leading-relaxed">
                   If you have reviewed the systems manual but still face functional blockers, please reach out via the internal ticketing portal or contact your local team lead.
                </p>
             </div>
             <div className="relative z-10 flex flex-col gap-4 shrink-0">
                <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                   Internal Support Portal
                </button>
                <button className="px-10 py-5 bg-blue-700 text-white border border-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                   Submit Feedback
                </button>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
