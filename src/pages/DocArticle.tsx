import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Anchor } from 'lucide-react';
import { motion } from 'motion/react';

const DOCS_CONTENT = {
  'environment-setup': {
    title: 'Environment Setup',
    description: 'Everything you need to set up your team and configure your first performance cycle.',
    content: `## System Requirements\nEnsure that your network meets our connectivity standards for real-time WebSocket syncing. We recommend a high-speed connection for video playback during QA, and firewall rules updated to allow inbound traffic on our API domains.\n\n## Initial Configuration\n1. Login to LeadCoach Admin Portal.\n2. Navigate to Settings -> Organization.\n3. Establish your timezone and data privacy region settings.\n4. Invite your initial coach roster through the Team directory.`
  },
  'defining-benchmarks': {
    title: 'Defining Benchmarks',
    description: 'Set your team up for success by building consistent operational goals.',
    content: `## Baseline Assessment\nBefore establishing targets, run a 30-day baseline assessment on the QA audit module to see the natural distribution of scores. \n\n## Target Setting\nWe recommend starting with industry averages for initial targets:\n- **CSAT**: 85% Minimal, 92% Target\n- **AHT (Average Handle Time)**: Service desk specific. Typical is 7m 30s.\n- **First Contact Resolution (FCR)**: Target >75% for basic issues.\n\nUse the settings panel to commit these figures, which will update the Global Performance Dashboard.`
  },
  'team-onboarding': {
    title: 'Team Onboarding',
    description: 'Adding agents to the directory and initializing them into the workflow.',
    content: `## Add a New Agent\nGo to the **My Team** section and click "Add Agent". Enter their details (Name, Role, Department). \nOnce added, they will appear in the registry, and you can proceed to assess their baseline skills matrix.\n\n## Initial Skills Evaluation\nWe recommend standardizing skill competency levels between 1-5 where:\n1 - Novice (Needs immediate support)\n3 - Competent (Handles most calls without escalation)\n5 - Expert (SME level, mentor candidate)`
  },
  'focus-mode': {
    title: 'Focus Mode Guide',
    description: 'Use focus mode during live 1-on-1 coaching for optimal attention.',
    content: `When Focus Mode is activated (via the top Navigation Bar), the platform will dim external distractions, suppress non-critical dashboard notifications, and isolate active coaching metrics to keep the conversation centered on outcome alignment.\n\nYou can customize which metrics stay highlighted during Focus Mode in the Coach Settings panel.`
  },
  'webhooks-signal-sync': {
    title: 'Webhooks & Signal Sync',
    description: 'Real-time state synchronization via RESTful webhooks.',
    content: `## Endpoint Configuration\nTo listen for real-time QA and Coaching events, configure your Receiving Endpoint in the developer settings. We support standard \`POST\` payloads using JSON formatting.\n\n## Included Events\n- \`qa.audit.completed\`: Fired when a QA score is recorded.\n- \`session.scheduled\`: Fired when a new 1-on-1 session is booked.\n- \`agent.status.changed\`: Useful for WFM integration (Online, Offline, In-Call).`
  },
  'auth-tokens': {
    title: 'Auth Tokens',
    description: 'Securing the LeadCoach API infrastructure.',
    content: `We utilize OAuth 2.0 and JWT (JSON Web Tokens) for authenticating machine-to-machine requests. \nAlways pass your Bearer token in the Authorization header:\n\`Authorization: Bearer <your-token-here>\`\n\nTokens rotate every 24 hours. Ensure your integration client requests a refresh token appropriately to prevent connection drops.`
  },
  'payload-schemas': {
    title: 'Payload Schemas',
    description: 'The JSON structure of LeadCoach integration resources.',
    content: `All response payloads adhere to top-level key standard wrapping, e.g.,\n\`{\n  "data": { ... },\n  "meta": { "timestamp": "..." }\n}\`\n\nSchema definitions are rigidly typed. Any updates to definitions will be communicated 60 days before deprecation of the older schema version.`
  },
  'rate-limit-control': {
    title: 'Rate Limit Control',
    description: 'Understanding enterprise throughput guarantees.',
    content: `Rate limits are assessed periodically during heavy traffic:\n- **Standard Tier**: 100 requests / minute\n- **Enterprise Tier**: 1,000 requests / minute\n\nWhen rate limited, the API will throw a \`429 Too Many Requests\` response. Follow the \`Retry-After\` header hints to properly queue back-off requests.`
  },
  'data-retention': {
    title: 'Data Retention Policy',
    description: 'Compliance and archiving for historical team data.',
    content: `LeadCoach retains all QA scorecards and agent profile metadata for 7 years by default, conforming with standard financial and healthcare operational reporting policies. \n\nVoice/Screen recordings (if attached via an external CDN) are governed by your third-party CDN's retention cycle.`
  },
  'rbac-matrix': {
    title: 'RBAC Matrix',
    description: 'Role-Based Access Control and permission tiers.',
    content: `The RBAC architecture operates primarily on 3 roles:\n1. **Agent**: Read-only access focused on their own profile and coaching plans.\n2. **Coach**: Write access to sessions, QA reviews, and team metadata.\n3. **Admin**: Read/Write for system settings, billing, API controls, and user lifecycle operations.\n\nRoles can be adjusted via the Admin Portal under "User Provisioning".`
  },
  'audit-journal': {
    title: 'Audit Journal',
    description: 'Indelible logging of system actions.',
    content: `Every write operation (QA completion, skill level change, user role swap) is securely logged in the append-only Audit Journal. \n\nYou can export the past 90 days of Audit Logs using the Reporting dashboard formatted as a CSV. For security compliance purposes, this history cannot be manually altered or erased.`
  },
  'encryption-headers': {
    title: 'Encryption Headers',
    description: 'In-transit and static database cryptography.',
    content: `All data transmitted is secured using TLS 1.3 across the wire. \nAt rest, agent databases, QA records, and session notes use AES-256 block encryption. \nFor enterprise deployments, Custom KMS (Key Management Systems) can be bound to your storage cluster.`
  }
};

