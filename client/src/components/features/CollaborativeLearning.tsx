import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathRoundedSquareIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';
import ExportButton from '../shared/ExportButton';

interface Props {
  sessionId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CollaborativeLearning: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'activities' | 'peer-feedback'>('groups');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [classSize, setClassSize] = useState('30');
  const [results, setResults] = useState<any>(null);

  const generateGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/collaboration/form-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classSize: parseInt(classSize),
          groupSize: 4,
          formationStrategy: 'heterogeneous',
          taskType: 'problem-solving'
        })
      });

      if (!response.ok) throw new Error('Failed to generate groups');
      const data = await response.json();
      setResults(data);
      toast.success('Group formation strategy generated!');
    } catch (error) {
      toast.error('Failed to generate groups');
    } finally {
      setLoading(false);
    }
  };

  const generateActivity = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/collaboration/generate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          duration: 20,
          groupSize: 4,
          activityType: 'think-pair-share'
        })
      });

      if (!response.ok) throw new Error('Failed to generate activity');
      const data = await response.json();
      setResults(data);
      toast.success('Collaborative activity generated!');
    } catch (error) {
      toast.error('Failed to generate activity');
    } finally {
      setLoading(false);
    }
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
            <UsersIcon className="h-7 w-7 text-scholarly-sage" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Group Work</h1>
            <p className="text-brand-text mt-1">Set up group activities that actually work</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.collaborativeLearning} color="sage" />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'groups', name: 'Group Formation', icon: UserGroupIcon },
          { id: 'activities', name: 'Activities', icon: ArrowPathRoundedSquareIcon },
          { id: 'peer-feedback', name: 'Peer Feedback', icon: ChatBubbleLeftRightIcon },
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
          {activeTab === 'groups' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Smart Group Formation
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate evidence-based group formation strategies that maximize
                learning outcomes while maintaining positive dynamics.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Class Size
                  </label>
                  <input
                    type="number"
                    value={classSize}
                    onChange={(e) => setClassSize(e.target.value)}
                    placeholder="30"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Formation Strategy
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'heterogeneous', label: 'Heterogeneous', desc: 'Mixed ability levels' },
                      { value: 'homogeneous', label: 'Homogeneous', desc: 'Similar ability levels' },
                      { value: 'interest', label: 'Interest-Based', desc: 'Shared interests/topics' },
                      { value: 'random', label: 'Random', desc: 'Random assignment' },
                    ].map((strategy) => (
                      <label key={strategy.value} className="flex items-start space-x-2 p-3 border border-brand-border-subtle rounded-lg hover:bg-scholarly-sage/5 cursor-pointer">
                        <input type="radio" name="strategy" defaultChecked={strategy.value === 'heterogeneous'} className="text-brand-navy focus:ring-brand-gold mt-1" />
                        <div>
                          <span className="text-sm font-medium">{strategy.label}</span>
                          <p className="text-xs text-brand-text-light">{strategy.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateGroups}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Strategy'}
              </button>
            </>
          )}

          {activeTab === 'activities' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Collaborative Activities
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create structured collaborative learning activities with clear
                roles, interdependence, and individual accountability.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Topic/Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Climate change causes and effects"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Activity Type
                  </label>
                  <select className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold">
                    <option value="think-pair-share">Think-Pair-Share</option>
                    <option value="jigsaw">Jigsaw</option>
                    <option value="gallery-walk">Gallery Walk</option>
                    <option value="debate">Structured Debate</option>
                    <option value="case-analysis">Case Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
              </div>
              <button
                onClick={generateActivity}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Activity'}
              </button>
            </>
          )}

          {activeTab === 'peer-feedback' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Peer Feedback Structures
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create scaffolded peer feedback activities that help students
                give and receive constructive feedback effectively.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Assignment Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Research paper draft"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Feedback Focus
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Content/Ideas', 'Organization', 'Evidence/Support', 'Clarity'].map((focus) => (
                      <label key={focus} className="flex items-center space-x-2 p-2 border border-brand-border-subtle rounded-lg hover:bg-scholarly-sage/5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="text-brand-navy focus:ring-brand-gold" />
                        <span className="text-sm">{focus}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                Generate Feedback Protocol
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
        >
          {results && activeTab === 'groups' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-navy">
                  Group Formation Strategy
                </h2>
                <ExportButton data={results} filename="group-formation" title="Export" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-scholarly-sage/5 rounded-xl">
                  <h3 className="font-medium text-scholarly-sage mb-2">Recommendation</h3>
                  <p className="text-sm text-brand-navy">{results.rationale}</p>
                </div>
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Group Size: {results.groupSize} students</h3>
                  <p className="text-sm text-brand-text">
                    Number of groups: {results.numberOfGroups}
                  </p>
                </div>
                {results.roleAssignments && (
                  <div>
                    <h3 className="font-medium text-brand-navy mb-2">Suggested Roles:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {results.roleAssignments.map((role: any, i: number) => (
                        <div key={i} className="p-3 bg-brand-bg/50 rounded-lg">
                          <p className="font-medium text-brand-navy">{role.role}</p>
                          <p className="text-xs text-brand-text">{role.responsibilities}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'activities' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-navy">
                  {results.activityName || 'Collaborative Activity'}
                </h2>
                <ExportButton data={results} filename="collaborative-activity" title="Export" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-scholarly-sage/5 rounded-xl">
                  <p className="text-sm text-scholarly-sage">{results.description}</p>
                </div>
                {results.phases && (
                  <div>
                    <h3 className="font-medium text-brand-navy mb-2">Activity Phases:</h3>
                    <div className="space-y-3">
                      {results.phases.map((phase: any, i: number) => (
                        <div key={i} className="p-3 bg-brand-bg/50 rounded-lg border-l-4 border-scholarly-sage">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-brand-navy">{phase.name}</p>
                            <span className="text-xs text-brand-text-light">{phase.duration} min</span>
                          </div>
                          <p className="text-sm text-brand-text mt-1">{phase.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-scholarly-sage/10 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-scholarly-sage" />
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm">
                Generate collaborative learning structures to enhance peer interaction and learning.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Collaboration Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-scholarly-sage/5 to-scholarly-sage/10 rounded-2xl p-6 border border-scholarly-sage/20"
      >
        <h3 className="font-semibold text-brand-navy mb-3">What Makes Group Work Succeed</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-scholarly-sage mb-2">Everyone Needed</h4>
            <p className="text-brand-text">
              Design tasks so students can't finish without each other. The whole group succeeds or struggles together.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-scholarly-sage mb-2">Everyone Contributes</h4>
            <p className="text-brand-text">
              Give each person a specific role. Check that everyone did their part, not just the group as a whole.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-scholarly-sage mb-2">Real Discussion</h4>
            <p className="text-brand-text">
              Students should explain ideas to each other, ask questions, and build on each other's thinking.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CollaborativeLearning;
