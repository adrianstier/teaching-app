import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ActiveLearningProps {
  sessionId: string;
}

interface ActivityTemplate {
  name: string;
  type: string;
  duration: {
    min: number;
    max: number;
  };
  materials: {
    instructorScript: string;
    studentHandout: string;
    timingGuide: Array<{ time: number; action: string; who: string }>;
    facilitationTips: string[];
  };
}

const ActiveLearning: React.FC<ActiveLearningProps> = ({ sessionId }) => {
  const [selectedType, setSelectedType] = useState<string>('think-pair-share');
  const [topic, setTopic] = useState<string>('');
  const [duration, setDuration] = useState<number>(20);
  const [classSize, setClassSize] = useState<number>(30);
  const [specificQuestion, setSpecificQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState<ActivityTemplate | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [showHandout, setShowHandout] = useState(false);

  const activityTypes = [
    { id: 'think-pair-share', name: 'Think-Pair-Share', duration: '6-10 min', icon: UserGroupIcon },
    { id: 'peer-instruction', name: 'Peer Instruction', duration: '8-12 min', icon: UserIcon },
    { id: 'jigsaw', name: 'Jigsaw', duration: '30-45 min', icon: UserGroupIcon },
    { id: 'case-study', name: 'Case Study', duration: '20-30 min', icon: DocumentTextIcon },
    { id: 'minute-paper', name: 'Minute Paper', duration: '3-5 min', icon: ClockIcon },
    { id: 'concept-map', name: 'Concept Mapping', duration: '15-20 min', icon: DocumentTextIcon },
    { id: 'problem-based-learning', name: 'Problem-Based Learning', duration: '60-180 min', icon: DocumentTextIcon },
    { id: 'debate', name: 'Structured Debate', duration: '30-45 min', icon: UserGroupIcon },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/active-learning/${sessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          topic,
          duration,
          classSize,
          specificQuestion: specificQuestion || undefined,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setGeneratedActivity(result.data);
        setShowScript(true);
      } else {
        alert('Failed to generate activity');
      }
    } catch (error) {
      console.error('Error generating activity:', error);
      alert('Error generating activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-brand-navy mb-4">Activity Studio</h1>
        <p className="text-lg text-brand-text">
          Evidence-based active learning templates with instructor scripts and student handouts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 sticky top-8">
            <h2 className="text-xl font-semibold text-brand-navy mb-6">Activity Configuration</h2>

            {/* Activity Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-navy mb-3">Activity Type</label>
              <div className="space-y-2">
                {activityTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-brand-gold bg-brand-gold bg-opacity-10'
                        : 'border-gray-200 hover:border-brand-gold'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <type.icon className="h-5 w-5 text-brand-navy mr-2" />
                        <span className="font-medium text-brand-navy">{type.name}</span>
                      </div>
                      <span className="text-xs text-brand-text">{type.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-navy mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold"
                placeholder="e.g., Photosynthesis"
              />
            </div>

            {/* Specific Question (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-navy mb-2">
                Specific Question (Optional)
              </label>
              <textarea
                value={specificQuestion}
                onChange={(e) => setSpecificQuestion(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold"
                placeholder="e.g., Why do plants need both photosynthesis and cellular respiration?"
              />
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-navy mb-2">
                Duration (minutes): {duration}
              </label>
              <input
                type="range"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Class Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-navy mb-2">
                Class Size: {classSize}
              </label>
              <input
                type="range"
                min="5"
                max="500"
                value={classSize}
                onChange={(e) => setClassSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full bg-brand-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Activity'}
            </button>
          </div>
        </div>

        {/* Activity Display */}
        <div className="lg:col-span-2">
          {generatedActivity ? (
            <div className="space-y-6">
              {/* Activity Header */}
              <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-brand-navy mb-2">{generatedActivity.name}</h2>
                <div className="flex items-center gap-4 text-sm text-brand-text">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {generatedActivity.duration.min}-{generatedActivity.duration.max} minutes
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => { setShowScript(true); setShowHandout(false); }}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        showScript ? 'text-brand-navy border-b-2 border-brand-gold' : 'text-brand-text'
                      }`}
                    >
                      Instructor Script
                    </button>
                    <button
                      onClick={() => { setShowScript(false); setShowHandout(true); }}
                      className={`flex-1 px-6 py-4 font-medium transition-colors ${
                        showHandout ? 'text-brand-navy border-b-2 border-brand-gold' : 'text-brand-text'
                      }`}
                    >
                      Student Handout
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {showScript && (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-brand-text bg-gray-50 p-6 rounded-xl">
                        {generatedActivity.materials.instructorScript}
                      </pre>
                    </div>
                  )}

                  {showHandout && (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-brand-text bg-gray-50 p-6 rounded-xl">
                        {generatedActivity.materials.studentHandout}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Timing Guide */}
              <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Timing Guide</h3>
                <div className="space-y-3">
                  {generatedActivity.materials.timingGuide.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 text-brand-gold font-medium">{item.time} min</div>
                      <div className="flex-1">
                        <div className="font-medium text-brand-navy">{item.action}</div>
                        <div className="text-xs text-brand-text">({item.who})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilitation Tips */}
              <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Facilitation Tips</h3>
                <ul className="space-y-2">
                  {generatedActivity.materials.facilitationTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-gold mr-2">•</span>
                      <span className="text-brand-text">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const data = generatedActivity.materials.instructorScript;
                    const blob = new Blob([data], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${generatedActivity.name}-script.txt`;
                    a.click();
                  }}
                  className="px-6 py-3 bg-white border-2 border-brand-navy text-brand-navy rounded-xl font-semibold hover:bg-brand-navy hover:text-white transition-all"
                >
                  Download Script
                </button>
                <button
                  onClick={() => {
                    const data = generatedActivity.materials.studentHandout;
                    const blob = new Blob([data], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${generatedActivity.name}-handout.txt`;
                    a.click();
                  }}
                  className="px-6 py-3 bg-white border-2 border-brand-navy text-brand-navy rounded-xl font-semibold hover:bg-brand-navy hover:text-white transition-all"
                >
                  Download Handout
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-12 border border-gray-100 text-center">
              <UserGroupIcon className="h-16 w-16 text-brand-navy opacity-20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-navy mb-2">No Activity Generated Yet</h3>
              <p className="text-brand-text">
                Configure your activity settings and click "Generate Activity" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveLearning;
