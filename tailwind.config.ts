import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Nouvelle palette principale
        brand: {
          red: '#f02822',
          'red-light': '#ff4d47',
          'red-dark': '#c41e1a',
          violet: '#844cfc',
          'violet-light': '#dbcbff',
          'violet-dark': '#6a3acc',
          'violet-bg': '#0a0a0f',
        },
        kraft: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc9',
          300: '#d4c4a4',
          400: '#c4a574',
          500: '#b08d5a',
          600: '#9a7648',
          700: '#7d5e3a',
          800: '#5c4a32',
          900: '#3d3221',
          paper: '#faf6f0',
          light: '#f5e6d3',
          dark: '#8b6914',
        },
        carton: {
          light: '#c9b896',
          DEFAULT: '#a08060',
          dark: '#5c4a32',
          brown: '#6d5238'
        },
        primary: {
          DEFAULT: '#844cfc',
          light: '#dbcbff',
          dark: '#6a3acc',
          50: '#f5f0ff',
          100: '#ede5ff',
          500: '#844cfc',
          600: '#6a3acc',
          700: '#5a2eb3'
        },
        mustard: {
          light: '#f5d547',
          DEFAULT: '#dd9933',
          dark: '#b87a20'
        },
        theater: {
          cream: '#faf6f0',
          brown: '#2a1f14',
          beige: '#e8d1b2',
          green: '#4a6741',
          black: '#1a1612'
        },
        drop: {
          black: '#1a1612',
          white: '#ffffff'
        },
        pencil: {
          red: '#f02822',
          blue: '#1e3a5f',
          green: '#2d5a27',
          yellow: '#f4c430',
          purple: '#844cfc'
        }
      },
      fontFamily: {
        sans: ['Josefin Sans', 'system-ui', 'sans-serif'],
        display: ['Sans Merci', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        craft: ['Patrick Hand', 'cursive'],
        body: ['Josefin Sans', 'system-ui', 'sans-serif'],
        title: ['Sans Merci', 'Georgia', 'serif']
      },
      boxShadow: {
        'paper': '2px 2px 8px rgba(0,0,0,0.08)',
        'paper-hover': '4px 4px 12px rgba(0,0,0,0.12)',
        'cardboard': '4px 4px 0 rgba(90,70,50,0.3)',
        'tape': '0 2px 4px rgba(0,0,0,0.15)',
        'cutout': 'inset 2px 2px 4px rgba(0,0,0,0.1)',
        'drop': '2px 3px 6px rgba(0,0,0,0.15)',
        'kraft': '3px 3px 0 #c9b896',
        'violet': '0 0 30px rgba(132,76,252,0.4)',
        'violet-lg': '0 0 60px rgba(132,76,252,0.3)',
      },
      backgroundImage: {
        'kraft-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E\")",
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' opacity='0.03'/%3E%3C/svg%3E\")",
        'grid-violet': "linear-gradient(rgba(132,76,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(132,76,252,0.3) 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 4s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'swing': 'swing 3s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'rotate-gentle': 'rotateGentle 12s ease-in-out infinite',
        'spotlight': 'spotlight 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' }
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-5px)' },
          '50%': { transform: 'translateX(5px) translateY(-10px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' }
        },
        rotateGentle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        spotlight: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translate(10%, 10%) scale(1.1)', opacity: '0.4' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(132,76,252,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(132,76,252,0.5)' }
        }
      },
      borderRadius: {
        'torn': '255px 15px 225px 15px/15px 225px 15px 255px'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
