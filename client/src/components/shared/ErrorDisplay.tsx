import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  WifiIcon,
  ServerIcon,
  LockClosedIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export interface AppError {
  type: 'network' | 'validation' | 'server' | 'auth' | 'timeout' | 'rate-limit';
  message: string;
  details?: string;
  suggestion?: string;
  docLink?: string;
  technicalDetails?: string;
}

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  compact = false,
}) => {
  if (!error) return null;

  const getErrorIcon = (type: AppError['type']) => {
    switch (type) {
      case 'network':
        return WifiIcon;
      case 'server':
        return ServerIcon;
      case 'auth':
        return LockClosedIcon;
      case 'timeout':
        return ClockIcon;
      case 'rate-limit':
        return ClockIcon;
      case 'validation':
        return ExclamationTriangleIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const getErrorColor = (type: AppError['type']) => {
    switch (type) {
      case 'validation':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-600',
          text: 'text-amber-900',
        };
      case 'network':
      case 'timeout':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        };
      case 'auth':
      case 'rate-limit':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          text: 'text-orange-900',
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
        };
    }
  };

  const getDefaultMessage = (type: AppError['type']): {
    title: string;
    explanation: string;
    commonCauses: string[];
    suggestion: string;
  } => {
    switch (type) {
      case 'network':
        return {
          title: 'Cannot connect to server',
          explanation: 'The Teaching Assistant server is not responding.',
          commonCauses: [
            'The server is not running',
            'Your internet connection is down',
            'The server is temporarily overloaded',
          ],
          suggestion: 'Check your internet connection, then refresh the page.',
        };
      case 'validation':
        return {
          title: 'Please complete required fields',
          explanation: 'We need more information to generate quality content.',
          commonCauses: [
            'Required fields are empty',
            'Input format is incorrect',
            'Values are out of acceptable range',
          ],
          suggestion: 'Check the highlighted fields above and fill in the required information.',
        };
      case 'server':
        return {
          title: 'AI generation failed',
          explanation: "The AI couldn't generate content for your request.",
          commonCauses: [
            'The request was too complex or vague',
            'The AI service is temporarily unavailable',
            'The generated content didn\'t meet quality standards',
          ],
          suggestion: 'Try simplifying your request or being more specific about what you need.',
        };
      case 'auth':
        return {
          title: 'API key not configured',
          explanation: 'The server needs an Anthropic API key to generate content.',
          commonCauses: [
            'ANTHROPIC_API_KEY is missing from .env file',
            'API key is invalid or expired',
            'API key lacks required permissions',
          ],
          suggestion:
            'Contact your administrator to configure the API key, or add ANTHROPIC_API_KEY to the .env file.',
        };
      case 'timeout':
        return {
          title: 'Request timed out',
          explanation: 'The AI took too long to generate content.',
          commonCauses: [
            'The request was very complex',
            'The AI service is experiencing delays',
            'Network connection is slow',
          ],
          suggestion: 'Try again with a simpler request, or wait a few minutes and retry.',
        };
      case 'rate-limit':
        return {
          title: 'Rate limit exceeded',
          explanation: 'Too many requests were made in a short time.',
          commonCauses: [
            'Batch generation with too many items',
            'Multiple users sharing the same API key',
            'Rapid repeated requests',
          ],
          suggestion: 'Wait a few minutes before trying again, or reduce the number of items.',
        };
      default:
        return {
          title: 'Something went wrong',
          explanation: 'An unexpected error occurred.',
          commonCauses: ['Unknown error'],
          suggestion: 'Please try again or contact support if the problem persists.',
        };
    }
  };

  const Icon = getErrorIcon(error.type);
  const colors = getErrorColor(error.type);
  const defaultContent = getDefaultMessage(error.type);
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative rounded-xl border ${colors.border} ${colors.bg} ${
          compact ? 'p-4' : 'p-6'
        } shadow-sm`}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`absolute top-3 right-3 ${colors.icon} hover:opacity-70 transition-opacity`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 ${colors.icon}`}>
            <Icon className={compact ? 'h-6 w-6' : 'h-8 w-8'} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold ${colors.text} mb-2`}>
              {error.message || defaultContent.title}
            </h3>

            {!compact && (
              <>
                <p className={`text-sm ${colors.text} mb-3`}>
                  {error.details || defaultContent.explanation}
                </p>

                {defaultContent.commonCauses.length > 0 && (
                  <div className="mb-3">
                    <p className={`text-sm font-medium ${colors.text} mb-1`}>
                      Common causes:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {defaultContent.commonCauses.map((cause, index) => (
                        <li key={index} className={`text-sm ${colors.text} opacity-90`}>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={`text-sm ${colors.text} bg-white/50 rounded-lg p-3 mb-4`}>
                  <p className="font-medium mb-1">💡 What to try:</p>
                  <p>{error.suggestion || defaultContent.suggestion}</p>
                </div>
              </>
            )}

            {compact && (
              <p className={`text-sm ${colors.text} opacity-90 mb-3`}>
                {error.suggestion || defaultContent.suggestion}
              </p>
            )}

            {error.docLink && (
              <a
                href={error.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm ${colors.icon} hover:underline mb-3`}
              >
                <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-1" />
                View documentation
              </a>
            )}

            <div className="flex items-center space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`inline-flex items-center px-4 py-2 ${colors.icon} bg-white border ${colors.border} rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors`}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              )}

              {error.technicalDetails && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`text-sm ${colors.icon} hover:underline`}
                >
                  {showDetails ? 'Hide' : 'Show'} technical details
                </button>
              )}
            </div>

            {showDetails && error.technicalDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4"
              >
                <div className={`text-xs ${colors.text} bg-white/70 rounded-lg p-3 font-mono`}>
                  <p className="font-semibold mb-2">Technical Details:</p>
                  <pre className="whitespace-pre-wrap">{error.technicalDetails}</pre>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;
