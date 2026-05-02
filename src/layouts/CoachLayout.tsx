import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CheckCircle,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  HelpCircle,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', path: '/', icon: BarChart3 },
  { name: 'My Team', path: '/team', icon: Users },
  { name: 'Skills Matrix', path: '/skills', icon: Award },
  { name: 'QA Reviews', path: '/qa', icon: CheckCircle },
  { name: 'Coaching', path: '/coaching', icon: MessageSquare },
];

export default function CoachLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { agents } = useStore();

  // Helper to determine breadcrumb based on route
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (path.startsWith('/team/')) {
      const id = path.split('/')[2];
      const rep = agents.find(a => a.id === id);
      return rep ? `Agent Profile: ${rep.name}` : 'Agent Profile';
    }
    if (path === '/team') return 'Team Roster';
    if (path === '/qa') return 'QA Review';
    if (path === '/coaching') return 'Coaching Sessions';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Integration Help';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4">
        <div className="font-semibold text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">C</div>
          CoachSpace
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-slate-500">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:static md:block",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex border-b border-slate-100 items-center px-6 font-semibold text-xl gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">SD</div>
            <span className="tracking-tight font-bold text-slate-800">LeadCoach</span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={18} className="opacity-80" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-2">System</div>
            <nav className="space-y-1">
              <NavLink
                to="/settings"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} className="opacity-80" />
                Settings
              </NavLink>
              <NavLink
                to="/help"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle size={18} className="opacity-80" />
                Integration Help
              </NavLink>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
              <img src="https://i.pravatar.cc/150?u=coach" alt="Coach Profile" className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300" />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">Daniel Gooding</span>
                <span className="text-xs text-slate-500 mt-1">Lead Coach</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-500">
              {getBreadcrumb()}
            </div>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md flex items-center gap-1.5 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span> Live Sync Active
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reps, tickets..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors" onClick={() => toast.info("No new notifications")}>
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
