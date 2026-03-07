import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Briefcase, Tag, ArrowRight, Star, Sparkles, MessageSquare, Bell, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const NormalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Welcome Hero - Bento Large */}
      <div className="relative overflow-hidden bg-indigo-600 p-10 rounded-[40px] text-white space-y-4 shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider">
            <TrendingUp className="w-3 h-3" />
            WORKBRIDGE PREMIUM
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 font-medium max-w-md">
            Your neighborhood is buzzing today. We've found 12 new jobs and 5 exclusive offers near you.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs Card - Bento Medium */}
        <Link to="/jobs" className="md:col-span-2 bg-white p-8 rounded-[40px] border border-zinc-200 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 text-zinc-100 group-hover:text-indigo-50 transition-colors">
            <Briefcase className="w-24 h-24" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Explore Local Jobs</h2>
              <p className="text-zinc-500 font-medium max-w-xs leading-relaxed">
                Browse verified hiring opportunities from businesses in your immediate area.
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              View All Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Profile Stats - Bento Small */}
        <div className="bg-zinc-900 p-8 rounded-[40px] text-white space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Profile Strength</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">85%</span>
              <span className="text-emerald-400 text-xs font-bold mb-1">+5% this week</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-indigo-500" />
            </div>
          </div>
          <Link to="/profile" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Offers Card - Bento Small */}
        <Link to="/offers" className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 hover:border-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between space-y-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
            <Tag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900">Local Offers</h2>
            <p className="text-zinc-500 text-sm font-medium">Exclusive deals from shops near you.</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            Save Money <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Quick Actions - Bento Small */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 space-y-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Quick Connect</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/chat" className="p-4 bg-zinc-50 rounded-3xl flex flex-col items-center gap-2 hover:bg-indigo-50 transition-colors group">
              <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-indigo-600" />
              <span className="text-xs font-bold text-zinc-600">Inbox</span>
            </Link>
            <div className="p-4 bg-zinc-50 rounded-3xl flex flex-col items-center gap-2 hover:bg-amber-50 transition-colors group cursor-pointer">
              <Bell className="w-6 h-6 text-zinc-400 group-hover:text-amber-600" />
              <span className="text-xs font-bold text-zinc-600">Alerts</span>
            </div>
          </div>
        </div>

        {/* Location Card - Bento Small */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Your Area</p>
              <p className="text-sm font-bold text-zinc-900">Chennai, TN</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
            <CheckCircle className="w-4 h-4" />
            Location Verified
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NormalDashboard;
