import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Section {
  id: string;
  type: 'five-second' | 'first-click' | 'survey';
  title: string;
  config: any;
}

const StudyPreview: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  // Mock data
  const mockSections: Section[] = [
    { 
      id: '1', 
      type: 'five-second', 
      title: 'Initial Impression', 
      config: { 
        duration: 5, 
        instructions: 'What was the main value proposition of this page?',
        image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000' 
      } 
    },
    { 
      id: '2', 
      type: 'first-click', 
      title: 'Navigation Task', 
      config: { 
        task: 'Where would you click to find our pricing plans?',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000' 
      } 
    },
    { 
      id: '3', 
      type: 'survey', 
      title: 'Final Feedback', 
      config: { 
        question: 'Any other comments on the clarity of the interface?' 
      } 
    }
  ];

  const sections = mockSections;
  const currentSection = sections[currentSectionIndex];

  // Start the test when the section changes
  useEffect(() => {
    if (currentSection?.type === 'five-second') {
      setShowImage(true);
      setTimeLeft(currentSection.config.duration);
    } else {
      setShowImage(false);
      setTimeLeft(0);
    }
  }, [currentSectionIndex]); // Only trigger on index change

  // Separate timer logic that doesn't trigger the above effect
  useEffect(() => {
    let timer: number | undefined;
    if (showImage && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && showImage) {
      setShowImage(false);
    }
    return () => clearInterval(timer);
  }, [showImage, timeLeft]);

  const handleNext = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentSectionIndex, sections.length]);

  const handleFirstClick = (e: React.MouseEvent) => {
    if (currentSection.type !== 'first-click') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(`First Click Captured: ${x}, ${y}`);
    handleNext();
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-[48px] p-12 text-center max-w-md shadow-2xl animate-in zoom-in duration-500">
           <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-8">
             <span className="material-symbols-rounded text-4xl">check_circle</span>
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Study Complete</h2>
           <p className="text-slate-500 font-medium leading-relaxed mb-10">
             Thank you for your participation. Your insights are helping us build better experiences.
           </p>
           <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
             Back to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 lg:p-12 font-sans">
      {/* Progress Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-600">
            {currentSectionIndex + 1}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display italic">{currentSection.title}</h4>
            <div className="flex gap-1 mt-1">
              {sections.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === currentSectionIndex ? 'w-8 bg-brand-600' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard/create')} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-red-500 transition-all">
          Exit Preview
        </button>
      </div>

      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center">
        {currentSection.type === 'five-second' && (
          <div className="w-full text-center">
            {showImage ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="relative inline-block rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                   <img src={currentSection.config.image} alt="Test" className="max-h-[60vh] object-contain" />
                   <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white font-black text-xl border border-white/20">
                     {timeLeft}
                   </div>
                 </div>
                 <p className="text-2xl font-bold text-slate-600 animate-pulse">Observation in progress...</p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                <h2 className="text-4xl font-bold text-slate-900 font-display">Recall Phase</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">{currentSection.config.instructions}</p>
                <textarea 
                  autoFocus 
                  className="w-full bg-white border-2 border-slate-100 rounded-[32px] p-8 text-lg font-medium focus:border-brand-600 outline-none shadow-sm transition-all"
                  rows={4} 
                  placeholder="Type what you remember..."
                />
                <button onClick={handleNext} className="bg-brand-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-brand-200 hover:bg-brand-700 transition-all scale-110 active:scale-95">
                  Continue Research
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection.type === 'first-click' && (
          <div className="w-full space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">First Click Task</span>
              <h2 className="text-4xl font-bold text-slate-900 font-display leading-tight">{currentSection.config.task}</h2>
              <p className="text-slate-600 font-medium italic">Click the area on the image where you would perform this action.</p>
            </div>
            
            <div 
              onClick={handleFirstClick}
              className="relative rounded-[48px] overflow-hidden shadow-2xl cursor-pointer group border-8 border-white ring-1 ring-slate-200 mx-auto max-w-4xl"
            >
              <img src={currentSection.config.image} alt="Target" className="w-full select-none pointer-events-none" />
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 animate-ping opacity-20" />
              </div>
            </div>
          </div>
        )}

        {currentSection.type === 'survey' && (
          <div className="max-w-2xl w-full space-y-10 animate-in slide-in-from-bottom-8 duration-500 text-center">
             <h2 className="text-5xl font-bold text-slate-900 font-display leading-tight">{currentSection.config.question}</h2>
             <input 
               autoFocus
               className="w-full bg-transparent border-b-4 border-slate-200 py-6 text-2xl font-medium focus:border-brand-600 outline-none transition-all placeholder:text-slate-200" 
               placeholder="Write your response here..." 
             />
             <div className="pt-10">
               <button onClick={handleNext} className="bg-slate-900 text-white px-16 py-5 rounded-[24px] font-bold shadow-2xl hover:bg-slate-800 transition-all text-lg flex items-center gap-3 mx-auto">
                 Finish Study <span className="material-symbols-rounded">rocket_launch</span>
               </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyPreview;
