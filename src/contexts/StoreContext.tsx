import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { teamMembers as initialAgents, recentQA as initialQA, upcomingSessions as initialSessions, performanceData, initialGoals, initialNotes } from '../lib/mockData';

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
  status: string;
  details?: Record<string, number>;
  notes?: string;
};
export type CoachingSession = typeof initialSessions[0] & { 
  notes?: string; 
  actionItems?: string[]; 
  followUpNotes?: string;
  rating?: 'EXCEEDS' | 'MEETS' | 'NEEDS IMPROVEMENT' | 'DOES NOT MEET';
  strengths?: string[];
  growthOpportunities?: string[];
  interactionRef?: string;
};

export type Goal = typeof initialGoals[0];
export type Note = typeof initialNotes[0];

interface StoreContextType {
  agents: Agent[];
  qaReviews: QAReview[];
  sessions: CoachingSession[];
  performance: typeof performanceData;
  goals: Goal[];
  notes: Note[];
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateAgentSkill: (id: string, skill: string, level: number) => void;
  addQAReview: (review: Omit<QAReview, 'id' | 'date'>) => void;
  addSession: (session: Omit<CoachingSession, 'id'>) => void;
  completeSession: (id: string, updates: Partial<CoachingSession>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalStatus: (id: string, status: string, progressValue: number) => void;
  addNote: (note: Omit<Note, 'id' | 'date' | 'author'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [qaReviews, setQaReviews] = useState<QAReview[]>(
    initialQA.map(qa => ({
      ...qa,
      repName: qa.rep,
      repId: initialAgents.find(a => a.name === qa.rep)?.id || 'rep-001'
    })) as QAReview[]
  );
  const [sessions, setSessions] = useState<CoachingSession[]>(
    initialSessions.map(s => ({
      ...s,
      repId: initialAgents.find(a => a.name === s.rep)?.id || 'rep-001'
    })) as CoachingSession[]
  );
  const [performance, setPerformance] = useState(performanceData);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  useEffect(() => {
    const savedData = localStorage.getItem('coachapp_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.agents) setAgents(parsed.agents);
        if (parsed.qaReviews) setQaReviews(parsed.qaReviews);
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.performance) setPerformance(parsed.performance);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.notes) setNotes(parsed.notes);
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coachapp_data', JSON.stringify({
      agents, qaReviews, sessions, performance, goals, notes
    }));
  }, [agents, qaReviews, sessions, performance, goals, notes]);

  // Derived calculations: Update agent QA score based on reviews
  useEffect(() => {
    setAgents(prev => prev.map(agent => {
      const repReviews = qaReviews.filter(qa => qa.repId === agent.id);
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
    const id = `rep-${Date.now()}`;
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
    const id = `QA-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    setQaReviews(prev => [{ ...review, id, date }, ...prev]);
  };

  const addSession = (session: Omit<CoachingSession, 'id'>) => {
    const id = `sess-${Date.now()}`;
    setSessions(prev => [...prev, { ...session, id }]);
  };

  const completeSession = (id: string, updates: Partial<CoachingSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'completed', date: new Date().toLocaleDateString(), ...updates } : s));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const id = `goal-${Date.now()}`;
    setGoals(prev => [...prev, { ...goal, id }]);
  };

  const updateGoalStatus = (id: string, status: string, progressValue: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status, progressValue } : g));
  };

  const addNote = (note: Omit<Note, 'id' | 'date' | 'author'>) => {
    const id = `note-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    setNotes(prev => [...prev, { ...note, id, date, author: "Coach Dan" }]);
  };

  return (
    <StoreContext.Provider value={{
      agents, qaReviews, sessions, performance, goals, notes,
      addAgent, updateAgentStatus, updateAgentSkill, addQAReview, addSession, completeSession,
      addGoal, updateGoalStatus, addNote
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
