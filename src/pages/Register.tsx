import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, Briefcase, UserCheck, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'normal' as 'business' | 'helper' | 'normal',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'normal', icon: Globe, label: t('normal'), desc: 'Browse jobs and offers' },
    { id: 'helper', icon: UserCheck, label: t('helper'), desc: 'Find and apply for jobs' },
    { id: 'business', icon: Briefcase, label: t('business'), desc: 'Post jobs and hire talent' },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900">{t('signup')}</h1>
        <p className="text-zinc-500">Join the WorkBridge community today</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-700 ml-1">{t('role_selection')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setFormData({ ...formData, role: role.id as any })}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all space-y-2",
                  formData.role === role.id 
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10" 
                    : "border-zinc-100 hover:border-zinc-200 bg-zinc-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  formData.role === role.id ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-500"
                )}>
                  <role.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{role.label}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium leading-tight">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Chennai, Tamil Nadu"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-zinc-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('signup')} <ArrowRight className="w-5 h-5" /></>}
        </button>

        <p className="text-center text-sm text-zinc-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            {t('login')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
