export const teamMembers = [
  {
    id: "rep-001",
    name: "Alex Johnson",
    role: "IT Service Desk T1",
    status: "online",
    metrics: {
      csat: 94,
      fcr: 78,
      aht: "6m 12s",
      qaScore: 92,
    },
    skills: { "ETS": 4, "Agent": 2, "Claims": 1, "Property": 0, "Fleet": 3, "Cloud (Azure/AWS)": 4, "Identity (AD/Okta)": 5 },
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "rep-002",
    name: "Samantha Lee",
    role: "IT Service Desk T1",
    status: "offline",
    metrics: {
      csat: 98,
      fcr: 85,
      aht: "8m 45s",
      qaScore: 97,
    },
    skills: { "ETS": 1, "Agent": 5, "Claims": 4, "Property": 2, "Fleet": 0, "Cloud (Azure/AWS)": 3, "Identity (AD/Okta)": 4 },
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    id: "rep-003",
    name: "Marcus Green",
    role: "IT Service Desk T1",
    status: "in-call",
    metrics: {
      csat: 82,
      fcr: 65,
      aht: "11m 30s",
      qaScore: 78,
    },
    skills: { "ETS": 0, "Agent": 2, "Claims": 1, "Property": 4, "Fleet": 2, "Cloud (Azure/AWS)": 1, "Identity (AD/Okta)": 2 },
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: "rep-004",
    name: "Priya Patel",
    role: "IT Service Desk T1",
    status: "online",
    metrics: {
      csat: 89,
      fcr: 72,
      aht: "7m 50s",
      qaScore: 86,
    },
    skills: { "ETS": 5, "Agent": 4, "Claims": 5, "Property": 3, "Fleet": 4, "Cloud (Azure/AWS)": 5, "Identity (AD/Okta)": 5 },
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
  {
    id: "rep-005",
    name: "David Kim",
    role: "IT Service Desk T1",
    status: "away",
    metrics: {
      csat: 91,
      fcr: 80,
      aht: "9m 10s",
      qaScore: 88,
    },
    skills: { "ETS": 2, "Agent": 3, "Claims": 0, "Property": 5, "Fleet": 5, "Cloud (Azure/AWS)": 2, "Identity (AD/Okta)": 3 },
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
];

export const performanceData = [
  { month: "Jan", csat: 88, qa: 85, coachingHours: 12, target: 90 },
  { month: "Feb", csat: 89, qa: 86, coachingHours: 18, target: 90 },
  { month: "Mar", csat: 91, qa: 88, coachingHours: 35, target: 90 },
  { month: "Apr", csat: 90, qa: 91, coachingHours: 42, target: 90 },
  { month: "May", csat: 93, qa: 94, coachingHours: 38, target: 90 },
  { month: "Jun", csat: 95, qa: 96, coachingHours: 45, target: 90 },
];

export const recentQA = [
  { 
    id: "QA-1004", rep: "Marcus Green", ticket: "INC128945", score: 72, date: "2023-11-02", reviewer: "Coach Dan", status: "needs_review",
    details: { opening: 80, authenticating: 100, listening: 60, technical: 75, closing: 60, logging: 50 },
    categoryNotes: { opening: "A bit rushed but covered all points.", listening: "Interrupted the customer twice.", technical: "Missed the secondary reboot step.", logging: "Did not categorize correctly in ServiceNow." },
    notes: "Marcus sounded very rushed during this interaction. Failed to properly acknowledge the user's frustration regarding the recurring software crash. Needs coaching on active listening and empathy markers."
  },
  { 
    id: "QA-1005", rep: "Alex Johnson", ticket: "INC129001", score: 96, date: "2023-11-01", reviewer: "Coach Dan", status: "completed",
    details: { opening: 100, authenticating: 100, listening: 100, technical: 95, closing: 90, logging: 100 },
    notes: "Excellent call. Alex handled the escalated VPN issue perfectly, verified identity swiftly, and provided a comprehensive explanation of the security certificate error."
  },
  { 
    id: "QA-1006", rep: "Priya Patel", ticket: "REQ094421", score: 84, date: "2023-10-31", reviewer: "Coach Dan", status: "completed",
    details: { opening: 90, authenticating: 100, listening: 90, technical: 80, closing: 85, logging: 90 },
    notes: "Good overall interaction handling the hardware request. Could have offered more proactive suggestions regarding the laptop deployment timeline, but all technical requirements were met."
  },
];

export const initialGoals = [
  {
    id: "goal-1",
    repId: "rep-001",
    description: "Reduce AHT by utilizing Knowledge Base shortcuts.",
    targetMetric: "AHT < 6m 00s",
    progressValue: 75,
    status: "On Track"
  },
  {
    id: "goal-2",
    repId: "rep-001",
    description: "Improve FCR on VPN related tickets.",
    targetMetric: "FCR > 85%",
    progressValue: 40,
    status: "Needs Attention"
  },
  {
    id: "goal-3",
    repId: "rep-003",
    description: "Improve empathetic greetings on frustrated user calls.",
    targetMetric: "QA Score > 85",
    progressValue: 20,
    status: "Needs Attention"
  }
];

export const initialNotes = [
  {
    id: "note-1",
    repId: "rep-001",
    content: "Alex is doing well with customer greetings but struggles with finding the right KB for VPN issues. Suggested shadowing Tier 2 for 30 minutes next week.",
    date: "2023-11-05",
    followUpDate: "2023-11-12",
    author: "Coach Dan"
  },
  {
    id: "note-2",
    repId: "rep-003",
    content: "Marcus seems burnt out this week. Had a good chat about taking proper breaks. Will check in again next Tuesday.",
    date: "2023-11-03",
    followUpDate: "2023-11-07",
    author: "Coach Dan"
  }
];

export const initialCommunications = [
  {
    id: "comm-1",
    agentId: "rep-003",
    agentName: "Marcus Green",
    type: "Teams Chat",
    subject: "QA Performance Alert: Critical Score on INC128945",
    date: "2026-05-05 09:12 AM",
    status: "Sent"
  },
  {
    id: "comm-2",
    agentId: "rep-001",
    agentName: "Alex Johnson",
    type: "Outlook Invite",
    subject: "VPN Module Mastery Check-in",
    date: "2026-05-06 11:30 AM",
    status: "Scheduled"
  },
  {
    id: "comm-3",
    agentId: "rep-003",
    agentName: "Marcus Green",
    type: "1:1 Sync",
    subject: "Burnout Wellness Check",
    date: "2026-05-04 03:20 PM",
    status: "Delivered"
  }
];
