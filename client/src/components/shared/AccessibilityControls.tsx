import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

type FontSize = 'normal' | 'large' | 'larger';

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('ta-font-size') as FontSize;
    const savedMotion = localStorage.getItem('ta-reduced-motion');

    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }
    if (savedMotion === 'true') {
      setReducedMotion(true);
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    switch (size) {
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'larger':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('ta-font-size', size);
  };

  const handleMotionChange = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('ta-reduced-motion', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1.5 rounded-md text-brand-text-light hover:text-brand-navy hover:bg-brand-bg transition-colors"
        aria-label="Accessibility settings"
        title="Accessibility settings"
      >
        <EyeIcon className="h-4 w-4" />
        <span className="text-xs hidden sm:inline">Accessibility</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-brand-border py-3 z-50"
            >
              <div className="px-4 pb-2 mb-2 border-b border-brand-border-subtle">
                <div className="flex items-center space-x-2">
                  <Cog6ToothIcon className="h-4 w-4 text-brand-text-light" />
                  <span className="text-sm font-medium text-brand-navy">
                    Accessibility Options
                  </span>
                </div>
              </div>

              {/* Font Size */}
              <div className="px-4 py-2">
                <label className="block text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                  Text Size
                </label>
                <div className="flex space-x-2">
                  {[
                    { value: 'normal', label: 'A', size: 'text-sm' },
                    { value: 'large', label: 'A', size: 'text-base' },
                    { value: 'larger', label: 'A', size: 'text-lg' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontSizeChange(option.value as FontSize)}
                      className={`flex-1 py-2 rounded-md ${option.size} font-medium transition-colors ${
                        fontSize === option.value
                          ? 'bg-brand-navy text-white'
                          : 'bg-brand-bg text-brand-text hover:bg-brand-border'
                      }`}
                      aria-label={`${option.value} text size`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-brand-text-light mt-1">
                  {fontSize === 'normal' && 'Default size'}
                  {fontSize === 'large' && 'Large (18px)'}
                  {fontSize === 'larger' && 'Larger (20px)'}
                </p>
              </div>

              {/* Reduced Motion */}
              <div className="px-4 py-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <span className="text-sm text-brand-text group-hover:text-brand-navy transition-colors">
                      Reduce motion
                    </span>
                    <p className="text-xs text-brand-text-light">
                      Minimize animations
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={handleMotionChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${
                      reducedMotion ? 'bg-brand-navy' : 'bg-brand-border'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform absolute top-1 ${
                        reducedMotion ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </div>
                  </div>
                </label>
              </div>

              {/* Help Text */}
              <div className="px-4 pt-2 mt-2 border-t border-brand-border-subtle">
                <p className="text-xs text-brand-text-light">
                  Settings are saved automatically
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityControls;
