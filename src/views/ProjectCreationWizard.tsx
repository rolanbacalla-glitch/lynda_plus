import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCreationWizard: React.FC = () => {
  const [step] = useState(1);
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState<{ type: 'neutral' | 'bias' | 'none', message: string }>({ type: 'none', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (question.length < 10) {
      setAnalysis({ type: 'none', message: '' });
      return;
    }

    // Agentic AI Logic Simulation
    const timer = setTimeout(() => {
      if (question.toLowerCase().includes('how much') || question.toLowerCase().includes('enjoy')) {
        setAnalysis({
          type: 'bias',
          message: 'Potential Bias: "How much" and "Enjoy" assume a positive experience. Try: "What was your experience using this feature?"'
        });
      } else {
        setAnalysis({
          type: 'neutral',
          message: 'Optimal: The question is neutral and open-ended. Ready for collection.'
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [question]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Create New Study</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Step {step} of 3: Research Objective & Intelligence Guardrails</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Study Name</label>
          <input className="input-field" placeholder="e.g. Navigation Usability Audit" />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Primary Research Question</label>
          <textarea 
            className="input-field" 
            rows={4} 
            placeholder="Type your question here. Gemini 1.5 Pro will audit for bias..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          
          {analysis.type !== 'none' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              background: analysis.type === 'bias' ? '#fff1f2' : '#f0fdf4',
              border: `1px solid ${analysis.type === 'bias' ? '#fda4af' : '#86efac'}`,
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.25rem' }}>{analysis.type === 'bias' ? '🕵️' : '🎯'}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: analysis.type === 'bias' ? '#e11d48' : '#16a34a' }}>
                  {analysis.type === 'bias' ? 'Observer Bias Detected' : 'Question Validated'}
                </p>
                <p style={{ fontSize: '0.875rem', color: analysis.type === 'bias' ? '#9f1239' : '#166534', fontWeight: 500 }}>
                  {analysis.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Cancel</button>
          <button className="btn-primary" style={{ padding: '0.6rem 2rem' }}>Continue to Participants</button>
        </div>
      </div>

      <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', border: '1px dashed var(--primary)', opacity: 0.7 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: 'var(--primary)', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '10px' }}>AI</span>
           **Observer Bias Detector (Gemini 1.5 Pro)** is active. We'll automatically ensure your study remains neutral and participant-first.
        </p>
      </div>
    </div>
  );
};

export default ProjectCreationWizard;
