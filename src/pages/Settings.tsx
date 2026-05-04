import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Moon, 
  Smartphone, 
  Globe, 
  Database,
  Lock,
  ChevronRight,
  Monitor,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SettingItem = ({ icon: Icon, title, description, badge, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-200 hover:shadow-md transition-all group text-left"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 rounded-xl transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs font-medium text-slate-500">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {badge && (
        <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded">
          {badge}
        </span>
      )}
      <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-all group-hover:translate-x-1" />
    </div>
  </button>
);

export default function Settings() {
  const navigate = useNavigate();
  const { focusMode, setFocusMode } = useStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'edit_blueprint':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Blueprint</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                <input type="text" defaultValue="Daniel Gooding" className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500/20 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Title</label>
                <input type="text" defaultValue="Lead Performance Coach" className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500/20 outline-none" />
              </div>
              <button 
                onClick={() => {
                  toast.success('Blueprint identity updated');
                  setActiveModal(null);
                }}
                className="w-full mt-4 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
              >
                Save Identity
              </button>
            </div>
          </div>
        );
      case 'dark_mode':
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4"><Moon size={32} /></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dark Mode (Beta)</h2>
            <p className="text-sm font-medium text-slate-500">The low-light command interface is currently being rolled out. You have been added to the waitlist.</p>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Close</button>
          </div>
        );
      case 'mobile_hud':
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sync Mobile HUD</h2>
            <div className="w-48 h-48 bg-slate-100 mx-auto rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">QR Code Placeholder</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Scan this code with the LeadCoach Companion App to secure a handshake.</p>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel Pairing</button>
          </div>
        );
      case 'signals':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Signal Preferences</h2>
            <div className="space-y-3">
              {['QA Alert Spikes', 'CSAT Drops (< 80%)', 'Agent Offline > 30m', 'Team Metric Summaries Weekly'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                  <div className="w-10 h-5 bg-brand-600 rounded-full relative p-0.5 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => {toast.success('Signals Updated'); setActiveModal(null);}} className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700">Save Preferences</button>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Integrations</h2>
            <div className="space-y-3">
              <div className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between bg-white text-left">
                <div><h4 className="font-bold text-sm">Zendesk CRM</h4><p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Connected</p></div>
                <button onClick={() => toast.success('Zendesk CRM disconnected securely.')} className="text-xs font-bold text-slate-400 hover:text-rose-600">Disconnect</button>
              </div>
              <div className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between bg-white text-left">
                <div><h4 className="font-bold text-sm">Snowflake Data Warehouse</h4><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Not Configured</p></div>
                <button onClick={() => toast.success('OAuth handshake initiated with Snowflake...')} className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline">Connect</button>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Close</button>
          </div>
        );
      case 'vault':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vault & Privacy</h2>
            <p className="text-sm font-medium text-slate-500">Your organization manages security policies centrally. Two-factor authentication is enforced.</p>
            <div className="p-4 bg-brand-50 text-brand-700 rounded-xl border border-brand-100 text-sm font-medium flex items-center gap-3">
              <Shield size={20} />
              Platform is SOC2 Type II Certified
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Close Vault Settings</button>
          </div>
        );
      case 'privacy_charter':
         return (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Privacy Charter</h2>
            <div className="h-48 overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-4 font-medium leading-relaxed">
              <p>LeadCoach collects performance data purely to drive coaching interventions. Data is never sold or used for automated disciplinary action.</p>
              <p>All metrics are encrypted at rest and in transit. The AI analysis logic focuses on finding capability gaps rather than punishing employees.</p>
              <p>We comply with all enterprise-grade privacy strictures and local employment regulations.</p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700">Acknowledge</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Preferences</h1>
        <p className="text-slate-500 font-medium tracking-tight">Configure your terminal and coaching environment.</p>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Personal Identity</h3>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="relative group cursor-pointer">
              <img src="https://avatar.vercel.sh/daniel?size=200" alt="Avatar" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50" />
              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Daniel Gooding</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Lead Performance Coach</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-100">Senior Staff</span>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">Global Admin</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('edit_blueprint')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-brand-600 transition-all"
            >
              Edit Blueprint
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Display & HUD</h3>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-200 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                  <Monitor size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Command Focus Mode</h4>
                  <p className="text-xs font-medium text-slate-500">Minimalist interface for high-density sessions</p>
                </div>
              </div>
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative p-1",
                  focusMode ? "bg-brand-600" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                  focusMode ? "translate-x-6" : "translate-x-0"
                )}></div>
              </button>
            </div>
            <SettingItem icon={Moon} title="Dark Mode" description="Switch to low-light command interface" badge="Beta" onClick={() => setActiveModal('dark_mode')} />
            <SettingItem icon={Smartphone} title="Mobile HUD" description="Sync alerts to secondary handheld device" onClick={() => setActiveModal('mobile_hud')} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Intelligence & Data</h3>
            <SettingItem icon={Bell} title="Signal Preferences" description="Configure real-time performance alerts" onClick={() => setActiveModal('signals')} />
            <SettingItem icon={Database} title="API & Integrations" description="Manage connections to CRM and Service Desk" onClick={() => setActiveModal('api')} />
            <SettingItem icon={Lock} title="Vault & Privacy" description="Enterprise-grade security and key management" onClick={() => setActiveModal('vault')} />
          </div>
        </section>

        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">LeadCoach Platform v2.4.0-stable</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/help')} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Documentation</button>
            <button onClick={() => setActiveModal('privacy_charter')} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy Charter</button>
            <button onClick={() => {
              toast.success('Environment cache cleared.');
              localStorage.clear();
            }} className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-lg border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">Clear Environment Cache</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                {renderModalContent()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
