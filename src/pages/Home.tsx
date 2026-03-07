import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Tag, ArrowRight, Image as ImageIcon, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { motion } from 'motion/react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const portals = [
    {
      title: t('jobs'),
      description: 'Find local hiring opportunities and apply directly to businesses.',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: t('offers'),
      description: 'Discover exclusive deals, discounts, and text-based offers.',
      icon: Tag,
      path: '/offers',
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Business Feed',
      description: 'Browse visual posters, latest updates, and social announcements.',
      icon: ImageIcon,
      path: '/posters',
      color: 'bg-fuchsia-600',
      lightColor: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-600'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16 pb-20"
    >
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative h-[500px] rounded-[40px] overflow-hidden bg-zinc-900 text-white flex items-center px-8 md:px-16 shadow-2xl"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            WELCOME TO WORKBRIDGE
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tighter">
            Connecting <span className="text-indigo-400">Local</span> Businesses.
          </h1>
          <p className="text-xl text-zinc-300 font-medium leading-relaxed">
            The all-in-one platform for jobs, offers, and visual advertisements in your neighborhood.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Portal Grid */}
      <section className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold text-zinc-900">Choose Your Path</h2>
          <p className="text-zinc-500 font-medium">Explore the different ways WorkBridge connects you with your community.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={portal.path} 
                className="group bg-white p-8 rounded-[40px] border border-zinc-200 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500 flex flex-col items-center text-center space-y-6 h-full"
              >
                <div className={`w-20 h-20 ${portal.lightColor} rounded-[28px] flex items-center justify-center ${portal.textColor} group-hover:scale-110 transition-transform duration-500`}>
                  <portal.icon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900">{portal.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    {portal.description}
                  </p>
                </div>
                <div className={`flex items-center gap-2 font-bold text-sm ${portal.textColor} mt-auto`}>
                  Explore Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extra Features */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-600 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="space-y-4 max-w-xl">
          <h2 className="text-3xl font-bold">Real-time Communication</h2>
          <p className="text-indigo-100 font-medium leading-relaxed">
            Message business owners directly from any post. Whether it's a job inquiry or a question about an offer, WorkBridge keeps you connected.
          </p>
          <Link to="/chat" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            <MessageSquare className="w-5 h-5" />
            Open Chat
          </Link>
        </div>
        <div className="w-full md:w-1/3 aspect-video bg-indigo-500/50 rounded-3xl border border-indigo-400/30 flex items-center justify-center">
          <MessageSquare className="w-20 h-20 text-indigo-300/50" />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
