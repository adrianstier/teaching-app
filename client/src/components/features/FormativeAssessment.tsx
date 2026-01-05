import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  HandRaisedIcon,
  DocumentTextIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

interface LivePoll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  pedagogicalPurpose: string;
  followUpQuestions: string[];
}

interface ExitTicket {
  id: string;
  prompts: Array<{
    type: string;
    prompt: string;
    purpose: string;
  }>;
  analysisGuidelines: string[];
}

const FormativeAssessment: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'polls' | 'tickets' | 'analysis'>('polls');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [pollResult, setPollResult] = useState<LivePoll | null>(null);
  const [ticketResult, setTicketResult] = useState<ExitTicket | null>(null);

  const generatePoll = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/formative-assessment/live-poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          learningObjective: learningObjective || undefined,
          pollType: 'conceptual',
          includeDistractors: true
        })
      });

      if (!response.ok) throw new Error('Failed to generate poll');
      const data = await response.json();
      setPollResult(data);
      toast.success('Poll generated!');
    } catch (error) {
      toast.error('Failed to generate poll');
    } finally {
      setLoading(false);
    }
  };

  const generateExitTicket = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/formative-assessment/exit-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionTopic: topic,
          keyConcepts: [topic],
          ticketType: 'comprehensive'
        })
      });

      if (!response.ok) throw new Error('Failed to generate exit ticket');
      const data = await response.json();
      setTicketResult(data);
      toast.success('Exit ticket generated!');
    } catch (error) {
      toast.error('Failed to generate exit ticket');
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
          <div className="p-3 bg-purple-100 rounded-xl">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Quick Polls & Check-ins</h1>
            <p className="text-gray-600">Find out if students understand before moving on</p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-purple-800">
            <strong>Why this works:</strong> A quick poll during class shows you whether students understand—before
            you move on to the next topic. Without checking, you might be teaching to confused faces. Exit
            tickets at the end of class tell you what to review next time.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'polls', name: 'Live Polls', icon: ChartPieIcon },
          { id: 'tickets', name: 'Exit Tickets', icon: ClipboardDocumentListIcon },
          { id: 'analysis', name: 'Response Analysis', icon: LightBulbIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
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
          {activeTab === 'polls' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Create Live Poll
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate conceptual polling questions that reveal student thinking
                and common misconceptions in real-time.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic/Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Newton's Third Law"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Objective (optional)
                  </label>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    placeholder="e.g., Students will be able to apply Newton's Third Law..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Conceptual', 'Prediction', 'Application', 'Misconception Probe'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer">
                        <input type="radio" name="pollType" defaultChecked={type === 'Conceptual'} className="text-purple-600" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generatePoll}
                disabled={loading}
                className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Poll'}
              </button>
            </>
          )}

          {activeTab === 'tickets' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Create Exit Ticket
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate end-of-session prompts that help you understand what students
                learned and what needs reinforcement.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Today's main topic"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Format
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="comprehensive">Comprehensive (3 prompts)</option>
                    <option value="muddiest-point">Muddiest Point</option>
                    <option value="one-minute-paper">One-Minute Paper</option>
                    <option value="3-2-1">3-2-1 (3 things learned, 2 questions, 1 insight)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={generateExitTicket}
                disabled={loading}
                className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Exit Ticket'}
              </button>
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Analyze Responses
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Paste student responses to get AI-powered analysis of common patterns,
                misconceptions, and suggested interventions.
              </p>
              <textarea
                placeholder="Paste student responses here (one per line)..."
                className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <button
                disabled={loading}
                className="mt-4 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Analyze Responses
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
          {pollResult && activeTab === 'polls' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generated Poll
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="font-medium text-brand-navy text-lg">
                    {pollResult.question}
                  </p>
                  <p className="text-sm text-purple-700 mt-2">
                    Purpose: {pollResult.pedagogicalPurpose}
                  </p>
                </div>
                <div className="space-y-2">
                  {pollResult.options.map((option, index) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border ${
                        option.isCorrect
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="font-medium text-gray-700">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800">{option.text}</p>
                          <p className="text-sm text-gray-600 mt-1 italic">
                            {option.explanation}
                          </p>
                        </div>
                        {option.isCorrect && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            Correct
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {pollResult.followUpQuestions.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">Follow-up Questions:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {pollResult.followUpQuestions.map((q, i) => (
                        <li key={i}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {ticketResult && activeTab === 'tickets' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Exit Ticket
              </h2>
              <div className="space-y-4">
                {ticketResult.prompts.map((prompt, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded mb-2">
                      {prompt.type}
                    </span>
                    <p className="font-medium text-brand-navy">{prompt.prompt}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Purpose: {prompt.purpose}
                    </p>
                  </div>
                ))}
                {ticketResult.analysisGuidelines.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <h4 className="font-medium text-purple-700 mb-2">
                      How to Analyze Responses:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {ticketResult.analysisGuidelines.map((g, i) => (
                        <li key={i}>• {g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {!pollResult && !ticketResult && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Create polls or exit tickets to gather real-time feedback from your students.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
      >
        <h3 className="font-semibold text-brand-navy mb-3">Tips for Using Polls Effectively</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-purple-700 mb-2">During Class:</h4>
            <ul className="space-y-1">
              <li>• Poll every 15-20 minutes to check understanding</li>
              <li>• Have students discuss with a neighbor before re-answering</li>
              <li>• Wait before showing the right answer—let them think</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">What to Do with Results:</h4>
            <ul className="space-y-1">
              <li>• Most got it wrong? Explain it a different way</li>
              <li>• About half right? Have them discuss, then poll again</li>
              <li>• Most got it right? Move on to the next topic</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormativeAssessment;
