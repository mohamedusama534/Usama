import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Users, Briefcase, ShieldAlert, Loader2, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState<any>({ users: 0, jobs: 0, reports: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd have an admin stats endpoint
    const fetchStats = async () => {
      try {
        const jobsRes = await fetch('/api/jobs');
        const jobs = await jobsRes.json();
        setStats({ users: 124, jobs: jobs.length, reports: 3 });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900">{t('admin_panel')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-zinc-900">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Active Jobs</p>
          <p className="text-3xl font-bold text-zinc-900">{stats.jobs}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 space-y-2">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Pending Reports</p>
          <p className="text-3xl font-bold text-zinc-900">{stats.reports}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {[
            { id: 1, type: 'User Registered', user: 'Anand K', role: 'Helper', time: '2 mins ago' },
            { id: 2, type: 'Job Posted', user: 'Saravana Stores', role: 'Business', time: '15 mins ago' },
            { id: 3, type: 'Report Filed', user: 'Mani R', role: 'Normal', time: '1 hour ago' },
          ].map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{item.type}</p>
                  <p className="text-xs text-zinc-500">{item.user} ({item.role})</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
