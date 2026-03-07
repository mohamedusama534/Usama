import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Mail, Phone, MapPin, Camera, Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock initial data for fields not in AuthContext
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu',
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'default'}`,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update context if name/email changed
    if (user) {
      login('mock-token', {
        ...user,
        name: formData.name,
        email: formData.email,
      });
    }

    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Profile Settings</h1>
          <p className="text-zinc-500 font-medium">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-zinc-100 border-4 border-white shadow-xl">
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all group-hover:scale-110">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{formData.name}</h2>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{user?.role} Account</p>
            </div>

            <div className="w-full pt-6 border-t border-zinc-100 space-y-4">
              <div className="flex items-center gap-3 text-zinc-500 text-sm">
                <Mail className="w-4 h-4" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{formData.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-indigo-500/20">
            <h3 className="font-bold">WorkBridge Premium</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">Get verified badges, priority support, and unlimited job postings.</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all">
              Upgrade Now
            </button>
          </div>
        </motion.div>

        {/* Right Column: Edit Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSave} className="bg-white p-10 rounded-[40px] border border-zinc-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Changes saved successfully!
                  </motion.div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
