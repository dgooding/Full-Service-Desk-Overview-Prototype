import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  Download, 
  Printer, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  Users,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';
import { ExecutiveRep } from '../lib/executiveData';
import { toast } from 'sonner';

export default function ExecutiveRepList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { executiveReps } = useStore();
  
  // Filters
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");

  useEffect(() => {
    if (location.state?.filter) {
      setTierFilter(location.state.filter);
    }
    if (location.state?.sortBy) {
      setSortConfig({ key: location.state.sortBy, direction: 'desc' });
    }
  }, [location.state]);

  // Table State
  const [sortConfig, setSortConfig] = useState<{ key: keyof ExecutiveRep, direction: 'asc' | 'desc' }>({ 
    key: 'overallPerformanceScore', 
    direction: 'desc' 
  });

  const filteredData = useMemo(() => {
    return executiveReps.filter(rep => {
      const matchesSearch = rep.fullName.toLowerCase().includes(search.toLowerCase()) || 
                             rep.repId.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter === "All" || rep.team === teamFilter;
      const matchesShift = shiftFilter === "All" || rep.shift === shiftFilter;
      const matchesLocation = locationFilter === "All" || rep.location === locationFilter;
      const matchesTier = tierFilter === "All" || rep.performanceTier.includes(tierFilter);
      
      return matchesSearch && matchesTeam && matchesShift && matchesLocation && matchesTier;
    }).sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const aStr = String(aValue);
      const bStr = String(bValue);
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [executiveReps, search, teamFilter, shiftFilter, locationFilter, tierFilter, sortConfig]);

  const handleSort = (key: keyof ExecutiveRep) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const exportCSV = () => {
    const headers = Object.keys(executiveReps[0]).join(",");
    const rows = executiveReps.map(rep => Object.values(rep).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rep_performance_roster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Roster exported successfully");
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/executive" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest mb-4">
            <ChevronLeft size={16} />
            Back to Executive Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personnel Roster</h1>
            <div className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
              {executiveReps.length} Specialists
            </div>
          </div>
          <p className="text-slate-500 font-medium tracking-tight mt-2 italic text-lg">Full technical workforce performance directory and distribution mapping.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-all"
          >
            <Download size={18} />
            Export Roster
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
          >
            <Printer size={18} />
            Print View
          </button>
        </div>
      </div>

      {/* Roster Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, ID or location..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/10 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect label="Team" value={teamFilter} onChange={setTeamFilter} options={["All", "Alpha", "Bravo", "Charlie", "Delta", "Echo"]} />
              <FilterSelect label="Shift" value={shiftFilter} onChange={setShiftFilter} options={["All", "Morning", "Afternoon", "Evening"]} />
              <FilterSelect label="Location" value={locationFilter} onChange={setLocationFilter} options={["All", "Colorado Springs, CO", "Tampa, FL", "Austin, TX", "Remote"]} />
              <FilterSelect label="Tier" value={tierFilter} onChange={setTierFilter} options={["All", "Elite", "Strong", "Developing", "Support"]} />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[11px] font-serif italic text-slate-400 border-b border-slate-100">
                <SortHeader label="Technical Specialist" k="fullName" activeSort={sortConfig} onSort={() => handleSort('fullName')} />
                <SortHeader label="Domain / Org" k="team" activeSort={sortConfig} onSort={() => handleSort('team')} />
                <SortHeader label="Service Metrics (FCR/CSAT)" k="firstCallResolution_pct" activeSort={sortConfig} onSort={() => handleSort('firstCallResolution_pct')} />
                <SortHeader label="QA Compliance" k="qualityScore" activeSort={sortConfig} onSort={() => handleSort('qualityScore')} />
                <SortHeader label="Overall Power" k="overallPerformanceScore" activeSort={sortConfig} onSort={() => handleSort('overallPerformanceScore')} />
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((rep) => (
                <tr key={rep.repId} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={`https://i.pravatar.cc/100?u=${rep.repId}`} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-brand-200 transition-all" alt="" />
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                          rep.status === 'active' ? "bg-emerald-500" : rep.status === 'away' ? "bg-amber-500" : "bg-slate-300"
                        )} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors">{rep.fullName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{rep.repId} • {rep.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{rep.team}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Shift: {rep.shift}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <MetricMiniBar label="FCR" value={rep.firstCallResolution_pct} color="emerald" />
                      <MetricMiniBar label="CSX" value={rep.customerSat_pct} color="indigo" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-black text-slate-900">{rep.qualityScore}%</div>
                      <div className="flex-1 h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn(
                          "h-full rounded-full transition-all",
                          rep.qualityScore >= 90 ? "bg-emerald-500" : rep.qualityScore >= 80 ? "bg-brand-500" : "bg-amber-500"
                        )} style={{ width: `${rep.qualityScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                        rep.overallPerformanceScore >= 90 ? "bg-emerald-100 text-emerald-700" :
                        rep.overallPerformanceScore >= 80 ? "bg-brand-100 text-brand-700" :
                        rep.overallPerformanceScore >= 70 ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      )}>
                        {rep.overallPerformanceScore}%
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter hidden md:inline">
                        {rep.performanceTier}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/team/${rep.repId}`)}
                      className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all shadow-sm group/btn"
                    >
                      <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="p-4 bg-slate-100 text-slate-300 rounded-full mb-4">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No specialists matching criteria</h3>
              <p className="text-slate-500 font-medium mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) {
  return (
    <div className="flex flex-col gap-1 underline-none">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-500/10 cursor-pointer shadow-sm"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function SortHeader({ label, k, activeSort, onSort }: { label: string, k: keyof ExecutiveRep, activeSort: any, onSort: () => void }) {
  const isActive = activeSort.key === k;
  return (
    <th 
      onClick={onSort}
      className={cn(
        "px-6 py-4 text-[11px] font-medium uppercase tracking-[0.1em] cursor-pointer hover:bg-slate-100/50 transition-all group",
        isActive && "text-brand-600 bg-brand-50/30"
      )}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {isActive ? (
          <TrendingUp size={12} className={cn("transition-transform", activeSort.direction === 'asc' ? "rotate-180" : "")} />
        ) : (
          <TrendingUp size={12} className="opacity-0 group-hover:opacity-30 transition-opacity" />
        )}
      </div>
    </th>
  );
}

function MetricMiniBar({ label, value, color }: { label: string, value: number, color: 'emerald' | 'indigo' | 'amber' }) {
  const colors = {
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    amber: "bg-amber-500"
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black text-slate-400 w-6">{label}</span>
      <div className="flex-1 h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", colors[color])} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[9px] font-bold text-slate-700 w-8">{value}%</span>
    </div>
  );
}
