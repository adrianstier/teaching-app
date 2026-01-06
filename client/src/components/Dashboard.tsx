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
  AcademicCapIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const categories = [
    {
      name: 'Course Planning',
      description: 'Design your course for student success',
      icon: CalendarIcon,
      color: 'sage' as const,
      tools: [
        { path: '/syllabus-analyzer', name: 'Syllabus Analyzer', icon: DocumentMagnifyingGlassIcon, desc: 'Analyze course structure and alignment' },
        { path: '/learning-outcomes', name: 'Learning Outcomes', icon: LightBulbIcon, desc: 'Write clear, measurable objectives' },
        { path: '/adaptive-pathways', name: 'Adaptive Pathways', icon: AdjustmentsHorizontalIcon, desc: 'Personalized learning routes', badge: 'New' },
        { path: '/spaced-repetition', name: 'Spaced Repetition', icon: ArrowPathIcon, desc: 'Optimize review schedules', badge: 'New' },
        { path: '/cognitive-load', name: 'Cognitive Load', icon: CpuChipIcon, desc: 'Manage information density', badge: 'New' },
        { path: '/inclusive-design', name: 'Inclusive Design', icon: GlobeAltIcon, desc: 'Universal design principles', badge: 'New' },
      ],
    },
    {
      name: 'Teaching Delivery',
      description: 'Engage students in active learning',
      icon: PresentationChartLineIcon,
      color: 'terracotta' as const,
      tools: [
        { path: '/create', name: 'Lecture Builder', icon: PlusCircleIcon, desc: 'Create complete lecture materials' },
        { path: '/active-learning', name: 'Activity Generator', icon: UserGroupIcon, desc: 'Interactive exercises and discussions' },
        { path: '/case-based', name: 'Case Studies', icon: BookOpenIcon, desc: 'Real-world scenario development', badge: 'New' },
        { path: '/collaborative', name: 'Group Work', icon: UsersIcon, desc: 'Structured team activities', badge: 'New' },
        { path: '/elaborative', name: 'Deep Processing', icon: BeakerIcon, desc: 'Elaborative interrogation prompts', badge: 'New' },
        { path: '/desirable-difficulties', name: 'Productive Struggle', icon: FireIcon, desc: 'Challenge-based learning', badge: 'New' },
      ],
    },
    {
      name: 'Assessment',
      description: 'Measure understanding and provide feedback',
      icon: ClipboardDocumentCheckIcon,
      color: 'slate' as const,
      tools: [
        { path: '/exercise-generator', name: 'Question Generator', icon: ClipboardDocumentCheckIcon, desc: 'Create varied assessments' },
        { path: '/formative-assessment', name: 'Quick Polls', icon: ChatBubbleLeftRightIcon, desc: 'Real-time comprehension checks', badge: 'New' },
        { path: '/misconceptions', name: 'Misconception Tracker', icon: ExclamationTriangleIcon, desc: 'Identify and address gaps', badge: 'New' },
        { path: '/metacognition', name: 'Study Skills', icon: QuestionMarkCircleIcon, desc: 'Self-regulation tools', badge: 'New' },
        { path: '/transfer', name: 'Transfer Learning', icon: ArrowsRightLeftIcon, desc: 'Apply knowledge to new contexts', badge: 'New' },
      ],
    },
    {
      name: 'Analytics',
      description: 'Continuously improve your teaching',
      icon: ChartBarIcon,
      color: 'wine' as const,
      tools: [
        { path: '/growth-mindset', name: 'Growth Mindset', icon: RocketLaunchIcon, desc: 'Encouraging feedback language', badge: 'New' },
        { path: '/student-perspective', name: 'Student Lens', icon: EyeIcon, desc: 'See content as beginners do', badge: 'New' },
        { path: '/learning-science', name: 'Research Tips', icon: SparklesIcon, desc: 'Evidence-based recommendations', badge: 'New' },
        { path: '/course-analytics', name: 'Course Dashboard', icon: ChartBarIcon, desc: 'Track student progress', badge: 'New' },
      ],
    },
  ];

  const getColorClasses = (color: 'sage' | 'terracotta' | 'slate' | 'wine') => {
    const colors = {
      sage: {
        bg: 'bg-scholarly-sage/8',
        bgSolid: 'bg-scholarly-sage/15',
        text: 'text-scholarly-sage',
        border: 'border-scholarly-sage/25',
        borderLeft: 'border-l-scholarly-sage',
        hover: 'hover:border-scholarly-sage/40',
      },
      terracotta: {
        bg: 'bg-scholarly-terracotta/8',
        bgSolid: 'bg-scholarly-terracotta/15',
        text: 'text-scholarly-terracotta',
        border: 'border-scholarly-terracotta/25',
        borderLeft: 'border-l-scholarly-terracotta',
        hover: 'hover:border-scholarly-terracotta/40',
      },
      slate: {
        bg: 'bg-scholarly-slate/8',
        bgSolid: 'bg-scholarly-slate/15',
        text: 'text-scholarly-slate',
        border: 'border-scholarly-slate/25',
        borderLeft: 'border-l-scholarly-slate',
        hover: 'hover:border-scholarly-slate/40',
      },
      wine: {
        bg: 'bg-scholarly-wine/8',
        bgSolid: 'bg-scholarly-wine/15',
        text: 'text-scholarly-wine',
        border: 'border-scholarly-wine/25',
        borderLeft: 'border-l-scholarly-wine',
        hover: 'hover:border-scholarly-wine/40',
      },
    };
    return colors[color];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section - Specific Value Proposition */}
      <motion.div variants={itemVariants} className="pt-8 pb-16 md:pt-12 md:pb-20">
        <div className="max-w-3xl">
          {/* Credibility badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-navy/5 rounded-full mb-6">
            <BookmarkIcon className="h-4 w-4 text-brand-navy" />
            <span className="text-xs font-medium text-brand-navy">Grounded in 50+ research studies</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-brand-navy mb-6 leading-[1.1] tracking-tight">
            Help Students Learn More{' '}
            <span className="text-brand-gold-dark">in Less Time</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-text mb-8 max-w-2xl leading-relaxed">
            Design courses using strategies that cognitive science proves work. Create lectures, assessments, and activities that actually improve retention.
          </p>

          {/* Key benefits */}
          <div className="flex flex-wrap gap-4 mb-10 text-sm text-brand-text">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-scholarly-sage" />
              <span>Evidence-based tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-scholarly-sage" />
              <span>Save hours of prep time</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-scholarly-sage" />
              <span>Free for educators</span>
            </div>
          </div>

          {/* CTAs with clear hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/create"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-brand-navy text-white font-medium rounded-lg shadow-md hover:bg-brand-navy-light hover:shadow-lg transition-all duration-200 group"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Start Building a Lecture
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/syllabus-analyzer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-brand-navy font-medium rounded-lg border-2 border-brand-navy/20 hover:border-brand-navy/40 hover:bg-brand-bg transition-all duration-200"
            >
              <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Analyze Your Syllabus
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-brand-navy rounded-xl p-6 md:p-8 mb-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-white">21</p>
            <p className="text-xs md:text-sm text-white/70 mt-1">Teaching Tools</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-white">4</p>
            <p className="text-xs md:text-sm text-white/70 mt-1">Workflow Categories</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-white">50+</p>
            <p className="text-xs md:text-sm text-white/70 mt-1">Research Citations</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-white">Free</p>
            <p className="text-xs md:text-sm text-white/70 mt-1">For All Educators</p>
          </div>
        </div>
      </motion.div>

      {/* Tool Categories - Improved Cards */}
      <div className="space-y-10 mb-16">
        {categories.map((category) => {
          const colorClasses = getColorClasses(category.color);
          return (
            <motion.div
              key={category.name}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-card border border-brand-border-subtle overflow-hidden"
            >
              {/* Category Header */}
              <div className={`px-6 py-5 border-b border-brand-border-subtle ${colorClasses.bg}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg ${colorClasses.bgSolid}`}>
                    <category.icon className={`h-5 w-5 ${colorClasses.text}`} />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-brand-navy">{category.name}</h2>
                    <p className="text-sm text-brand-text-light">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`group flex items-start space-x-3 p-4 rounded-lg border-l-3 ${colorClasses.borderLeft} border border-brand-border-subtle bg-white hover:shadow-md hover:bg-brand-bg/30 transition-all duration-200`}
                    >
                      <div className={`p-2 rounded-md ${colorClasses.bgSolid} group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <tool.icon className={`h-5 w-5 ${colorClasses.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-brand-navy text-sm group-hover:text-brand-navy-light transition-colors">{tool.name}</h3>
                          {tool.badge && (
                            <span className="badge-new">{tool.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-brand-text-light mt-1 line-clamp-2">{tool.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Research Foundation - Consolidated */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-brand-bg-warm to-brand-bg rounded-xl p-6 md:p-8 mb-12 border border-brand-border"
      >
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-brand-gold/10 rounded-lg flex-shrink-0">
            <AcademicCapIcon className="h-6 w-6 text-brand-gold-dark" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-navy mb-1">Built on Learning Science</h2>
            <p className="text-brand-text text-sm">Every tool applies research-backed strategies that improve student outcomes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Retrieval Practice', desc: 'Testing improves memory more than re-studying' },
            { name: 'Spaced Learning', desc: 'Distributed practice beats cramming' },
            { name: 'Active Recall', desc: 'Generation strengthens retention' },
            { name: 'Metacognition', desc: 'Self-monitoring improves performance' },
          ].map((principle) => (
            <div key={principle.name} className="bg-white rounded-lg p-4 border border-brand-border-subtle">
              <p className="font-medium text-brand-navy text-sm mb-1">{principle.name}</p>
              <p className="text-xs text-brand-text-light">{principle.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={itemVariants} className="text-center pb-16">
        <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-3">Ready to get started?</h2>
        <p className="text-brand-text mb-6 max-w-md mx-auto">Choose any tool to begin. They work independently or together as part of your workflow.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/create" className="px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-medium hover:bg-brand-navy-light transition-colors">
            Build a Lecture
          </Link>
          <Link to="/syllabus-analyzer" className="px-5 py-2.5 bg-scholarly-sage/10 text-scholarly-sage rounded-lg text-sm font-medium hover:bg-scholarly-sage/20 transition-colors">
            Analyze Syllabus
          </Link>
          <Link to="/exercise-generator" className="px-5 py-2.5 bg-scholarly-slate/10 text-scholarly-slate rounded-lg text-sm font-medium hover:bg-scholarly-slate/20 transition-colors">
            Create Questions
          </Link>
          <Link to="/spaced-repetition" className="px-5 py-2.5 bg-scholarly-terracotta/10 text-scholarly-terracotta rounded-lg text-sm font-medium hover:bg-scholarly-terracotta/20 transition-colors">
            Plan Reviews
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
