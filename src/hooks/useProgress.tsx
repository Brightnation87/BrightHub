import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ProgressEntry {
  lesson_id: string;
  progress: number;
  is_completed: boolean;
  last_accessed: string;
}

interface ProgressContextType {
  progress: Record<string, ProgressEntry>;
  loading: boolean;
  updateProgress: (lessonId: string, progressValue: number, isCompleted?: boolean) => Promise<void>;
  getProgress: (lessonId: string) => ProgressEntry | undefined;
  getLessonProgress: (lessonId: string) => number;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgress: (lessonIds: string[]) => { completed: number; total: number; percentage: number };
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap: Record<string, ProgressEntry> = {};
      data?.forEach((entry) => {
        progressMap[entry.lesson_id] = {
          lesson_id: entry.lesson_id,
          progress: entry.progress || 0,
          is_completed: entry.is_completed || false,
          last_accessed: entry.last_accessed || new Date().toISOString(),
        };
      });

      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = async (lessonId: string, progressValue: number, isCompleted?: boolean) => {
    if (!user) {
      toast.error('Please sign in to save progress');
      return;
    }

    const completed = isCompleted ?? progressValue >= 100;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          progress: progressValue,
          is_completed: completed,
          last_accessed: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      setProgress((prev) => ({
        ...prev,
        [lessonId]: {
          lesson_id: lessonId,
          progress: progressValue,
          is_completed: completed,
          last_accessed: new Date().toISOString(),
        },
      }));

      if (completed && !progress[lessonId]?.is_completed) {
        toast.success('Lesson completed!');
      }
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const getProgress = (lessonId: string) => progress[lessonId];

  const getLessonProgress = (lessonId: string) => progress[lessonId]?.progress || 0;

  const isLessonCompleted = (lessonId: string) => progress[lessonId]?.is_completed || false;

  const getCourseProgress = (lessonIds: string[]) => {
    const completed = lessonIds.filter((id) => progress[id]?.is_completed).length;
    const total = lessonIds.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const refreshProgress = async () => {
    await fetchProgress();
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        updateProgress,
        getProgress,
        getLessonProgress,
        isLessonCompleted,
        getCourseProgress,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
