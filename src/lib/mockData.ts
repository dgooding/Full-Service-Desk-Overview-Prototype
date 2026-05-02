export const teamMembers = [
  {
    id: "rep-001",
    name: "Alex Johnson",
    role: "Tier 1 Specialist",
    status: "online",
    metrics: {
      csat: 94,
      fcr: 78,
      aht: "6m 12s",
      qaScore: 92,
    },
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "rep-002",
    name: "Samantha Lee",
    role: "Tier 2 Analyst",
    status: "offline",
    metrics: {
      csat: 98,
      fcr: 85,
      aht: "8m 45s",
      qaScore: 97,
    },
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    id: "rep-003",
    name: "Marcus Green",
    role: "Tier 1 Specialist",
    status: "in-call",
    metrics: {
      csat: 82,
      fcr: 65,
      aht: "11m 30s",
      qaScore: 78,
    },
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: "rep-004",
    name: "Priya Patel",
    role: "Tier 1 Specialist",
    status: "online",
    metrics: {
      csat: 89,
      fcr: 72,
      aht: "7m 50s",
      qaScore: 86,
    },
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
  {
    id: "rep-005",
    name: "David Kim",
    role: "Tier 2 Analyst",
    status: "away",
    metrics: {
      csat: 91,
      fcr: 80,
      aht: "9m 10s",
      qaScore: 88,
    },
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
];

export const performanceData = [
  { month: "Jan", csat: 88, qa: 85, target: 90 },
  { month: "Feb", csat: 89, qa: 86, target: 90 },
  { month: "Mar", csat: 91, qa: 88, target: 90 },
  { month: "Apr", csat: 90, qa: 91, target: 90 },
  { month: "May", csat: 93, qa: 94, target: 90 },
  { month: "Jun", csat: 95, qa: 93, target: 90 },
];

export const recentQA = [
  { id: "QA-1004", rep: "Marcus Green", ticket: "INC128945", score: 72, date: "2023-11-02", reviewer: "Coach Dan", status: "needs_review" },
  { id: "QA-1005", rep: "Alex Johnson", ticket: "INC129001", score: 96, date: "2023-11-01", reviewer: "Coach Dan", status: "completed" },
  { id: "QA-1006", rep: "Priya Patel", ticket: "REQ094421", score: 84, date: "2023-10-31", reviewer: "Coach Dan", status: "completed" },
];

export const upcomingSessions = [
  { id: "sess-1", rep: "Marcus Green", type: "Performance Review", date: "Today, 2:00 PM", status: "scheduled" },
  { id: "sess-2", rep: "Samantha Lee", type: "Career Development", date: "Tomorrow, 10:30 AM", status: "scheduled" },
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
