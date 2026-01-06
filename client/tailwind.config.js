/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A1A2A',
          'navy-light': '#1a2d3d',
          gold: '#C6A667',
          'gold-dark': '#8B7355', // Darker gold for text on light backgrounds (WCAG AA compliant)
          'gold-muted': '#D4BC8A',
          'gold-light': 'rgba(198, 166, 103, 0.1)',
          bg: '#F1F3F5',
          'bg-warm': '#F8F7F4',
          text: '#374151', // Slightly darker for better contrast
          'text-light': '#4B5563', // Adjusted for better readability
          cream: '#FDFCFA',
          border: '#E5E7EB',
          'border-subtle': '#F0F0EE',
        },
        // Scholarly accent palette (muted, academic)
        scholarly: {
          sage: '#8B9A7E',
          'sage-light': 'rgba(139, 154, 126, 0.1)',
          terracotta: '#C4A484',
          'terracotta-light': 'rgba(196, 164, 132, 0.1)',
          slate: '#6B7A8C',
          'slate-light': 'rgba(107, 122, 140, 0.1)',
          wine: '#8B6B6B',
          'wine-light': 'rgba(139, 107, 107, 0.1)',
        }
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(10, 26, 42, 0.04)',
        'DEFAULT': '0 1px 3px rgba(10, 26, 42, 0.05), 0 1px 2px rgba(10, 26, 42, 0.03)',
        'md': '0 4px 6px rgba(10, 26, 42, 0.04), 0 2px 4px rgba(10, 26, 42, 0.03)',
        'lg': '0 10px 15px rgba(10, 26, 42, 0.05), 0 4px 6px rgba(10, 26, 42, 0.03)',
        'xl': '0 20px 25px rgba(10, 26, 42, 0.06), 0 10px 10px rgba(10, 26, 42, 0.03)',
        'card': '0 1px 2px rgba(10, 26, 42, 0.02), 0 4px 12px rgba(10, 26, 42, 0.04)',
        'card-hover': '0 4px 8px rgba(10, 26, 42, 0.04), 0 12px 24px rgba(10, 26, 42, 0.08)',
        'gold': '0 4px 12px rgba(198, 166, 103, 0.2)',
        'inner-subtle': 'inset 0 1px 2px rgba(10, 26, 42, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.35' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['2.75rem', { lineHeight: '1.15' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'scholarly': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-scholarly': 'linear-gradient(135deg, var(--brand-navy) 0%, #1a2d3d 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C6A667 0%, #D4BC8A 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(241, 243, 245, 0) 0%, rgba(241, 243, 245, 1) 100%)',
      },
    },
  },
  plugins: [],
}
