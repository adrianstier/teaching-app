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
  XMarkIcon,
  CheckIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const categories = [
    {
      name: 'Course Planning',
      description: 'Set up your course for success before the semester starts',
      principle: 'Good course design makes teaching easier all semester. These tools help you organize your course so students can follow along and remember what they learn.',
      icon: CalendarIcon,
      color: 'sage' as const,
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
      color: 'terracotta' as const,
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
      color: 'slate' as const,
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
      color: 'wine' as const,
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

  const getColorClasses = (color: 'sage' | 'terracotta' | 'slate' | 'wine') => {
    const colors = {
      sage: {
        bg: 'bg-scholarly-sage/5',
        bgSolid: 'bg-scholarly-sage/10',
        text: 'text-scholarly-sage',
        border: 'border-scholarly-sage/20',
        hover: 'hover:bg-scholarly-sage/10',
        gradient: 'from-scholarly-sage/5 to-scholarly-sage/10',
      },
      terracotta: {
        bg: 'bg-scholarly-terracotta/5',
        bgSolid: 'bg-scholarly-terracotta/10',
        text: 'text-scholarly-terracotta',
        border: 'border-scholarly-terracotta/20',
        hover: 'hover:bg-scholarly-terracotta/10',
        gradient: 'from-scholarly-terracotta/5 to-scholarly-terracotta/10',
      },
      slate: {
        bg: 'bg-scholarly-slate/5',
        bgSolid: 'bg-scholarly-slate/10',
        text: 'text-scholarly-slate',
        border: 'border-scholarly-slate/20',
        hover: 'hover:bg-scholarly-slate/10',
        gradient: 'from-scholarly-slate/5 to-scholarly-slate/10',
      },
      wine: {
        bg: 'bg-scholarly-wine/5',
        bgSolid: 'bg-scholarly-wine/10',
        text: 'text-scholarly-wine',
        border: 'border-scholarly-wine/20',
        hover: 'hover:bg-scholarly-wine/10',
        gradient: 'from-scholarly-wine/5 to-scholarly-wine/10',
      },
    };
    return colors[color];
  };

  const workflowSteps = [
    { step: 1, name: 'Plan', desc: 'Analyze syllabus & design outcomes', timing: 'Start of term' },
    { step: 2, name: 'Design', desc: 'Create lectures, activities & assessments', timing: 'Weekly prep' },
    { step: 3, name: 'Teach', desc: 'Deliver with real-time feedback tools', timing: 'During class' },
    { step: 4, name: 'Improve', desc: 'Review analytics & refine approach', timing: 'Ongoing' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-20 pt-8">
        <p className="text-sm font-medium text-brand-gold tracking-wide uppercase mb-4">
          Evidence-Based Course Design
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-brand-navy mb-6 leading-tight tracking-tight">
          Teaching, Elevated.
        </h1>
        <p className="text-lg text-brand-text mb-4 max-w-2xl mx-auto leading-relaxed">
          Practical tools grounded in learning science that help your students learn more effectively and remember longer.
        </p>
        <p className="text-sm text-brand-text-light mb-10 max-w-xl mx-auto">
          Research demonstrates that small, intentional changes to course design can significantly improve student outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-brand-navy text-white font-medium rounded-lg shadow-sm hover:bg-brand-navy-light transition-all duration-200"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Lecture Package
          </Link>
          <Link
            to="/syllabus-analyzer"
            className="inline-flex items-center px-6 py-3 bg-white text-brand-navy font-medium rounded-lg border border-brand-border hover:border-brand-navy hover:bg-brand-bg transition-all duration-200"
          >
            <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Analyze Your Syllabus
          </Link>
        </div>
      </motion.div>

      {/* Why These Tools Work - Refined without emojis */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-card p-8 mb-16 border border-brand-border-subtle"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-3">
            Why These Tools Work
          </h2>
          <p className="text-brand-text max-w-2xl mx-auto">
            Common intuitions about learning are often misleading. Here is what decades of research actually shows.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-scholarly-wine/10 flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="h-6 w-6 text-scholarly-wine" />
            </div>
            <h3 className="font-medium text-brand-navy mb-2">What Feels Productive</h3>
            <p className="text-sm text-brand-text leading-relaxed">
              Re-reading notes, highlighting, and cramming before exams feel like studying—but students forget most of it within weeks.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-scholarly-sage/10 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-6 w-6 text-scholarly-sage" />
            </div>
            <h3 className="font-medium text-brand-navy mb-2">What Actually Sticks</h3>
            <p className="text-sm text-brand-text leading-relaxed">
              Testing yourself, spacing study over time, and mixing up practice feel harder—but students remember more, and for longer.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <ArrowTrendingUpIcon className="h-6 w-6 text-brand-gold" />
            </div>
            <h3 className="font-medium text-brand-navy mb-2">Small Changes, Real Results</h3>
            <p className="text-sm text-brand-text leading-relaxed">
              You do not need to overhaul your course. Strategic adjustments to how you present and assess material make a measurable difference.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar - More refined */}
      <motion.div
        variants={itemVariants}
        className="bg-brand-navy rounded-xl p-8 mb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-semibold text-white">21</p>
            <p className="text-sm text-white/70 mt-1">Evidence-Based Tools</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-white">15</p>
            <p className="text-sm text-white/70 mt-1">New Teaching Features</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-white">50+</p>
            <p className="text-sm text-white/70 mt-1">Research Citations</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-white">4</p>
            <p className="text-sm text-white/70 mt-1">Integrated Workflows</p>
          </div>
        </div>
      </motion.div>

      {/* Teaching Workflow */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-card p-8 mb-16 border border-brand-border-subtle"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-3">
            Your Teaching Workflow
          </h2>
          <p className="text-brand-text">
            Tools organized around how you actually teach
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <div key={step.step} className="relative text-center">
              <div className="w-14 h-14 rounded-full border-2 border-brand-gold bg-brand-gold/5 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-serif font-semibold text-brand-gold">{step.step}</span>
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">{step.name}</h3>
              <p className="text-sm text-brand-text mb-2">{step.desc}</p>
              <span className="text-xs font-medium text-brand-gold uppercase tracking-wider">
                {step.timing}
              </span>
              {index < workflowSteps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-brand-gold/40 to-brand-gold/10"></div>
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
              variants={itemVariants}
              className="bg-white rounded-xl shadow-card p-8 border border-brand-border-subtle"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className={`p-3 rounded-lg ${colorClasses.bgSolid} flex-shrink-0`}>
                  <category.icon className={`h-6 w-6 ${colorClasses.text}`} />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand-navy">{category.name}</h2>
                  <p className="text-brand-text text-sm mt-1">{category.description}</p>
                </div>
              </div>

              {/* Category Principle */}
              <div className="research-callout mb-8">
                <p className="text-sm text-brand-text italic leading-relaxed">{category.principle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`block p-5 rounded-lg border border-brand-border-subtle bg-white hover:shadow-md hover:border-brand-border transition-all duration-200 group`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`p-2 rounded-md ${colorClasses.bgSolid} group-hover:scale-105 transition-transform flex-shrink-0`}>
                        <tool.icon className={`h-4 w-4 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="font-medium text-brand-navy text-sm">{tool.name}</h3>
                          {tool.badge && (
                            <span className="badge-new">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brand-text-light mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                    <p className="text-xs text-brand-text leading-relaxed line-clamp-2">{tool.why}</p>
                    <div className="mt-3 pt-3 border-t border-brand-border-subtle">
                      <p className="text-[10px] font-medium text-brand-text-light uppercase tracking-wide">Best for</p>
                      <p className="text-xs text-brand-text mt-0.5">{tool.bestFor}</p>
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
        variants={itemVariants}
        className="bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 rounded-xl p-8 mb-16 border border-brand-gold/20"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-3">
            Strategies That Work
          </h2>
          <p className="text-brand-text max-w-2xl mx-auto">
            These approaches have been validated in hundreds of studies with real students
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Practice Testing', benefit: 'Quizzes help students remember more than re-reading', simple: 'Test yourself to learn' },
            { name: 'Spaced Practice', benefit: 'Studying over time beats cramming every time', simple: 'Space out your reviews' },
            { name: 'Elaborative Interrogation', benefit: 'Asking "why?" helps students understand deeply', simple: 'Connect new to old' },
            { name: 'Metacognition', benefit: 'Students who monitor their learning do better', simple: 'Know what you know' },
          ].map((research) => (
            <div key={research.name} className="bg-white rounded-lg p-5 text-center border border-brand-border-subtle">
              <p className="font-medium text-brand-navy text-sm">{research.name}</p>
              <p className="text-xs text-brand-gold mt-2 leading-relaxed">{research.benefit}</p>
              <p className="text-xs text-brand-text-light italic mt-2">{research.simple}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-brand-text-light mt-8">
          These approaches consistently help students learn more effectively than traditional studying methods.
        </p>
      </motion.div>

      {/* Quick Start - Refined */}
      <motion.div variants={itemVariants} className="text-center pb-12">
        <div className="inline-flex items-center space-x-2 mb-4">
          <AcademicCapIcon className="h-5 w-5 text-brand-gold" />
          <span className="text-sm font-medium text-brand-gold uppercase tracking-wide">Get Started</span>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-4">Ready to Enhance Your Teaching?</h2>
        <p className="text-brand-text mb-8">Start with any tool—they all work together seamlessly.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/syllabus-analyzer" className="px-4 py-2 bg-scholarly-sage/10 text-scholarly-sage rounded-md text-sm font-medium hover:bg-scholarly-sage/20 transition-colors">
            Analyze Syllabus
          </Link>
          <Link to="/learning-outcomes" className="px-4 py-2 bg-scholarly-terracotta/10 text-scholarly-terracotta rounded-md text-sm font-medium hover:bg-scholarly-terracotta/20 transition-colors">
            Write Outcomes
          </Link>
          <Link to="/spaced-repetition" className="px-4 py-2 bg-scholarly-slate/10 text-scholarly-slate rounded-md text-sm font-medium hover:bg-scholarly-slate/20 transition-colors">
            Schedule Reviews
          </Link>
          <Link to="/formative-assessment" className="px-4 py-2 bg-scholarly-wine/10 text-scholarly-wine rounded-md text-sm font-medium hover:bg-scholarly-wine/20 transition-colors">
            Create Polls
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
