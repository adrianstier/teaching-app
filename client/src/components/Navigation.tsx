import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  PuzzlePieceIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  BoltIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  EyeIcon,
  Cog6ToothIcon,
  BeakerIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  UsersIcon,
  GlobeAltIcon,
  ScaleIcon,
  RocketLaunchIcon,
  FireIcon,
  LinkIcon,
  AcademicCapIcon as GraduationIcon
} from '@heroicons/react/24/outline';

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
  color: string;
  description: string;
  items: NavItem[];
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
      color: 'blue',
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
      color: 'green',
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
      name: 'Assessment & Feedback',
      icon: ClipboardDocumentCheckIcon,
      color: 'purple',
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
      name: 'Improvement & Analytics',
      icon: ChartBarIcon,
      color: 'orange',
      description: 'Analyze and improve teaching',
      items: [
        { path: '/growth-mindset', name: 'Growth Mindset', icon: RocketLaunchIcon, description: 'Motivation & attribution', badge: 'New' },
        { path: '/student-perspective', name: 'Student Lens', icon: EyeIcon, description: 'See as students see', badge: 'New' },
        { path: '/learning-science', name: 'Learning Science', icon: SparklesIcon, description: 'Research recommendations', badge: 'New' },
        { path: '/course-analytics', name: 'Course Analytics', icon: ChartBarIcon, description: 'Performance insights', badge: 'New' },
      ]
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; text: string; hover: string; active: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-50', active: 'bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-700', hover: 'hover:bg-green-50', active: 'bg-green-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:bg-purple-50', active: 'bg-purple-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', hover: 'hover:bg-orange-50', active: 'bg-orange-100' },
    };
    return colors[color] || colors.blue;
  };

  const isInCategory = (category: NavCategory) => {
    return category.items.some(item => location.pathname === item.path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <AcademicCapIcon className="h-8 w-8 text-brand-navy" />
            <span className="text-xl font-bold text-gray-800">Teaching Assistant</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1" ref={dropdownRef}>
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-brand-navy text-white'
                  : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {/* Category Dropdowns */}
            {categories.map((category) => {
              const colorClasses = getColorClasses(category.color, isInCategory(category));
              const isOpen = openCategory === category.name;
              const isCategoryActive = isInCategory(category);

              return (
                <div key={category.name} className="relative">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : category.name)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCategoryActive
                        ? `${colorClasses.active} ${colorClasses.text}`
                        : `text-gray-600 hover:text-gray-900 ${colorClasses.hover}`
                    }`}
                  >
                    <category.icon className="h-5 w-5" />
                    <span className="hidden lg:inline">{category.name}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                      {/* Category Header */}
                      <div className={`px-4 py-3 ${colorClasses.bg} mx-2 rounded-lg mb-2`}>
                        <div className="flex items-center space-x-2">
                          <category.icon className={`h-5 w-5 ${colorClasses.text}`} />
                          <span className={`font-semibold ${colorClasses.text}`}>{category.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                      </div>

                      {/* Items */}
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setOpenCategory(null)}
                          className={`flex items-start space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                            location.pathname === item.path
                              ? `${colorClasses.active} ${colorClasses.text}`
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                            location.pathname === item.path ? colorClasses.text : 'text-gray-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium truncate">{item.name}</span>
                              {item.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-gold text-white">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Create Button */}
            <Link
              to="/create"
              className="ml-2 flex items-center space-x-2 px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Category Pills - shown below main nav on smaller screens */}
      <div className="lg:hidden border-t border-gray-100 overflow-x-auto">
        <div className="flex space-x-2 px-4 py-2">
          {categories.map((category) => {
            const colorClasses = getColorClasses(category.color, isInCategory(category));
            return (
              <button
                key={category.name}
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isInCategory(category)
                    ? `${colorClasses.active} ${colorClasses.text}`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <category.icon className="h-4 w-4" />
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
