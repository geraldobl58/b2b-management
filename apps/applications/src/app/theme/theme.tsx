'use client';

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#3b82f6', // blue-500
      light: '#60a5fa', // blue-400
      dark: '#2563eb', // blue-600
    },
    secondary: {
      main: '#8b5cf6', // violet-500
      light: '#a78bfa', // violet-400
      dark: '#7c3aed', // violet-600
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171', // red-400
      dark: '#dc2626', // red-600
    },
    warning: {
      main: '#f59e0b', // amber-500
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
    },
    info: {
      main: '#06b6d4', // cyan-500
      light: '#22d3ee', // cyan-400
      dark: '#0891b2', // cyan-600
    },
    success: {
      main: '#10b981', // emerald-500
      light: '#34d399', // emerald-400
      dark: '#059669', // emerald-600
    },
    grey: {
      50: '#f9fafb',   // gray-50
      100: '#f3f4f6',  // gray-100
      200: '#e5e7eb',  // gray-200
      300: '#d1d5db',  // gray-300
      400: '#9ca3af',  // gray-400
      500: '#6b7280',  // gray-500
      600: '#4b5563',  // gray-600
      700: '#374151',  // gray-700
      800: '#1f2937',  // gray-800
      900: '#111827',  // gray-900
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8, // rounded-lg
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem', // rounded-lg
          fontWeight: 500,
          padding: '0.5rem 1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
          borderRadius: '0.5rem', // rounded-lg
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem', // rounded-md
            '& fieldset': {
              borderColor: '#d1d5db', // gray-300
            },
            '&:hover fieldset': {
              borderColor: '#9ca3af', // gray-400
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6', // blue-500
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;