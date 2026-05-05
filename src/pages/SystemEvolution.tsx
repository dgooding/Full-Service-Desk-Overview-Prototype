import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const updates = [
  {
    date: 'May 05, 2026',
    title: 'Final Production Readiness & UI Polish',
    description: 'Completed a comprehensive end-to-end audit of the platform, ensuring zero-error compilation and high-fidelity UI consistency for public release.',
    details: [
      'Executed full-stack dependency validation and script optimization.',
      'Refined interface rhythms and micro-animations for peak UX.',
      'Verified responsive performance across all localized command centers.',
      'Consolidated architectural logs to document system development Lifecycle.'
    ]
  },
  {
    date: 'May 05, 2026',
    title: 'Architectural Tracking & Transparency',
    description: 'Deployed a dedicated system evolution log to provide leadership with transparent oversight of architectural milestones and iterative progress.',
    details: [
      'Established version-controlled tracking for major feature drops.',
      'Created a consolidated view to replace scattered release notes.',
      'Improved visibility into engineering velocity and strategic alignment.'
    ]
  },
  {
    date: 'May 05, 2026',
    title: 'External Systems Integration',
    description: 'Secured external routing to seamlessly connect the core platform with specialized third-party coaching and performance modules.',
    details: [
      'Built a robust routing layer to handle external authentications.',
      'Reduced context-switching by embedding specialized modules within the HUD.',
      'Ensured data continuity between proprietary and third-party systems.'
    ]
  },
  {
    date: 'May 05, 2026',
    title: 'Executive Print-Ready Audits',
    description: 'Engineered a print-specific rendering engine to transform dynamic operational dashboards into clean, physical reports for executive reviews.',
    details: [
      'Implemented CSS architectures to strip non-essential UI for printing.',
      'Reformatted data visualizations into high-contrast print-safe layouts.',
      'Automated physical report generation to save time.'
    ]
  },
  {
    date: 'May 04, 2026',
    title: 'Focus Mode Implementation',
    description: 'Developed an interface toggle that collapses secondary navigation, allowing leadership to focus entirely on critical data during high-stakes evaluations.',
    details: [
      'Built a dynamic layout engine that prioritizes primary metric viewing.',
      'Reduced cognitive load by hiding dormant interface elements.',
      'Streamlined workflows for deep-dive coaching sessions.'
    ]
  },
  {
    date: 'May 04, 2026',
    title: 'System Optimization & Deprecation',
    description: 'Conducted a strategic codebase cleanup, removing redundant communication logs to centralize operations within a unified command interface.',
    details: [
      'Identified and sunsetted low-usage legacy features.',
      'Centralized communications to prevent fragmented data silos.',
      'Reduced technical debt and improved application load times.'
    ]
  },
  {
    date: 'May 04, 2026',
    title: 'Executive Dashboard Architecture',
    description: 'Built a high-density strategic dashboard optimized for cross-team aggregation, enabling rapid operational risk assessment at the executive level.',
    details: [
      'Designed a responsive grid layout for disparate data streams.',
      'Aggregated team-level KPIs into organization-wide health metrics.',
      'Highlighted actionable risk vectors for immediate leadership intervention.'
    ]
  },
  {
    date: 'May 03, 2026',
    title: 'Quality Assurance (QA) Engine',
    description: 'Engineered a comprehensive QA review environment featuring ticket auditing workflows and simulated sentiment analysis for service interactions.',
    details: [
      'Integrated deep-linking to specific customer support tickets.',
      'Built standard scoring forms for representative evaluations.',
      'Automated sentiment flagging to identify coaching opportunities.'
    ]
  },
  {
    date: 'May 03, 2026',
    title: 'Dynamic Skills Matrix',
    description: 'Developed an interactive capabilities matrix using real-time radar mapping to track individual agent competencies against organizational benchmarks.',
    details: [
      'Implemented dynamic charts for visual skill gap analysis.',
      'Mapped qualitative competencies to quantitative performance scores.',
      'Created a framework for targeted upskilling paths.'
    ]
  },
  {
    date: 'May 02, 2026',
    title: 'Agent Performance Profiles',
    description: 'Standardized personnel dashboards featuring chronological performance histories, real-time status indicators, and metric aggregations.',
    details: [
      'Unified the layout for individual representative data.',
      'Added historical trendlines for key performance indicators (KPIs).',
      'Improved 1-on-1 coaching efficiency through centralized data.'
    ]
  },
  {
    date: 'May 02, 2026',
    title: 'Design System Stabilization',
    description: 'Established and documented the core design system, ensuring consistent typography, color palettes, and accessibility standards across the platform.',
    details: [
      'Standardized UI components to ensure cross-page consistency.',
      'Implemented WCAG-compliant color contrasts for accessibility.',
      'Created a reusable component library to increase development speed.'
    ]
  },
  {
    date: 'May 01, 2026',
    title: 'Reusable Analytics Components',
    description: 'Developed the foundational suite of data widgets, including live leaderboards, KPI counters, and strategic health monitors.',
    details: [
      'Abstracted complex data queries into modular, plug-and-play UI widgets.',
      'Standardized the display of performance tiering and leaderboards.',
      'Ensured real-time metric updates across all modular components.'
    ]
  },
  {
    date: 'May 01, 2026',
    title: 'Core Platform Architecture',
    description: 'Bootstrapped the secure frontend environment using React 18, Vite, and Tailwind CSS, establishing comprehensive routing and global state management.',
    details: [
      'Transitioned to a modern, high-performance tech stack.',
      'Implemented strict typing for reliability and edge-case prevention.',
      'Established standard routing and global state for a robust foundation.'
    ]
  }
];

export default function SystemEvolution() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-12">
      {/* Header */}
      <div className="border-b border-slate-200 px-8 py-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Development Timeline</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            System evolution and architectural updates. 
            <span className="text-slate-400 italic">Click around to see the days of work behind each update.</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-3xl border-l-2 border-slate-100 ml-4 space-y-8">
          {updates.map((update, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-[3px] border-slate-300 rounded-full" />
                
                <button 
                  onClick={() => toggleExpand(idx)}
                  className="w-full text-left group"
                >
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{update.date}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">{update.title}</h3>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm group-hover:text-slate-500 transition-colors">
                    {update.description}
                  </p>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-slate-100">
                        <ul className="space-y-2">
                          {update.details.map((detail, dIdx) => (
                            <li key={dIdx} className="text-sm text-slate-600 flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Signature Block */}
        <div className="mt-16 pt-8 border-t border-slate-100 max-w-3xl ml-4">
          <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex items-start sm:items-center gap-5 transition-all hover:bg-slate-50 hover:shadow-sm">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xl shadow-sm rotate-[15deg] transition-transform hover:rotate-0 shrink-0 origin-bottom-right">
              👋
            </div>
            <div>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-slate-900 font-semibold tracking-tight">Hi, I'm Daniel.</strong> I architected, designed, and wrote the code for everything you see above. I care deeply about the details, and I'm really proud of how this platform is shaping up. <Link to="/requests" className="text-brand-600 font-bold hover:underline inline-flex items-center gap-1 group">Let's talk about what we should build next. <span className="transition-transform group-hover:translate-x-0.5">→</span></Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

