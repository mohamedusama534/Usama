import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Plus, Briefcase, Users, CheckCircle, XCircle, Loader2, MapPin, DollarSign, FileText, Clock, Image as ImageIcon, Tag, Sparkles, TrendingUp, ArrowRight, MessageSquare, Bell, Search, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const BusinessDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showPostPoster, setShowPostPoster] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    salary: '',
    location: '',
    requiredSkills: '',
    description: '',
    experienceLevel: 'Entry Level',
    jobType: 'Full-time',
    salaryCategory: '0-10k',
    dueDate: '',
  });
  const [newPoster, setNewPoster] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
  });
  const [posters, setPosters] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, postersRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/posters')
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();
      const postersData = await postersRes.json();
      setJobs(jobsData.filter((j: any) => j.businessName === user?.name));
      setApplications(appsData);
      setPosters(postersData.filter((p: any) => p.businessName === user?.name));
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
        setNewJob({ 
          title: '', 
          salary: '', 
          location: '', 
          requiredSkills: '', 
          description: '',
          experienceLevel: 'Entry Level',
          jobType: 'Full-time',
          salaryCategory: '0-10k',
          dueDate: ''
        });
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

  const handlePostPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posters', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPoster),
      });
      if (res.ok) {
        setShowPostPoster(false);
        setNewPoster({ title: '', description: '', imageUrl: '', price: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Business Hero - Bento Large */}
      <div className="relative overflow-hidden bg-indigo-600 p-10 rounded-[40px] text-white space-y-4 shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider">
            <TrendingUp className="w-3 h-3" />
            BUSINESS PRO
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 font-medium max-w-md">
            You have {applications.filter(a => a.status === 'pending').length} new applications to review. Grow your team today!
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-3 pt-4">
          <button
            onClick={() => { setShowPostJob(!showPostJob); setShowPostPoster(false); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {t('post_job')}
          </button>
          <button
            onClick={() => { setShowPostPoster(!showPostPoster); setShowPostJob(false); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold hover:bg-white/30 transition-all"
          >
            <ImageIcon className="w-5 h-5" />
            Post Poster
          </button>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Active Jobs</p>
            <p className="text-4xl font-bold text-zinc-900">{jobs.length}</p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <TrendingUp className="w-3 h-3" />
            +2 this month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Applicants</p>
            <p className="text-4xl font-bold text-zinc-900">{applications.length}</p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <TrendingUp className="w-3 h-3" />
            +12% vs last week
          </div>
        </div>
        <div className="bg-zinc-900 p-8 rounded-[40px] text-white space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <Bell className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Pending Reviews</p>
            <p className="text-4xl font-bold text-white">
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <Link to="/chat" className="pt-2 flex items-center gap-2 text-indigo-400 text-xs font-bold hover:text-indigo-300">
            Check Messages <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showPostPoster && (
          <motion.form 
            key="post-poster"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handlePostPoster} 
            className="bg-white p-10 rounded-[40px] border border-indigo-100 shadow-2xl shadow-indigo-500/5 space-y-8 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Post New Poster</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Poster Title</label>
                <input
                  type="text"
                  value={newPoster.title}
                  onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. Friday Sahar Special"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Price Info</label>
                <input
                  type="text"
                  value={newPoster.price}
                  onChange={(e) => setNewPoster({ ...newPoster, price: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. ₹110 per person"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Image URL</label>
                <input
                  type="url"
                  value={newPoster.imageUrl}
                  onChange={(e) => setNewPoster({ ...newPoster, imageUrl: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Paste the image URL here..."
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Description</label>
                <textarea
                  value={newPoster.description}
                  onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
                  placeholder="Describe the offer, menu, or event..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setShowPostPoster(false)} className="px-8 py-4 text-zinc-500 font-bold hover:bg-zinc-100 rounded-2xl transition-all">Cancel</button>
              <button type="submit" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Post Poster</button>
            </div>
          </motion.form>
        )}

        {showPostJob && (
          <motion.form 
            key="post-job"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handlePostJob} 
            className="bg-white p-10 rounded-[40px] border border-indigo-100 shadow-2xl shadow-indigo-500/5 space-y-8 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">{t('post_job')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Delivery Driver"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. ₹15,000 - ₹20,000"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Salary Category</label>
                <select
                  value={newJob.salaryCategory}
                  onChange={(e) => setNewJob({ ...newJob, salaryCategory: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="0-10k">₹0 - ₹10k</option>
                  <option value="10k-25k">₹10k - ₹25k</option>
                  <option value="25k-50k">₹25k - ₹50k</option>
                  <option value="50k+">₹50k+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Experience Level</label>
                <select
                  value={newJob.experienceLevel}
                  onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Job Type</label>
                <select
                  value={newJob.jobType}
                  onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Application Deadline</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="date"
                    value={newJob.dueDate}
                    onChange={(e) => setNewJob({ ...newJob, dueDate: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Madurai"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Required Skills</label>
                <div className="relative">
                  <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={newJob.requiredSkills}
                    onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Driving, Communication"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-6 w-5 h-5 text-zinc-400" />
                  <textarea
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[140px]"
                    placeholder="Describe the job role and responsibilities..."
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setShowPostJob(false)} className="px-8 py-4 text-zinc-500 font-bold hover:bg-zinc-100 rounded-2xl transition-all">Cancel</button>
              <button type="submit" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Post Job</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-600" />
              Recent Applications
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{applications.length} Total</span>
          </div>
          <div className="space-y-4">
            {applications.length > 0 ? applications.map((app) => (
              <motion.div 
                layout
                key={app.applicationId} 
                className="bg-white p-6 rounded-[32px] border border-zinc-200 space-y-4 hover:border-indigo-200 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-500">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">{app.applicantName}</h3>
                      <p className="text-zinc-500 text-xs font-medium">Applied for: <span className="text-indigo-600">{app.title}</span></p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider",
                    app.status === 'pending' ? "bg-amber-50 text-amber-700 border border-amber-100" : 
                    app.status === 'accepted' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                  )}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {app.applicantPhone}</span>
                </div>

                {app.profileSnapshot && (
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                      <User className="w-3 h-3" />
                      Profile Snapshot
                    </div>
                    {(() => {
                      try {
                        const profile = JSON.parse(app.profileSnapshot);
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">Location</p>
                              <p className="text-xs font-bold text-zinc-900">{profile.location || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">Email</p>
                              <p className="text-xs font-bold text-zinc-900 truncate">{profile.email}</p>
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>
                )}

                {app.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleUpdateStatus(app.applicationId, 'accepted')}
                      className="flex-1 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(app.applicationId, 'rejected')}
                      className="flex-1 py-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="py-20 text-center text-zinc-500 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <Users className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="font-bold">No applications yet.</p>
                <p className="text-sm">New applications will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              My Posted Jobs
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{jobs.length} Total</span>
          </div>
          <div className="space-y-4">
            {jobs.length > 0 ? jobs.map((job) => (
              <div key={job.jobId} className="bg-white p-6 rounded-[32px] border border-zinc-200 space-y-4 group hover:border-indigo-200 transition-colors shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-wider">
                    {job.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{job.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                        {i}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      +5
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Manage Job <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-zinc-500 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <Briefcase className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="font-bold">No jobs posted yet.</p>
                <button onClick={() => setShowPostJob(true)} className="text-indigo-600 text-sm font-bold hover:underline mt-2">Post your first job</button>
              </div>
            )}
          </div>
        </div>

        {/* Posters List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-indigo-600" />
              My Posted Posters
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{posters.length} Total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posters.length > 0 ? posters.map((poster) => (
              <div key={poster.posterId} className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden flex flex-col group hover:border-indigo-200 transition-colors shadow-sm">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-zinc-900 shadow-sm">
                    {poster.price}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-zinc-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{poster.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[10px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(poster.createdAt).toLocaleDateString()}
                    </span>
                    <button className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center text-zinc-500 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <ImageIcon className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="font-bold">No posters posted yet.</p>
                <button onClick={() => setShowPostPoster(true)} className="text-indigo-600 text-sm font-bold hover:underline mt-2">Create your first poster</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;
