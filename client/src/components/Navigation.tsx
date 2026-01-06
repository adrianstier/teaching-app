import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  PlusCircleIcon,
  DocumentMagnifyingGlassIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ChevronDownIcon,
  CalendarIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  EyeIcon,
  BeakerIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  UsersIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  FireIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import AccessibilityControls from './shared/AccessibilityControls';

interface NavItem {
  path: string;
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  description?: string;
  badge?: string;
}

interface NavCategory {
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  color: 'sage' | 'terracotta' | 'slate' | 'wine';
  description: string;
  items: NavItem[];
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
    setToolsMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const categories: NavCategory[] = [
    {
      name: 'Course Planning',
      icon: CalendarIcon,
      color: 'sage',
      description: 'Design and structure your course',
      items: [
        { path: '/syllabus-analyzer', name: 'Syllabus Analyzer', icon: DocumentMagnifyingGlassIcon, description: 'Analyze course structure' },
        { path: '/learning-outcomes', name: 'Learning Outcomes', icon: LightBulbIcon, description: 'Bloom\'s taxonomy alignment' },
        { path: '/adaptive-pathways', name: 'Adaptive Pathways', icon: AdjustmentsHorizontalIcon, description: 'Personalized learning paths', badge: 'New' },
        { path: '/spaced-repetition', name: 'Spaced Repetition', icon: ArrowPathIcon, description: 'Memory optimization schedules', badge: 'New' },
        { path: '/cognitive-load', name: 'Cognitive Load', icon: CpuChipIcon, description: 'Optimize information density', badge: 'New' },
        { path: '/inclusive-design', name: 'Inclusive Design', icon: GlobeAltIcon, description: 'Universal design for learning', badge: 'New' },
      ]
    },
    {
      name: 'Teaching Delivery',
      icon: PresentationChartLineIcon,
      color: 'terracotta',
      description: 'Tools for live teaching',
      items: [
        { path: '/create', name: 'Lecture Builder', icon: PlusCircleIcon, description: 'Create lecture packages' },
        { path: '/active-learning', name: 'Activity Studio', icon: UserGroupIcon, description: 'Active learning activities' },
        { path: '/case-based', name: 'Case Studies', icon: BookOpenIcon, description: 'Real-world scenarios', badge: 'New' },
        { path: '/collaborative', name: 'Collaboration', icon: UsersIcon, description: 'Group learning activities', badge: 'New' },
        { path: '/elaborative', name: 'Deep Processing', icon: BeakerIcon, description: 'Elaborative interrogation', badge: 'New' },
        { path: '/desirable-difficulties', name: 'Desirable Difficulties', icon: FireIcon, description: 'Productive struggle activities', badge: 'New' },
      ]
    },
    {
      name: 'Assessment',
      icon: ClipboardDocumentCheckIcon,
      color: 'slate',
      description: 'Evaluate and respond to learning',
      items: [
        { path: '/exercise-generator', name: 'Exercise Generator', icon: ClipboardDocumentCheckIcon, description: 'Create assessments' },
        { path: '/formative-assessment', name: 'Formative Assessment', icon: ChatBubbleLeftRightIcon, description: 'Live polls & exit tickets', badge: 'New' },
        { path: '/misconceptions', name: 'Misconception Tracker', icon: ExclamationTriangleIcon, description: 'Identify & address gaps', badge: 'New' },
        { path: '/metacognition', name: 'Metacognition', icon: QuestionMarkCircleIcon, description: 'Self-regulation tools', badge: 'New' },
        { path: '/transfer', name: 'Transfer Learning', icon: ArrowsRightLeftIcon, description: 'Near & far transfer', badge: 'New' },
      ]
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      color: 'wine',
      description: 'Analyze and improve teaching',
      items: [
        { path: '/growth-mindset', name: 'Growth Mindset', icon: RocketLaunchIcon, description: 'Motivation & attribution', badge: 'New' },
        { path: '/student-perspective', name: 'Student Lens', icon: EyeIcon, description: 'See as students see', badge: 'New' },
        { path: '/learning-science', name: 'Learning Science', icon: SparklesIcon, description: 'Research recommendations', badge: 'New' },
        { path: '/course-analytics', name: 'Course Analytics', icon: ChartBarIcon, description: 'Performance insights', badge: 'New' },
      ]
    }
  ];

