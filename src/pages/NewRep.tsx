import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ArrowLeft, UserPlus, Mail, Phone, MapPin, Building, ShieldCheck, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function NewRep() {
  const navigate = useNavigate();
  const { addAgent } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'IT Service Desk T1',
    email: '',
    phone: '',
    location: '',
    department: 'Service Desk',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Name and Role are required.');
      return;
    }
    
    addAgent({
      name: formData.name,
      role: formData.role,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(formData.name)}`,
      status: 'offline',
      metrics: {
        csat: 0,
        qaScore: 0,
        aht: '0m 00s'
      },
      skills: {}
    });
    
    toast.success('Agent onboarded successfully!');
    navigate('/team');
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate('/team')} className="flex items-center gap-2 p-2 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 transition-all hover:shadow-sm">
          <ArrowLeft size={14} />
          Back to Team List
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl">
            <UserPlus size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Onboard Representative</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provision new system access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. IT Service Desk T1"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="jane.doe@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Austin, TX / Remote"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all appearance-none"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option>Service Desk</option>
                  <option>Endpoint Support</option>
                  <option>Network Operations</option>
                  <option>Customer Success</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <ShieldCheck size={16} />
              Standard Access will be provisioned
            </div>
            <button 
              type="submit"
              className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-black text-sm hover:bg-brand-700 shadow-xl shadow-brand-500/20 active:scale-95 transition-all"
            >
              Provision Account
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
