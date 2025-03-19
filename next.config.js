/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Next.js 12+ Pages Router approach for i18n
  i18n: {
    locales: ['en', 'hi', 'ta', 'te', 'bn', 'mr'], // English, Hindi, Tamil, Telugu, Bengali, Marathi
    defaultLocale: 'en',
  },
};

module.exports = nextConfig; 