  const getColorClasses = (color: NavCategory['color']) => {
    const colors = {
      sage: {
        bg: 'bg-scholarly-sage/8',
        bgSolid: 'bg-scholarly-sage/15',
        text: 'text-scholarly-sage',
        hover: 'hover:bg-scholarly-sage/10',
        border: 'border-scholarly-sage/20',
        accent: 'bg-scholarly-sage',
      },
      terracotta: {
        bg: 'bg-scholarly-terracotta/8',
        bgSolid: 'bg-scholarly-terracotta/15',
        text: 'text-scholarly-terracotta',
        hover: 'hover:bg-scholarly-terracotta/10',
        border: 'border-scholarly-terracotta/20',
        accent: 'bg-scholarly-terracotta',
      },
      slate: {
        bg: 'bg-scholarly-slate/8',
        bgSolid: 'bg-scholarly-slate/15',
        text: 'text-scholarly-slate',
        hover: 'hover:bg-scholarly-slate/10',
        border: 'border-scholarly-slate/20',
        accent: 'bg-scholarly-slate',
      },
      wine: {
        bg: 'bg-scholarly-wine/8',
        bgSolid: 'bg-scholarly-wine/15',
        text: 'text-scholarly-wine',
        hover: 'hover:bg-scholarly-wine/10',
        border: 'border-scholarly-wine/20',
        accent: 'bg-scholarly-wine',
      },
    };
    return colors[color];
  };

  const isInCategory = (category: NavCategory) => {
    return category.items.some(item => location.pathname === item.path);
  };

