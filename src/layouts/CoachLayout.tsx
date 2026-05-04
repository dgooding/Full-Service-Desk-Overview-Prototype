import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle2,
  MessagesSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  LogOut,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Team', path: '/team', icon: Users },
  { name: 'Skills Matrix', path: '/skills', icon: Target },
  { name: 'QA Reviews', path: '/qa', icon: CheckCircle2 },
  { name: 'Coaching', path: '/coaching', icon: MessagesSquare },
];

export default function CoachLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { agents, focusMode, setFocusMode } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync mobile menu close on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Command Center';
    if (path.startsWith('/team/')) {
      const id = path.split('/')[2];
      const rep = agents.find(a => a.id === id);
      return `Agent: ${rep?.name || 'Profile'}`;
    }
    if (path === '/team') return 'Team Operations';
    if (path === '/qa') return 'Quality Assurance';
    if (path === '/coaching') return 'Performance Coaching';
    if (path === '/skills') return 'Competency Matrix';
    if (path === '/settings') return 'Preferences';
    if (path === '/help') return 'Documentation';
    if (path === '/help/functions') return 'Site Guide';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row focus-transition">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <TrendingUp size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">LeadCoach</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 -mr-2 text-slate-500 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: focusMode ? 80 : 260 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-500 ease-in-out md:translate-x-0 md:static",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full shadow-none",
          !focusMode && "shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-100 shrink-0",
          focusMode ? "justify-center" : "px-6 gap-3"
        )}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0">
            <TrendingUp size={focusMode ? 20 : 18} strokeWidth={2.5} />
          </div>
          {!focusMode && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-slate-800 tracking-tight text-lg"
            >
              LeadCoach
            </motion.span>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          {!focusMode && (
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Principal</span>
            </div>
          )}
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={focusMode ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all group relative",
                    focusMode ? "justify-center p-3 mx-auto w-12" : "gap-3 px-3 py-2.5",
                    "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={focusMode ? 22 : 18} className={cn("shrink-0", focusMode ? "" : "opacity-70 group-hover:opacity-100")} />
                  {!focusMode && <span>{item.name}</span>}
                </a>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  title={focusMode ? item.name : ""}
                  className={({ isActive }) => cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all group relative",
                    focusMode ? "justify-center p-3 mx-auto w-12" : "gap-3 px-3 py-2.5",
                    isActive 
                      ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/5 ring-1 ring-brand-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={focusMode ? 22 : 18} className={cn("shrink-0", focusMode ? "" : "opacity-70 group-hover:opacity-100")} />
                      {!focusMode && <span>{item.name}</span>}
                      {isActive && !focusMode && (
                        <motion.div 
                          layoutId="active-pill" 
                          className="absolute left-0 w-1 h-5 bg-brand-600 rounded-r-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            ))}
          </nav>

          {!focusMode && (
            <div className="px-3 mt-8 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Support</span>
            </div>
          )}
          
          <nav className={cn("space-y-1", focusMode && "mt-6")}>
            <NavLink
              to="/settings"
              title={focusMode ? "Settings" : ""}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl text-sm font-medium transition-all group",
                focusMode ? "justify-center p-3 mx-auto w-12" : "gap-3 px-3 py-2.5",
                isActive 
                  ? "bg-slate-100 text-slate-900 ring-1 ring-slate-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Settings size={focusMode ? 22 : 18} className="shrink-0 opacity-70 group-hover:opacity-100" />
              {!focusMode && <span>Settings</span>}
            </NavLink>
            
            <NavLink
              to="/help"
              title={focusMode ? "Documentation" : ""}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl text-sm font-medium transition-all group",
                focusMode ? "justify-center p-3 mx-auto w-12" : "gap-3 px-3 py-2.5",
                isActive 
                  ? "bg-slate-100 text-slate-900 ring-1 ring-slate-200 text-brand-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <HelpCircle size={focusMode ? 22 : 18} className="shrink-0 opacity-70 group-hover:opacity-100" />
              {!focusMode && <span>Docs & Help</span>}
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className={cn(
            "flex items-center rounded-xl transition-all",
            focusMode ? "justify-center" : "gap-3 px-2 py-2 hover:bg-slate-50 cursor-pointer"
          )}>
            <div className="relative">
              <img 
                src="https://avatar.vercel.sh/daniel?size=100" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover bg-slate-200 border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            {!focusMode && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate leading-tight">Daniel Gooding</span>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  Senior Coach
                </span>
              </div>
            )}
          </div>
          
          {!focusMode && (
            <button 
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              onClick={() => toast.success("Signed out successfully")}
            >
              <LogOut size={14} />
              Logout Session
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden relative">
        {/* Desktop Top Header */}
        <header className={cn(
          "hidden md:flex h-16 items-center justify-between px-8 z-40 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm" : "bg-transparent"
        )}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              <Link to="/" className="hover:text-brand-600 transition-colors">Platform</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 tracking-normal capitalize">{getBreadcrumb()}</span>
            </div>
            
            <div className="h-4 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-2 group cursor-help">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Real-time HUD Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search command..." 
                className="pl-9 pr-4 py-1.5 bg-slate-200/50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none w-48 focus:w-72 transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 opacity-0 group-focus-within:opacity-100 transition-opacity">/</div>
            </div>

            <button 
              onClick={() => setFocusMode(!focusMode)}
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {focusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content Scroll Container */}
        <div className="flex-1 overflow-y-auto w-full px-4 py-6 md:px-10 md:py-8 bg-[#FDFDFD]">
          <div className="max-w-5xl w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Focus Toggle Floating Action Button */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setFocusMode(!focusMode)}
          className="fixed bottom-6 right-6 p-4 bg-brand-600 text-white rounded-full shadow-xl shadow-brand-500/30 z-[70] md:hidden active:scale-95 transition-transform"
        >
          {focusMode ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      )}
    </div>
  );
}
