import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const AppRouter: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
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
  );
};

export default AppRouter;
