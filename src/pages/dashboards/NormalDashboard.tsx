import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Briefcase, Tag, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const NormalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 p-8 rounded-[40px] text-white space-y-4">
        <h1 className="text-3xl font-bold">Hello, {user?.name}!</h1>
        <p className="text-indigo-100 font-medium">Welcome back to WorkBridge. Browse local jobs and exclusive offers from businesses in your area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/jobs" className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-indigo-600 transition-all group space-y-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900">Explore Jobs</h2>
            <p className="text-zinc-500 text-sm">Find the perfect job opportunity that matches your skills.</p>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link to="/offers" className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-indigo-600 transition-all group space-y-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Tag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900">Exclusive Offers</h2>
            <p className="text-zinc-500 text-sm">Get access to special discounts and offers from local businesses.</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            Browse Offers <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Want to find work?</h2>
          <p className="text-zinc-400 text-sm">Switch your role to Helper to start applying for jobs.</p>
        </div>
        <Link to="/profile" className="px-8 py-3 bg-white text-zinc-900 rounded-xl font-bold hover:bg-zinc-100 transition-all">
          Update Profile
        </Link>
      </div>
    </div>
  );
};

export default NormalDashboard;
