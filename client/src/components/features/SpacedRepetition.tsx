import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

interface ScheduleItem {
  conceptId: string;
  conceptName: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface RetrievalPractice {
  id: string;
  concept: string;
  questions: Array<{
    type: string;
    question: string;
    expectedResponse: string;
  }>;
}

const SpacedRepetition: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'practice' | 'activation'>('schedule');
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState('');
  const [courseTopic, setCourseTopic] = useState('');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [practice, setPractice] = useState<RetrievalPractice | null>(null);

  const generateSchedule = async () => {
    if (!concepts.trim()) {
      toast.error('Please enter at least one concept');
      return;
    }

    setLoading(true);
    try {
      const conceptList = concepts.split('\n').filter(c => c.trim());
      const response = await fetch('/api/pedagogical/spaced-repetition/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: sessionId,
          concepts: conceptList.map(name => ({
            id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            difficulty: 0.5,
            prerequisites: []
          })),
          algorithmType: 'sm2'
        })
      });

      if (!response.ok) throw new Error('Failed to generate schedule');
      const data = await response.json();
      setSchedule(data.schedule || []);
      toast.success('Schedule generated!');
    } catch (error) {
      toast.error('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const generatePractice = async () => {
    if (!courseTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/spaced-repetition/retrieval-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: courseTopic,
          priorKnowledge: [],
          retrievalType: 'free-recall'
        })
      });

      if (!response.ok) throw new Error('Failed to generate practice');
      const data = await response.json();
      setPractice(data);
      toast.success('Practice questions generated!');
    } catch (error) {
      toast.error('Failed to generate practice questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ArrowPathIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Spaced Repetition</h1>
            <p className="text-gray-600">Optimize memory retention with scientifically-backed scheduling</p>
          </div>
        </div>

        {/* Research Basis */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Research Basis:</strong> Based on Ebbinghaus's forgetting curve and the SM-2 algorithm
            (Wozniak & Gorzelanczyk, 1994). Spaced repetition can improve long-term retention by 200%
            compared to massed practice.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'schedule', name: 'Review Schedule', icon: CalendarIcon },
          { id: 'practice', name: 'Retrieval Practice', icon: AcademicCapIcon },
          { id: 'activation', name: 'Pre-Class Activation', icon: PlayIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          {activeTab === 'schedule' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Review Schedule
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the key concepts from your course (one per line) to generate
                an optimal review schedule based on the SM-2 algorithm.
              </p>
              <textarea
                value={concepts}
                onChange={(e) => setConcepts(e.target.value)}
                placeholder="Enter concepts (one per line):&#10;Photosynthesis&#10;Cellular respiration&#10;ATP synthesis&#10;Electron transport chain"
                className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={generateSchedule}
                disabled={loading}
                className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </>
          )}

          {activeTab === 'practice' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Retrieval Practice
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create retrieval practice questions that promote active recall
                rather than passive review.
              </p>
              <input
                type="text"
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                placeholder="Enter a topic (e.g., Photosynthesis)"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <div className="space-y-3 mb-4">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input type="radio" name="type" defaultChecked className="text-blue-600" />
                  <span>Free Recall (most effective)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input type="radio" name="type" className="text-blue-600" />
                  <span>Cued Recall</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input type="radio" name="type" className="text-blue-600" />
                  <span>Recognition</span>
                </label>
              </div>
              <button
                onClick={generatePractice}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Practice Questions'}
              </button>
            </>
          )}

          {activeTab === 'activation' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Pre-Class Knowledge Activation
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate activities to activate prior knowledge before introducing
                new material, improving encoding of new information.
              </p>
              <input
                type="text"
                placeholder="Upcoming topic"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <textarea
                placeholder="Related prior knowledge students should have"
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              />
              <button
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Generate Activation Activity
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          {activeTab === 'schedule' && schedule.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Review Schedule
              </h2>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-brand-navy">{item.conceptName}</h3>
                        <p className="text-sm text-gray-600">
                          Next review: {new Date(item.nextReview).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-blue-600">
                          Interval: {item.interval} days
                        </span>
                        <p className="text-xs text-gray-500">
                          Ease: {(item.easeFactor * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'practice' && practice && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Practice Questions: {practice.concept}
              </h2>
              <div className="space-y-4">
                {practice.questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded mb-2">
                      {q.type}
                    </span>
                    <p className="font-medium text-brand-navy mb-2">{q.question}</p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        Show expected response
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-blue-200">
                        {q.expectedResponse}
                      </p>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}

          {((activeTab === 'schedule' && schedule.length === 0) ||
            (activeTab === 'practice' && !practice) ||
            activeTab === 'activation') && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Fill in the form on the left and click generate to create
                your spaced repetition content.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
      >
        <h3 className="font-semibold text-brand-navy mb-3">Instructor Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500">•</span>
            <span>Schedule reviews right before new related content for maximum connection-making</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500">•</span>
            <span>Use retrieval practice as low-stakes quizzes to reduce test anxiety while boosting learning</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500">•</span>
            <span>Encourage students to generate their own retrieval questions for deeper processing</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SpacedRepetition;
