import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, Tag, MessageSquare, User, LogOut, Settings, PlusCircle, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ta' : 'en');
  };

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/jobs', icon: Briefcase, label: t('jobs') },
    { path: '/offers', icon: Tag, label: t('offers') },
  ];

  if (user) {
    navItems.push({ path: '/dashboard', icon: Settings, label: t('dashboard') });
    navItems.push({ path: '/chat', icon: MessageSquare, label: t('chat') });
    navItems.push({ path: '/profile', icon: User, label: t('profile') });
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">WorkBridge</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-1 text-sm font-medium text-zinc-600"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'en' ? 'தமிழ்' : 'English'}
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-4 py-2 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              location.pathname === item.path ? "text-indigo-600" : "text-zinc-400"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
