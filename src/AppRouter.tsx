import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ResearchProvider } from './contexts/ResearchContext';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
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
import StudyPreview from './views/StudyPreview';
import TeamSettings from './views/TeamSettings';
import AgenticSession from './views/AgenticSession';
import RecruitingCampaigns from './views/RecruitingCampaigns';
import DriveVault from './views/DriveVault';
import IntegrationsHub from './views/IntegrationsHub';
import AdminConsole from './views/AdminConsole';
import Login from './views/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--sys-surface-canvas)]">
        <div className="w-8 h-8 border-2 border-[var(--sys-outline)] border-t-[var(--sys-primary)] rounded-full animate-spin" />
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ResearchProvider>
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
                  <Route path="drive" element={<DriveVault />} />
                  <Route path="integrations" element={<IntegrationsHub />} />
                  <Route path="recruitment" element={<RecruitingCampaigns />} />
                  <Route path="inbox" element={<Inbox />} />
                  <Route path="sessions" element={<Sessions />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="settings/team" element={<TeamSettings />} />
                  <Route path="admin" element={<AdminConsole />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ResearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;