export default function DocArticle() {
  const { docId } = useParams();
  const doc = DOCS_CONTENT[docId as keyof typeof DOCS_CONTENT];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [docId]);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Article Not Found</h2>
        <Link to="/help" className="text-brand-600 font-bold hover:underline">Return to Docs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/help" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest mb-10">
        <ChevronLeft size={16} />
        Back to Library
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{doc.title}</h1>
        </div>
        
        <p className="text-lg font-medium text-slate-500 leading-relaxed mb-10 pb-10 border-b border-slate-100">
          {doc.description}
        </p>

        <div className="prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 hover:prose-a:text-brand-700 max-w-none">
          {doc.content.split('\\n\\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return (
                <div key={i} className="flex items-center gap-2 group mt-8 mb-4">
                  <h2 className="text-2xl text-slate-800 m-0">{paragraph.replace('## ', '')}</h2>
                  <Anchor size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={i} className="my-4 space-y-2 list-disc pl-5">
                  {paragraph.split('\\n').map((item, j) => (
                    <li key={j} className="text-slate-600" dangerouslySetInnerHTML={{ __html: item.replace('- ', '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') }} />
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('\`') && paragraph.endsWith('\`')) {
               return (
                  <pre key={i} className="bg-slate-900 text-slate-30 p-4 rounded-2xl overflow-x-auto my-6 text-sm whitespace-pre-wrap text-blue-200">
                    <code>{paragraph.replaceAll('\`', '')}</code>
                  </pre>
               )
            }
            return (
              <p key={i} className="text-slate-600 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\\`(.*?)\\\`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-brand-700 font-mono text-sm">$1</code>') }} />
            );
          })}
        </div>
      </motion.div>
      
      <div className="flex justify-between items-center mt-8 py-8 border-t border-slate-200">
        <p className="text-sm font-bold text-slate-400">Was this article helpful?</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Yes</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">No</button>
        </div>
      </div>
    </div>
  );
}
