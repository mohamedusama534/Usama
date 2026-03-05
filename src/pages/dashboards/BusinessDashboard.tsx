import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Plus, Briefcase, Users, CheckCircle, XCircle, Loader2, MapPin, DollarSign, FileText, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const BusinessDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    salary: '',
    location: '',
    requiredSkills: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();
      setJobs(jobsData.filter((j: any) => j.businessName === user?.name));
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        setShowPostJob(false);
        setNewJob({ title: '', salary: '', location: '', requiredSkills: '', description: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">{t('dashboard')}</h1>
        <button
          onClick={() => setShowPostJob(!showPostJob)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('post_job')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Active Jobs</p>
          <p className="text-3xl font-bold text-zinc-900">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Total Applicants</p>
          <p className="text-3xl font-bold text-zinc-900">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Pending Reviews</p>
          <p className="text-3xl font-bold text-zinc-900">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {showPostJob && (
        <form onSubmit={handlePostJob} className="bg-white p-8 rounded-3xl border border-indigo-200 shadow-xl shadow-indigo-500/5 space-y-6 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-zinc-900">{t('post_job')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Job Title</label>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Delivery Driver"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Salary Range</label>
              <input
                type="text"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. ₹15,000 - ₹20,000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Location</label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Madurai"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Required Skills</label>
              <input
                type="text"
                value={newJob.requiredSkills}
                onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Driving, Communication"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-zinc-700">Description</label>
              <textarea
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                placeholder="Describe the job role and responsibilities..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowPostJob(false)} className="px-6 py-3 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Post Job</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Recent Applications
          </h2>
          <div className="space-y-4">
            {applications.length > 0 ? applications.map((app) => (
              <div key={app.applicationId} className="bg-white p-5 rounded-3xl border border-zinc-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-900">{app.applicantName}</h3>
                    <p className="text-zinc-500 text-xs font-medium">Applied for: {app.title}</p>
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
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {app.applicantPhone}</span>
                </div>
                {app.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleUpdateStatus(app.applicationId, 'accepted')}
                      className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(app.applicationId, 'rejected')}
                      className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="py-12 text-center text-zinc-500 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                No applications yet.
              </div>
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            My Posted Jobs
          </h2>
          <div className="space-y-4">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job.jobId} className="bg-white p-5 rounded-3xl border border-zinc-200 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-zinc-900">{job.title}</h3>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase">
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                </div>
                <p className="text-zinc-500 text-xs line-clamp-2">{job.description}</p>
              </div>
            )) : (
              <div className="py-12 text-center text-zinc-500 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                You haven't posted any jobs yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
