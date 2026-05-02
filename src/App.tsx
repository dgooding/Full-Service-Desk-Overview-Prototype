/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoachLayout from './layouts/CoachLayout';
import Dashboard from './pages/Dashboard';
import TeamList from './pages/TeamList';
import RepProfile from './pages/RepProfile';
import TicketQA from './pages/TicketQA';
import CoachingSessions from './pages/CoachingSessions';
import SkillsMatrix from './pages/SkillsMatrix';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SiteFunctionHelp from './pages/SiteFunctionHelp';
import { StoreProvider } from './contexts/StoreContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <StoreProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoachLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="team" element={<TeamList />} />
            <Route path="team/:id" element={<RepProfile />} />
            <Route path="qa" element={<TicketQA />} />
            <Route path="coaching" element={<CoachingSessions />} />
            <Route path="skills" element={<SkillsMatrix />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="help/functions" element={<SiteFunctionHelp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
