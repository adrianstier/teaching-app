import React from 'react';
import { useLecture } from '../context/LectureContext';
import { CheckIcon } from '@heroicons/react/24/solid';

const ProgressIndicator: React.FC = () => {
  const { currentPhase } = useLecture();

  const phases = [
    { id: 1, name: 'Intake', description: 'Requirements gathering' },
    { id: 2, name: 'Architecture', description: 'Learning design' },
    { id: 3, name: 'Development', description: 'Content & activities' },
    { id: 4, name: 'Visual Design', description: 'Slide creation' },
    { id: 5, name: 'Integration', description: 'Final package' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => (
          <React.Fragment key={phase.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  phase.id < currentPhase
                    ? 'bg-green-500 text-white'
                    : phase.id === currentPhase
                    ? 'bg-primary-600 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {phase.id < currentPhase ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <span className="font-semibold">{phase.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-gray-900">{phase.name}</p>
                <p className="text-xs text-gray-500">{phase.description}</p>
              </div>
            </div>
            {index < phases.length - 1 && (
              <div
                className={`flex-1 h-1 transition-colors ${
                  phase.id < currentPhase ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;