import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ParticipantRecording: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [piiStatus, setPiiStatus] = useState('Idle');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        // Simulate PII masking events
        if (Math.random() > 0.8) {
          setPiiStatus('Masking Detected PII...');
          setTimeout(() => setPiiStatus('Protection Active'), 1500);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="header-section">
        <h1 className="view-title">Participant Session</h1>
        <p className="view-subtitle">Project ID: {projectId} • Real-time Multimodal Feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card glass relative overflow-hidden aspect-video flex items-center justify-center bg-slate-900">
            {/* Simulated Video Feed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full border-4 ${isRecording ? 'border-red-500 animate-pulse' : 'border-slate-700'} mb-4 flex items-center justify-center mx-auto`}>
                  <div className={`w-12 h-12 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                </div>
                <p className="text-slate-400 font-medium">
                  {isRecording ? 'LIVE FEED ACTIVE' : 'CAMERA READY'}
                </p>
              </div>
            </div>

            {/* PII Masking Overlay (Privacy Shield) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className={`badge ${piiStatus.includes('Masking') ? 'badge-warning' : 'badge-success'} flex items-center gap-2 py-2 px-3`}>
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${piiStatus.includes('Masking') ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${piiStatus.includes('Masking') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Privacy Shield: {piiStatus}</span>
              </div>
            </div>

            {/* Recording Stats */}
            {isRecording && (
              <div className="absolute bottom-4 left-4 font-mono text-white text-xl bg-black/50 px-3 py-1 rounded">
                {formatTime(elapsedTime)}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <button 
                className="btn btn-primary px-8"
                onClick={() => {
                  setIsRecording(true);
                  setPiiStatus('Protection Active');
                }}
              >
                Start Session
              </button>
            ) : (
              <button 
                className="btn btn-secondary px-8"
                onClick={() => setIsRecording(false)}
              >
                Stop & Upload
              </button>
            )}
            <button className="btn btn-outline" onClick={() => navigate('/dashboard/projects')}>
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card glass">
            <h3 className="font-bold mb-4 text-slate-800">Intelligence Layer</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-tighter">Security Engine</p>
                <p className="text-sm text-slate-700">Gemini 3.1 Flash is currently masking in-buffer PII (Face, Documents, Screen Content).</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 opacity-50">
                <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-tighter">Synthesis Engine</p>
                <p className="text-sm text-slate-700">Gemini 1.5 Pro will process this stream for "Aha!" moments post-upload.</p>
              </div>
            </div>
          </div>

          <div className="card glass">
            <h3 className="font-bold mb-4 text-slate-800">Session Guardrails</h3>
            <ul className="text-sm space-y-2 text-slate-600">
              <li className="flex gap-2">✅ Biometric data redacted</li>
              <li className="flex gap-2">✅ Background content blurred</li>
              <li className="flex gap-2">✅ Audio voice-scrambling active</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantRecording;
