import React from 'react';
import { BookOpen, Phone, MessageSquare, Ticket, Zap, Code, Shield } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Integration Guide</h1>
        <p className="text-slate-500 mt-1">
          Developer documentation for connecting this dashboard to live production systems (Finesse, Teams, BMC).
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <h2 className="text-blue-900 font-semibold mb-2 flex items-center gap-2">
          <Code size={20} /> Developer Architecture Overview
        </h2>
        <p className="text-sm text-blue-800 leading-relaxed mb-4">
          This application currently uses a mocked Context API (`StoreContext`) to simulate data. 
          To make this a fully operational real-time dashboard, a backend service (e.g., Node.js/Express, Python/FastAPI) is required to aggregate data from external APIs and push updates to this frontend via <strong>WebSockets</strong> or <strong>Server-Sent Events (SSE)</strong>.
        </p>
        <p className="text-sm text-blue-800 leading-relaxed">
          The frontend should transition from `initialAgents` to a Redux or Zustand store subscribed to a WebSocket channel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teams Integration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Microsoft Teams (Presence)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4 flex-1">
            Replaces the "Online/Away/Offline" status manually set in this app with real-time presence data from Microsoft Teams.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-auto">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Integration Steps</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li>Register an Azure AD Application to get Client ID & Secret.</li>
              <li>Grant <code>Presence.Read.All</code> application permissions.</li>
              <li>Use the <strong>Microsoft Graph API</strong> endpoint: <code className="bg-slate-200 px-1 rounded">GET /users/{"{id}"}/presence</code></li>
              <li>Set up Microsoft Graph Webhook Subscriptions to receive push notifications when presence changes.</li>
            </ul>
          </div>
        </div>

        {/* Cisco Finesse Integration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Cisco Finesse (Call State)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4 flex-1">
            Detects if an agent is currently "In Call", "Talking", or "Wrap-up" in real-time, overriding the base Teams status.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-auto">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Integration Steps</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li>Connect to Finesse using the <strong>Finesse REST API</strong>.</li>
              <li>Establish an XMPP BOSH (Bidirectional-streams Over Synchronous HTTP) or WebSocket connection to the Finesse Notification Service.</li>
              <li>Subscribe to the generic agent node: <code className="bg-slate-200 px-1 rounded">/finesse/api/User/{"{id}"}</code></li>
              <li>Parse custom presence events (TALKING, READY, NOT_READY).</li>
            </ul>
          </div>
        </div>

        {/* BMC Integration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Ticket size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">BMC Remedy / Helix (Tickets)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4 flex-1">
            Pulls live ticket queues, current assignments, and historical resolution data for QA and Dashboard metrics.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-auto">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Integration Steps</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li>Authenticate via the <strong>BMC REST API</strong> to receive a JWT or RSSO token.</li>
              <li>Query the <code className="bg-slate-200 px-1 rounded">HPD:Help Desk</code> form for incidents.</li>
              <li>Filter by the agent's Assignee Login ID.</li>
              <li>Calculate CSAT and AHT by pulling from related Work Logs and Survey forms.</li>
            </ul>
          </div>
        </div>

        {/* Real-time Data Platform */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Real-Time Sync Platform</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4 flex-1">
            The infrastructure required to merge Teams, Finesse, and BMC into a unified, live dashboard state.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-auto">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Integration Steps</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li>Set up a Redis cache to maintain the "current state" of all agents to avoid hammering APIs.</li>
              <li>Ensure the server implements <code className="bg-slate-200 px-1 rounded">Socket.io</code> or deep integrations to push diffs to the client.</li>
              <li>Update frontend `App.tsx` to handle <code className="bg-slate-200 px-1 rounded">ws.onmessage()</code> to dispatch state updates directly to the Context.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex gap-4 items-start">
        <div className="p-3 bg-slate-100 text-slate-600 rounded-full mt-1">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Security & Permissions</h3>
          <p className="text-sm text-slate-600 mb-3">
            Since this application will process sensitive Service Desk data and active call states, it should implement Single Sign-On (SSO) using SAML or OAuth2 against your corporate identity provider. Roles should be explicitly defined so standard reps cannot access QA tools reserved for coaches.
          </p>
          <button className="text-blue-600 text-sm font-medium hover:underline">Read the security implementation guide &rarr;</button>
        </div>
      </div>
    </div>
  );
}
