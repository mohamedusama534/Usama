import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Search, MapPin, DollarSign, Clock, ArrowRight, Loader2, Filter, CheckCircle, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    salaryRange: 'all',
    experienceLevel: 'all',
    jobType: 'all',
    closingSoon: false,
  });
  const [sortBy, setSortBy] = useState<'newest' | 'deadline'>('newest');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        // Adding some mock data for filters if they don't exist in the API yet
        const enhancedData = data.map((job: any, index: number) => {
          // Create some varied due dates
          const today = new Date();
          const dueDate = new Date();
          dueDate.setDate(today.getDate() + (index % 5 === 0 ? 2 : 15)); // Some soon, some later
          
          return {
            ...job,
            experienceLevel: job.experienceLevel || ['Entry Level', 'Intermediate', 'Senior'][Math.floor(Math.random() * 3)],
            jobType: job.jobType || ['Full-time', 'Part-time', 'Contract', 'Internship'][Math.floor(Math.random() * 4)],
            salaryCategory: job.salaryCategory || ['0-10k', '10k-25k', '25k-50k', '50k+'][Math.floor(Math.random() * 4)],
            dueDate: job.dueDate || dueDate.toISOString().split('T')[0],
          };
        });
        setJobs(enhancedData);
        setIsLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSalary = filters.salaryRange === 'all' || job.salaryCategory === filters.salaryRange;
    const matchesExperience = filters.experienceLevel === 'all' || job.experienceLevel === filters.experienceLevel;
    const matchesType = filters.jobType === 'all' || job.jobType === filters.jobType;
    
    let matchesClosingSoon = true;
    if (filters.closingSoon) {
      const today = new Date();
      const deadline = new Date(job.dueDate);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesClosingSoon = diffDays <= 3 && diffDays >= 0;
    }

    return matchesSearch && matchesSalary && matchesExperience && matchesType && matchesClosingSoon;
  }).sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filterOptions = {
    salaryRange: [
      { label: 'All Salaries', value: 'all' },
      { label: '₹0 - ₹10k', value: '0-10k' },
      { label: '₹10k - ₹25k', value: '10k-25k' },
      { label: '₹25k - ₹50k', value: '25k-50k' },
      { label: '₹50k+', value: '50k+' },
    ],
    experienceLevel: [
      { label: 'All Experience', value: 'all' },
      { label: 'Entry Level', value: 'Entry Level' },
      { label: 'Intermediate', value: 'Intermediate' },
      { label: 'Senior', value: 'Senior' },
    ],
    jobType: [
      { label: 'All Types', value: 'all' },
      { label: 'Full-time', value: 'Full-time' },
      { label: 'Part-time', value: 'Part-time' },
      { label: 'Contract', value: 'Contract' },
      { label: 'Internship', value: 'Internship' },
    ],
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">{t('jobs')}</h1>
          <p className="text-zinc-500 font-medium">Find your next opportunity in WorkBridge.</p>
        </div>
        
        <div className="flex w-full lg:w-auto gap-3">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search jobs, locations, or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-4 rounded-2xl border transition-all flex items-center gap-2 font-bold text-sm shadow-sm",
              showFilters ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-zinc-200 text-zinc-600 hover:border-indigo-600"
            )}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-bold text-sm text-zinc-600"
          >
            <option value="newest">Newest First</option>
            <option value="deadline">Deadline (Soonest)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full lg:w-72 space-y-8 bg-white p-8 rounded-[40px] border border-zinc-200 h-fit sticky top-24 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-zinc-100 rounded-full">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Salary Range */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Salary Range</h3>
                <div className="space-y-2">
                  {filterOptions.salaryRange.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters({ ...filters, salaryRange: option.value })}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        filters.salaryRange === option.value 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-zinc-500 hover:bg-zinc-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience Level</h3>
                <div className="space-y-2">
                  {filterOptions.experienceLevel.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters({ ...filters, experienceLevel: option.value })}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        filters.experienceLevel === option.value 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-zinc-500 hover:bg-zinc-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Job Type</h3>
                <div className="space-y-2">
                  {filterOptions.jobType.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters({ ...filters, jobType: option.value })}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        filters.jobType === option.value 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-zinc-500 hover:bg-zinc-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closing Soon Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={filters.closingSoon}
                      onChange={() => setFilters({ ...filters, closingSoon: !filters.closingSoon })}
                    />
                    <div className={cn(
                      "w-10 h-6 rounded-full transition-colors",
                      filters.closingSoon ? "bg-indigo-600" : "bg-zinc-200"
                    )} />
                    <div className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                      filters.closingSoon ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 group-hover:text-indigo-600 transition-colors">Closing Soon (3 days)</span>
                </label>
              </div>

              <button 
                onClick={() => setFilters({ salaryRange: 'all', experienceLevel: 'all', jobType: 'all', closingSoon: false })}
                className="w-full py-3 text-xs font-bold text-zinc-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Jobs Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={job.jobId}
              >
                <Link to={`/jobs/${job.jobId}`} className="group bg-white p-8 rounded-[40px] border border-zinc-200 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
                        {job.salary}
                      </span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-wider">
                          {job.jobType}
                        </span>
                        {(() => {
                          const today = new Date();
                          const deadline = new Date(job.dueDate);
                          const diffTime = deadline.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays <= 3 && diffDays >= 0) {
                            return (
                              <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 uppercase tracking-wider animate-pulse">
                                Closing Soon
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <p className="text-zinc-500 text-sm font-medium">{job.businessName}</p>
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-red-500 font-bold">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(job.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-md uppercase">
                        {job.experienceLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm pt-2 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 text-center space-y-6 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <div className="w-24 h-24 bg-zinc-100 rounded-[32px] flex items-center justify-center mx-auto text-zinc-300">
                  <Search className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-zinc-900">No jobs found</p>
                  <p className="text-zinc-500 font-medium">Try adjusting your filters or search term to find what you're looking for.</p>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ salaryRange: 'all', experienceLevel: 'all', jobType: 'all', closingSoon: false });
                  }}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
