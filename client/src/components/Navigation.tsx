import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  HomeIcon,
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
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenCategory(null);
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
        bg: 'bg-scholarly-sage/10',
        bgSolid: 'bg-scholarly-sage/20',
        text: 'text-scholarly-sage',
        hover: 'hover:bg-scholarly-sage/10',
        active: 'bg-scholarly-sage/15',
        border: 'border-scholarly-sage/30',
        leftBorder: 'border-l-scholarly-sage',
      },
      terracotta: {
        bg: 'bg-scholarly-terracotta/10',
        bgSolid: 'bg-scholarly-terracotta/20',
        text: 'text-scholarly-terracotta',
        hover: 'hover:bg-scholarly-terracotta/10',
        active: 'bg-scholarly-terracotta/15',
        border: 'border-scholarly-terracotta/30',
        leftBorder: 'border-l-scholarly-terracotta',
      },
      slate: {
        bg: 'bg-scholarly-slate/10',
        bgSolid: 'bg-scholarly-slate/20',
        text: 'text-scholarly-slate',
        hover: 'hover:bg-scholarly-slate/10',
        active: 'bg-scholarly-slate/15',
        border: 'border-scholarly-slate/30',
        leftBorder: 'border-l-scholarly-slate',
      },
      wine: {
        bg: 'bg-scholarly-wine/10',
        bgSolid: 'bg-scholarly-wine/20',
        text: 'text-scholarly-wine',
        hover: 'hover:bg-scholarly-wine/10',
        active: 'bg-scholarly-wine/15',
        border: 'border-scholarly-wine/30',
        leftBorder: 'border-l-scholarly-wine',
      },
    };
    return colors[color];
  };

  const isInCategory = (category: NavCategory) => {
    return category.items.some(item => location.pathname === item.path);
  };

  return (
    <>
      <nav className="bg-white border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="p-1.5 bg-brand-navy rounded-lg group-hover:bg-brand-navy-light transition-colors">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-serif font-semibold text-brand-navy leading-tight">
                  Teaching Assistant
                </span>
                <span className="text-[10px] text-brand-text-light tracking-wide uppercase hidden sm:block">
                  Evidence-Based Design
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
              {/* Home */}
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-brand-navy text-white'
                    : 'text-brand-text hover:text-brand-navy hover:bg-brand-bg'
                }`}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>

              {/* Category Dropdowns */}
              {categories.map((category) => {
                const colorClasses = getColorClasses(category.color);
                const isOpen = openCategory === category.name;
                const isCategoryActive = isInCategory(category);

                return (
                  <div key={category.name} className="relative">
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : category.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isCategoryActive
                          ? `${colorClasses.active} ${colorClasses.text}`
                          : `text-brand-text hover:text-brand-navy hover:bg-brand-bg`
                      }`}
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                      <ChevronDownIcon
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-brand-border py-1 z-50"
                        >
                          {/* Category Header */}
                          <div className={`px-4 py-3 mx-2 my-1 rounded-md ${colorClasses.bg} border ${colorClasses.border}`}>
                            <div className="flex items-center space-x-2">
                              <category.icon className={`h-4 w-4 ${colorClasses.text}`} />
                              <span className={`font-medium text-sm ${colorClasses.text}`}>{category.name}</span>
                            </div>
                            <p className="text-xs text-brand-text-light mt-1">{category.description}</p>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-brand-border mx-3 my-2" />

                          {/* Items */}
                          {category.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setOpenCategory(null)}
                              className={`flex items-start space-x-3 px-4 py-2.5 mx-2 rounded-md transition-colors ${
                                location.pathname === item.path
                                  ? `${colorClasses.active}`
                                  : 'hover:bg-brand-bg'
                              }`}
                            >
                              <item.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                location.pathname === item.path ? colorClasses.text : 'text-brand-text-light'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-medium ${
                                    location.pathname === item.path ? 'text-brand-navy' : 'text-brand-text'
                                  }`}>
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="badge-new">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-brand-text-light mt-0.5">{item.description}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Divider */}
              <div className="h-6 w-px bg-brand-border mx-2" />

              {/* Accessibility Controls */}
              <AccessibilityControls />

              {/* Pricing Badge */}
              <div className="flex items-center px-2.5 py-1 bg-scholarly-sage/10 text-scholarly-sage rounded-md text-xs font-medium whitespace-nowrap">
                Free for Educators
              </div>

              {/* Quick Create Button */}
              <Link
                to="/create"
                className="flex items-center space-x-2 px-4 py-2 bg-brand-navy text-white rounded-md text-sm font-medium hover:bg-brand-navy-light transition-colors shadow-sm ml-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>Create</span>
              </Link>
            </div>

            {/* Mobile: Create button + Hamburger */}
            <div className="flex lg:hidden items-center space-x-2">
              <Link
                to="/create"
                className="flex items-center space-x-1 px-3 py-2 bg-brand-navy text-white rounded-md text-sm font-medium"
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span className="hidden xs:inline">Create</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-brand-text hover:bg-brand-bg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
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
              className="fixed inset-0 bg-brand-navy/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="sticky top-0 bg-white border-b border-brand-border px-4 py-4 flex items-center justify-between">
                <span className="font-serif font-semibold text-brand-navy">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-brand-text hover:bg-brand-bg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="p-4">
                {/* Home Link */}
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    location.pathname === '/'
                      ? 'bg-brand-navy text-white'
                      : 'text-brand-text hover:bg-brand-bg'
                  }`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>

                {/* Categories */}
                <div className="space-y-2 mt-4">
                  {categories.map((category) => {
                    const colorClasses = getColorClasses(category.color);
                    const isExpanded = mobileExpandedCategory === category.name;
                    const isCategoryActive = isInCategory(category);

                    return (
                      <div key={category.name} className="rounded-lg overflow-hidden">
                        <button
                          onClick={() => setMobileExpandedCategory(isExpanded ? null : category.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                            isCategoryActive
                              ? `${colorClasses.bg} ${colorClasses.text}`
                              : 'text-brand-text hover:bg-brand-bg'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <category.icon className="h-5 w-5" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-brand-bg/50"
                            >
                              <div className="py-2 px-2">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors ${
                                      location.pathname === item.path
                                        ? `${colorClasses.bg} ${colorClasses.text}`
                                        : 'text-brand-text hover:bg-white'
                                    }`}
                                  >
                                    <item.icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm">{item.name}</span>
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
                <div className="mt-6 pt-6 border-t border-brand-border">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-brand-text-light">Accessibility</span>
                    <AccessibilityControls />
                  </div>

                  <div className="mt-4 px-4">
                    <div className="inline-flex items-center px-3 py-1.5 bg-scholarly-sage/10 text-scholarly-sage rounded-md text-xs font-medium">
                      Free for Educators
                    </div>
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
