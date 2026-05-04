import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  teamMembers as initialAgents, 
  recentQA as initialQA, 
  performanceData, 
  initialGoals, 
  initialNotes 
} from '../lib/mockData';

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

interface StoreContextType {
  agents: Agent[];
  qaReviews: QAReview[];
  performance: typeof performanceData;
  goals: Goal[];
  notes: Note[];
  focusMode: boolean;
  
  setFocusMode: (val: boolean) => void;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateAgentSkill: (id: string, skill: string, level: number) => void;
  addQAReview: (review: Omit<QAReview, 'id' | 'date'>) => void;
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
      repId: initialAgents.find(a => a.name === qa.rep)?.id || 'rep-001',
      status: qa.status as QAReview['status']
    })) as QAReview[]
  );
  const [performance, setPerformance] = useState(performanceData);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [focusMode, setFocusMode] = useState(false);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('leadcoach_v4_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.agents) setAgents(parsed.agents);
        if (parsed.qaReviews) setQaReviews(parsed.qaReviews);
        if (parsed.performance) setPerformance(parsed.performance);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.focusMode !== undefined) setFocusMode(parsed.focusMode);
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leadcoach_v4_data', JSON.stringify({
      agents, qaReviews, performance, goals, notes, focusMode
    }));
  }, [agents, qaReviews, performance, goals, notes, focusMode]);

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
    const id = `goal-${Date.now()}`;
    setGoals(prev => [...prev, { ...goal, id }]);
  };

  const updateGoalStatus = (id: string, status: string, progressValue: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status, progressValue } : g));
  };

  const addNote = (note: Omit<Note, 'id' | 'date' | 'author'>) => {
    const id = `note-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    setNotes(prev => [...prev, { ...note, id, date, author: "Coach Daniel" }]);
  };

  return (
    <StoreContext.Provider value={{
      agents, qaReviews, performance, goals, notes, focusMode,
      setFocusMode, addAgent, updateAgentStatus, updateAgentSkill, addQAReview,
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
