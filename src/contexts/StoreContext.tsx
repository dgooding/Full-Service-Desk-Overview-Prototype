import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  teamMembers as initialAgents, 
  recentQA as initialQA, 
  performanceData, 
  initialGoals, 
  initialNotes,
  initialCommunications
} from '../lib/mockData';
import { generateExecutiveData, ExecutiveRep } from '../lib/executiveData';

export type Agent = typeof initialAgents[0] & {
  skills?: Record<string, number>;
};

export type QAReview = {
  id: string;
  repId: string;
  repName: string;
  ticket: string;
  score: number;
  date: string;
  reviewer: string;
  status: 'draft' | 'completed' | 'needs_review';
  details?: Record<string, number>;
  categoryNotes?: Record<string, string>;
  notes?: string;
};

export type Goal = typeof initialGoals[0];
export type Note = typeof initialNotes[0];

export type RequestItem = {
  id: string;
  title: string;
  description: string;
  type: 'Feature' | 'Report';
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string;
  requester: string;
  votes: number;
};

export type Communication = {
  id: string;
  agentId: string;
  agentName: string;
  type: 'Teams Chat' | 'Outlook Invite' | 'Email' | '1:1 Sync';
  subject: string;
  date: string;
  status: 'Sent' | 'Scheduled' | 'Delivered';
};

const initialRequests: RequestItem[] = [
  {
    id: 'REQ-001',
    title: 'Add AHT vs CSAT Correlation Chart',
    description: 'We need a scatter plot showing if longer handle times are positively or negatively impacting CSAT scores across Tier 1 teams.',
    type: 'Report',
    status: 'Completed',
    date: '2026-04-15',
    requester: 'David Thompson',
    votes: 12
  },
  {
    id: 'REQ-002',
    title: 'Real-time Chat Integration',
    description: 'Allow managers to directly Slack/Teams message agents from the Team View without leaving the application.',
    type: 'Feature',
    status: 'In Progress',
    date: '2026-04-28',
    requester: 'Sia Miller',
    votes: 8
  },
  {
    id: 'REQ-003',
    title: 'Weekly Automated Email Summaries',
    description: 'Send a generated PDF report to region leaders every Monday morning detailing previous week SLA performance.',
    type: 'Feature',
    status: 'Pending',
    date: '2026-05-02',
    requester: 'Elena Vasquez',
    votes: 5
  },
  {
    id: 'REQ-005',
    title: 'Build a new page for All Communications/Reminders',
    description: 'Centralized log of all Teams chats, Outlook invites, and leadership reachouts.',
    type: 'Feature',
    status: 'Completed',
    date: '2026-05-05',
    requester: 'Coach Daniel',
    votes: 1
  }
];

interface StoreContextType {
  agents: Agent[];
  qaReviews: QAReview[];
  performance: typeof performanceData;
  goals: Goal[];
  notes: Note[];
  focusMode: boolean;
  executiveReps: ExecutiveRep[];
  featureRequests: RequestItem[];
  communications: Communication[];
  timeRange: number;
  
