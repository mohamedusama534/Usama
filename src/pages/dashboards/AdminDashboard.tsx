import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Users, Briefcase, ShieldAlert, Loader2, CheckCircle, XCircle, Trash2, Edit, Tag, Image as ImageIcon, Sparkles, TrendingUp, ArrowRight, Bell, Search, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>({ users: 0, jobs: 0, offers: 0, reports: 0, posters: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'jobs' | 'offers' | 'posters'>('stats');
  const [jobs, setJobs] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [posters, setPosters] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'job' | 'offer' | 'poster' | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, jobsRes, offersRes, postersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/all-jobs', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/all-offers', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/all-posters', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const statsData = await statsRes.json();
      const jobsData = await jobsRes.json();
      const offersData = await offersRes.json();
      const postersData = await postersRes.json();
      
      setStats(statsData);
      setJobs(jobsData);
      setOffers(offersData);
      setPosters(postersData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePoster = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this poster?')) return;
    try {
      const res = await fetch(`/api/posters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editType) return;

    try {
      let url = '';
      if (editType === 'job') url = `/api/jobs/${editingItem.jobId}`;
      else if (editType === 'offer') url = `/api/offers/${editingItem.offerId}`;
      else if (editType === 'poster') url = `/api/posters/${editingItem.posterId}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingItem)
      });

      if (res.ok) {
        setEditingItem(null);
        setEditType(null);
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
      {/* Admin Hero - Bento Large */}
      <div className="relative overflow-hidden bg-zinc-900 p-10 rounded-[40px] text-white space-y-4 shadow-2xl shadow-zinc-900/20">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldAlert className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider border border-white/10">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            ADMINISTRATOR CONTROL
          </div>
          <h1 className="text-4xl font-bold tracking-tight">System Overview</h1>
          <p className="text-zinc-400 font-medium max-w-md leading-relaxed">
            Monitor platform health, manage users, and moderate content across the WorkBridge ecosystem.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 pt-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {(['stats', 'jobs', 'offers', 'posters'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === tab ? "bg-white text-zinc-900 shadow-xl" : "text-zinc-400 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.users, icon: Users, color: 'indigo' },
                { label: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'emerald' },
                { label: 'Live Offers', value: stats.offers, icon: Tag, color: 'amber' },
                { label: 'Pending Reports', value: stats.reports, icon: ShieldAlert, color: 'red' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-zinc-200 flex flex-col justify-between space-y-4 shadow-sm group hover:border-indigo-600 transition-all">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" :
                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                    stat.color === 'amber' ? "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" :
                    "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                  )}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-4xl font-bold text-zinc-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity - Bento Medium */}
              <div className="lg:col-span-2 bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </h2>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Feed</span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {[
                    { id: 1, type: 'User Registered', user: 'Anand K', role: 'Helper', time: '2 mins ago', icon: Users, color: 'indigo' },
                    { id: 2, type: 'Job Posted', user: 'Saravana Stores', role: 'Business', time: '15 mins ago', icon: Briefcase, color: 'emerald' },
                    { id: 3, type: 'Report Filed', user: 'Mani R', role: 'Normal', time: '1 hour ago', icon: ShieldAlert, color: 'red' },
                    { id: 4, type: 'Offer Created', user: 'Pothys', role: 'Business', time: '3 hours ago', icon: Tag, color: 'amber' },
                  ].map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          item.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                          item.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                          item.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">{item.type}</p>
                          <p className="text-xs text-zinc-500 font-medium">{item.user} • {item.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.time}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all">
                  View Full Audit Log
                </button>
              </div>

              {/* System Health - Bento Small */}
              <div className="space-y-6">
                <div className="bg-zinc-900 p-8 rounded-[40px] text-white space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                      HEALTHY
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">System Performance</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <span>API Response</span>
                          <span className="text-emerald-400">99.9%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[99.9%] h-full bg-emerald-500" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <span>Server Load</span>
                          <span className="text-amber-400">42%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[42%] h-full bg-amber-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-zinc-200 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-zinc-50 rounded-3xl flex flex-col items-center gap-2 hover:bg-red-50 group transition-colors">
                      <ShieldAlert className="w-5 h-5 text-zinc-400 group-hover:text-red-600" />
                      <span className="text-[10px] font-bold text-zinc-600">Reports</span>
                    </button>
                    <button className="p-4 bg-zinc-50 rounded-3xl flex flex-col items-center gap-2 hover:bg-indigo-50 group transition-colors">
                      <Bell className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
                      <span className="text-[10px] font-bold text-zinc-600">Notify</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab !== 'stats' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-sm"
          >
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900 capitalize">{activeTab} Management</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Details</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Owner</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status/Info</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {activeTab === 'jobs' && jobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">{job.title}</p>
                        <p className="text-xs text-zinc-500 font-medium">{job.location}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-zinc-600 font-bold">{job.businessName}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider",
                          job.status === 'open' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                        )}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setEditingItem(job); setEditType('job'); }}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(job.jobId)}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'offers' && offers.map((offer) => (
                    <tr key={offer.offerId} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">{offer.title}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-zinc-600 font-bold">{offer.businessName}</td>
                      <td className="px-8 py-6 text-xs text-zinc-500 font-bold">
                        Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setEditingItem(offer); setEditType('offer'); }}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOffer(offer.offerId)}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'posters' && posters.map((poster) => (
                    <tr key={poster.posterId} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">{poster.title}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-zinc-600 font-bold">{poster.businessName}</td>
                      <td className="px-8 py-6 text-xs text-zinc-500 font-bold">{poster.price}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setEditingItem(poster); setEditType('poster'); }}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePoster(poster.posterId)}
                            className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h2 className="text-2xl font-bold text-zinc-900">Edit {editType}</h2>
                <button onClick={() => { setEditingItem(null); setEditType(null); }} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>

                {editType === 'job' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Salary</label>
                        <input
                          type="text"
                          value={editingItem.salary}
                          onChange={(e) => setEditingItem({ ...editingItem, salary: e.target.value })}
                          className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Location</label>
                        <input
                          type="text"
                          value={editingItem.location}
                          onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                          className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Status</label>
                      <select
                        value={editingItem.status}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </>
                )}

                {editType === 'offer' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Expiry Date</label>
                    <input
                      type="date"
                      value={editingItem.expiryDate.split('T')[0]}
                      onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-medium"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingItem(null); setEditType(null); }}
                    className="flex-1 py-4 border border-zinc-200 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
