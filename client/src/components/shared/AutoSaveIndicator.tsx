import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowPathIcon, CloudIcon } from '@heroicons/react/24/outline';
import { formatSaveTime } from '../../hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  lastSaved: number | null;
  isSaving?: boolean;
  compact?: boolean;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  lastSaved,
  isSaving = false,
  compact = false,
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every 10 seconds to refresh "X minutes ago" text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!lastSaved && !isSaving) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`inline-flex items-center space-x-2 ${
            compact ? 'text-xs' : 'text-sm'
          } text-brand-text-light`}
        >
          <ArrowPathIcon className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} animate-spin`} />
          <span>Saving...</span>
        </motion.div>
      ) : lastSaved ? (
        <motion.div
          key="saved"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`inline-flex items-center space-x-2 ${
            compact ? 'text-xs' : 'text-sm'
          } text-brand-text-light`}
        >
          <CheckCircleIcon
            className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-scholarly-sage`}
          />
          <span>Saved {formatSaveTime(lastSaved)}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

// Larger version for empty state or prominent placement
export const AutoSaveIndicatorLarge: React.FC<{
  lastSaved: number | null;
  isSaving?: boolean;
  onManualSave?: () => void;
}> = ({ lastSaved, isSaving, onManualSave }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border-subtle">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white rounded-lg">
          <CloudIcon className="h-5 w-5 text-brand-navy" />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-navy">Auto-save enabled</p>
          <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
        </div>
      </div>

      {onManualSave && !isSaving && (
        <button
          onClick={onManualSave}
          className="text-sm text-brand-gold hover:text-brand-gold-dark font-medium transition-colors"
        >
          Save Now
        </button>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
