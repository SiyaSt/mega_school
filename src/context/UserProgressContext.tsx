import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProgress, updateProgress } from '../services/userService';
import { useAuth } from './AuthContext';

interface LessonRecord {
  id: string;
  subjectId: string;
  topicName: string;
  points: number;
  completedAt: string;
}

interface UserProgressState {
  points: number;
  lessons: LessonRecord[];
  childId: string | null;
  isLoading: boolean;
}

interface UserProgressContextValue extends UserProgressState {
  refetch: () => Promise<void>;
  registerLessonResult: (params: {
    childId?: string;
    points: number;
    subjectId: string;
    topicName: string;
  }) => Promise<void>;
}

const defaultState: UserProgressState = {
  points: 0,
  lessons: [],
  childId: null,
  isLoading: false,
};

const UserProgressContext = createContext<UserProgressContextValue | null>(null);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<UserProgressState>(defaultState);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setState(defaultState);
      return;
    }
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const data = await getProgress();
      setState({
        points: data.points,
        lessons: data.lessons,
        childId: data.childId,
        isLoading: false,
      });
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const registerLessonResult = useCallback(
    async (params: { childId?: string; points: number; subjectId: string; topicName: string }) => {
      const res = await updateProgress(params);
      setState((s) => ({
        ...s,
        points: res.points,
      }));
    },
    []
  );

  const value: UserProgressContextValue = {
    ...state,
    refetch,
    registerLessonResult,
  };

  return (
    <UserProgressContext.Provider value={value}>{children}</UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextValue {
  const ctx = useContext(UserProgressContext);
  if (!ctx) throw new Error('useUserProgress must be used within UserProgressProvider');
  return ctx;
}
