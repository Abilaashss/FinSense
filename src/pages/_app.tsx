import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Load external fonts if needed
    const linkFonts = document.createElement('link');
    linkFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap';
    linkFonts.rel = 'stylesheet';
    document.head.appendChild(linkFonts);

    return () => {
      document.head.removeChild(linkFonts);
    };
  }, []);

  return (
    <>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
} 