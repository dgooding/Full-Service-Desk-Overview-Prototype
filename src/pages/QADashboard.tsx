import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Search, 
  Calendar,
  AlertCircle,
  FileText,
  Filter,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function QADashboard() {
  const { qaReviews, agents } = useStore();
  const navigate = useNavigate();

  const totalReviews = qaReviews.length;
  const completedReviews = qaReviews.filter(r => r.status === 'completed').length;
  const needsReview = qaReviews.filter(r => r.status === 'needs_review').length;
  
  const avgQAScore = totalReviews > 0 
    ? Math.round(qaReviews.reduce((sum, r) => sum + r.score, 0) / totalReviews)
    : 0;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">QA Reviews</h1>
          <p className="text-slate-500 font-medium tracking-tight">Quality Assurance evaluations and interaction audits.</p>
        </div>
        <Link 
          to="/qa/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25 active:scale-95"
        >
          <Plus size={18} />
          New QA Audit
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/qa/insights/average">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer h-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Average QA Score</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 tracking-tight">{avgQAScore}%</span>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/>+1.2%</span>
            </div>
          </motion.div>
        </Link>

        <Link to="/qa/insights/completed">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer h-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                <FileText size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed Reviews</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 tracking-tight">{completedReviews}</span>
              <span className="text-sm font-bold text-slate-400">/ {totalReviews} Total</span>
            </div>
          </motion.div>
        </Link>

        <Link to="/qa/insights/action">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer h-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Needs Action</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 tracking-tight">{needsReview}</span>
              <span className="text-sm font-bold text-slate-400">Appeals/Reviews</span>
            </div>
          </motion.div>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by agent name, ticket ID, or reviewer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
            />
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-bold transition-colors border border-slate-100">
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Agent & Ticket</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 hidden md:table-cell">Reviewer</th>
                <th className="px-6 py-4 text-right">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {qaReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No QA reviews found. <Link to="/qa/new" className="text-brand-600 font-bold hover:underline">Start an audit</Link>.
                  </td>
                </tr>
              ) : (
                qaReviews.map((review) => {
                  const agent = agents.find(a => a.id === review.repId) || agents[0];
                  return (
                    <tr 
                      key={review.id} 
                      onClick={() => navigate(`/qa/${review.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={agent?.avatar} alt={review.repName} className="w-10 h-10 rounded-full border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{review.repName}</div>
                            <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <FileText size={10} />
                              {review.ticket}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm",
                          review.score >= 90 ? "bg-emerald-50 text-emerald-600" :
                          review.score >= 80 ? "bg-brand-50 text-brand-600" :
                          "bg-rose-50 text-rose-600"
                        )}>
                          {review.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                          review.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                          review.status === 'needs_review' ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {review.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">{review.reviewer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-300 group-hover:text-brand-400 transition-colors p-2 rounded-lg hover:bg-white">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
