import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Briefcase, Clock, CheckCircle, XCircle, Loader2, MapPin, DollarSign, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const HelperDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">{t('dashboard')}</h1>
        <Link
          to="/jobs"
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          {t('search_jobs')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Applications Sent</p>
          <p className="text-3xl font-bold text-zinc-900">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Accepted</p>
          <p className="text-3xl font-bold text-zinc-900">
            {applications.filter(a => a.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-zinc-900">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Applications */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            {t('my_applications')}
          </h2>
          <div className="space-y-4">
            {applications.length > 0 ? applications.map((app) => (
              <div key={app.applicationId} className="bg-white p-5 rounded-3xl border border-zinc-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-900">{app.title}</h3>
                    <p className="text-zinc-500 text-xs font-medium">{app.businessName}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider",
                    app.status === 'pending' ? "bg-amber-50 text-amber-700" : 
                    app.status === 'accepted' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  )}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-zinc-500 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                You haven't applied for any jobs yet.
              </div>
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Recommended for You
          </h2>
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <Link key={job.jobId} to={`/jobs/${job.jobId}`} className="block bg-white p-5 rounded-3xl border border-zinc-200 hover:border-indigo-600 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <span className="text-emerald-600 text-xs font-bold">{job.salary}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.businessName}</span>
                </div>
                <div className="flex justify-end">
                  <span className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
            <Link to="/jobs" className="block w-full py-4 text-center text-indigo-600 font-bold bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperDashboard;
