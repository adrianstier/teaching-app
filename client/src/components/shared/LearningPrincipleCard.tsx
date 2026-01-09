import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface LearningPrincipleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: 'sage' | 'terracotta' | 'slate' | 'wine' | 'gold' | 'navy';
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  badge?: string;
}

const LearningPrincipleCard: React.FC<LearningPrincipleCardProps> = ({
  title,
  description,
  icon,
  color = 'gold',
  onClick,
  variant = 'default',
  badge,
}) => {
  const colorSchemes = {
    sage: {
      bg: 'bg-scholarly-sage/5',
      border: 'border-scholarly-sage/20',
      hoverBorder: 'hover:border-scholarly-sage/40',
      text: 'text-scholarly-sage',
      iconBg: 'bg-scholarly-sage/10',
      badgeBg: 'bg-scholarly-sage/10',
    },
    terracotta: {
      bg: 'bg-scholarly-terracotta/5',
      border: 'border-scholarly-terracotta/20',
      hoverBorder: 'hover:border-scholarly-terracotta/40',
      text: 'text-scholarly-terracotta',
      iconBg: 'bg-scholarly-terracotta/10',
      badgeBg: 'bg-scholarly-terracotta/10',
    },
    slate: {
      bg: 'bg-scholarly-slate/5',
      border: 'border-scholarly-slate/20',
      hoverBorder: 'hover:border-scholarly-slate/40',
      text: 'text-scholarly-slate',
      iconBg: 'bg-scholarly-slate/10',
      badgeBg: 'bg-scholarly-slate/10',
    },
    wine: {
      bg: 'bg-scholarly-wine/5',
      border: 'border-scholarly-wine/20',
      hoverBorder: 'hover:border-scholarly-wine/40',
      text: 'text-scholarly-wine',
      iconBg: 'bg-scholarly-wine/10',
      badgeBg: 'bg-scholarly-wine/10',
    },
    gold: {
      bg: 'bg-brand-gold/5',
      border: 'border-brand-gold/20',
      hoverBorder: 'hover:border-brand-gold/40',
      text: 'text-brand-gold',
      iconBg: 'bg-brand-gold/10',
      badgeBg: 'bg-brand-gold/10',
    },
    navy: {
      bg: 'bg-brand-navy/5',
      border: 'border-brand-navy/20',
      hoverBorder: 'hover:border-brand-navy/40',
      text: 'text-brand-navy',
      iconBg: 'bg-brand-navy/10',
      badgeBg: 'bg-brand-navy/10',
    },
  };

  const scheme = colorSchemes[color];

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl border ${scheme.border} ${scheme.bg} ${scheme.hoverBorder} transition-all cursor-pointer group`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${scheme.iconBg}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-brand-navy truncate">{title}</h4>
            <p className="text-xs text-brand-text-light truncate">{description}</p>
          </div>
          {onClick && (
            <ArrowRightIcon className={`h-4 w-4 ${scheme.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={`p-6 rounded-2xl border-2 ${scheme.border} bg-white shadow-card ${scheme.hoverBorder} transition-all cursor-pointer group relative overflow-hidden`}
        onClick={onClick}
      >
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${scheme.bg} rounded-full -translate-y-1/2 translate-x-1/2`} />

        <div className="relative">
          {badge && (
            <span className={`inline-block text-xs font-medium ${scheme.text} ${scheme.badgeBg} px-2 py-1 rounded-full mb-3`}>
              {badge}
            </span>
          )}

          <div className={`p-3 rounded-xl ${scheme.iconBg} w-fit mb-4`}>
            {icon}
          </div>

          <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
            {title}
          </h3>

          <p className="text-sm text-brand-text leading-relaxed mb-4">
            {description}
          </p>

          {onClick && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${scheme.text} group-hover:translate-x-1 transition-transform`}>
              <span>Learn more</span>
              <ArrowRightIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-5 rounded-xl border ${scheme.border} ${scheme.bg} ${scheme.hoverBorder} transition-all ${onClick ? 'cursor-pointer' : ''} group`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-2.5 rounded-xl ${scheme.iconBg} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          {badge && (
            <span className={`inline-block text-xs font-medium ${scheme.text} ${scheme.badgeBg} px-2 py-0.5 rounded mb-2`}>
              {badge}
            </span>
          )}
          <h4 className="text-sm font-semibold text-brand-navy mb-1">{title}</h4>
          <p className="text-sm text-brand-text leading-relaxed">{description}</p>
        </div>
        {onClick && (
          <ArrowRightIcon className={`h-4 w-4 ${scheme.text} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
        )}
      </div>
    </motion.div>
  );
};

export default LearningPrincipleCard;
