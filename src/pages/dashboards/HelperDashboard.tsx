import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Briefcase, Clock, CheckCircle, XCircle, Loader2, MapPin, DollarSign, Search, ArrowRight, TrendingUp, Sparkles, Bell, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const HelperDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/jobs')
        ]);
        const appsData = await appsRes.json();
        const jobsData = await jobsRes.json();
        setApplications(appsData);
        setRecommendedJobs(jobsData.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

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
            HELPER PRO
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 font-medium max-w-md">
            You have {applications.filter(a => a.status === 'pending').length} pending applications. Stay tuned for updates!
          </p>
        </div>
        <div className="relative z-10 pt-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
          >
            <Search className="w-5 h-5" />
            Browse New Jobs
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Applications</p>
            <p className="text-4xl font-bold text-zinc-900">{applications.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Accepted</p>
            <p className="text-4xl font-bold text-zinc-900">
              {applications.filter(a => a.status === 'accepted').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Pending Review</p>
            <p className="text-4xl font-bold text-zinc-900">
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Applications - Bento Medium */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              {t('my_applications')}
            </h2>
            <Link to="/jobs" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Jobs</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {applications.length > 0 ? applications.map((app, index) => (
                <motion.div
                  key={app.applicationId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 rounded-[32px] border border-zinc-200 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all space-y-4 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{app.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <p className="text-zinc-500 text-xs font-medium">{app.businessName}</p>
                        <CheckCircle className="w-3 h-3 text-indigo-600 fill-indigo-600/10" />
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider",
                      app.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" : 
                      app.status === 'accepted' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                    )}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                    <Link to={`/jobs/${app.jobId}`} className="text-indigo-600">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center space-y-4 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                  <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto text-zinc-300">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <p className="text-zinc-500 font-bold">You haven't applied for any jobs yet.</p>
                  <Link to="/jobs" className="inline-block text-indigo-600 font-bold hover:underline">Start browsing jobs</Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar - Recommended & Quick Actions */}
        <div className="space-y-8">
          {/* Recommended Jobs */}
          <div className="bg-white p-8 rounded-[40px] border border-zinc-200 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Recommended
            </h2>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <Link key={job.jobId} to={`/jobs/${job.jobId}`} className="block p-4 rounded-3xl hover:bg-zinc-50 transition-all group border border-transparent hover:border-zinc-100">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors text-sm">{job.title}</h3>
                    <span className="text-emerald-600 text-[10px] font-bold">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  </div>
                </Link>
              ))}
              <Link to="/jobs" className="block w-full py-3 text-center text-indigo-600 text-sm font-bold bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all">
                Browse All Jobs
              </Link>
            </div>
          </div>

          {/* Quick Connect */}
          <div className="bg-zinc-900 p-8 rounded-[40px] text-white space-y-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Quick Connect</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/chat" className="p-4 bg-white/10 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/20 transition-colors group">
                <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                <span className="text-[10px] font-bold">Inbox</span>
              </Link>
              <Link to="/profile" className="p-4 bg-white/10 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/20 transition-colors group">
                <User className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                <span className="text-[10px] font-bold">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HelperDashboard;
