import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { formatSaveTime } from '../../hooks/useAutoSave';

interface SessionRecoveryModalProps {
  isOpen: boolean;
  savedTimestamp: number;
  featureName?: string;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const SessionRecoveryModal: React.FC<SessionRecoveryModalProps> = ({
  isOpen,
  savedTimestamp,
  featureName = 'previous session',
  onRestore,
  onDiscard,
  onCancel,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="p-6">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/10 mb-4"
                  >
                    <DocumentTextIcon className="h-8 w-8 text-brand-gold" />
                  </motion.div>

                  {/* Title */}
                  <Dialog.Title className="text-center font-serif text-2xl font-semibold text-brand-navy mb-2">
                    Resume Previous Session?
                  </Dialog.Title>

                  {/* Description */}
                  <div className="text-center mb-6">
                    <p className="text-brand-text mb-3">
                      We found a saved draft from <span className="font-medium">{featureName}</span>.
                    </p>

                    <div className="inline-flex items-center space-x-2 text-sm text-brand-text-light">
                      <ClockIcon className="h-4 w-4" />
                      <span>Last saved {formatSaveTime(savedTimestamp)}</span>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-brand-bg rounded-lg p-4 mb-6 border border-brand-border-subtle">
                    <p className="text-sm text-brand-text">
                      <span className="font-medium">What happens when you restore:</span>
                      <br />
                      Your form will be filled with the data from your previous session. You can continue
                      where you left off.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {/* Restore button (primary) */}
                    <button
                      onClick={onRestore}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-white font-medium rounded-xl hover:bg-brand-navy-light transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Restore My Session
                    </button>

                    {/* Start fresh button (secondary) */}
                    <button
                      onClick={onCancel}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-navy font-medium rounded-xl border-2 border-brand-border-subtle hover:bg-brand-bg transition-colors"
                    >
                      Start Fresh Instead
                    </button>

                    {/* Discard button (danger) */}
                    <button
                      onClick={onDiscard}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm text-scholarly-wine hover:text-scholarly-wine-dark transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Discard Saved Session
                    </button>
                  </div>

                  {/* Help text */}
                  <p className="text-xs text-center text-brand-text-light mt-4">
                    Sessions are automatically saved every 30 seconds while you work
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SessionRecoveryModal;
