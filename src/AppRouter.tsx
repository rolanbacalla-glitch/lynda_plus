import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import App from './App';
import DashboardLayout from './layouts/DashboardLayout';
import ProjectList from './views/ProjectList';
import ProjectCreationWizard from './views/ProjectCreationWizard';
import ParticipantPanel from './views/ParticipantPanel';
import ProjectInsights from './views/ProjectInsights';
import ParticipantRecording from './views/ParticipantRecording';
import Inbox from './views/Inbox';
import Sessions from './views/Sessions';
import Tasks from './views/Tasks';
import Solutions from './views/Solutions';
import StudyPreview from './views/StudyPreview';
import TeamSettings from './views/TeamSettings';
import AgenticSession from './views/AgenticSession';
import RecruitingCampaigns from './views/RecruitingCampaigns';
import Login from './views/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProjectList />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:projectId/insights" element={<ProjectInsights />} />
            <Route path="projects/:projectId/session" element={<AgenticSession />} />
            <Route path="projects/:projectId/record" element={<ParticipantRecording />} />
            <Route path="create" element={<ProjectCreationWizard />} />
            <Route path="preview" element={<StudyPreview />} />
            <Route path="panel" element={<ParticipantPanel />} />
            <Route path="recruitment" element={<RecruitingCampaigns />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="settings/team" element={<TeamSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
