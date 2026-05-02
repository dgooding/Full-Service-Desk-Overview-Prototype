import React from 'react';
import { Check, User, Bell, Shield, Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">App Settings</h1>
        <p className="text-slate-500 mt-1">Manage application preferences and notification controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-4 py-2.5 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg flex items-center gap-2">
            <User size={18} /> Profile & Account
          </button>
          <button className="w-full text-left px-4 py-2.5 text-slate-600 font-medium text-sm rounded-lg flex items-center gap-2 hover:bg-slate-50">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2.5 text-slate-600 font-medium text-sm rounded-lg flex items-center gap-2 hover:bg-slate-50">
            <Database size={18} /> Integrations
          </button>
          <button className="w-full text-left px-4 py-2.5 text-slate-600 font-medium text-sm rounded-lg flex items-center gap-2 hover:bg-slate-50">
            <Shield size={18} /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
              <p className="text-sm text-slate-500 mt-1">Update your coach profile details.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-6">
                <img src="https://i.pravatar.cc/150?u=coach" alt="Coach" className="w-20 h-20 rounded-full border border-slate-200" />
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
                  Change Avatar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Daniel Gooding" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role/Title</label>
                  <input type="text" defaultValue="Lead Coach" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" defaultValue="daniel.gooding@example.com" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-slate-50" readOnly />
                <p className="text-xs text-slate-500 mt-1">Contact your IT admin to change your primary email.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Data Sync Preferences</h2>
                <p className="text-sm text-slate-500 mt-1">Configure how often data is refreshed from connected systems.</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                <RefreshCw size={20} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Refresh Rate (Teams/Finesse)</label>
                <select className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 max-w-sm">
                  <option>Real-time (WebSockets)</option>
                  <option>Every 5 seconds</option>
                  <option>Every 30 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Metrics Refresh Rate (BMC)</label>
                <select className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 max-w-sm">
                  <option>Every 15 minutes</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-5 py-2.5 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors">
              Discard Changes
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
              <Check size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
