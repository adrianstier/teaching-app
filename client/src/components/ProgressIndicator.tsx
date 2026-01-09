import React from 'react';
import { useLecture } from '../context/LectureContext';
import { CheckIcon } from '@heroicons/react/24/solid';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
  FolderArrowDownIcon,
} from '@heroicons/react/24/outline';

const ProgressIndicator: React.FC = () => {
  const { currentPhase } = useLecture();

  const phases = [
    { id: 1, name: 'Intake', description: 'Requirements', icon: DocumentTextIcon },
    { id: 2, name: 'Architecture', description: 'Learning design', icon: AcademicCapIcon },
    { id: 3, name: 'Development', description: 'Content', icon: LightBulbIcon },
    { id: 4, name: 'Visual', description: 'Slides', icon: PresentationChartLineIcon },
    { id: 5, name: 'Integration', description: 'Package', icon: FolderArrowDownIcon },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => (
          <React.Fragment key={phase.id}>
            <div className="flex flex-col items-center relative">
              {/* Phase Circle */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  phase.id < currentPhase
                    ? 'bg-scholarly-sage text-white shadow-md'
                    : phase.id === currentPhase
                    ? 'bg-brand-navy text-white shadow-lg ring-4 ring-brand-navy/20'
                    : 'bg-brand-bg text-brand-text-light border-2 border-brand-border'
                }`}
              >
                {phase.id < currentPhase ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <phase.icon className="h-5 w-5" />
                )}
              </div>

              {/* Phase Label */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium transition-colors ${
                    phase.id <= currentPhase ? 'text-brand-navy' : 'text-brand-text-light'
                  }`}
                >
                  {phase.name}
                </p>
                <p className="text-xs text-brand-text-light hidden sm:block">
                  {phase.description}
                </p>
              </div>

              {/* Active Indicator */}
              {phase.id === currentPhase && (
                <div className="absolute -bottom-1 w-full flex justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div className="flex-1 mx-2 h-0.5 relative">
                <div className="absolute inset-0 bg-brand-border rounded-full" />
                <div
                  className={`absolute inset-0 bg-scholarly-sage rounded-full transition-all duration-500 ${
                    phase.id < currentPhase ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Text */}
      <div className="mt-4 pt-4 border-t border-brand-border-subtle flex items-center justify-between">
        <p className="text-sm text-brand-text">
          <span className="font-medium text-brand-navy">Phase {currentPhase}</span>
          <span className="text-brand-text-light"> of 5</span>
        </p>
        <div className="flex items-center space-x-2">
          <div className="w-24 h-1.5 bg-brand-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold rounded-full transition-all duration-500"
              style={{ width: `${(currentPhase / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-brand-text-light">
            {Math.round((currentPhase / 5) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
