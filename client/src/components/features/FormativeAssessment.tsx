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
  BookOpenIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import ConceptExplainer, { conceptData } from '../shared/ConceptExplainer';
import ConceptDiagram from '../shared/ConceptDiagram';
import ExportButton from '../shared/ExportButton';

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
  const [activeTab, setActiveTab] = useState<'learn' | 'polls' | 'tickets' | 'analysis'>('learn');
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
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-scholarly-wine/10 rounded-xl">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-scholarly-wine" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Quick Polls & Check-ins</h1>
            <p className="text-brand-text mt-1">Find out if students understand before moving on</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'learn', name: 'Understand the Science', icon: BookOpenIcon },
          { id: 'polls', name: 'Live Polls', icon: ChartPieIcon },
          { id: 'tickets', name: 'Exit Tickets', icon: ClipboardDocumentListIcon },
          { id: 'analysis', name: 'Response Analysis', icon: LightBulbIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-text hover:bg-brand-bg border border-brand-border-subtle'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Learn Tab - Enhanced Concept Presentation */}
      {activeTab === 'learn' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Visual Diagram */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle">
            <h2 className="font-serif text-xl font-semibold text-brand-navy mb-4">
              The Formative Assessment Loop
            </h2>
            <p className="text-sm text-brand-text mb-6">
              Formative assessment is about gathering real-time information on student understanding
              so you can adjust instruction before it's too late. It creates a continuous feedback loop.
            </p>
            <div className="max-w-2xl mx-auto">
              <ConceptDiagram type="feedbackLoop" animated={true} />
            </div>
          </div>

          {/* Key Techniques Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-scholarly-wine/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-wine/10 flex items-center justify-center mb-3">
                <ChartPieIcon className="h-5 w-5 text-scholarly-wine" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Live Polling</h3>
              <p className="text-sm text-brand-text mb-3">
                Quick conceptual questions during class reveal whether students grasp key ideas.
                If most get it wrong, you know to re-teach before moving on.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: Poll every 15-20 minutes during lecture.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-sage/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-sage/10 flex items-center justify-center mb-3">
                <ClipboardDocumentListIcon className="h-5 w-5 text-scholarly-sage" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Exit Tickets</h3>
              <p className="text-sm text-brand-text mb-3">
                Brief end-of-class reflections that tell you what students learned and what
                remains unclear. Review before your next session.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: "What's still confusing?" before students leave.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-terracotta/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-terracotta/10 flex items-center justify-center mb-3">
                <ArrowPathIcon className="h-5 w-5 text-scholarly-terracotta" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Think-Pair-Share</h3>
              <p className="text-sm text-brand-text mb-3">
                Students think individually, discuss with a neighbor, then share with the class.
                This surfaces misconceptions and builds confidence.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: After polling, let pairs discuss, then re-poll.
              </p>
            </div>
          </div>

          {/* Detailed Concept Explainer */}
          <ConceptExplainer
            {...conceptData.formativeAssessment}
            color="wine"
            icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-scholarly-wine" />}
          />

          {/* Quick Start CTA */}
          <div className="bg-gradient-to-r from-scholarly-wine/10 to-scholarly-wine/5 rounded-2xl p-6 border border-scholarly-wine/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
                  Ready to apply this?
                </h3>
                <p className="text-sm text-brand-text">
                  Generate polling questions that reveal student thinking or create exit tickets for end-of-class reflection.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('polls')}
                className="flex items-center space-x-2 px-6 py-3 bg-scholarly-wine text-white rounded-xl font-medium hover:bg-scholarly-wine/90 transition-colors"
              >
                <span>Create Live Poll</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {activeTab !== 'learn' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'polls' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Create Live Poll
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate conceptual polling questions that reveal student thinking
                and common misconceptions in real-time.
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
                    placeholder="e.g., Constitutional interpretation, Supply and demand, Narrative structure"
                    className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Learning Objective (optional)
                  </label>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    placeholder="e.g., Students will analyze stakeholder perspectives..."
                    className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Poll Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Conceptual', 'Prediction', 'Application', 'Misconception Probe'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 p-3 border border-brand-border rounded-lg hover:bg-brand-bg cursor-pointer transition-colors group">
                        <input type="radio" name="pollType" defaultChecked={type === 'Conceptual'} className="text-brand-navy focus:ring-brand-gold" />
                        <span className="text-sm text-brand-text group-hover:text-brand-navy transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generatePoll}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Poll'}
              </button>
            </>
          )}

          {activeTab === 'tickets' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Create Exit Ticket
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate end-of-session prompts that help you understand what students
                learned and what needs reinforcement.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Session Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Today's main topic"
                    className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Ticket Format
                  </label>
                  <select className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50">
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
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Exit Ticket'}
              </button>
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Analyze Responses
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Paste student responses to get AI-powered analysis of common patterns,
                misconceptions, and suggested interventions.
              </p>
              <textarea
                placeholder="Paste student responses here (one per line)..."
                className="w-full h-64 p-4 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
              />
              <button
                disabled={loading}
                className="mt-4 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {pollResult && activeTab === 'polls' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Generated Poll
                </h2>
                <ExportButton data={pollResult} filename="poll-questions" title="Export" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-scholarly-wine/10 rounded-lg border border-scholarly-wine/20">
                  <p className="font-medium text-brand-navy">
                    {pollResult.question}
                  </p>
                  <p className="text-sm text-scholarly-wine mt-2">
                    Purpose: {pollResult.pedagogicalPurpose}
                  </p>
                </div>
                <div className="space-y-2">
                  {pollResult.options.map((option, index) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border ${
                        option.isCorrect
                          ? 'border-scholarly-sage/30 bg-scholarly-sage/10'
                          : 'border-brand-border-subtle bg-brand-bg/50'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="font-medium text-brand-navy text-sm">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <div className="flex-1">
                          <p className="text-brand-text text-sm">{option.text}</p>
                          <p className="text-sm text-brand-text-light mt-1 italic">
                            {option.explanation}
                          </p>
                        </div>
                        {option.isCorrect && (
                          <span className="text-xs font-medium text-scholarly-sage bg-scholarly-sage/10 px-2 py-1 rounded">
                            Correct
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {pollResult.followUpQuestions.length > 0 && (
                  <div className="mt-4 p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                    <h4 className="font-medium text-brand-navy mb-2 text-sm">Follow-up Questions:</h4>
                    <ul className="space-y-1 text-sm text-brand-text">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Exit Ticket
                </h2>
                <ExportButton data={ticketResult} filename="exit-ticket" title="Export" />
              </div>
              <div className="space-y-4">
                {ticketResult.prompts.map((prompt, index) => (
                  <div key={index} className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-scholarly-wine/10 text-scholarly-wine rounded mb-2">
                      {prompt.type}
                    </span>
                    <p className="font-medium text-brand-navy text-sm">{prompt.prompt}</p>
                    <p className="text-sm text-brand-text-light mt-2">
                      Purpose: {prompt.purpose}
                    </p>
                  </div>
                ))}
                {ticketResult.analysisGuidelines.length > 0 && (
                  <div className="p-4 bg-scholarly-wine/10 rounded-lg border border-scholarly-wine/20">
                    <h4 className="font-medium text-scholarly-wine mb-2 text-sm">
                      How to Analyze Responses:
                    </h4>
                    <ul className="space-y-1 text-sm text-brand-text">
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
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-brand-bg rounded-full mb-4">
                <DocumentTextIcon className="h-10 w-10 text-brand-text-light" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-xs">
                Create polls or exit tickets to gather real-time feedback from your students.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      )}

      {/* Best Practices - only show on non-learn tabs */}
      {activeTab !== 'learn' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-scholarly-wine/5 to-scholarly-wine/10 rounded-xl p-6 border border-scholarly-wine/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-wine" />
          <h3 className="font-medium text-brand-navy">Tips for Using Polls Effectively</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-text">
          <div>
            <h4 className="font-medium text-scholarly-wine mb-2">During Class:</h4>
            <ul className="space-y-1">
              <li>• Poll every 15-20 minutes to check understanding</li>
              <li>• Have students discuss with a neighbor before re-answering</li>
              <li>• Wait before showing the right answer—let them think</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-scholarly-wine mb-2">What to Do with Results:</h4>
            <ul className="space-y-1">
              <li>• Most got it wrong? Explain it a different way</li>
              <li>• About half right? Have them discuss, then poll again</li>
              <li>• Most got it right? Move on to the next topic</li>
            </ul>
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default FormativeAssessment;
