import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Tag, MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
    fetch('/api/offers').then(res => res.json()).then(setOffers);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden bg-indigo-900 text-white flex items-center px-8 md:px-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-xl text-indigo-100 font-light">
            Connecting local businesses with skilled helpers in Tamil Nadu. Find your next opportunity or hire the best talent today.
          </p>
          <div className="flex gap-4">
            <Link to="/jobs" className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2">
              {t('search_jobs')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            {t('jobs')}
          </h2>
          <Link to="/jobs" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? jobs.slice(0, 6).map((job) => (
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
            <div className="col-span-full py-12 text-center text-zinc-500 font-medium">
              {t('no_jobs')}
            </div>
          )}
        </div>
      </section>

      {/* Featured Offers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            {t('offers')}
          </h2>
          <Link to="/offers" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.length > 0 ? offers.slice(0, 6).map((offer) => (
            <div key={offer.offerId} className="bg-white p-6 rounded-3xl border border-zinc-200 border-l-4 border-l-indigo-600 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{offer.title}</h3>
                  <p className="text-zinc-500 text-xs">{offer.businessName}</p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm line-clamp-2">{offer.description}</p>
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400">
                <span className="uppercase tracking-widest">Expires</span>
                <span className="text-indigo-600">{new Date(offer.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-zinc-500 font-medium">
              {t('no_offers')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
