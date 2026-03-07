import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, ArrowLeft, Loader2, ShieldCheck, MessageCircle, Send, User, XCircle, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [applied, setApplied] = useState(false);
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
    const fetchJob = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        const found = data.find((j: any) => j.jobId === id);
        setJob(found);
        
        if (user?.role === 'helper' && token) {
          const appsRes = await fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } });
          const appsData = await appsRes.json();
          setApplied(appsData.some((a: any) => a.jobId === id));
        }
        fetchComments();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, user, token]);

  const handleApply = async (withProfile: boolean = false) => {
    if (!user) return navigate('/login');
    if (user.role !== 'helper') return;

    setIsApplying(true);
    try {
      const profileSnapshot = withProfile ? {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      } : null;

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: id, profileSnapshot }),
      });
      if (res.ok) {
        setApplied(true);
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

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
          postType: 'job',
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
    navigate('/chat', { state: { contactId: job.ownerId, contactName: job.businessName } });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!job) return <div className="text-center py-20 text-zinc-500">Job not found</div>;

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
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">{job.title}</h1>
                  <p className="text-zinc-500 font-medium flex items-center gap-1">
                    {job.businessName} <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 text-zinc-600 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-indigo-500" /> {job.location}
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-bold">
                  <DollarSign className="w-4 h-4" /> {job.salary}
                </div>
                <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 text-zinc-600 text-sm font-bold">
                  <Clock className="w-4 h-4 text-indigo-500" /> Posted: {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="px-4 py-2 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-sm font-bold">
                  <Clock className="w-4 h-4" /> Deadline: {new Date(job.dueDate || job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {user?.role === 'helper' && (
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleApply(false)}
                  disabled={applied || isApplying}
                  className={cn(
                    "w-full px-12 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    applied 
                      ? "bg-emerald-50 text-emerald-600 cursor-default" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  )}
                >
                  {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    applied ? <><CheckCircle className="w-5 h-5" /> Applied</> : t('apply')
                  )}
                </button>
                
                {!applied && (
                  <button
                    onClick={() => setShowProfileModal(true)}
                    disabled={isApplying}
                    className="w-full px-12 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 border border-indigo-100"
                  >
                    <User className="w-5 h-5" />
                    Apply with Profile
                  </button>
                )}

                <button
                  onClick={handleMessageOwner}
                  className="w-full px-12 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  Message Owner
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showProfileModal && (
              <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h2 className="text-2xl font-bold text-zinc-900">Apply with Profile</h2>
                    <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                      <XCircle className="w-6 h-6 text-zinc-400" />
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <p className="text-zinc-500 font-medium">The following information from your profile will be shared with the employer:</p>
                    
                    <div className="space-y-4 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</p>
                          <p className="font-bold text-zinc-900">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                          <p className="font-bold text-zinc-900">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</p>
                          <p className="font-bold text-zinc-900">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                          <p className="font-bold text-zinc-900">{user.location || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApply(true)}
                        disabled={isApplying}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                      >
                        {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-zinc-100">
            <div className="md:col-span-2 space-y-12">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> {t('description')}
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
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

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> {t('skills')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.split(',').map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

export default JobDetails;
