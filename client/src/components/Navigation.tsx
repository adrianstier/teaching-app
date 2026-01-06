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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        bg: 'bg-scholarly-sage-light',
        bgSolid: 'bg-scholarly-sage',
        text: 'text-scholarly-sage',
        hover: 'hover:bg-scholarly-sage-light',
        active: 'bg-scholarly-sage/10',
        border: 'border-scholarly-sage/20',
      },
      terracotta: {
        bg: 'bg-scholarly-terracotta-light',
        bgSolid: 'bg-scholarly-terracotta',
        text: 'text-scholarly-terracotta',
        hover: 'hover:bg-scholarly-terracotta-light',
        active: 'bg-scholarly-terracotta/10',
        border: 'border-scholarly-terracotta/20',
      },
      slate: {
        bg: 'bg-scholarly-slate-light',
        bgSolid: 'bg-scholarly-slate',
        text: 'text-scholarly-slate',
        hover: 'hover:bg-scholarly-slate-light',
        active: 'bg-scholarly-slate/10',
        border: 'border-scholarly-slate/20',
      },
      wine: {
        bg: 'bg-scholarly-wine-light',
        bgSolid: 'bg-scholarly-wine',
        text: 'text-scholarly-wine',
        hover: 'hover:bg-scholarly-wine-light',
        active: 'bg-scholarly-wine/10',
        border: 'border-scholarly-wine/20',
      },
    };
    return colors[color];
  };

  const isInCategory = (category: NavCategory) => {
    return category.items.some(item => location.pathname === item.path);
  };

  return (
    <nav className="bg-white border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-1.5 bg-brand-navy rounded-lg group-hover:bg-brand-navy-light transition-colors">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-semibold text-brand-navy leading-tight">
                Teaching Assistant
              </span>
              <span className="text-[10px] text-brand-text-light tracking-wide uppercase">
                Evidence-Based Design
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1" ref={dropdownRef}>
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
                    <span className="hidden lg:inline">{category.name}</span>
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
            <div className="h-6 w-px bg-brand-border mx-1" />

            {/* Accessibility Controls */}
            <AccessibilityControls />

            {/* Pricing Badge */}
            <div className="hidden lg:flex items-center px-2.5 py-1 bg-scholarly-sage/10 text-scholarly-sage rounded-md text-xs font-medium whitespace-nowrap ml-1">
              Free for Educators
            </div>

            {/* Quick Create Button */}
            <Link
              to="/create"
              className="flex items-center space-x-2 px-4 py-2 bg-brand-navy text-white rounded-md text-sm font-medium hover:bg-brand-navy-light transition-colors shadow-sm ml-2"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Category Pills */}
      <div className="lg:hidden border-t border-brand-border overflow-x-auto">
        <div className="flex space-x-2 px-4 py-2">
          {categories.map((category) => {
            const colorClasses = getColorClasses(category.color);
            return (
              <button
                key={category.name}
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isInCategory(category)
                    ? `${colorClasses.active} ${colorClasses.text}`
                    : 'bg-brand-bg text-brand-text'
                }`}
              >
                <category.icon className="h-3.5 w-3.5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