  setFocusMode: (val: boolean) => void;
  setTimeRange: (val: number) => void;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateAgentSkill: (id: string, skill: string, level: number) => void;
  addQAReview: (review: Omit<QAReview, 'id' | 'date'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalStatus: (id: string, status: string, progressValue: number) => void;
  addNote: (note: Omit<Note, 'id' | 'date' | 'author'>) => void;
  addFeatureRequest: (request: Omit<RequestItem, 'id' | 'date' | 'votes' | 'status'>) => void;
  updateFeatureRequestVotes: (id: string) => void;
  logCommunication: (comm: Omit<Communication, 'id' | 'date' | 'status'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [qaReviews, setQaReviews] = useState<QAReview[]>(
    initialQA.map(qa => ({
      ...qa,
      repName: qa.rep,
      repId: initialAgents.find(a => a.name === qa.rep)?.id || 'rep-001',
      status: qa.status as QAReview['status']
    })) as QAReview[]
  );
  const [performance, setPerformance] = useState(performanceData);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [focusMode, setFocusMode] = useState(false);
  const [executiveReps, setExecutiveReps] = useState<ExecutiveRep[]>([]);
  const [featureRequests, setFeatureRequests] = useState<RequestItem[]>(initialRequests);
  const [communications, setCommunications] = useState<Communication[]>(initialCommunications as Communication[]);
  const [timeRange, setTimeRange] = useState(30);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('leadcoach_v4_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.agents) {
          // Force all agent roles to IT Service Desk T1 as requested
          const updatedAgents = parsed.agents.map((a: any) => ({ ...a, role: "IT Service Desk T1" }));
          setAgents(updatedAgents);
        }
        if (parsed.qaReviews) setQaReviews(parsed.qaReviews);
        if (parsed.performance) setPerformance(parsed.performance);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.featureRequests) setFeatureRequests(parsed.featureRequests);
        if (parsed.communications) setCommunications(parsed.communications);
        if (parsed.timeRange) setTimeRange(parsed.timeRange);
        if (parsed.focusMode !== undefined) setFocusMode(parsed.focusMode);
        if (parsed.executiveReps && parsed.executiveReps.length > 0) {
          setExecutiveReps(parsed.executiveReps);
        } else {
          setExecutiveReps(generateExecutiveData());
        }
      } catch (e) {
        console.error("Failed to parse saved data");
        setExecutiveReps(generateExecutiveData());
      }
    } else {
      setExecutiveReps(generateExecutiveData());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leadcoach_v4_data', JSON.stringify({
      agents, qaReviews, performance, goals, notes, focusMode, executiveReps, featureRequests, communications, timeRange
    }));
  }, [agents, qaReviews, performance, goals, notes, focusMode, executiveReps, featureRequests, communications, timeRange]);

  // Derived calculations: Update agent QA score based on reviews
  useEffect(() => {
    setAgents(prev => prev.map(agent => {
      const repReviews = qaReviews.filter(qa => qa.repId === agent.id && qa.status === 'completed');
      if (repReviews.length === 0) return agent;
      const avgScore = Math.round(repReviews.reduce((sum, r) => sum + r.score, 0) / repReviews.length);
      return {
        ...agent,
        metrics: {
          ...agent.metrics,
          qaScore: avgScore
        }
      };
    }));
  }, [qaReviews]);

  const addAgent = (agent: Omit<Agent, 'id'>) => {
    const id = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setAgents(prev => [...prev, { ...agent, id }]);
  };

  const updateAgentStatus = (id: string, status: Agent['status']) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateAgentSkill = (id: string, skill: string, level: number) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const currentSkills = a.skills || {};
        return { ...a, skills: { ...currentSkills, [skill]: level } };
      }
      return a;
    }));
  };

  const addQAReview = (review: Omit<QAReview, 'id' | 'date'>) => {
    const id = `QA-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const date = new Date().toISOString().split('T')[0];
    
    setQaReviews(prev => {
      const newReviews = [{ ...review, id, date }, ...prev];
      
      // Update the agent's average QA score based on all their reviews
      setAgents(agentsPrev => agentsPrev.map(a => {
        if (a.id === review.repId) {
          const agentQAs = newReviews.filter(r => r.repId === a.id);
          const newAvg = Math.round(agentQAs.reduce((sum, r) => sum + r.score, 0) / agentQAs.length);
          return {
            ...a,
            metrics: {
              ...a.metrics,
              qaScore: newAvg
            }
          };
        }
        return a;
      }));
      
      return newReviews;
    });
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const id = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setGoals(prev => [...prev, { ...goal, id }]);
  };

  const updateGoalStatus = (id: string, status: string, progressValue: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status, progressValue } : g));
  };

  const addNote = (note: Omit<Note, 'id' | 'date' | 'author'>) => {
    const id = `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const date = new Date().toISOString().split('T')[0];
    setNotes(prev => [...prev, { ...note, id, date, author: "Coach Daniel" }]);
  };

  const addFeatureRequest = (request: Omit<RequestItem, 'id' | 'date' | 'votes' | 'status'>) => {
    const id = `REQ-${String(featureRequests.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    setFeatureRequests(prev => [{
      ...request,
      id,
      date,
      votes: 1,
      status: 'Pending'
    }, ...prev]);
  };

  const updateFeatureRequestVotes = (id: string) => {
    setFeatureRequests(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
  };

  const logCommunication = (comm: Omit<Communication, 'id' | 'date' | 'status'>) => {
    const randomId = Math.random().toString(36).substring(2, 7);
    const id = `comm-${Date.now()}-${randomId}`;
    const date = new Date().toLocaleString();
    setCommunications(prev => [{
      ...comm,
      id,
      date,
      status: comm.type === 'Outlook Invite' ? 'Scheduled' : 'Sent'
    }, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      agents, qaReviews, performance, goals, notes, focusMode, executiveReps, featureRequests, communications, timeRange,
      setFocusMode, setTimeRange, addAgent, updateAgentStatus, updateAgentSkill, addQAReview,
      addGoal, updateGoalStatus, addNote, addFeatureRequest, updateFeatureRequestVotes, logCommunication
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
