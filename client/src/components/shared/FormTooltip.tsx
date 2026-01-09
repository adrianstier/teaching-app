import React, { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FormTooltipProps {
  label: string;
  tooltip: string;
  example?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormTooltip: React.FC<FormTooltipProps> = ({
  label,
  tooltip,
  example,
  required = false,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-brand-navy">
          {label}
          {required && <span className="text-scholarly-wine ml-1">*</span>}
        </label>
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className="relative text-brand-text-light hover:text-brand-navy transition-colors"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-6 z-50 w-72 p-4 bg-brand-navy text-white text-sm rounded-lg shadow-xl"
              >
                <p className="mb-2">{tooltip}</p>
                {example && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/70 mb-1">Example:</p>
                    <p className="text-xs text-white/90 italic">{example}</p>
                  </div>
                )}
                {/* Arrow pointing up */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-brand-navy transform rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      {children}
    </div>
  );
};

export default FormTooltip;
