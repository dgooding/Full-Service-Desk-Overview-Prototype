import { HashRouter, Routes, Route } from 'react-router-dom';
import CoachLayout from './layouts/CoachLayout';
import Dashboard from './pages/Dashboard';
import TeamList from './pages/TeamList';
import RepProfile from './pages/RepProfile';
import TicketQA from './pages/TicketQA';
import QADashboard from './pages/QADashboard';
import QAInsightDeepDive from './pages/QAInsightDeepDive';
import QADetail from './pages/QADetail';
import CoachingEmbed from './pages/CoachingEmbed';
import SkillsMatrix from './pages/SkillsMatrix';
import RepSkillEdit from './pages/RepSkillEdit';
import SkillInsightDeepDive from './pages/SkillInsightDeepDive';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SiteFunctionHelp from './pages/SiteFunctionHelp';
import DocArticle from './pages/DocArticle';
import NewRep from './pages/NewRep';
import Reports from './pages/Reports';
import TrainingPath from './pages/TrainingPath';
import NewBenchmark from './pages/NewBenchmark';
import { StoreProvider } from './contexts/StoreContext';
import { Toaster } from 'sonner';

import MetricDeepDive from './pages/MetricDeepDive';

export default function App() {
  return (
    <StoreProvider>
      <Toaster position="top-right" richColors />
      <HashRouter>
        <Routes>
          <Route path="/" element={<CoachLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="training/:id" element={<TrainingPath />} />
            <Route path="team" element={<TeamList />} />
            <Route path="team/new" element={<NewRep />} />
            <Route path="team/:id" element={<RepProfile />} />
            <Route path="metrics/:metricId" element={<MetricDeepDive />} />
            <Route path="team/:id/benchmark/new" element={<NewBenchmark />} />
            <Route path="qa" element={<QADashboard />} />
            <Route path="qa/insights/:insightId" element={<QAInsightDeepDive />} />
            <Route path="qa/new" element={<TicketQA />} />
            <Route path="qa/:qaId" element={<QADetail />} />
            <Route path="coaching" element={<CoachingEmbed />} />
            <Route path="skills" element={<SkillsMatrix />} />
            <Route path="skills/rep/:id" element={<RepSkillEdit />} />
            <Route path="skills/insights/:insightId" element={<SkillInsightDeepDive />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help">
              <Route index element={<Help />} />
              <Route path="functions" element={<SiteFunctionHelp />} />
              <Route path="docs/:docId" element={<DocArticle />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
