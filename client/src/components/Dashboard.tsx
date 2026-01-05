import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  PlusCircleIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  ChartBarIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  GlobeAltIcon,
  BookOpenIcon,
  UsersIcon,
  BeakerIcon,
  FireIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ArrowsRightLeftIcon,
  RocketLaunchIcon,
  EyeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const categories = [
    {
      name: 'Course Planning',
      description: 'Set up your course for success before the semester starts',
      principle: 'Good course design makes teaching easier all semester. These tools help you organize your course so students can follow along and remember what they learn.',
      icon: CalendarIcon,
      color: 'blue',
      tools: [
        {
          path: '/syllabus-analyzer',
          name: 'Syllabus Analyzer',
          icon: DocumentMagnifyingGlassIcon,
          desc: 'Analyze course structure',
          why: 'Identify gaps, redundancies, and misalignments in your course design before the semester starts.',
          bestFor: 'Course redesign, accreditation prep, new course development'
        },
        {
          path: '/learning-outcomes',
          name: 'Learning Outcomes',
          icon: LightBulbIcon,
          desc: 'Write clear goals for your course',
          why: 'Clear goals help you decide what to teach, how to test, and what students should focus on.',
          bestFor: 'Writing course objectives, making sure tests match what you taught'
        },
        {
          path: '/adaptive-pathways',
          name: 'Flexible Paths',
          icon: AdjustmentsHorizontalIcon,
          desc: 'Different routes for different students',
          badge: 'New',
          why: 'Students come in with different backgrounds. This helps you offer catch-up material or advanced options.',
          bestFor: 'Mixed-level classes, helping struggling students, challenging advanced students'
        },
        {
          path: '/spaced-repetition',
          name: 'Review Scheduling',
          icon: ArrowPathIcon,
          desc: 'Plan when to revisit material',
          badge: 'New',
          why: 'Cramming doesn\'t work. Spreading review sessions over time helps students remember much longer.',
          bestFor: 'Courses with lots of terms to memorize, cumulative material, exam prep'
        },
        {
          path: '/cognitive-load',
          name: 'Complexity Checker',
          icon: CpuChipIcon,
          desc: 'Is this too much at once?',
          badge: 'New',
          why: 'Students can only process so much at a time. This helps you break down complex material into digestible pieces.',
          bestFor: 'Difficult topics, improving slides, explaining hard concepts step-by-step'
        },
        {
          path: '/inclusive-design',
          name: 'Inclusive Design',
          icon: GlobeAltIcon,
          desc: 'Make materials work for everyone',
          badge: 'New',
          why: 'Materials that work for students with different needs actually help all students learn better.',
          bestFor: 'Checking accessibility, reaching more students, offering multiple ways to engage'
        },
      ],
    },
    {
      name: 'In the Classroom',
      description: 'Make class time more engaging and effective',
      principle: 'Students learn more when they\'re actively doing something, not just listening. These tools help you get students participating and thinking.',
      icon: PresentationChartLineIcon,
      color: 'green',
      tools: [
        {
          path: '/create',
          name: 'Lecture Builder',
          icon: PlusCircleIcon,
          desc: 'Create complete lecture materials',
          why: 'Turn your knowledge into organized slides, notes, and activities in minutes instead of hours.',
          bestFor: 'Preparing new topics, updating old lectures, creating consistent materials'
        },
        {
          path: '/active-learning',
          name: 'Activity Generator',
          icon: UserGroupIcon,
          desc: 'Quick activities to break up lectures',
          why: 'Students remember more when they discuss or practice, not just listen. Even 2-minute activities help.',
          bestFor: 'Making lectures interactive, getting students talking, checking if they understand'
        },
        {
          path: '/case-based',
          name: 'Case Studies',
          icon: BookOpenIcon,
          desc: 'Real-world scenarios for your topic',
          badge: 'New',
          why: 'Real examples help students see why concepts matter and how to apply them.',
          bestFor: 'Professional courses, showing real-world applications, making abstract ideas concrete'
        },
        {
          path: '/collaborative',
          name: 'Group Work',
          icon: UsersIcon,
          desc: 'Structure effective team activities',
          badge: 'New',
          why: 'Group work helps students learn from each other—when it\'s set up well.',
          bestFor: 'Projects, discussions, getting different viewpoints'
        },
        {
          path: '/elaborative',
          name: '"Why?" Questions',
          icon: BeakerIcon,
          desc: 'Questions that deepen understanding',
          badge: 'New',
          why: 'Asking students to explain "why" or "how" helps them connect new ideas to what they already know.',
          bestFor: 'Building real understanding, science classes, connecting ideas'
        },
        {
          path: '/desirable-difficulties',
          name: 'Productive Challenge',
          icon: FireIcon,
          desc: 'Make learning stick through effort',
          badge: 'New',
          why: 'When learning feels too easy, students often forget quickly. A little struggle helps memory.',
          bestFor: 'Mixing up practice, having students generate answers before showing them'
        },
      ],
    },
    {
      name: 'Quizzes & Feedback',
      description: 'Check understanding and help students improve',
      principle: 'Tests aren\'t just for grades—they actually help students learn. Quick checks during class let you see what\'s working and what needs more time.',
      icon: ClipboardDocumentCheckIcon,
      color: 'purple',
      tools: [
        {
          path: '/exercise-generator',
          name: 'Question Generator',
          icon: ClipboardDocumentCheckIcon,
          desc: 'Create quizzes and practice problems',
          why: 'Mix up your question types to test different skills and keep students engaged.',
          bestFor: 'Making quizzes, practice problems, exam questions'
        },
        {
          path: '/formative-assessment',
          name: 'Quick Polls',
          icon: ChatBubbleLeftRightIcon,
          desc: 'Check understanding in real-time',
          badge: 'New',
          why: 'A quick poll shows you if students get it—so you can adjust before moving on.',
          bestFor: 'During class, spotting confusion early, deciding when to slow down'
        },
        {
          path: '/misconceptions',
          name: 'Common Mistakes',
          icon: ExclamationTriangleIcon,
          desc: 'Find and fix misunderstandings',
          badge: 'New',
          why: 'Students often have wrong ideas that block new learning. Finding these early saves time later.',
          bestFor: 'Diagnosing problems, fixing wrong assumptions, prereq gaps'
        },
        {
          path: '/metacognition',
          name: 'Study Skills',
          icon: QuestionMarkCircleIcon,
          desc: 'Help students learn how to learn',
          badge: 'New',
          why: 'Students who can judge their own understanding and adjust their studying do better.',
          bestFor: 'Teaching study strategies, helping students self-assess, building independence'
        },
        {
          path: '/transfer',
          name: 'Apply to New Situations',
          icon: ArrowsRightLeftIcon,
          desc: 'Practice using knowledge in new contexts',
          badge: 'New',
          why: 'Students often struggle to use what they learned in new situations. These activities build that skill.',
          bestFor: 'Application problems, connecting to other fields, real-world use'
        },
      ],
    },
    {
      name: 'Improve Your Teaching',
      description: 'See what\'s working and get better over time',
      principle: 'Great teachers keep improving. These tools help you see patterns in how students are doing and find ways to help them succeed.',
      icon: ChartBarIcon,
      color: 'orange',
      tools: [
        {
          path: '/growth-mindset',
          name: 'Encouraging Feedback',
          icon: RocketLaunchIcon,
          desc: 'Help students persist through challenges',
          badge: 'New',
          why: 'How you talk about struggle matters. The right words help students keep trying instead of giving up.',
          bestFor: 'Writing feedback, encouraging struggling students, building resilience'
        },
        {
          path: '/student-perspective',
          name: 'Beginner\'s View',
          icon: EyeIcon,
          desc: 'See your course as students see it',
          badge: 'New',
          why: 'Experts forget what it\'s like to be confused. This helps you spot where students might get lost.',
          bestFor: 'Finding confusing parts, simplifying explanations, catching jargon'
        },
        {
          path: '/learning-science',
          name: 'Teaching Tips',
          icon: SparklesIcon,
          desc: 'What research says works',
          badge: 'New',
          why: 'Get practical suggestions based on what research shows helps students learn.',
          bestFor: 'Trying new approaches, getting ideas, professional growth'
        },
        {
          path: '/course-analytics',
          name: 'Course Dashboard',
          icon: ChartBarIcon,
          desc: 'See how students are doing overall',
          badge: 'New',
          why: 'Spot patterns in where students struggle so you can address problems early.',
          bestFor: 'Finding trouble spots, tracking progress, making mid-course adjustments'
        },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hover: 'hover:bg-green-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
    };
    return colors[color] || colors.blue;
  };

  const workflowSteps = [
    { step: 1, name: 'Plan', desc: 'Analyze syllabus & design outcomes', timing: 'Start of term' },
    { step: 2, name: 'Design', desc: 'Create lectures, activities & assessments', timing: 'Weekly prep' },
    { step: 3, name: 'Teach', desc: 'Deliver with real-time feedback tools', timing: 'During class' },
    { step: 4, name: 'Improve', desc: 'Review analytics & refine approach', timing: 'Ongoing' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-brand-navy mb-6 leading-tight">
          Teaching, Elevated.
        </h1>
        <p className="text-xl text-brand-text mb-6 max-w-3xl mx-auto leading-relaxed">
          Simple, practical tools that help your students learn better and remember longer.
          No education degree required—just good teaching made easier.
        </p>
        <p className="text-base text-gray-500 mb-10 max-w-2xl mx-auto">
          Research shows that small changes to how we teach can make a big difference in student outcomes.
          These tools make it easy to apply what works.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/create"
            className="inline-flex items-center px-8 py-4 bg-brand-navy text-white font-semibold rounded-xl shadow-card hover:bg-opacity-90 transition-all"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Lecture Package
          </Link>
          <Link
            to="/syllabus-analyzer"
            className="inline-flex items-center px-8 py-4 bg-white text-brand-navy font-semibold rounded-xl border-2 border-brand-navy hover:bg-brand-navy hover:text-white transition-all"
          >
            Analyze Your Syllabus
          </Link>
        </div>
      </motion.div>

      {/* Why These Tools Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl shadow-card p-8 mb-16 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-3">
            Why These Tools Work
          </h2>
          <p className="text-brand-text max-w-2xl mx-auto">
            Our instincts about learning are often wrong. Here's what research shows actually helps students.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="font-semibold text-brand-navy mb-2">What Feels Productive</h3>
            <p className="text-sm text-gray-600">
              Re-reading notes, highlighting, and cramming before exams feel like studying—but students forget most of it within weeks.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-brand-navy mb-2">What Actually Sticks</h3>
            <p className="text-sm text-gray-600">
              Testing yourself, spreading study over time, and mixing up practice feel harder—but students remember much more, much longer.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-brand-navy mb-2">Small Changes, Big Results</h3>
            <p className="text-sm text-gray-600">
              You don't need to overhaul your course. Small tweaks to how you present material and test students can make a real difference.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-brand-navy to-indigo-800 rounded-2xl p-6 mb-16 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">21</p>
            <p className="text-sm text-blue-200">Evidence-Based Tools</p>
          </div>
          <div>
            <p className="text-3xl font-bold">15</p>
            <p className="text-sm text-blue-200">New Teaching Features</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm text-blue-200">Research Citations</p>
          </div>
          <div>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-blue-200">Integrated Hubs</p>
          </div>
        </div>
      </motion.div>

      {/* Teaching Workflow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-card p-8 mb-16 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-3">
            Your Teaching Workflow
          </h2>
          <p className="text-brand-text">
            Tools organized around how you actually teach
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => (
            <div key={step.step} className="relative text-center">
              <div className="w-16 h-16 rounded-full bg-brand-gold bg-opacity-10 border-2 border-brand-gold flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-gold">{step.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-2">{step.name}</h3>
              <p className="text-sm text-brand-text mb-2">{step.desc}</p>
              <span className="text-xs font-medium text-brand-gold uppercase tracking-wide">
                {step.timing}
              </span>
              {index < workflowSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-gold to-transparent -ml-8"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tool Categories */}
      <div className="space-y-12 mb-16">
        {categories.map((category, catIndex) => {
          const colorClasses = getColorClasses(category.color);
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + catIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-card p-8 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 rounded-xl ${colorClasses.bg} flex-shrink-0`}>
                  <category.icon className={`h-8 w-8 ${colorClasses.text}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-navy">{category.name}</h2>
                  <p className="text-brand-text">{category.description}</p>
                </div>
              </div>

              {/* Category Principle */}
              <div className={`${colorClasses.bg} rounded-lg p-4 mb-6 border-l-4 ${colorClasses.border.replace('border-', 'border-l-')}`}>
                <p className="text-sm text-gray-700 italic">{category.principle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`block p-4 rounded-xl border ${colorClasses.border} ${colorClasses.hover} transition-all group hover:shadow-md`}
                  >
                    <div className="flex items-start space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${colorClasses.bg} group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <tool.icon className={`h-5 w-5 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="font-semibold text-brand-navy">{tool.name}</h3>
                          {tool.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-brand-gold text-white rounded-full">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
                      </div>
                    </div>
                    {/* Why Use This */}
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{tool.why}</p>
                    {/* Best For */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Best for</p>
                      <p className="text-xs text-gray-600 mt-0.5">{tool.bestFor}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* What Research Shows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-16 border border-indigo-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-3">
            Strategies That Work
          </h2>
          <p className="text-brand-text max-w-2xl mx-auto">
            These approaches have been tested in hundreds of studies with real students
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Practice Testing', benefit: 'Quizzes help students remember more than re-reading', simple: 'Test yourself to learn' },
            { name: 'Spread It Out', benefit: 'Studying over time beats cramming every time', simple: 'Space out your reviews' },
            { name: 'Explain Why', benefit: 'Asking "why?" helps students understand deeply', simple: 'Connect new to old' },
            { name: 'Self-Checking', benefit: 'Students who monitor their learning do better', simple: 'Know what you know' },
          ].map((research) => (
            <div key={research.name} className="bg-white rounded-xl p-4 text-center">
              <p className="font-semibold text-brand-navy">{research.name}</p>
              <p className="text-sm text-indigo-600 my-2">{research.benefit}</p>
              <p className="text-xs text-gray-500 italic">{research.simple}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-500 mt-6">
          These approaches consistently help students learn more than traditional studying.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center pb-8"
      >
        <h2 className="text-2xl font-bold text-brand-navy mb-4">Ready to Transform Your Teaching?</h2>
        <p className="text-brand-text mb-6">Start with any tool—they all work together seamlessly.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/syllabus-analyzer" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            Analyze Syllabus
          </Link>
          <Link to="/learning-outcomes" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            Write Outcomes
          </Link>
          <Link to="/spaced-repetition" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
            Schedule Reviews
          </Link>
          <Link to="/formative-assessment" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
            Create Polls
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
