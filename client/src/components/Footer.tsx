import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-1.5 bg-brand-navy rounded-lg">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif font-semibold text-brand-navy">
                Teaching Assistant
              </span>
            </div>
            <p className="text-sm text-brand-text leading-relaxed">
              Evidence-based tools for designing effective learning experiences,
              grounded in decades of cognitive science research.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-navy mb-4 uppercase tracking-wide">
              Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/syllabus-analyzer" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Syllabus Analyzer
                </Link>
              </li>
              <li>
                <Link to="/spaced-repetition" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Spaced Repetition
                </Link>
              </li>
              <li>
                <Link to="/cognitive-load" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Cognitive Load
                </Link>
              </li>
              <li>
                <Link to="/formative-assessment" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Formative Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-brand-navy mb-4 uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#research" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Research Foundation
                </a>
              </li>
              <li>
                <a href="#getting-started" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Getting Started Guide
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#support" className="text-sm text-brand-text hover:text-brand-navy transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-brand-navy mb-4 uppercase tracking-wide">
              Legal & Compliance
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="flex items-center space-x-2 text-sm text-brand-text hover:text-brand-navy transition-colors">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#terms" className="flex items-center space-x-2 text-sm text-brand-text hover:text-brand-navy transition-colors">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#accessibility" className="flex items-center space-x-2 text-sm text-brand-text hover:text-brand-navy transition-colors">
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  <span>Accessibility Statement</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="mt-8 pt-8 border-t border-brand-border-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-brand-bg rounded-md border border-brand-border-subtle">
                <ShieldCheckIcon className="h-4 w-4 text-scholarly-sage" />
                <span className="text-xs font-medium text-brand-text">FERPA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-brand-bg rounded-md border border-brand-border-subtle">
                <ShieldCheckIcon className="h-4 w-4 text-scholarly-sage" />
                <span className="text-xs font-medium text-brand-text">WCAG 2.1 AA</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-brand-bg rounded-md border border-brand-border-subtle">
                <ShieldCheckIcon className="h-4 w-4 text-scholarly-sage" />
                <span className="text-xs font-medium text-brand-text">SOC 2 Type II</span>
              </div>
            </div>
            <p className="text-xs text-brand-text-light">
              © {new Date().getFullYear()} Teaching Assistant. All rights reserved.
            </p>
          </div>
        </div>

        {/* AI Transparency Note */}
        <div className="mt-6 p-4 bg-brand-gold/5 rounded-lg border border-brand-gold/20">
          <div className="flex items-start space-x-3">
            <AcademicCapIcon className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-brand-text leading-relaxed">
                <span className="font-medium text-brand-navy">AI-Assisted Tools:</span>{' '}
                This platform uses AI to generate pedagogical content based on established learning science research.
                All generated materials should be reviewed and adapted by instructors for their specific contexts.
                AI outputs are suggestions, not prescriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
