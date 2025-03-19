import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import FaceVerification from '../components/FaceVerification';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanApplicationResult from '../components/LoanApplicationResult';
import DocumentScanner from '../components/DocumentScanner';

// Import loan data
import { homeLoanQuestions, personalLoanQuestions, businessLoanQuestions } from '../data/loan-questions';

interface UserInfo {
  fullName: string;
  email: string;
  mobile: string;
  language: string;
}

export default function LoanApplicationV2() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loanType, setLoanType] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ai-video' | 'user-recording' | 'questions'>('ai-video');
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
    reasons: string[];
    nextSteps: string[];
  } | null>(null);
  const [hardcodedAnswers, setHardcodedAnswers] = useState<Record<string, string>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [documentVerificationStep, setDocumentVerificationStep] = useState<'aadhaar' | 'pan' | 'complete'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');
  const [panNumber, setPanNumber] = useState<string>('');
  

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
      let questionList: any[] = [];
      if (type === 'home-loan') {
        questionList = homeLoanQuestions;
        setQuestions(homeLoanQuestions);
      } else if (type === 'personal-loan') {
        questionList = personalLoanQuestions; 
        setQuestions(personalLoanQuestions);
      } else if (type === 'business-loan') {
        questionList = businessLoanQuestions;
        setQuestions(businessLoanQuestions);
      }
      
      // Generate hardcoded answers for all questions
      const answers: Record<string, string> = {};
      questionList.forEach(question => {
        answers[question.id] = generateHardcodedAnswer(question);
      });
      setHardcodedAnswers(answers);
    }
    
    // Set language if provided in query
    if (lang) {
      setSelectedLanguage(lang as string);
    }
  }, [router, router.query]);

  // Generate hardcoded answer based on question
  const generateHardcodedAnswer = (question: any): string => {
    // Generate consistent hardcoded answers based on question ID and text
    const questionType = question.id.split('-')[0];
    const questionNum = parseInt(question.id.split('-')[1]);
    
    switch(questionType) {
      case 'home':
        if (question.text.includes("Welcome to Standard Chartered Bank")) 
          return "I'm doing well, thank you for asking. I appreciate your warm welcome.";
        if (question.text.includes("what brings you in today")) 
          return "Yes, I'm interested in applying for a home loan. I've been saving up for a while and feel ready to take this step.";
        if (question.text.includes("property you have in mind")) 
          return "I'm looking at a 3-bedroom apartment in a gated community in Whitefield, Bangalore. It's approximately 1,500 sq ft with modern amenities.";
        if (question.text.includes("price range")) 
          return "The property is priced at ₹75,00,000. I'm planning to make a down payment of about 20%, which is ₹15,00,000.";
        if (question.text.includes("budget")) 
          return "I'd be comfortable with a monthly installment between ₹45,000 to ₹50,000, depending on the interest rate and tenure.";
        if (question.text.includes("employment status and income")) 
          return "I'm a Senior Software Engineer at Infosys, with 8 years of experience. My monthly income is ₹1,25,000, and I've been with my current employer for 4 years.";
        if (question.text.includes("ongoing debts")) 
          return "I have a car loan with an EMI of ₹12,000, which will be fully paid off in about 18 months. No other significant debts.";
        if (question.text.includes("different loan plans")) 
          return "I've done some research, but I'd appreciate if you could explain the different home loan options, especially regarding fixed vs. floating rates and any special schemes for first-time homebuyers.";
        if (question.text.includes("any questions for me")) 
          return "Yes, I'd like to know the typical processing time once all documents are submitted, and if there are any pre-payment penalties.";
        if (question.text.includes("I'll guide you")) 
          return "Thank you! I'm looking forward to a smooth application process with your guidance.";
        return "I would need more information about that specific aspect of the home loan.";
        
      case 'personal':
        if (question.text.includes("How can I assist you today")) 
          return "I'm interested in taking a personal loan for some upcoming expenses.";
        if (question.text.includes("what you'd like to use the loan for")) 
          return "I'm planning to renovate my home, specifically the kitchen and bathroom. I've been wanting to do this for a while now.";
        if (question.text.includes("loan amount are you considering")) 
          return "I'm looking for a loan of ₹10,00,000, preferably with a 4-year (48 months) repayment period.";
        if (question.text.includes("employment status and monthly income")) 
          return "I'm currently employed as a Marketing Manager at TCS. My monthly income is ₹1,25,000, and I've been with the company for 6 years now.";
        if (question.text.includes("ongoing loans or debts")) 
          return "I have a car loan with an EMI of ₹15,000 that has about 2 years left. Other than that, I have no significant debts.";
        if (question.text.includes("credit score")) 
          return "My current CIBIL score is 760, which I checked last month.";
        if (question.text.includes("taken a personal loan")) 
          return "Yes, I took a personal loan about 5 years ago for my wedding expenses, which I repaid successfully without any defaults.";
        if (question.text.includes("fixed or flexible repayment plan")) 
          return "I'd prefer a fixed repayment plan as it helps me budget better with a consistent monthly payment.";
        if (question.text.includes("interest rates and processing fees")) 
          return "I've checked the rates online, but I'd appreciate if you could explain any current promotions or special rates that might apply to my situation.";
        if (question.text.includes("any questions before we proceed")) 
          return "Yes, I'd like to know how quickly the loan can be disbursed after approval and whether there are any pre-payment penalties.";
        return "I would need more information about that specific aspect of the personal loan.";
        
      case 'business':
        if (question.text.includes("explore our business loan options")) 
          return "Yes, I'm interested in exploring financing options for my tech business to support our expansion plans.";
        if (question.text.includes("what industry you're in")) 
          return "I run a software development company called TechSolutions Pvt Ltd. We specialize in enterprise software solutions and have been operating for 5 years now.";
        if (question.text.includes("purpose of the loan")) 
          return "We're planning to expand our operations by hiring more developers and establishing a new office space to accommodate our growing team.";
        if (question.text.includes("How much capital")) 
          return "We're looking to borrow ₹50,00,000 with a repayment period of 5 years to ensure manageable monthly payments.";
        if (question.text.includes("current revenue and any outstanding debts")) 
          return "Our annual revenue is approximately ₹2.5 crores with a consistent growth rate of 20% year-on-year. We have a small equipment loan of ₹5,00,000 that will be fully paid off within 6 months.";
        if (question.text.includes("collateral in mind")) 
          return "Yes, we can offer our office property and equipment as collateral for the loan. We're open to discussing the valuation process.";
        if (question.text.includes("taken a business loan")) 
          return "Yes, we took a smaller business loan (₹10,00,000) three years ago for purchasing equipment, which we repaid ahead of schedule.";
        if (question.text.includes("choose Standard Chartered Bank")) 
          return "Standard Chartered has a strong reputation for supporting growing businesses, and your competitive interest rates and business-friendly policies made you our first choice.";
        if (question.text.includes("growth plans for next 5 years")) 
          return "We aim to double our team size, expand to international markets starting with Singapore, and launch a SaaS product line that should increase our revenue by at least 40% annually.";
        if (question.text.includes("repayment options and interest rates")) 
          return "Yes, please. I'd particularly like to understand any flexible repayment options that might align with our business's seasonal cash flow.";
        if (question.text.includes("any questions for me before we begin")) 
          return "Yes, I'd like to know what documentation we'll need to provide and how long the approval process typically takes for a loan of this size.";
        return "I would need more specific information about that aspect of the business loan.";
        
      default:
        return "I prefer not to answer this question at this time.";
    }
  };

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
    if (!loanType) return 'Intro.mp4';
    
    // Map the loan type to the actual video file names
    switch(loanType) {
      case 'home-loan':
        return 'Home_loan.mp4';
      case 'personal-loan':
        return 'Personal_loan.mp4';
      case 'business-loan':
        return 'business_loan.mp4';
      default:
        return 'Intro.mp4';
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
  };

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      
      // Request camera access with appropriate settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      // Make sure the video element is properly set up with the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute to prevent feedback
        
        // Make sure the video is visible before starting recording
        await videoRef.current.play();
        console.log("Video playback started - you should see yourself now");
      }

      // Start recording after ensuring the stream is visible - no need for delay
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: navigator.userAgent.indexOf('Firefox') !== -1 
          ? 'video/webm' // Firefox
          : 'video/webm;codecs=vp9,opus' // Chrome and others
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        
        // Create a name for the recording based on user info
        const userNamePart = userInfo?.fullName ? userInfo.fullName.replace(/\s+/g, '_').toLowerCase() : 'user';
        const loanTypePart = loanType ? loanType.replace('-', '_') : 'loan';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const videoName = `${userNamePart}_${loanTypePart}_${timestamp}.mp4`;
        
        console.log(`Video recorded: ${videoName}`);
      };
      
      // Start recording - keep camera preview visible during recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // For demo purposes, limit recording to 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecorded(true);
      
      // Also stop the tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleQuestionRecording = (questionId: string) => {
    console.log(`Recording for question ${questionId}`);
    // In a real implementation, this would record a video for a specific question
    // For demo purposes, we'll just mark the question as answered after a delay
    setTimeout(() => {
      setHardcodedAnswers(prev => ({
        ...prev,
        [questionId]: generateHardcodedAnswer(questions.find(q => q.id === questionId))
      }));
    }, 2000);
  };

  const handleSubmitApplication = () => {
    // Submit the application for final decision
    setIsSubmitted(true);
    setIsReviewing(false);
    
    // Simulate an approval decision
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 300) + 600; // 600-900 range
      const randomAmount = Math.floor(Math.random() * 40) + 10; // 10-50 lakhs
      const randomTenure = Math.floor(Math.random() * 20) + 5; // 5-25 years
      
      let interestRate;
      let status: 'approved' | 'rejected' = 'approved';
      let reasons: string[] = [];
      let nextSteps: string[] = [];
      
      // Set interest rate based on CIBIL score
      if (randomScore >= 750) {
        interestRate = 7.5;
        reasons.push('Excellent credit score of ' + randomScore);
        reasons.push('Strong financial history with no defaults');
        reasons.push('Adequate income-to-loan ratio');
        reasons.push('Stable employment history');
        
        nextSteps.push('Visit your nearest Standard Chartered branch with KYC documents');
        nextSteps.push('Sign the loan agreement');
        nextSteps.push('Funds will be disbursed within 48 hours');
        nextSteps.push('Set up auto-payment for monthly EMIs');
      } else if (randomScore >= 700) {
        interestRate = 8.5;
        reasons.push('Good credit score of ' + randomScore);
        reasons.push('No recent defaults on existing loans');
        reasons.push('Income meets minimum requirements');
        reasons.push('Acceptable debt-to-income ratio');
        
        nextSteps.push('Visit your nearest Standard Chartered branch with KYC documents');
        nextSteps.push('Complete income verification process');
        nextSteps.push('Sign the loan agreement');
        nextSteps.push('Funds will be disbursed within 3-5 business days');
      } else if (randomScore >= 650) {
        interestRate = 9.5;
        reasons.push('Fair credit score of ' + randomScore);
        reasons.push('Limited credit history but no major concerns');
        reasons.push('Income is sufficient with minimal risk factors');
        reasons.push('Additional documentation may be required');
        
        nextSteps.push('Submit additional income proof documents');
        nextSteps.push('Complete detailed financial verification');
        nextSteps.push('Visit your nearest Standard Chartered branch for document verification');
        nextSteps.push('Funds will be disbursed within 7 business days after verification');
      } else {
        interestRate = 10.5;
        
        // With a low score, there's a chance of rejection
        if (randomScore < 630) {
          status = 'rejected';
          reasons.push('Credit score below minimum threshold: ' + randomScore);
          reasons.push('Unfavorable debt-to-income ratio');
          reasons.push('Insufficient income for the requested loan amount');
          reasons.push('Credit history shows recent payment irregularities');
          
          nextSteps.push('Work on improving your credit score');
          nextSteps.push('Reduce existing debt obligations');
          nextSteps.push('Maintain regular payments on existing loans');
          nextSteps.push('You can reapply after 6 months with improved financial standing');
        } else {
          reasons.push('Below average credit score of ' + randomScore);
          reasons.push('Higher risk profile based on credit history');
          reasons.push('Approved with higher interest rate to offset risk');
          reasons.push('Regular payment history will help improve future rates');
          
          nextSteps.push('Submit additional collateral documentation');
          nextSteps.push('Complete enhanced verification process');
          nextSteps.push('Visit branch with co-applicant (if applicable)');
          nextSteps.push('Funds will be disbursed within 10 business days after verification');
        }
      }
      
      // Calculate EMI (simplified)
      const principal = randomAmount * 100000; // Convert lakhs to rupees
      const monthlyInterest = interestRate / 12 / 100;
      const months = randomTenure * 12;
      const monthlyEMI = Math.round(principal * monthlyInterest * Math.pow(1 + monthlyInterest, months) / (Math.pow(1 + monthlyInterest, months) - 1));
      
      // Generate application ID using user initials if available
      let applicationId = 'SC';
      if (userInfo?.fullName) {
        const initials = userInfo.fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase();
        applicationId += initials;
      }
      applicationId += Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      
      setApplicationResult({
        applicationId,
        status,
        reasons,
        nextSteps,
        interestRate,
        loanAmount: randomAmount,
        tenure: randomTenure,
        monthlyEMI,
        cibilScore: randomScore
      });
      
    }, 3000);
  };

  const playIntroVideo = () => {
    const introVideo = document.getElementById('introVideo') as HTMLVideoElement;
    if (introVideo) {
      introVideo.play();
      setIsPlayingVideo(true);
      
      // Set up an event listener to detect when the video ends
      introVideo.onended = () => {
        setIsVideoWatched(true);
        // Remove automatic progression
        // setViewMode('user-recording');
      };
    }
  };

  // Add onReview callback to handle application review
  const handleReviewApplication = (answers: Record<string, string>) => {
    // Show the review screen before final submission
    setIsReviewing(true);
  };

  // Format recording time as MM:SS
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add effect to handle the recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTimer(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);

  // Add a new function to handle document verification
  const handleDocumentVerification = (success: boolean, documentType: 'aadhaar' | 'pan', documentNumber: string) => {
    if (success) {
      if (documentType === 'aadhaar') {
        setAadhaarNumber(documentNumber);
        setDocumentVerificationStep('pan');
      } else {
        setPanNumber(documentNumber);
        setDocumentVerificationStep('complete');
      }
    }
  };

  if (!loanType || !isLoaded) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{getTitleByLoanType()} | Standard Chartered FinSense</title>
        <meta name="description" content={`Apply for a ${loanType?.replace('-', ' ')} with FinSense AI Branch Manager`} />
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
              reasons={applicationResult.reasons}
              nextSteps={applicationResult.nextSteps}
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
          ) : documentVerificationStep !== 'complete' ? (
            <div className="bg-white rounded-xl shadow-card p-8 max-w-3xl mx-auto">
              <h1 className="text-2xl font-display font-bold text-scblue-dark mb-6">
                Document Verification - {documentVerificationStep === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}
              </h1>
              
              <p className="text-secondary-700 mb-6">
                Please scan your {documentVerificationStep === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'} to verify your identity.
              </p>
              
              <DocumentScanner onVerificationComplete={handleDocumentVerification} />
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-md font-medium text-blue-800 mb-2">Document Verification</h3>
                  <p className="text-sm text-blue-700">
                    {documentVerificationStep === 'aadhaar' 
                      ? 'Your Aadhaar card details will be verified securely. This information is needed for KYC compliance.' 
                      : 'Your PAN card is required for tax purposes and to complete your financial profile.'}
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
                  {viewMode === 'ai-video' && "Watch our AI Branch Manager explain the loan process."}
                  {viewMode === 'user-recording' && "Please record your video response explaining your loan requirements."}
                  {viewMode === 'questions' && "Review and answer all the questions below to submit your loan application."}
                </p>
              </div>
              
              {viewMode === 'ai-video' && (
                <div className="bg-white rounded-xl shadow-card p-6 max-w-3xl mx-auto">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    Introduction to {getLoanTypeFormatted()}
                  </h2>
                  
                  <p className="text-secondary-700 mb-4">
                    Watch this short video to understand the {getLoanTypeFormatted()} process at Standard Chartered FinSense.
                    Our AI Branch Manager will guide you through the application process.
                  </p>
                  
                  <div className="bg-scblue-dark p-1 rounded-xl overflow-hidden shadow-md mb-4">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                      <video 
                        id="introVideo"
                        className="w-full h-full object-cover"
                        controls={isPlayingVideo}
                        poster="/images/branch-manager-poster.svg"
                        src={`/videos/${getVideoFileName()}`}
                        onPlay={() => setIsPlayingVideo(true)}
                        onEnded={() => {
                          setIsVideoWatched(true);
                          // Remove automatic progression
                          // setViewMode('user-recording');
                        }}
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
                  
                  {/* Auto-progression message */}
                  {isVideoWatched && (
                    <div className="mt-4 text-center">
                      <p className="text-secondary-700">Proceeding to next step automatically...</p>
                      <div className="mt-2 flex justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Add a Next button that appears after video is watched */}
                  {isVideoWatched && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setViewMode('user-recording')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Next: Record Your Response
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {viewMode === 'user-recording' && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-white rounded-xl shadow-card p-6 md:w-2/3">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                      Record Your Video Response
                    </h2>
                    
                    <p className="text-secondary-700 mb-6">
                      Please record a short video (30-60 seconds) explaining your loan requirements, your current financial situation, 
                      and why you're applying for this {getLoanTypeFormatted()}.
                    </p>
                    
                    <div className="bg-scblue-dark p-1 rounded-xl overflow-hidden shadow-md mb-6">
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                        {isRecording || (!hasRecorded && recordedVideo === null) ? (
                          <video 
                            ref={videoRef} 
                            className="w-full h-full object-contain"
                            autoPlay 
                            playsInline 
                            muted
                          />
                        ) : hasRecorded && recordedVideo ? (
                          <video 
                            src={recordedVideo}
                            className="w-full h-full object-contain" 
                            controls
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <div className="text-center p-6">
                              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                              </div>
                              <h3 className="text-white text-lg font-medium mb-2">Ready to Record</h3>
                              <p className="text-gray-300 text-sm">
                                Click the record button below to start. Make sure your face is clearly visible.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {isRecording && (
                          <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <div className="bg-red-600 text-white px-3 py-1 rounded-full animate-pulse flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                              <span className="text-xs font-medium">Recording</span>
                            </div>
                            <div className="bg-black/70 text-white px-3 py-1 rounded-full">
                              <span className="text-xs font-medium">{formatRecordingTime(recordingTimer)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      {!hasRecorded ? (
                        <div className="flex space-x-4">
                          {isRecording ? (
                            <button
                              onClick={stopRecording}
                              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                            >
                              <span className="w-3 h-3 bg-white rounded-full"></span>
                              <span>Stop Recording</span>
                            </button>
                          ) : (
                            <button
                              onClick={startRecording}
                              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                            >
                              Start Recording
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-4 w-full justify-between">
                          <button
                            onClick={() => {
                              setHasRecorded(false);
                              setRecordedVideo(null);
                            }}
                            className="px-6 py-3 border border-gray-300 text-secondary-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Record Again
                          </button>
                          <button
                            onClick={() => setViewMode('questions')}
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                          >
                            Next: Answer Questions
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* To-Do List for Questions */}
                  <div className="bg-white rounded-xl shadow-card p-6 md:w-1/3">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Questions To Answer
                    </h3>
                    
                    <p className="text-secondary-700 mb-4 text-sm">
                      Your video should address these key questions:
                    </p>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {questions.map((question, index) => (
                        <div key={question.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <div className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                              {index + 1}
                            </div>
                            <p className="text-secondary-700 text-sm">{question.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-md font-medium text-secondary-800 mb-2">Tips for a Good Recording:</h4>
                      <ul className="text-sm text-secondary-600 space-y-2">
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Ensure good lighting and clear audio
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Speak clearly and at a moderate pace
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-primary-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Address the key questions listed on the right
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {viewMode === 'questions' && (
                <LoanApplicationForm 
                  questions={questions} 
                  loanType={getLoanTypeFormatted()}
                  onSubmit={handleSubmitApplication}
                  onReview={handleReviewApplication}
                  onVideoRecord={handleQuestionRecording}
                  userInfo={userInfo || undefined}
                  hardcodedAnswers={hardcodedAnswers}
                />
              )}

              {isReviewing && (
                <div className="bg-white rounded-xl shadow-card p-8">
                  <h1 className="text-2xl font-display font-bold text-scblue-dark mb-6">
                    Review Your Application
                  </h1>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                      Personal Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary-500">Full Name</p>
                          <p className="font-medium text-secondary-800">{userInfo?.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Email</p>
                          <p className="font-medium text-secondary-800">{userInfo?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Mobile</p>
                          <p className="font-medium text-secondary-800">{userInfo?.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Preferred Language</p>
                          <p className="font-medium text-secondary-800">{userInfo?.language === 'en' ? 'English' : userInfo?.language === 'hi' ? 'Hindi' : userInfo?.language}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                      Loan Details
                    </h2>
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-secondary-500 mb-1">Question {index + 1}</p>
                          <p className="font-medium text-secondary-800 mb-2">{question.text}</p>
                          <p className="text-secondary-700 bg-white p-3 rounded border border-gray-200">{hardcodedAnswers[question.id]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                      Recorded Video
                    </h2>
                    {recordedVideo ? (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <video 
                          src={recordedVideo} 
                          className="w-full rounded-lg mb-2" 
                          controls
                        />
                        <p className="text-sm text-secondary-500">Your recorded video interview</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-700">
                        No video recorded. Your application will be processed without video interview.
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsReviewing(false)}
                      className="px-6 py-3 bg-white border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Back to Edit
                    </button>
                    
                    <div className="flex items-center">
                      <div className="mr-4">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4 mr-2" required />
                          <span className="text-sm text-secondary-700">
                            I confirm all information is accurate and complete
                          </span>
                        </label>
                      </div>
                      
                      <button
                        onClick={handleSubmitApplication}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 