import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Clock, ArrowLeft, Loader2, ShieldCheck, MessageCircle, Send, User, Tag, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

const PosterDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [poster, setPoster] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch('/api/posters');
        const data = await res.json();
        const found = data.find((p: any) => p.posterId === id);
        setPoster(found);
        fetchComments();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoster();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: id,
          postType: 'poster',
          content: newComment
        })
      });
      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleMessageOwner = () => {
    if (!user) return navigate('/login');
    navigate('/chat', { state: { contactId: poster.ownerId, contactName: poster.businessName } });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!poster) return <div className="text-center py-20 text-zinc-500">Poster not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-2xl shadow-zinc-200/50">
          <img 
            src={poster.imageUrl} 
            alt={poster.title} 
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right: Details & Comments */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-zinc-200 p-8 md:p-12 space-y-8 shadow-xl shadow-zinc-200/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900 leading-tight">{poster.title}</h1>
                  <p className="text-zinc-500 font-medium flex items-center gap-1">
                    {poster.businessName} <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {poster.price && (
                  <div className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-bold">
                    <DollarSign className="w-4 h-4" /> {poster.price}
                  </div>
                )}
                <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 text-zinc-600 text-sm font-bold">
                  <Clock className="w-4 h-4 text-indigo-500" /> {new Date(poster.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" /> Description
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{poster.description}</p>
              </div>

              <button
                onClick={handleMessageOwner}
                className="w-full px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Message Owner
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-[40px] border border-zinc-200 p-8 md:p-12 space-y-8 shadow-xl shadow-zinc-200/50">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                Comments ({comments.length})
              </h2>

              {user && (
                <form onSubmit={handlePostComment} className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Post
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="bg-zinc-50 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-zinc-200 rounded-lg flex items-center justify-center text-zinc-500">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-bold text-zinc-900">{comment.userName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center py-8 text-zinc-400 text-sm font-medium">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterDetails;
