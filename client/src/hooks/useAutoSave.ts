import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface AutoSaveOptions {
  key: string;
  data: any;
  delay?: number; // milliseconds
  enabled?: boolean;
  onSave?: () => void;
  silent?: boolean; // don't show toast notifications
}

interface SavedSession {
  data: any;
  timestamp: number;
  version: string;
  featureName?: string;
}

const AUTO_SAVE_VERSION = '1.0';

export const useAutoSave = ({
  key,
  data,
  delay = 30000, // 30 seconds default
  enabled = true,
  onSave,
  silent = false,
}: AutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveToLocalStorage = useCallback(() => {
    if (!enabled || !key) return;

    try {
      const dataString = JSON.stringify(data);

      // Don't save if data hasn't changed
      if (dataString === lastSavedRef.current) {
        return;
      }

      const savedSession: SavedSession = {
        data,
        timestamp: Date.now(),
        version: AUTO_SAVE_VERSION,
      };

      localStorage.setItem(`autosave_${key}`, JSON.stringify(savedSession));
      lastSavedRef.current = dataString;

      if (!silent) {
        toast.success('Draft saved', { duration: 1500, position: 'bottom-right' });
      }

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('[AutoSave] Failed to save:', error);
      if (!silent) {
        toast.error('Failed to save draft', { duration: 2000 });
      }
    }
  }, [data, enabled, key, onSave, silent]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, saveToLocalStorage]);

  // Save immediately when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveToLocalStorage]);

  return {
    saveNow: saveToLocalStorage,
  };
};

// Hook to load saved session
export const useLoadSavedSession = (key: string) => {
  const loadSession = useCallback((): SavedSession | null => {
    if (!key) return null;

    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      if (!saved) return null;

      const session: SavedSession = JSON.parse(saved);

      // Check if session is older than 7 days
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (session.timestamp < sevenDaysAgo) {
        // Session is too old, delete it
        localStorage.removeItem(`autosave_${key}`);
        return null;
      }

      return session;
    } catch (error) {
      console.error('[AutoSave] Failed to load session:', error);
      return null;
    }
  }, [key]);

  const clearSession = useCallback(() => {
    if (!key) return;
    localStorage.removeItem(`autosave_${key}`);
  }, [key]);

  return {
    loadSession,
    clearSession,
  };
};

// Hook to get all saved sessions
export const useListSavedSessions = () => {
  const listSessions = useCallback((): Array<{
    key: string;
    session: SavedSession;
    displayName: string;
  }> => {
    const sessions: Array<{ key: string; session: SavedSession; displayName: string }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('autosave_')) {
        try {
          const saved = localStorage.getItem(key);
          if (saved) {
            const session: SavedSession = JSON.parse(saved);
            const displayKey = key.replace('autosave_', '');
            sessions.push({
              key: displayKey,
              session,
              displayName: session.featureName || displayKey,
            });
          }
        } catch (error) {
          console.error('[AutoSave] Failed to parse session:', error);
        }
      }
    }

    // Sort by most recent first
    sessions.sort((a, b) => b.session.timestamp - a.session.timestamp);

    return sessions;
  }, []);

  const clearAllSessions = useCallback(() => {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('autosave_')) {
        keys.push(key);
      }
    }

    keys.forEach(key => localStorage.removeItem(key));
  }, []);

  return {
    listSessions,
    clearAllSessions,
  };
};

// Helper function to format timestamp
export const formatSaveTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};
