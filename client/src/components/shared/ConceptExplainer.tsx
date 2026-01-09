import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Citation {
  authors: string;
  year: string;
  title: string;
  source: string;
  finding?: string;
}

interface ConceptExplainerProps {
  // Core concept info
  conceptName: string;
  tagline: string;

  // The "What" - Plain language explanation
  simpleExplanation: string;

  // The "Why" - Why it matters
  whyItMatters: string[];

  // The "How" - Practical applications
  practicalTips: string[];

  // Common pitfalls or misconceptions
  commonMistakes?: string[];

  // Visual metaphor or analogy
  metaphor?: {
    title: string;
    description: string;
  };

  // Key statistics or findings
  keyStats?: Array<{
    stat: string;
    context: string;
  }>;

  // Academic citations (optional - can be provided separately)
  citations?: Citation[];

  // Visual styling
  color?: 'sage' | 'terracotta' | 'slate' | 'wine' | 'gold' | 'navy';
  icon?: React.ReactNode;
}

const ConceptExplainer: React.FC<ConceptExplainerProps> = ({
  conceptName,
  tagline,
  simpleExplanation,
  whyItMatters,
  practicalTips,
  commonMistakes,
  metaphor,
  keyStats,
  citations,
  color = 'gold',
  icon,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'practice' | 'research'>('overview');
  const [showAllCitations, setShowAllCitations] = useState(false);

  const colorSchemes = {
    sage: {
      primary: 'scholarly-sage',
      bg: 'bg-scholarly-sage/5',
      bgHover: 'hover:bg-scholarly-sage/10',
      border: 'border-scholarly-sage/20',
      text: 'text-scholarly-sage',
      gradient: 'from-scholarly-sage/10 to-scholarly-sage/5',
      statBg: 'bg-scholarly-sage/10',
      activeBg: 'bg-scholarly-sage',
    },
    terracotta: {
      primary: 'scholarly-terracotta',
      bg: 'bg-scholarly-terracotta/5',
      bgHover: 'hover:bg-scholarly-terracotta/10',
      border: 'border-scholarly-terracotta/20',
      text: 'text-scholarly-terracotta',
      gradient: 'from-scholarly-terracotta/10 to-scholarly-terracotta/5',
      statBg: 'bg-scholarly-terracotta/10',
      activeBg: 'bg-scholarly-terracotta',
    },
    slate: {
      primary: 'scholarly-slate',
      bg: 'bg-scholarly-slate/5',
      bgHover: 'hover:bg-scholarly-slate/10',
      border: 'border-scholarly-slate/20',
      text: 'text-scholarly-slate',
      gradient: 'from-scholarly-slate/10 to-scholarly-slate/5',
      statBg: 'bg-scholarly-slate/10',
      activeBg: 'bg-scholarly-slate',
    },
    wine: {
      primary: 'scholarly-wine',
      bg: 'bg-scholarly-wine/5',
      bgHover: 'hover:bg-scholarly-wine/10',
      border: 'border-scholarly-wine/20',
      text: 'text-scholarly-wine',
      gradient: 'from-scholarly-wine/10 to-scholarly-wine/5',
      statBg: 'bg-scholarly-wine/10',
      activeBg: 'bg-scholarly-wine',
    },
    gold: {
      primary: 'brand-gold',
      bg: 'bg-brand-gold/5',
      bgHover: 'hover:bg-brand-gold/10',
      border: 'border-brand-gold/20',
      text: 'text-brand-gold',
      gradient: 'from-brand-gold/10 to-brand-gold/5',
      statBg: 'bg-brand-gold/10',
      activeBg: 'bg-brand-gold',
    },
    navy: {
      primary: 'brand-navy',
      bg: 'bg-brand-navy/5',
      bgHover: 'hover:bg-brand-navy/10',
      border: 'border-brand-navy/20',
      text: 'text-brand-navy',
      gradient: 'from-brand-navy/10 to-brand-navy/5',
      statBg: 'bg-brand-navy/10',
      activeBg: 'bg-brand-navy',
    },
  };

  const scheme = colorSchemes[color];

  const tabs = [
    { id: 'overview', label: 'The Concept', icon: LightBulbIcon },
    { id: 'practice', label: 'In Practice', icon: BeakerIcon },
    { id: 'research', label: 'The Research', icon: BookOpenIcon },
  ];

  return (
    <div className={`rounded-2xl border ${scheme.border} ${scheme.bg} overflow-hidden`}>
      {/* Header with tagline */}
      <div className={`p-6 bg-gradient-to-r ${scheme.gradient}`}>
        <div className="flex items-start space-x-4">
          {icon && (
            <div className={`p-3 rounded-xl ${scheme.statBg}`}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-brand-navy mb-1">
              {conceptName}
            </h3>
            <p className={`text-sm font-medium ${scheme.text}`}>
              {tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border-subtle bg-white/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeSection === tab.id
                ? `${scheme.text} border-b-2 border-current bg-white`
                : 'text-brand-text-light hover:text-brand-navy hover:bg-white/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {/* Overview Tab */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Simple Explanation */}
              <div>
                <p className="font-serif text-brand-text leading-relaxed text-base">
                  {simpleExplanation}
                </p>
              </div>

              {/* Metaphor Card */}
              {metaphor && (
                <div className={`p-4 rounded-xl ${scheme.statBg} border ${scheme.border}`}>
                  <div className="flex items-start space-x-3">
                    <SparklesIcon className={`h-5 w-5 ${scheme.text} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="text-sm font-semibold text-brand-navy mb-1">
                        {metaphor.title}
                      </h4>
                      <p className="text-sm text-brand-text leading-relaxed">
                        {metaphor.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Statistics */}
              {keyStats && keyStats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {keyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-brand-border-subtle"
                    >
                      <p className={`text-2xl font-bold ${scheme.text} mb-1`}>
                        {stat.stat}
                      </p>
                      <p className="text-xs text-brand-text-light leading-relaxed">
                        {stat.context}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Why It Matters */}
              <div>
                <h4 className="flex items-center space-x-2 text-sm font-semibold text-brand-navy mb-3">
                  <AcademicCapIcon className={`h-4 w-4 ${scheme.text}`} />
                  <span>Why This Matters for Learning</span>
                </h4>
                <ul className="space-y-2">
                  {whyItMatters.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircleIcon className={`h-5 w-5 ${scheme.text} flex-shrink-0 mt-0.5`} />
                      <span className="text-sm text-brand-text leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Practice Tab */}
          {activeSection === 'practice' && (
            <div className="space-y-6">
              {/* Practical Tips */}
              <div>
                <h4 className="flex items-center space-x-2 text-sm font-semibold text-brand-navy mb-4">
                  <LightBulbIcon className={`h-4 w-4 ${scheme.text}`} />
                  <span>How to Apply This</span>
                </h4>
                <div className="space-y-3">
                  {practicalTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle group hover:border-brand-gold/30 transition-colors"
                    >
                      <div className={`w-6 h-6 rounded-full ${scheme.statBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xs font-bold ${scheme.text}`}>{index + 1}</span>
                      </div>
                      <p className="text-sm text-brand-text leading-relaxed flex-1">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              {commonMistakes && commonMistakes.length > 0 && (
                <div className="p-4 bg-scholarly-terracotta/5 rounded-xl border border-scholarly-terracotta/20">
                  <h4 className="flex items-center space-x-2 text-sm font-semibold text-scholarly-terracotta mb-3">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>Common Pitfalls to Avoid</span>
                  </h4>
                  <ul className="space-y-2">
                    {commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-brand-text">
                        <span className="text-scholarly-terracotta mt-1">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Research Tab */}
          {activeSection === 'research' && (
            <div className="space-y-4">
              <p className="text-sm text-brand-text-light mb-4">
                This concept is supported by decades of cognitive science and educational psychology research.
              </p>

              {/* Show first 2 citations, then expand */}
              {citations && citations.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {citations.slice(0, showAllCitations ? citations.length : 2).map((citation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white rounded-lg border border-brand-border-subtle"
                      >
                        <div className="flex items-start space-x-3">
                          <BookOpenIcon className={`h-5 w-5 ${scheme.text} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-brand-navy">
                              {citation.authors} ({citation.year})
                            </p>
                            <p className="text-sm text-brand-text mt-1 italic">
                              {citation.title}
                            </p>
                            <p className="text-xs text-brand-text-light mt-1">
                              {citation.source}
                            </p>
                            {citation.finding && (
                              <div className={`mt-3 p-3 rounded-lg ${scheme.bg}`}>
                                <p className="text-xs text-brand-text">
                                  <span className="font-semibold">Key finding: </span>
                                  {citation.finding}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {citations.length > 2 && !showAllCitations && (
                    <button
                      onClick={() => setShowAllCitations(true)}
                      className={`flex items-center space-x-2 text-sm font-medium ${scheme.text} ${scheme.bgHover} px-4 py-2 rounded-lg transition-colors`}
                    >
                      <span>Show {citations.length - 2} more sources</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-brand-text">
                  Research citations coming soon. This concept is grounded in established learning science principles.
                </p>
              )}

              <p className="text-xs text-brand-text-light italic pt-4 border-t border-brand-border-subtle">
                These tools apply research-supported principles to help you design more effective learning experiences.
                Results may vary based on your specific context and student population.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ConceptExplainer;

// Pre-configured concept data for all pedagogical principles
export const conceptData = {
  spacedRepetition: {
    conceptName: 'Spaced Repetition',
    tagline: 'Strategic timing transforms how we remember',
    simpleExplanation: 'Your brain forgets in a predictable pattern—rapidly at first, then more slowly. But each time you review something at just the right moment, you reset this "forgetting curve" and extend how long you will remember it. Space out your review sessions, and the same amount of study time produces dramatically better long-term retention.',
    whyItMatters: [
      'Memory consolidation happens over time, not all at once',
      'Each well-timed review makes the next forgetting period longer',
      'The same study time, distributed differently, can double retention',
      'This effect works across all types of material and all ages',
    ],
    practicalTips: [
      'Review key concepts right before introducing new material that builds on them',
      'Build brief review moments into class openings ("Last week we discussed...")',
      'Assign homework that revisits concepts from previous weeks, not just the current one',
      'Use low-stakes quizzes throughout the semester to trigger retrieval',
      'Share the science with students so they can space their own studying',
    ],
    commonMistakes: [
      'Assuming students will remember content from early in the semester without review',
      'Scheduling all practice on a topic in one week, then never returning to it',
      'Relying on final exam "cramming" rather than distributed practice',
    ],
    metaphor: {
      title: 'Think of it like watering a plant',
      description: 'Pouring a gallon of water on a plant once a month will drown it then let it dry out. But a cup of water every few days keeps it healthy. Memory works similarly—regular, spaced "watering" keeps knowledge alive.',
    },
    keyStats: [
      { stat: '200%', context: 'Improvement in long-term retention when practice is spaced vs. massed' },
      { stat: '50%', context: 'Less study time needed to reach the same level of mastery with spacing' },
    ],
  },

  cognitiveLoad: {
    conceptName: 'Cognitive Load Theory',
    tagline: 'Working memory is the bottleneck of learning',
    simpleExplanation: 'Your working memory—the mental workspace where thinking happens—can only juggle about four items at once. When we overwhelm it with too much information, competing demands, or confusing layouts, learning shuts down. Effective teaching manages this limited capacity like a precious resource.',
    whyItMatters: [
      'If working memory is overloaded, nothing gets stored in long-term memory',
      'Some load is unavoidable (the inherent complexity of the material)',
      'Much load is self-inflicted through poor design choices',
      'Experts and novices have vastly different capacities—what is easy for you may overwhelm students',
    ],
    practicalTips: [
      'Break complex procedures into clearly labeled steps',
      'Remove decorative images that do not directly support learning',
      'Place labels directly on diagrams rather than in separate legends',
      'Build from simple to complex, letting students automate basics first',
      'Provide worked examples before asking students to solve problems independently',
    ],
    commonMistakes: [
      'Cramming too much text onto slides',
      'Explaining while students read—their attention splits and both suffer',
      'Assuming students can integrate information from multiple sources as easily as you can',
      'Adding "engaging" elements that actually distract from the core content',
    ],
    metaphor: {
      title: 'Your brain is like a small table',
      description: 'Imagine trying to assemble a puzzle on a tiny table. If you dump all the pieces at once, they fall off. But if you work with a few pieces at a time, you can build something complex. Working memory is that small table.',
    },
    keyStats: [
      { stat: '4±1', context: 'Items that can be held in working memory simultaneously' },
      { stat: '50%', context: 'Reduction in learning when split attention occurs' },
    ],
  },

  formativeAssessment: {
    conceptName: 'Formative Assessment',
    tagline: 'Check for understanding while you can still do something about it',
    simpleExplanation: 'Formative assessment is not about grades—it is about getting real-time information on what students understand so you can adjust. When teachers regularly check comprehension and act on what they find, learning improves more than almost any other intervention we have discovered.',
    whyItMatters: [
      'Students often do not know what they do not understand',
      'Misunderstandings compound—catching them early prevents larger problems',
      'The feedback loop helps both teachers and students adjust in real time',
      'Low-stakes assessment reduces anxiety while improving learning',
    ],
    practicalTips: [
      'Poll every 15-20 minutes during class to check understanding',
      'Use "exit tickets" to identify what students found confusing',
      'Have students discuss with a neighbor before you reveal answers',
      'Adjust your teaching based on what polls reveal—do not just collect data',
      'Focus on common misconceptions, not just right/wrong answers',
    ],
    commonMistakes: [
      'Collecting assessment data but not changing instruction based on it',
      'Only assessing at the end of units when it is too late to adjust',
      'Making formative assessments high-stakes, which defeats the purpose',
      'Asking "Any questions?" and assuming silence means understanding',
    ],
    metaphor: {
      title: 'Like a GPS, not a final exam',
      description: 'A GPS does not just tell you at the end whether you reached your destination. It continuously monitors your location and helps you adjust along the way. Formative assessment is your teaching GPS.',
    },
    keyStats: [
      { stat: '0.4-0.7', context: 'Effect size—among the most powerful educational interventions known' },
      { stat: '55%', context: 'Reduction in achievement gaps when formative assessment is implemented well' },
    ],
  },

  metacognition: {
    conceptName: 'Metacognition',
    tagline: 'Thinking about thinking transforms learning',
    simpleExplanation: 'Students who can accurately assess what they know and do not know learn more efficiently. But most students are poor judges of their own understanding—they confuse familiarity with mastery. Teaching students to monitor and regulate their own learning is one of the highest-leverage skills we can develop.',
    whyItMatters: [
      'Illusions of competence waste study time and lead to unpleasant surprises',
      'Self-regulated learners adjust strategies when something is not working',
      'Metacognitive skills transfer across subjects and last a lifetime',
      'These skills can be explicitly taught—they are not fixed traits',
    ],
    practicalTips: [
      'Have students predict their test performance before they see results',
      'Teach students to self-test rather than just reread',
      'Ask "How do you know you understand this?" and discuss answers',
      'Model your own metacognition: "I am not sure about this, so I will check..."',
      'Provide feedback on the accuracy of student self-assessments',
    ],
    commonMistakes: [
      'Assuming students know how to study effectively',
      'Equating time spent with learning accomplished',
      'Not addressing the illusion of competence directly',
      'Teaching content without teaching how to learn content',
    ],
    metaphor: {
      title: 'Be the coach in your own head',
      description: 'Expert athletes do not just practice—they monitor their performance, identify weaknesses, and adjust their training. Metacognition is developing that internal coach for learning.',
    },
    keyStats: [
      { stat: '23%', context: 'Of students accurately predict their test performance' },
      { stat: '0.69', context: 'Effect size of metacognitive interventions on achievement' },
    ],
  },

  activeLearning: {
    conceptName: 'Active Learning',
    tagline: 'Learning happens through doing, not just listening',
    simpleExplanation: 'Students learn more when they actively process information—solving problems, discussing, explaining—rather than passively receiving it. This is one of the most robust findings in education research. The discomfort of active engagement is not a sign of failure; it is a sign that learning is happening.',
    whyItMatters: [
      'Active processing creates stronger memory traces',
      'Struggling with material is part of learning, not a sign it is failing',
      'Passive formats feel comfortable but produce less durable learning',
      'Even brief activities significantly improve retention over pure lecture',
    ],
    practicalTips: [
      'Break lectures every 10-15 minutes with a think-pair-share',
      'Have students solve a problem before you show the solution',
      'Use peer instruction: let students teach each other',
      'Make it safe to be wrong—learning requires productive struggle',
      'Warn students that active learning feels harder but works better',
    ],
    commonMistakes: [
      'Equating "activity" with "learning"—the mental activity matters, not just physical',
      'Giving up on active learning because students initially resist',
      'Not providing enough structure for productive discussion',
      'Doing all the cognitive work yourself instead of making students think',
    ],
    metaphor: {
      title: 'You cannot learn to swim by watching',
      description: 'No matter how many videos of swimming you watch, you will not learn to swim without getting in the water. Academic learning is similar—real understanding requires mental effort, not just exposure.',
    },
    keyStats: [
      { stat: '6%', context: 'Average exam score improvement in active learning classes' },
      { stat: '55%', context: 'Reduction in failure rates compared to traditional lecture' },
    ],
  },

  growthMindset: {
    conceptName: 'Growth Mindset',
    tagline: 'How we think about ability shapes how we learn',
    simpleExplanation: 'Students who believe their abilities can grow through effort tend to embrace challenges, persist through difficulty, and ultimately learn more. Students who see ability as fixed tend to avoid challenges that might reveal inadequacy. The way we talk about learning can shift these beliefs.',
    whyItMatters: [
      'Beliefs about intelligence become self-fulfilling prophecies',
      'How we praise and frame struggle shapes student mindsets',
      'A growth mindset makes challenge feel like opportunity, not threat',
      'These beliefs are malleable—even brief interventions can shift them',
    ],
    practicalTips: [
      'Praise effort and strategy, not ability ("You worked hard" not "You are so smart")',
      'Normalize struggle as part of learning, not evidence of inadequacy',
      'Share stories of experts who struggled before succeeding',
      'Frame challenges as opportunities to grow, not tests of fixed ability',
      'Provide process feedback: "Try this strategy" rather than just "good job"',
    ],
    commonMistakes: [
      'Praising intelligence, which makes students avoid challenges',
      'Treating struggle as a sign something is wrong',
      'Oversimplifying growth mindset as just "trying harder"',
      'Ignoring that some students face real structural barriers',
    ],
    metaphor: {
      title: 'Your brain is like a muscle',
      description: 'Just as muscles get stronger with exercise—even when it burns—neural connections strengthen when you push beyond comfort. The struggle is the growth happening.',
    },
    keyStats: [
      { stat: '0.3', context: 'GPA improvement from brief growth mindset interventions' },
      { stat: '40%', context: 'Of struggling students improved grades after a short intervention' },
    ],
  },

  desirableDifficulties: {
    conceptName: 'Desirable Difficulties',
    tagline: 'Some struggle is the price of durable learning',
    simpleExplanation: 'Learning that feels easy often does not last. When we introduce certain challenges—mixing up practice, spacing it out, having students generate answers—it slows initial performance but dramatically improves long-term retention and transfer. The difficulty is "desirable" because it builds stronger learning.',
    whyItMatters: [
      'Fluent performance during learning often does not predict later retention',
      'Struggle during practice strengthens retrieval pathways',
      'What feels harder often works better in the long run',
      'Students (and teachers) often prefer ineffective methods that feel easier',
    ],
    practicalTips: [
      'Interleave different problem types rather than blocking by category',
      'Have students generate answers before showing solutions',
      'Space practice over time rather than massing it together',
      'Test students on material rather than just having them restudy',
      'Explain to students why these harder methods work better',
    ],
    commonMistakes: [
      'Making things difficult in ways that do not benefit learning',
      'Abandoning effective methods because they feel hard',
      'Equating smooth performance in class with learning accomplished',
      'Not distinguishing "desirable" difficulty from mere confusion',
    ],
    metaphor: {
      title: 'Like weight training for your brain',
      description: 'If lifting weights were easy, it would not build muscle. The resistance is what triggers growth. Similarly, cognitive resistance builds stronger learning—but only the right kind of resistance.',
    },
    keyStats: [
      { stat: '43%', context: 'Higher scores on delayed tests from interleaved vs. blocked practice' },
      { stat: '10%', context: 'Lower performance during practice, but much higher on later tests' },
    ],
  },

  collaborativeLearning: {
    conceptName: 'Collaborative Learning',
    tagline: 'Learning is social, but structure matters',
    simpleExplanation: 'Students often learn better working together than alone—but only when collaboration is well-designed. Effective group work requires individual accountability, genuine interdependence, and thoughtful composition. The learning happens in the discussion and negotiation of meaning.',
    whyItMatters: [
      'Explaining to others deepens your own understanding',
      'Peers can often explain things in ways that resonate',
      'Social learning develops communication and teamwork skills',
      'Diverse perspectives reveal gaps in understanding',
    ],
    practicalTips: [
      'Structure groups so everyone has a clear, necessary role',
      'Include individual accountability—everyone must contribute',
      'Teach collaboration skills explicitly; do not assume students have them',
      'Use think-pair-share for quick collaborative moments',
      'Debrief group work: what worked? What would you change?',
    ],
    commonMistakes: [
      'Letting students just divide and conquer work',
      'Not structuring tasks so they require genuine collaboration',
      'Assuming groups will function well without guidance',
      'Grading only the product, not the collaborative process',
    ],
    metaphor: {
      title: 'Like a jazz ensemble, not an orchestra',
      description: 'In an orchestra, everyone follows the conductor. In jazz, musicians respond to each other in real time. Good collaborative learning is more like jazz—students building on and responding to each other\'s ideas.',
    },
    keyStats: [
      { stat: '0.51', context: 'Effect size of small-group learning on achievement' },
      { stat: '900+', context: 'Studies confirming cooperative learning benefits' },
    ],
  },

  transferLearning: {
    conceptName: 'Transfer of Learning',
    tagline: 'The ultimate test—using knowledge in new situations',
    simpleExplanation: 'Applying what you learned in one context to a new situation is the goal of education, but it is surprisingly hard to achieve. Transfer does not happen automatically—it requires varied practice, explicit attention to underlying principles, and deliberate work on recognizing when knowledge applies.',
    whyItMatters: [
      'The real world rarely presents problems in classroom format',
      'Near transfer (similar contexts) is easier than far transfer',
      'Without transfer, school learning stays trapped in school',
      'Transfer is a skill that can be developed with the right practice',
    ],
    practicalTips: [
      'Use diverse examples, not just variations of the same scenario',
      'Explicitly discuss how principles apply across different contexts',
      'Have students practice identifying when a concept is relevant',
      'Compare and contrast cases to highlight underlying structure',
      'Test students in different formats than they learned in',
    ],
    commonMistakes: [
      'Assuming transfer will happen automatically',
      'Teaching only one type of example or context',
      'Testing in the same format as instruction',
      'Not explicitly addressing "when does this apply?"',
    ],
    metaphor: {
      title: 'Learning to see the deep structure',
      description: 'A chess grandmaster sees patterns that novices miss. Transfer is about learning to see the deep structure of problems—the underlying principles—rather than just surface features.',
    },
    keyStats: [
      { stat: '62%', context: 'Of training does not transfer to the job without deliberate effort' },
      { stat: '200%', context: 'More transfer when underlying principles are explicitly taught' },
    ],
  },

  misconceptions: {
    conceptName: 'Misconception Correction',
    tagline: 'You cannot pour new knowledge into occupied space',
    simpleExplanation: 'Students do not arrive as blank slates—they bring existing ideas that may be incorrect. These misconceptions are stubborn because they form coherent (if wrong) mental models. Simply presenting correct information rarely dislodges them. Conceptual change requires creating cognitive conflict.',
    whyItMatters: [
      'Prior knowledge is the foundation for new learning—accurate or not',
      'Misconceptions filter how students interpret new information',
      'Students may "learn" correct answers while retaining wrong beliefs',
      'Targeted intervention works better than generic correction',
    ],
    practicalTips: [
      'Probe for misconceptions before teaching a concept',
      'Create situations where students\' predictions fail',
      'Ask students to explain why incorrect answers are wrong',
      'Use common errors as teaching opportunities',
      'Provide the correct answer and explain why the alternative seems reasonable',
    ],
    commonMistakes: [
      'Assuming stating the correct answer corrects the misconception',
      'Not probing for what students already believe',
      'Moving on before misconceptions are resolved',
      'Not acknowledging why the misconception seemed sensible',
    ],
    metaphor: {
      title: 'Like debugging code',
      description: 'You cannot fix a bug just by adding correct code—you have to find and remove the faulty logic. Misconceptions are bugs in student thinking that need to be identified and specifically addressed.',
    },
    keyStats: [
      { stat: '75%', context: 'Of students retain misconceptions after traditional instruction' },
      { stat: '3x', context: 'More effective when misconceptions are directly addressed' },
    ],
  },

  inclusiveDesign: {
    conceptName: 'Universal Design for Learning',
    tagline: 'Designing for variability helps everyone',
    simpleExplanation: 'Learners vary enormously in how they perceive information, engage with material, and express understanding. Universal Design for Learning (UDL) provides multiple means of each, accommodating this natural variability. What helps students with specific needs often helps everyone.',
    whyItMatters: [
      'There is no "average" learner—everyone has a unique profile',
      'Barriers in design, not deficits in learners, often cause problems',
      'Flexibility benefits all students, not just those with disabilities',
      'Proactive design is more efficient than reactive accommodation',
    ],
    practicalTips: [
      'Provide content in multiple formats (text, audio, visual)',
      'Offer choices in how students demonstrate understanding',
      'Use captions, transcripts, and alt text as standard practice',
      'Build in flexibility from the start rather than accommodating after',
      'Ask students what helps them learn and actually use that information',
    ],
    commonMistakes: [
      'Treating UDL as only about disability accommodation',
      'Providing options without guidance on when each works best',
      'Adding complexity without clear learning benefit',
      'Designing for an imaginary "typical" student',
    ],
    metaphor: {
      title: 'Curb cuts for learning',
      description: 'Curb cuts were designed for wheelchair users but help everyone—parents with strollers, travelers with luggage, delivery workers. Good learning design works the same way.',
    },
    keyStats: [
      { stat: '1 in 5', context: 'Students have some form of learning difference' },
      { stat: '85%', context: 'Of UDL benefits go to students without identified disabilities' },
    ],
  },

  caseBased: {
    conceptName: 'Case-Based Learning',
    tagline: 'Real scenarios build real expertise',
    simpleExplanation: 'Learning from authentic cases helps students develop problem-solving skills and see how abstract concepts apply in practice. Cases create memorable "anchors" that students can reference when facing similar situations. The complexity and ambiguity of real cases is a feature, not a bug.',
    whyItMatters: [
      'Experts think in cases—they recognize patterns from experience',
      'Cases bridge the gap between theory and practice',
      'Wrestling with complexity builds judgment, not just knowledge',
      'Memorable cases become reference points for future problems',
    ],
    practicalTips: [
      'Use authentic scenarios that don\'t have obvious answers',
      'Let students wrestle with complexity before providing guidance',
      'Build cases that require integrating multiple concepts',
      'Discuss what makes cases similar to and different from each other',
      'Create case libraries that students can reference later',
    ],
    commonMistakes: [
      'Oversimplifying cases to the point they lose authenticity',
      'Providing the "right answer" too quickly',
      'Using cases only as examples rather than problems to solve',
      'Not helping students extract transferable principles',
    ],
    metaphor: {
      title: 'Building a mental case library',
      description: 'Experienced doctors don\'t just know facts—they have a library of cases in their heads. When they see a new patient, they pattern-match against this library. Cases build that mental reference collection.',
    },
    keyStats: [
      { stat: '40%', context: 'Better retention of concepts learned through cases' },
      { stat: '2x', context: 'More likely to apply learning to novel situations' },
    ],
  },

  elaborativeInterrogation: {
    conceptName: 'Elaborative Interrogation',
    tagline: 'Asking "Why?" deepens everything',
    simpleExplanation: 'Asking "Why?" and "How?" forces deeper processing than simply reading or highlighting. Generating explanations—even imperfect ones—connects new information to existing knowledge and creates stronger memories. The effort of constructing understanding, not just receiving it, is what builds expertise.',
    whyItMatters: [
      'Explaining forces you to identify gaps in understanding',
      'Connections to prior knowledge make information more memorable',
      'Generation is more effective than just receiving information',
      'Deep processing beats shallow processing every time',
    ],
    practicalTips: [
      'Ask students to explain why facts make sense',
      'Have students generate explanations before you provide yours',
      'Use "Why do you think that works?" rather than just "Is that right?"',
      'Teach students to ask themselves explanatory questions',
      'Prompt for elaboration: "Tell me more about that"',
    ],
    commonMistakes: [
      'Providing all explanations rather than having students generate them',
      'Accepting surface-level answers without pushing deeper',
      'Not giving students time to think before answering',
      'Focusing on whether the answer is correct rather than the reasoning',
    ],
    metaphor: {
      title: 'Weaving new threads into existing fabric',
      description: 'New information sticks better when it\'s woven into what you already know. Asking "Why?" is the needle that makes those connections.',
    },
    keyStats: [
      { stat: '2x', context: 'Better recall when learners generate explanations' },
      { stat: '55%', context: 'Retention advantage of elaborative interrogation over rereading' },
    ],
  },

  adaptivePathways: {
    conceptName: 'Adaptive Learning',
    tagline: 'Meeting learners where they are',
    simpleExplanation: 'Students learn at different rates and bring different prior knowledge. Adaptive approaches assess where each student is and adjust difficulty, content, or pace accordingly. The goal is to keep everyone working at the edge of their ability—challenged but not overwhelmed.',
    whyItMatters: [
      'One-size-fits-all instruction leaves some students bored and others lost',
      'The zone of productive struggle is different for each student',
      'Personalization can approach the effectiveness of tutoring',
      'Technology makes adaptive approaches more scalable',
    ],
    practicalTips: [
      'Use diagnostic assessments to identify starting points',
      'Provide different pathways for students at different levels',
      'Allow students who understand to move ahead',
      'Give struggling students more scaffolding, not just more time',
      'Use mastery-based progression where possible',
    ],
    commonMistakes: [
      'Tracking students into permanent ability groups',
      'Adapting only pace, not content or support',
      'Letting struggling students fall further behind',
      'Not providing challenge for advanced students',
    ],
    metaphor: {
      title: 'Like a thermostat, not a furnace',
      description: 'A furnace blasts the same heat regardless of temperature. A thermostat adjusts based on conditions. Adaptive learning is the thermostat—constantly adjusting to maintain the optimal learning temperature.',
    },
    keyStats: [
      { stat: '0.76', context: 'Effect size of intelligent tutoring systems' },
      { stat: '2σ', context: 'The "2 sigma problem"—tutoring\'s advantage over classroom instruction' },
    ],
  },
};
