import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Search, Loader2, Heart, MessageCircle, Send, MoreHorizontal, User, Tag, PlusCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

import { motion, AnimatePresence } from 'motion/react';

const Posters: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posters, setPosters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [likes, setLikes] = useState<Record<string, { count: number, liked: boolean }>>({});

  useEffect(() => {
    fetch('/api/posters')
      .then(res => res.json())
      .then(data => {
        setPosters(data);
        // Initialize mock likes
        const initialLikes: Record<string, any> = {};
        data.forEach((p: any) => {
          initialLikes[p.posterId] = { count: Math.floor(Math.random() * 100), liked: false };
        });
        setLikes(initialLikes);
        setIsLoading(false);
      });
  }, []);

  const toggleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: {
        count: prev[id].liked ? prev[id].count - 1 : prev[id].count + 1,
        liked: !prev[id].liked
      }
    }));
  };

  const handleShare = (poster: any) => {
    if (navigator.share) {
      navigator.share({
        title: poster.title,
        text: poster.description,
        url: window.location.origin + `/posters/${poster.posterId}`
      }).catch(console.error);
    } else {
      alert('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.origin + `/posters/${poster.posterId}`);
    }
  };

  const filteredPosters = posters.filter(poster => 
    poster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poster.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poster.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 pb-20"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-zinc-900">Baari Feed</h1>
          <button className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:bg-zinc-200 transition-colors">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Stories Bar */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 relative">
              <User className="w-8 h-8" />
              <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white">
                <PlusCircle className="w-3 h-3" />
              </div>
            </div>
            <span className="text-[10px] font-medium text-zinc-500">Your Story</span>
          </div>
          {posters.slice(0, 6).map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-indigo-600 p-[2px] rounded-full">
                <div className="w-full h-full bg-white rounded-full p-[2px]">
                  <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${p.businessName}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-zinc-900 truncate w-16 text-center">{p.businessName}</span>
            </div>
          ))}
        </div>

        <div className="relative px-4">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search feed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {filteredPosters.length > 0 ? filteredPosters.map((poster, index) => (
            <motion.div 
              key={poster.posterId} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-zinc-200 md:rounded-3xl overflow-hidden shadow-sm"
            >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-fuchsia-600 p-[2px] rounded-full">
                  <div className="w-full h-full bg-white rounded-full p-[2px]">
                    <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-zinc-900 leading-none">{poster.businessName}</p>
                    <CheckCircle className="w-3 h-3 text-indigo-600 fill-indigo-600/10" />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">Sponsored</p>
                </div>
              </div>
              <button className="text-zinc-400 hover:text-zinc-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div 
              className="aspect-square bg-zinc-100 relative cursor-pointer"
              onDoubleClick={() => toggleLike(poster.posterId)}
            >
              <img 
                src={poster.imageUrl} 
                alt={poster.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {poster.price && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
                  {poster.price}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(poster.posterId)}
                    className={cn("transition-all active:scale-125", likes[poster.posterId]?.liked ? "text-red-500 fill-red-500" : "text-zinc-900 hover:text-zinc-600")}
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                  <Link to={`/posters/${poster.posterId}`} className="text-zinc-900 hover:text-zinc-600">
                    <MessageCircle className="w-6 h-6" />
                  </Link>
                  <button onClick={() => handleShare(poster)} className="text-zinc-900 hover:text-zinc-600">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/chat', { state: { contactId: poster.ownerId, contactName: poster.businessName } })}
                  className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  DM Business
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900">{likes[poster.posterId]?.count} likes</p>
                <div className="text-sm leading-relaxed">
                  <span className="font-bold mr-2">{poster.businessName}</span>
                  <span className="text-zinc-700 font-medium">{poster.title}</span>
                  <p className="text-zinc-500 mt-1 line-clamp-2">{poster.description}</p>
                </div>
                <Link 
                  to={`/posters/${poster.posterId}`} 
                  className="text-xs text-zinc-400 font-medium hover:text-zinc-600 transition-colors"
                >
                  View all comments
                </Link>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-2">
                  {new Date(poster.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto text-zinc-400">
              <ImageIcon className="w-10 h-10" />
            </div>
            <p className="text-zinc-500 font-bold">No posts in your feed yet</p>
          </div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Posters;
