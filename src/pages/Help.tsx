import React from 'react';
import { 
  BookOpen, 
  Search, 
  MessageCircle, 
  FileText, 
  Terminal, 
  Shield, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Code
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const HelpCard = ({ icon: Icon, title, description, items }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">{title}</h3>
    <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">{description}</p>
    <div className="space-y-2">
      {items.map((item: any, i: number) => (
        <Link key={i} to={item.href} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer group/link">
          <ChevronRight size={14} className="text-slate-300 group-hover/link:text-brand-500 transition-colors" />
          {item.label}
        </Link>
      ))}
    </div>
  </div>
);

export default function Help() {
  return (
    <div className="space-y-12 pb-20">
      <section className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Documentation & Support</h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Master the LeadCoach environment with detailed blueprints, integration guides, and live session support.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search the blueprint library..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HelpCard 
          icon={Zap} 
          title="Onboarding Guide" 
          description="Everything you need to set up your team and configure your first performance cycle."
          items={[
            { label: "Environment Setup", href: "/help/docs/environment-setup" },
            { label: "Defining Benchmarks", href: "/help/docs/defining-benchmarks" },
            { label: "Team Onboarding", href: "/help/docs/team-onboarding" },
            { label: "Focus Mode Guide", href: "/help/docs/focus-mode" }
          ]}
        />
        <HelpCard 
          icon={Terminal} 
          title="API Foundations" 
          description="Power your dashboard with enterprise integrations from Jira, ServiceNow, and Salesforce."
          items={[
            { label: "Webhooks & Signal Sync", href: "/help/docs/webhooks-signal-sync" },
            { label: "Auth Tokens", href: "/help/docs/auth-tokens" },
            { label: "Payload Schemas", href: "/help/docs/payload-schemas" },
            { label: "Rate Limit Control", href: "/help/docs/rate-limit-control" }
          ]}
        />
        <HelpCard 
          icon={Shield} 
          title="Security Protocols" 
          description="Understand how LeadCoach protects agent PII and maintains enterprise-grade auditing."
          items={[
            { label: "Data Retention Policy", href: "/help/docs/data-retention" },
            { label: "RBAC Matrix", href: "/help/docs/rbac-matrix" },
            { label: "Audit Journal", href: "/help/docs/audit-journal" },
            { label: "Encryption Headers", href: "/help/docs/encryption-headers" }
          ]}
        />
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="inline-flex gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
            <span className="text-brand-400">Advanced</span> Documentation
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-none">Internal Functionality Blueprint</h2>
          <p className="text-slate-300 font-medium text-lg">
            A deep-dive into every interface component, algorithm, and behavioral trigger within the LeadCoach platform.
          </p>
          <Link 
            to="/help/functions" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-2xl font-black text-sm hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 group"
          >
            Explore Site Guide
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-brand-500 rounded-full blur-[80px] opacity-20 absolute"></div>
          <Code size={200} className="text-white/5 relative z-10 rotate-12" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10 opacity-70">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect with Technical Support:</p>
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-brand-600 transition-colors uppercase tracking-widest">
            <MessageCircle size={16} />
            Live Terminal
          </button>
          <button className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-brand-600 transition-colors uppercase tracking-widest">
            <ExternalLink size={16} />
            Community Hub
          </button>
        </div>
      </div>
    </div>
  );
}
