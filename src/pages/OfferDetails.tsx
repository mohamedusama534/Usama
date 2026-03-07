import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Tag, Clock, ArrowLeft, Loader2, ShieldCheck, MessageCircle, Send, User } from 'lucide-react';
import { cn } from '../lib/utils';

const OfferDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<any>(null);
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
    const fetchOffer = async () => {
      try {
        const res = await fetch('/api/offers');
        const data = await res.json();
        const found = data.find((o: any) => o.offerId === id);
        setOffer(found);
        fetchComments();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffer();
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
          postType: 'offer',
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
    navigate('/chat', { state: { contactId: offer.ownerId, contactName: offer.businessName } });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!offer) return <div className="text-center py-20 text-zinc-500">Offer not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-xl shadow-zinc-200/50">
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                  <Tag className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">{offer.title}</h1>
                  <p className="text-zinc-500 font-medium flex items-center gap-1">
                    {offer.businessName} <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 text-zinc-600 text-sm font-bold">
                  <Clock className="w-4 h-4 text-indigo-500" /> Expires on {new Date(offer.expiryDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <button
              onClick={handleMessageOwner}
              className="w-full md:w-auto px-12 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              Message Owner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-zinc-100">
            <div className="md:col-span-2 space-y-12">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" /> Offer Details
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{offer.description}</p>
              </div>

              {/* Comments Section */}
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
    </div>
  );
};

export default OfferDetails;
