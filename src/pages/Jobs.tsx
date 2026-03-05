import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Search, MapPin, DollarSign, Clock, ArrowRight, Loader2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setIsLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">{t('jobs')}</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search jobs, locations, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
          <Link key={job.jobId} to={`/jobs/${job.jobId}`} className="group bg-white p-6 rounded-3xl border border-zinc-200 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                {job.salary}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
              <p className="text-zinc-500 text-sm font-medium">{job.businessName}</p>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 text-xs font-medium">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto text-zinc-400">
              <Briefcase className="w-10 h-10" />
            </div>
            <p className="text-zinc-500 font-bold">{t('no_jobs')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
