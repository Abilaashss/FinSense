import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import FaceVerification from '../components/FaceVerification';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanApplicationResult from '../components/LoanApplicationResult';

// Import loan data
import { homeLoanQuestions, personalLoanQuestions, businessLoanQuestions } from '../data/loan-questions';

interface UserInfo {
  fullName: string;
  email: string;
  mobile: string;
  language: string;
}

export default function LoanApplication() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loanType, setLoanType] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    applicationId: string;
    status: 'approved' | 'rejected' | 'pending';
    reason?: string;
    interestRate?: number;
    loanAmount?: number;
    tenure?: number;
    monthlyEMI?: number;
    cibilScore?: number;
  } | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    const { type, lang } = router.query;
    
    // Check if coming from the user-info page by looking for session storage
    const storedUserInfo = sessionStorage.getItem('userInfo');
    
    if (!storedUserInfo) {
      // If user hasn't entered their info, redirect to the user-info page
      if (type) {
        router.push({
          pathname: '/user-info',
          query: { type }
        });
      } else {
        router.push('/onboarding');
      }
      return;
    }
    
    // Parse user information from session storage
    try {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      if (parsedUserInfo.language) {
        setSelectedLanguage(parsedUserInfo.language);
      }
    } catch (e) {
      console.error('Error parsing user info:', e);
    }
    
    if (type) {
      setLoanType(type as string);
      
      // Set questions based on loan type
      if (type === 'home-loan') {
        setQuestions(homeLoanQuestions);
      } else if (type === 'personal-loan') {
        setQuestions(personalLoanQuestions);
      } else if (type === 'business-loan') {
        setQuestions(businessLoanQuestions);
      }
    }
    
    // Set language if provided in query
    if (lang) {
      setSelectedLanguage(lang as string);
    }
  }, [router, router.query]);

  const getTitleByLoanType = () => {
    switch(loanType) {
      case 'home-loan': return 'Home Loan Application';
      case 'personal-loan': return 'Personal Loan Application';
      case 'business-loan': return 'Business Loan Application';
      default: return 'Loan Application';
    }
  };

  const getLoanTypeFormatted = () => {
    return loanType?.replace('-', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) || '';
  };

  // Get video file name based on language and loan type
  const getVideoFileName = () => {
    // If language-specific videos are available, use them
    if (selectedLanguage !== 'en') {
      return `${loanType}-${selectedLanguage}.mp4`;
    }
    // Default to the standard video for the loan type
    return `${loanType}.mp4`;
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
  };

  const handleVideoRecordClick = (questionId: string) => {
    // Implement video recording for a specific question
    console.log(`Recording video for question ${questionId}`);
  };

  const handleSubmitApplication = (answers: Record<string, string>) => {
    // Process the submission
    setIsSubmitted(true);
    
    // Simulate an approval decision
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 300) + 600; // 600-900 range
      const randomAmount = Math.floor(Math.random() * 40) + 10; // 10-50 lakhs
      const randomTenure = Math.floor(Math.random() * 20) + 5; // 5-25 years
      
      let interestRate;
      let status: 'approved' | 'rejected' = 'approved';
      let reason = '';
      
      // Set interest rate based on CIBIL score
      if (randomScore >= 750) {
        interestRate = 7.5;
      } else if (randomScore >= 700) {
        interestRate = 8.5;
      } else if (randomScore >= 650) {
        interestRate = 9.5;
      } else {
        interestRate = 10.5;
        
        // With a low score, there's a chance of rejection
        if (randomScore < 630) {
          status = 'rejected';
          reason = 'Your CIBIL score is below our minimum threshold for this loan type. We recommend improving your credit score before applying again.';
        }
      }
      
      // Calculate EMI (simplified)
      const principal = randomAmount * 100000; // Convert lakhs to rupees
      const monthlyInterest = interestRate / 12 / 100;
      const months = randomTenure * 12;
      const monthlyEMI = Math.round(principal * monthlyInterest * Math.pow(1 + monthlyInterest, months) / (Math.pow(1 + monthlyInterest, months) - 1));
      
      // Generate random application ID
      const applicationId = `SC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      setApplicationResult({
        applicationId,
        status,
        reason,
        interestRate,
        loanAmount: randomAmount,
        tenure: randomTenure,
        monthlyEMI,
        cibilScore: randomScore
      });
      
    }, 2000);
  };

  const playIntroVideo = () => {
    const introVideo = document.getElementById('introVideo') as HTMLVideoElement;
    if (introVideo) {
      introVideo.play();
      setIsPlayingVideo(true);
    }
  };

  if (!loanType || !isLoaded) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{getTitleByLoanType()} | Standard Chartered AI Branch Manager</title>
        <meta name="description" content={`Apply for a ${loanType?.replace('-', ' ')} with AI Branch Manager`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.push('/onboarding')}
          className="flex items-center text-primary-600 hover:text-primary-700 transition mb-8 group"
        >
          <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Loan Selection
        </button>

        <div className={`max-w-6xl mx-auto transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {isSubmitted && applicationResult ? (
            <LoanApplicationResult 
              applicationId={applicationResult.applicationId}
              loanType={getLoanTypeFormatted()}
              status={applicationResult.status}
              reason={applicationResult.reason}
              interestRate={applicationResult.interestRate}
              loanAmount={applicationResult.loanAmount}
              tenure={applicationResult.tenure}
              monthlyEMI={applicationResult.monthlyEMI}
              cibilScore={applicationResult.cibilScore}
              userInfo={userInfo ? { fullName: userInfo.fullName } : undefined}
            />
          ) : !isVerified ? (
            <div className="bg-white rounded-xl shadow-card p-8 max-w-3xl mx-auto">
              <h1 className="text-2xl font-display font-bold text-scblue-dark mb-6">
                Identity Verification
              </h1>
              
              <p className="text-secondary-700 mb-6">
                Before proceeding with your {getLoanTypeFormatted()} application, we need to verify your identity for security purposes.
              </p>
              
              <FaceVerification onVerificationComplete={handleVerificationComplete} />
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-md font-medium text-blue-800 mb-2">Why We Verify Your Identity</h3>
                  <p className="text-sm text-blue-700">
                    Identity verification helps protect your personal information and prevents fraudulent applications. 
                    Your face scan is encrypted and only used for verification purposes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-display font-bold text-scblue-dark mb-2">
                  {getLoanTypeFormatted()} Application
                </h1>
                
                <p className="text-secondary-700">
                  Please complete all the questions below to submit your loan application.
                </p>
              </div>
              
              {/* Video Introduction */}
              <div className="mb-8 bg-white rounded-xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Introduction to {getLoanTypeFormatted()}
                </h2>
                
                <p className="text-secondary-700 mb-4">
                  Watch this short video to understand the {getLoanTypeFormatted()} process at Standard Chartered.
                </p>
                
                <div className="bg-scblue-dark p-1 rounded-xl overflow-hidden shadow-md mb-4">
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                    <video 
                      id="introVideo"
                      className="w-full h-full object-cover"
                      controls={isPlayingVideo}
                      poster={`/images/branch-manager-poster.svg`}
                      src={`/videos/${getVideoFileName()}`}
                      onPlay={() => setIsPlayingVideo(true)}
                      onEnded={() => setIsPlayingVideo(false)}
                    />
                    
                    {!isPlayingVideo && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" 
                        onClick={playIntroVideo}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
                          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Loan Application Form */}
              <LoanApplicationForm 
                questions={questions} 
                loanType={getLoanTypeFormatted()}
                onSubmit={handleSubmitApplication}
                onVideoRecord={handleVideoRecordClick}
                userInfo={userInfo || undefined}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Available languages for display in the summary
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
]; 