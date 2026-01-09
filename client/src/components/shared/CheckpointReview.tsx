import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface CheckpointReviewProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onApprove: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

const CheckpointReview: React.FC<CheckpointReviewProps> = ({
  title,
  description,
  children,
  onApprove,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleRevision = () => {
    if (feedback.trim()) {
      onRequestRevision(feedback);
      setFeedback('');
      setShowFeedback(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card border border-brand-border-subtle overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-brand-border-subtle bg-gradient-to-r from-brand-bg to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-semibold text-brand-navy">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-brand-text-light mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-medium rounded-full">
              Review Required
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {children}
      </div>

      {/* Action Bar */}
      <div className="px-8 py-5 bg-brand-bg border-t border-brand-border-subtle">
        <AnimatePresence mode="wait">
          {showFeedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-brand-text-light mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    What changes would you like to see?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-navy focus:ring-1 focus:ring-brand-navy text-sm"
                    placeholder="Describe the revisions you'd like..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="px-4 py-2 text-sm font-medium text-brand-text hover:text-brand-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevision}
                  disabled={!feedback.trim() || isLoading}
                  className="px-5 py-2 bg-scholarly-terracotta text-white text-sm font-medium rounded-lg hover:bg-scholarly-terracotta/90 transition-colors disabled:opacity-50"
                >
                  Submit Revision Request
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between"
            >
              <p className="text-sm text-brand-text-light">
                Review the content above and approve to continue, or request revisions.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFeedback(true)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 border border-brand-border text-brand-text text-sm font-medium rounded-lg hover:border-brand-navy hover:text-brand-navy transition-colors disabled:opacity-50"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  <span>Request Revisions</span>
                </button>
                <button
                  onClick={onApprove}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-5 py-2 bg-scholarly-sage text-white text-sm font-medium rounded-lg hover:bg-scholarly-sage/90 transition-colors disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{isLoading ? 'Processing...' : 'Approve & Continue'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckpointReview;
