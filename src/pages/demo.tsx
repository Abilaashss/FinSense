import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isPlaying, setIsPlaying] = useState({
    'home': false,
    'personal': false,
    'business': false
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const playVideo = (type: string) => {
    const videoId = `${type}Video`;
    const video = document.getElementById(videoId) as HTMLVideoElement;
    if (video) {
      video.play();
      setIsPlaying(prev => ({...prev, [type]: true}));
    }
  };

  const handleVideoEnd = (type: string) => {
    setIsPlaying(prev => ({...prev, [type]: false}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Demo | Standard Chartered AI Branch Manager</title>
        <meta name="description" content="Watch demonstrations of the AI Branch Manager loan application process" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`container mx-auto px-4 py-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-scblue-dark mb-4">
              AI Branch Manager Demo
            </h1>
            <p className="text-lg text-secondary-700 max-w-3xl mx-auto">
              See how our AI Branch Manager guides you through different loan applications using our interactive video technology.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-8">
            <button 
              className={`px-6 py-3 rounded-t-lg font-medium transition ${activeTab === 'home' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-700 hover:text-secondary-900'}`}
              onClick={() => setActiveTab('home')}
            >
              Home Loan
            </button>
            <button 
              className={`px-6 py-3 rounded-t-lg font-medium transition ${activeTab === 'personal' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-700 hover:text-secondary-900'}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Loan
            </button>
            <button 
              className={`px-6 py-3 rounded-t-lg font-medium transition ${activeTab === 'business' ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-700 hover:text-secondary-900'}`}
              onClick={() => setActiveTab('business')}
            >
              Business Loan
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
            {/* Home Loan Tab */}
            <div className={activeTab === 'home' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Home Loan Application Process</h2>
              <p className="text-secondary-700 mb-6">
                Watch a demonstration of how our AI Branch Manager guides you through the home loan application process, from initial questions to document verification.
              </p>
              
              <div className="relative rounded-xl overflow-hidden shadow-md mb-8">
                <div className="aspect-w-16 aspect-h-9 w-full bg-black">
                  <video 
                    id="homeVideo"
                    src="/videos/home-loan.mp4"
                    className="w-full h-full object-cover"
                    poster="/images/branch-manager-poster.svg"
                    controls={isPlaying.home}
                    onEnded={() => handleVideoEnd('home')}
                  />
                  {!isPlaying.home && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 cursor-pointer"
                      onClick={() => playVideo('home')}
                    >
                      <h3 className="text-white text-xl font-medium">Home Loan Demo</h3>
                      <p className="text-white/90 mt-2">See how to apply for a home loan with our AI Branch Manager</p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-secondary-900 mb-3">Key Features:</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Property evaluation and valuation assessments</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Down payment calculations and options</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Interest rate comparison and tenure selection</span>
                </li>
              </ul>
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => router.push('/onboarding')}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition shadow-md"
                >
                  Apply for a Home Loan
                </button>
              </div>
            </div>
            
            {/* Personal Loan Tab */}
            <div className={activeTab === 'personal' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Personal Loan Application Process</h2>
              <p className="text-secondary-700 mb-6">
                Watch a demonstration of how to apply for a personal loan using our AI Branch Manager, with instant eligibility checks and customized offers.
              </p>
              
              <div className="relative rounded-xl overflow-hidden shadow-md mb-8">
                <div className="aspect-w-16 aspect-h-9 w-full bg-black">
                  <video 
                    id="personalVideo"
                    src="/videos/personal-loan.mp4"
                    className="w-full h-full object-cover"
                    poster="/images/branch-manager-poster.svg"
                    controls={isPlaying.personal}
                    onEnded={() => handleVideoEnd('personal')}
                  />
                  {!isPlaying.personal && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 cursor-pointer"
                      onClick={() => playVideo('personal')}
                    >
                      <h3 className="text-white text-xl font-medium">Personal Loan Demo</h3>
                      <p className="text-white/90 mt-2">Learn how quick and easy personal loan application can be</p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-secondary-900 mb-3">Key Features:</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Instant loan eligibility assessment</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Customized loan amount and tenure options</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Digital income verification</span>
                </li>
              </ul>
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => router.push('/onboarding')}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition shadow-md"
                >
                  Apply for a Personal Loan
                </button>
              </div>
            </div>
            
            {/* Business Loan Tab */}
            <div className={activeTab === 'business' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Business Loan Application Process</h2>
              <p className="text-secondary-700 mb-6">
                Watch a demonstration of our business loan application process, featuring specialized business assessment and documentation requirements.
              </p>
              
              <div className="relative rounded-xl overflow-hidden shadow-md mb-8">
                <div className="aspect-w-16 aspect-h-9 w-full bg-black">
                  <video 
                    id="businessVideo"
                    src="/videos/business-loan.mp4"
                    className="w-full h-full object-cover"
                    poster="/images/branch-manager-poster.svg"
                    controls={isPlaying.business}
                    onEnded={() => handleVideoEnd('business')}
                  />
                  {!isPlaying.business && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 cursor-pointer"
                      onClick={() => playVideo('business')}
                    >
                      <h3 className="text-white text-xl font-medium">Business Loan Demo</h3>
                      <p className="text-white/90 mt-2">See how our AI helps streamline business loan applications</p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-secondary-900 mb-3">Key Features:</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Business viability and cash flow assessment</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Specialized business document processing</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center mt-1 mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-secondary-700">Tailored business growth financing options</span>
                </li>
              </ul>
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => router.push('/onboarding')}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition shadow-md"
                >
                  Apply for a Business Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 