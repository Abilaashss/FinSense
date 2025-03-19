/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEF9',
          100: '#CCDDF3',
          200: '#99BBE7',
          300: '#6699DB',
          400: '#3377CF',
          500: '#0055C3', // Standard Chartered primary blue
          600: '#004499',
          700: '#003370',
          800: '#002247',
          900: '#001123',
        },
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          50: '#E0F2FE',
          100: '#B9E6FE',
          200: '#7CD4FD',
          300: '#36BEFA',
          400: '#0BA2E9',
          500: '#0082CB', // Standard Chartered accent blue
          600: '#006BA6',
          700: '#005380',
          800: '#003B5C',
          900: '#001E2E',
        },
        scblue: {
          dark: '#0A2364',   // Dark navy blue (for gradients)
          medium: '#1E4DE0', // Medium blue (for gradients)
          light: '#3377FF',  // Light blue (for accent)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'sc-gradient': 'linear-gradient(135deg, #0A2364 0%, #1E4DE0 100%)',
      }
    },
  },
  plugins: [],
}; 