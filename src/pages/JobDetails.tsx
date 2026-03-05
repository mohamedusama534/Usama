import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, user, token]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'helper') return;

    setIsApplying(true);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: id }),
      });
      if (res.ok) setApplied(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
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
                  <Clock className="w-4 h-4 text-indigo-500" /> {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {user?.role === 'helper' && (
              <button
                onClick={handleApply}
                disabled={applied || isApplying}
                className={cn(
                  "w-full md:w-auto px-12 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                  applied 
                    ? "bg-emerald-50 text-emerald-600 cursor-default" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                )}
              >
                {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  applied ? <><CheckCircle className="w-5 h-5" /> Applied</> : t('apply')
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-zinc-100">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> {t('description')}
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
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
