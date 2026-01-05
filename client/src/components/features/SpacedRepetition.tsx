import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowPathIcon,
  CalendarIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';
import ExportButton from '../shared/ExportButton';

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
      toast.success('Schedule generated successfully');
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
      toast.success('Practice questions generated');
    } catch (error) {
      toast.error('Failed to generate practice questions');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-scholarly-sage/10 rounded-lg">
            <ArrowPathIcon className="h-7 w-7 text-scholarly-sage" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Spaced Repetition</h1>
            <p className="text-brand-text mt-1">Optimize memory retention with scientifically-backed scheduling</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.spacedRepetition} color="sage" />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'schedule', name: 'Review Schedule', icon: CalendarIcon },
          { id: 'practice', name: 'Retrieval Practice', icon: AcademicCapIcon },
          { id: 'activation', name: 'Pre-Class Activation', icon: PlayIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-text hover:bg-brand-bg border border-brand-border-subtle'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'schedule' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Review Schedule
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Enter the key concepts from your course (one per line) to generate
                an optimal review schedule based on the SM-2 algorithm.
              </p>
              <textarea
                value={concepts}
                onChange={(e) => setConcepts(e.target.value)}
                placeholder="Enter concepts (one per line):&#10;Supply and demand equilibrium&#10;Kantian categorical imperative&#10;Gram staining procedure&#10;Narrative point of view"
                className="w-full h-48 p-4 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
              />
              <button
                onClick={generateSchedule}
                disabled={loading}
                className="mt-4 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </>
          )}

          {activeTab === 'practice' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Retrieval Practice
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create retrieval practice questions that promote active recall
                rather than passive review.
              </p>
              <input
                type="text"
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                placeholder="Enter a topic (e.g., Constitutional amendments, Supply chain management)"
                className="w-full p-4 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all mb-4 bg-brand-bg/50"
              />
              <div className="space-y-3 mb-4">
                <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide">Retrieval Type</p>
                <label className="flex items-center space-x-3 text-sm text-brand-text cursor-pointer group">
                  <input type="radio" name="type" defaultChecked className="text-brand-navy focus:ring-brand-gold" />
                  <span className="group-hover:text-brand-navy transition-colors">Free Recall (most effective)</span>
                </label>
                <label className="flex items-center space-x-3 text-sm text-brand-text cursor-pointer group">
                  <input type="radio" name="type" className="text-brand-navy focus:ring-brand-gold" />
                  <span className="group-hover:text-brand-navy transition-colors">Cued Recall</span>
                </label>
                <label className="flex items-center space-x-3 text-sm text-brand-text cursor-pointer group">
                  <input type="radio" name="type" className="text-brand-navy focus:ring-brand-gold" />
                  <span className="group-hover:text-brand-navy transition-colors">Recognition</span>
                </label>
              </div>
              <button
                onClick={generatePractice}
                disabled={loading}
                className="w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Practice Questions'}
              </button>
            </>
          )}

          {activeTab === 'activation' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Pre-Class Knowledge Activation
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate activities to activate prior knowledge before introducing
                new material, improving encoding of new information.
              </p>
              <input
                type="text"
                placeholder="Upcoming topic"
                className="w-full p-4 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all mb-3 bg-brand-bg/50"
              />
              <textarea
                placeholder="Related prior knowledge students should have"
                className="w-full h-32 p-4 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none mb-4 bg-brand-bg/50"
              />
              <button
                disabled={loading}
                className="w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Activation Activity
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'schedule' && schedule.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Review Schedule
                </h2>
                <ExportButton
                  data={schedule}
                  filename="spaced-repetition-schedule"
                  title="Export"
                />
              </div>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-brand-navy text-sm">{item.conceptName}</h3>
                        <p className="text-xs text-brand-text-light mt-1">
                          Next review: {new Date(item.nextReview).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-scholarly-sage">
                          {item.interval} days
                        </span>
                        <p className="text-xs text-brand-text-light mt-0.5">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Practice Questions: {practice.concept}
                </h2>
                <ExportButton
                  data={practice}
                  filename="retrieval-practice"
                  title="Export"
                />
              </div>
              <div className="space-y-4">
                {practice.questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle"
                  >
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-scholarly-sage/10 text-scholarly-sage rounded mb-2">
                      {q.type}
                    </span>
                    <p className="font-medium text-brand-navy text-sm mb-2">{q.question}</p>
                    <details className="mt-2">
                      <summary className="text-xs text-brand-gold cursor-pointer hover:text-brand-gold/80 font-medium">
                        Show expected response
                      </summary>
                      <p className="mt-2 text-xs text-brand-text pl-4 border-l-2 border-brand-gold/30 leading-relaxed">
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
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-brand-bg rounded-full mb-4">
                <DocumentTextIcon className="h-10 w-10 text-brand-text-light" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-xs">
                Fill in the form on the left and click generate to create
                your spaced repetition content.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-r from-scholarly-sage/5 to-scholarly-sage/10 rounded-xl p-6 border border-scholarly-sage/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-sage" />
          <h3 className="font-medium text-brand-navy">Instructor Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-brand-text">
          <li className="flex items-start space-x-2">
            <span className="text-scholarly-sage mt-1">•</span>
            <span>Schedule reviews right before new related content for maximum connection-making</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-scholarly-sage mt-1">•</span>
            <span>Use retrieval practice as low-stakes quizzes to reduce test anxiety while boosting learning</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-scholarly-sage mt-1">•</span>
            <span>Encourage students to generate their own retrieval questions for deeper processing</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default SpacedRepetition;
