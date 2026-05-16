import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ChevronLeft, ChevronRight, Send, AlertCircle, CheckCircle, Award, Trophy, Users, Zap } from 'lucide-react';
import { tracker } from '../services/activityTracker';
import { socketService } from '../services/socketService';

const ExamSession = ({ userExamId, examId, setView, setUserExamId, user }) => {
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [liveScores, setLiveScores] = useState([]);
  const timerRef = useRef(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      loadSession();
      hasLoaded.current = true;
    }

    const socket = socketService.connect();
    
    socketService.onActiveUsers((data) => {
      setActiveCount(data.count);
    });

    socketService.onNewScore((data) => {
      setLiveScores(prev => [data, ...prev].slice(0, 5));
    });

    return () => {
      clearInterval(timerRef.current);
      if (examId) socketService.leaveExam(examId, user?.id);
    };
  }, []);

  const loadSession = async () => {
    setLoading(true);
    try {
      let data;
      if (userExamId) {
        const res = await fetch(`/api/portal/exams/session/${userExamId}`);
        if (res.ok) data = await res.json();
        else setError('Failed to load session');
      } else if (examId) {
        const csrfToken = document.cookie.split('; ').find(row => row.trim().startsWith('csrf_access_token='))?.split('=')[1];
        const res = await fetch(`/api/portal/exams/${examId}/start`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          }
        });
        if (res.ok) {
          data = await res.json();
          if (data.id) setUserExamId(data.id);
        } else {
          const errData = await res.json();
          setError(errData.msg || 'Failed to start session');
        }
      }

      if (data) {
        initializeSession(data);
        socketService.joinExam(data.exam_id, user?.id, user?.email?.split('@')[0]);
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const initializeSession = (data) => {
    setSession(data);
    setTimeLeft(data.duration_minutes * 60);
    startTimer();
    tracker.custom('exam_started', `Initiated assessment: ${data.title}`, 'Exam Attended');
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => {
      const updated = { ...prev, [questionId]: value };
      // Real-time progress update
      const progress = Math.round((Object.keys(updated).length / session.questions.length) * 100);
      socketService.updateProgress(session.exam_id, user?.id, progress);
      return updated;
    });
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm('You are about to finalize your assessment. Continue?')) return;
    
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrf_access_token='))?.split('=')[1];
      const res = await fetch(`/api/portal/exams/session/${userExamId}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ responses })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        socketService.examFinished(session.exam_id, user?.id, data.score, user?.email?.split('@')[0]);
        tracker.custom('exam_completed', `Completed assessment: ${session.title} with score ${data.score}%`, 'Exam Completed');
      }
    } catch (err) {
      alert('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm w-full">
        <div className="mb-8 relative inline-flex">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative z-10 p-6 bg-white rounded-[32px] border border-slate-100 shadow-xl">
            <Timer size={48} className="text-primary animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Preparing Assessment</h2>
        <p className="text-slate-500 font-medium mb-8">Securely initializing your certification module...</p>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-primary" />
        </div>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
       <div className="p-6 bg-rose-50 text-rose-600 rounded-[32px] mb-6">
         <AlertCircle size={48} />
       </div>
       <h2 className="text-2xl font-black text-slate-900 mb-2">Initialization Failed</h2>
       <p className="text-slate-500 font-medium mb-8">{error}</p>
       <button onClick={() => setView('exam_center')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl">Return to Center</button>
    </div>
  );

  if (!session) return null;

  if (result) return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative z-10 inline-flex p-8 bg-white text-primary rounded-[48px] mb-8 shadow-2xl">
            <Trophy size={80} />
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Assessment Finalized</h1>
        <p className="text-slate-500 font-medium mb-12">Results processed with real-time validation.</p>
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Final Score</div>
            <div className={`text-4xl font-black ${result.score >= 50 ? 'text-emerald-500' : 'text-rose-500'}`}>{result.score}%</div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Accuracy</div>
            <div className="text-4xl font-black text-slate-900">{result.correct}/{result.total}</div>
          </div>
        </div>
        <button onClick={() => setView('exam_center')} className="w-full py-5 bg-primary text-white rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all">Return to Dashboard</button>
      </motion.div>
    </div>
  );

  const currentQuestion = session.questions[currentIdx];
  const progress = ((currentIdx + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Real-time Side Panel */}
      <div className="hidden lg:flex w-80 bg-white border-r border-slate-200 flex-col p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Attendance</div>
              <div className="text-xl font-black text-slate-900">{activeCount} Users Active</div>
            </div>
          </div>
          
          <div className="space-y-3">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Live Updates</div>
             <AnimatePresence>
               {liveScores.map((s, i) => (
                 <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Zap size={14} className="text-primary" />
                     <span className="text-xs font-bold text-slate-700">{s.name}</span>
                   </div>
                   <span className="text-xs font-black text-emerald-500">{s.score}%</span>
                 </motion.div>
               ))}
               {liveScores.length === 0 && (
                 <div className="text-xs font-medium text-slate-400 italic">Waiting for submissions...</div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-24 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900 tracking-tight leading-tight">{session.title}</h2>
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                Phase • {currentIdx + 1} / {session.questions.length}
              </div>
            </div>
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-mono font-black ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-100' : 'bg-slate-900 text-white shadow-xl shadow-slate-200'}`}>
              <Timer size={20} />
              <span className="text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 pt-20">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="min-h-[400px] flex flex-col">
              <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                {currentQuestion.type} Assessment
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{currentQuestion.question_text}</h3>
              <div className="flex-1 space-y-4">
                {currentQuestion.type === 'MCQ' && currentQuestion.options.map((opt, i) => (
                  <button key={opt.id} onClick={() => handleResponseChange(currentQuestion.id, opt.id)} className={`w-full p-6 text-left rounded-[28px] border-2 transition-all flex items-center justify-between group ${responses[currentQuestion.id] === opt.id ? 'border-primary bg-primary/5 text-slate-900' : 'border-slate-100 hover:border-primary/20 bg-white text-slate-600 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-colors ${responses[currentQuestion.id] === opt.id ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + i)}</div>
                      <span className="font-bold text-lg">{opt.option_text}</span>
                    </div>
                    {responses[currentQuestion.id] === opt.id && <CheckCircle size={24} className="text-primary" />}
                  </button>
                ))}
                {currentQuestion.type === 'True/False' && (
                  <div className="grid grid-cols-2 gap-6">
                    {['True', 'False'].map(val => (
                      <button key={val} onClick={() => handleResponseChange(currentQuestion.id, val)} className={`p-10 rounded-[40px] border-2 font-black text-2xl text-center transition-all ${responses[currentQuestion.id] === val ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-primary/20 bg-white text-slate-400 shadow-sm'}`}>{val}</button>
                    ))}
                  </div>
                )}
                {currentQuestion.type === 'Fill in the Blank' && (
                  <div className="relative">
                    <input type="text" className="w-full p-8 bg-white border-2 border-slate-100 rounded-[32px] focus:border-primary outline-none transition-all font-black text-2xl text-slate-900 shadow-sm" placeholder="Type answer..." value={responses[currentQuestion.id] || ''} onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)} />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200"><Send size={24} /></div>
                  </div>
                )}
              </div>
              <div className="mt-20 flex items-center justify-between pb-20">
                <button onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0} className="flex items-center gap-3 text-slate-400 font-black uppercase text-xs tracking-widest disabled:opacity-0 transition-opacity"><ChevronLeft size={20} /> Previous</button>
                {currentIdx === session.questions.length - 1 ? (
                  <button onClick={() => handleSubmit()} disabled={submitting} className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 hover:bg-primary shadow-xl transition-all active:scale-[0.98]">{submitting ? 'Submitting...' : <><Send size={20} /> Finish Exam</>}</button>
                ) : (
                  <button onClick={() => setCurrentIdx(prev => Math.min(session.questions.length - 1, prev + 1))} className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 hover:bg-primary transition-all group shadow-xl">Next <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;
