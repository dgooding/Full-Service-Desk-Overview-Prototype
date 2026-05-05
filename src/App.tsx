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
import ActionItems from './pages/ActionItems';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ExecutiveRepList from './pages/ExecutiveRepList';
import CoachingSessionDetail from './pages/CoachingSessionDetail';
import SkillsMatrix from './pages/SkillsMatrix';
import RepSkillEdit from './pages/RepSkillEdit';
import SkillInsightDeepDive from './pages/SkillInsightDeepDive';
import SkillInventory from './pages/SkillInventory';
import SkillDetailedStats from './pages/SkillDetailedStats';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SiteFunctionHelp from './pages/SiteFunctionHelp';
import DocArticle from './pages/DocArticle';
import NewRep from './pages/NewRep';
import Reports from './pages/Reports';
import SummaryReport from './pages/SummaryReport';
import TrainingPath from './pages/TrainingPath';
import NewBenchmark from './pages/NewBenchmark';
import FeatureRequests from './pages/FeatureRequests';
import MetricDeepDive from './pages/MetricDeepDive';
import SystemEvolution from './pages/SystemEvolution';
import { StoreProvider } from './contexts/StoreContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <StoreProvider>
      <Toaster position="top-right" richColors />
      <HashRouter>
        <Routes>
          <Route path="/" element={<CoachLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="executive" element={<ExecutiveDashboard />} />
            <Route path="executive/summary" element={<SummaryReport />} />
            <Route path="executive/reps" element={<ExecutiveRepList />} />
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
            <Route path="coaching/action-items" element={<ActionItems />} />
            <Route path="coaching/sessions/:sessionId" element={<CoachingSessionDetail />} />
            <Route path="skills" element={<SkillsMatrix />} />
            <Route path="skills/rep/:id" element={<RepSkillEdit />} />
            <Route path="skills/inventory" element={<SkillInventory />} />
            <Route path="skills/taxonomy/:skillId" element={<SkillDetailedStats />} />
            <Route path="skills/insights/:insightId" element={<SkillInsightDeepDive />} />
            <Route path="requests" element={<FeatureRequests />} />
            <Route path="settings" element={<Settings />} />
            <Route path="evolution" element={<SystemEvolution />} />
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
