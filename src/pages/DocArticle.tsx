import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Anchor } from 'lucide-react';
import { motion } from 'motion/react';

const DOCS_CONTENT = {
  'navigating-executive-dashboard': {
    title: 'Navigating the Executive Dashboard',
    description: 'Learn how to read and interact with the high-level metrics on the Executive Dashboard.',
    content: `## The Overview Header\nAt the top of the Executive Dashboard, you'll find key performance indicators (KPIs) aggregated across all your frontline representatives. These metrics cover Total Reps, Average First Call Resolution (FCR), Average Customer Satisfaction (CSAT), Service Level Agreement (SLA) Compliance, QA Scores, Open Backlog, Escalation Rate, and more. \n\n## The Interactive Charts\nThe main charts offer visualizations of performance over time or across different teams/regions. You can hover over data points in the bar charts or line graphs to see specific values for a given period. Use the timeline filters (if available) to adjust the scope of data being displayed.\n\n## The Representative List\nBelow the charts, there is a comprehensive list of all your IT Service Desk representatives. Each row details their specific KPIs. You can sort this list by clicking on the column headers (e.g., sorting by 'CSAT' to see your highest or lowest performers). Clicking on a specific rep will bring up a snapshot view of their performance, and from there you can navigate to their full profile.`
  },
  'managing-team-operations': {
    title: 'Managing Team Operations & Status',
    description: 'A guide to using the My Team page to organize your staff.',
    content: `## The Team Roster\nThe "My Team" page is your central hub for viewing every agent under your purview. It displays an at-a-glance view of their current status, recent performance tier, and when they were last coached.\n\n## Status Monitoring\nYou can see which agents are currently available, which are in coaching sessions, or offline. This helps with workforce management and ensuring there is enough coverage on the floor.`
  },
  'kpi-calculations': {
    title: 'KPI Calculations',
    description: 'How we calculate key performance metrics on the dashboard.',
    content: `## Overall Performance Score\nOur system calculates an agent's overall score dynamically based on the following weighted formula:\n- **First Call Resolution (FCR)**: 20%\n- **Customer Satisfaction (CSAT)**: 20%\n- **Quality Score (QA)**: 20%\n- **SLA Adherence**: 20%\n- **Time Adherence**: 10%\n- **Ticket Volume (Normalized)**: 10%\n\n## Data Refresh Rates\nMetrics are synced throughout the day in real-time, but performance tiers are calculated nightly.`
  },
  'exporting-reports': {
    title: 'Exporting Reports & CSVs',
    description: 'How to extract your dashboard data into shareable files.',
    content: `## Exporting Data\nOn most dashboard views, especially the Executive Dashboard and QA Reviews, you will see an "Export CSV" or "Print Report" button. Clicking "Export CSV" will immediately download a spreadsheet containing the currently filtered dataset on your screen.\n\n## Using the Data\nThe exported CSV files can be imported into Excel, Google Sheets, or other BI tools (like Tableau or PowerBI) for further proprietary analysis or combined with HR and finance data.`
  },
  'viewing-qa-dashboard': {
    title: 'Viewing the QA Reviews Dashboard',
    description: 'How to navigate the QA auditing tools and check recent evaluations.',
    content: `## The Recent Reviews List\nThe QA Reviews page shows all recent ticket audits performed by coaches or QA specialists. You can see the ticket number, the agent evaluated, the final score, and the date of review.\n\n## Filtering and Search\nUse the search bar to find a specific ticket number or agent name. You can also filter by score ranges to quickly identify calls that failed compliance or need immediate coaching.`
  },
  'how-to-grade-ticket': {
    title: 'How to Grade a Ticket',
    description: 'A step-by-step guide to filling out a QA evaluation.',
    content: `## Starting a Review\nClick the "New Review" button on the QA Reviews page. You will be prompted to enter the Ticket ID and select the agent that handled it.\n\n## The Scorecard\nThe evaluation form is divided into sections such as Greeting, Troubleshooting, Technical Accuracy, and Closing. Rate each section according to your internal rubric. Some sections may have critical "auto-fail" criteria (e.g., failing to verify user identity). \n\n## Leaving Feedback\nAlways leave constructive notes in the text fields provided. These notes will be visible to the agent during their next 1-on-1 coaching session.`
  },
  'tracking-qa-scores': {
    title: 'Tracking QA Scores Over Time',
    description: 'Visualizing QA trends to spot systemic issues.',
    content: `## Trend Charts\nThe QA Dashboard includes trend lines showing the team's average QA score over the past several weeks or months. \n\n## Deep Dives\nIf you see a sudden dip in quality, you can click into that specific week to see which categories (e.g., Technical Accuracy, Soft Skills) caused the drop. This allows you to deploy targeted micro-training to the team.`
  },
  'escalations': {
    title: 'Addressing Escalations',
    description: 'Best practices for managing user ticket escalations.',
    content: `## Escalation Workflows\nWhen a ticket is escalated, it generally indicates a failure in initial tier triage, missing knowledge base documentation, or a critical system error.\n\n## QA and Escalations\nIn the QA module, you can actively flag tickets that resulted in an unexpected escalation. Add action items directly tied to these metrics to ensure reps learn from the escalation path and update their troubleshooting routines.`
  },
  'assessing-skills': {
    title: 'Assessing Skills in the Matrix',
    description: 'How to evaluate and update agent competencies.',
    content: `## The Competency Matrix\nThe Skills Matrix provides a heat-map view of your entire team's proficiency across various technical areas (e.g., Active Directory, Network Troubleshooting, Hardware).\n\n## Updating Skill Levels\nClick on a specific agent or skill cell to update their rating. We use a 1-5 scale (1 = Novice, 3 = Competent, 5 = Expert). When an agent completes a certification or shadows a senior tech, you should update their score here to reflect their new capability.`
  },
  'logging-coaching-sessions': {
    title: 'Logging Coaching Sessions',
    description: 'Recording 1-on-1s and performance conversations.',
    content: `## Creating a Session Record\nNavigate to the Coaching tab and click "Log Session". Select the agent you are meeting with. \n\n## Agenda and Notes\nDocument what was discussed, including reviewing recent QA scores, discussing career goals, or addressing behavioral issues. These logs create a historical record of management and support, which is critical for HR documentation and tracking growth over time.`
  },
  'assigning-action-items': {
    title: 'Assigning Action Items',
    description: 'How to create follow-up tasks for your agents.',
    content: `## During a Session\nWhile logging a coaching session or reviewing a QA ticket, you can assign Action Items to the agent. \n\n## Tracking Completion\nAction items appear on the agent's dashboard as tasks they need to complete (e.g., "Read the updated VPN documentation", "Shadow John for 1 hour on Mac issues"). You can monitor the status of these items from the Coaching Dashboard. An item isn't resolved until the coach verifies it.`
  },
  'viewing-rep-growth': {
    title: 'Viewing Rep Growth Trajectories',
    description: 'Analyzing an agent\'s individual profile to determine promotion readiness.',
    content: `## The Agent Profile\nClicking on an agent's name anywhere in the app will take you to their detailed profile. Here, you can see their historical KPI trends, their current Skills Matrix radar chart, and all past coaching notes.\n\n## Promotion Readiness\nLook for upward trends in CSAT, a steady increase in Skill Matrix levels, and a history of completed Action Items. This holistic view provides the data needed to justify advancements into specialized technical roles or leadership positions.`
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