  // Quick links for nav bar - most used tools
  const quickLinks = [
    { path: '/create', name: 'Lecture Builder' },
    { path: '/syllabus-analyzer', name: 'Syllabus' },
    { path: '/exercise-generator', name: 'Exercises' },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-brand-border/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="p-2 bg-brand-navy rounded-lg group-hover:bg-brand-navy-light transition-colors duration-200">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-semibold text-brand-navy leading-tight tracking-tight">
                  Teaching Assistant
                </span>
                <span className="text-[10px] text-brand-text-light tracking-widest uppercase hidden sm:block">
                  Evidence-Based Design
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Clean & Minimal */}
            <div className="hidden lg:flex items-center">
              {/* Quick Links */}
              <div className="flex items-center space-x-1 mr-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-2 text-sm transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-brand-navy font-medium'
                        : 'text-brand-text-light hover:text-brand-navy'
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-gold rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* Tools Mega Menu Trigger */}
              <div className="relative" ref={toolsMenuRef}>
                <button
                  onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    toolsMenuOpen
                      ? 'bg-brand-bg text-brand-navy'
                      : 'text-brand-text-light hover:text-brand-navy hover:bg-brand-bg/50'
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                  <span>All Tools</span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${toolsMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {toolsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full right-0 mt-2 w-[720px] bg-white rounded-xl shadow-2xl border border-brand-border/50 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-brand-bg to-white border-b border-brand-border/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-serif text-lg font-semibold text-brand-navy">Teaching Tools</h3>
                            <p className="text-xs text-brand-text-light mt-0.5">21 evidence-based tools for educators</p>
                          </div>
                          <Link
                            to="/"
                            onClick={() => setToolsMenuOpen(false)}
                            className="flex items-center space-x-1.5 text-xs text-brand-text-light hover:text-brand-navy transition-colors"
                          >
                            <HomeIcon className="h-3.5 w-3.5" />
                            <span>View Dashboard</span>
                          </Link>
                        </div>
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-2 gap-px bg-brand-border/20">
                        {categories.map((category) => {
                          const colorClasses = getColorClasses(category.color);
                          const isCategoryActive = isInCategory(category);

                          return (
                            <div
                              key={category.name}
                              className={`bg-white p-4 ${isCategoryActive ? colorClasses.bg : ''}`}
                            >
                              {/* Category Header */}
                              <div className="flex items-center space-x-2 mb-3">
                                <div className={`p-1.5 rounded-md ${colorClasses.bgSolid}`}>
                                  <category.icon className={`h-4 w-4 ${colorClasses.text}`} />
                                </div>
                                <div>
                                  <h4 className={`text-sm font-semibold ${colorClasses.text}`}>{category.name}</h4>
                                </div>
                              </div>

                              {/* Items */}
                              <div className="space-y-0.5">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setToolsMenuOpen(false)}
                                    className={`flex items-center justify-between px-2.5 py-2 rounded-md transition-all duration-150 group ${
                                      location.pathname === item.path
                                        ? `${colorClasses.bg} border-l-2 ${colorClasses.text.replace('text-', 'border-')}`
                                        : 'hover:bg-brand-bg/70 border-l-2 border-transparent'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2.5 min-w-0">
                                      <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${
                                        location.pathname === item.path
                                          ? colorClasses.text
                                          : 'text-brand-text-light group-hover:text-brand-text'
                                      }`} />
                                      <span className={`text-sm truncate ${
                                        location.pathname === item.path
                                          ? 'text-brand-navy font-medium'
                                          : 'text-brand-text group-hover:text-brand-navy'
                                      }`}>
                                        {item.name}
                                      </span>
                                    </div>
                                    {item.badge && (
                                      <span className="badge-new ml-2 flex-shrink-0">
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subtle Divider */}
              <div className="h-5 w-px bg-brand-border/50 mx-4" />

              {/* Accessibility - Icon Only */}
              <AccessibilityControls />

              {/* Primary CTA */}
              <Link
                to="/create"
                className="flex items-center space-x-2 px-4 py-2 ml-3 bg-brand-navy text-white rounded-lg text-sm font-medium hover:bg-brand-navy-light transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>Create</span>
              </Link>
            </div>

            {/* Mobile: Create button + Hamburger */}
            <div className="flex lg:hidden items-center space-x-2">
              <Link
                to="/create"
                className="flex items-center space-x-1.5 px-3 py-2 bg-brand-navy text-white rounded-lg text-sm font-medium shadow-sm"
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Create</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-brand-text hover:bg-brand-bg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-brand-navy/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-brand-border/50 px-5 py-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-brand-navy rounded-md">
                    <AcademicCapIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-serif font-semibold text-brand-navy">Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-brand-text hover:bg-brand-bg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="p-4">
                {/* Home Link */}
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-4 transition-colors ${
                    location.pathname === '/'
                      ? 'bg-brand-navy text-white'
                      : 'text-brand-text hover:bg-brand-bg'
                  }`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>

                {/* Categories */}
                <div className="space-y-2">
                  {categories.map((category) => {
                    const colorClasses = getColorClasses(category.color);
                    const isExpanded = mobileExpandedCategory === category.name;
                    const isCategoryActive = isInCategory(category);

                    return (
                      <div key={category.name} className="rounded-xl overflow-hidden border border-brand-border/30">
                        <button
                          onClick={() => setMobileExpandedCategory(isExpanded ? null : category.name)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${
                            isCategoryActive || isExpanded
                              ? `${colorClasses.bg}`
                              : 'bg-white hover:bg-brand-bg/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-1.5 rounded-md ${colorClasses.bgSolid}`}>
                              <category.icon className={`h-4 w-4 ${colorClasses.text}`} />
                            </div>
                            <span className={`font-medium ${isCategoryActive ? colorClasses.text : 'text-brand-text'}`}>
                              {category.name}
                            </span>
                          </div>
                          <ChevronDownIcon
                            className={`h-4 w-4 text-brand-text-light transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="py-2 px-2 bg-brand-bg/30">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                      location.pathname === item.path
                                        ? `${colorClasses.bg} ${colorClasses.text}`
                                        : 'text-brand-text hover:bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <item.icon className="h-4 w-4 flex-shrink-0" />
                                      <span className="text-sm">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                      <span className="badge-new text-[10px]">{item.badge}</span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom section */}
                <div className="mt-6 pt-6 border-t border-brand-border/50">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-brand-text-light">Accessibility</span>
                    <AccessibilityControls />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
