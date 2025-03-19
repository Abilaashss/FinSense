import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

// Define the interview questions and AI branch manager video sources
const interviewSteps = [
  {
    id: 'intro',
    aiVideoSrc: '/videos/ai-manager-intro.mp4',
    aiPrompt: "Hello! I'm your AI Branch Manager. I'll be guiding you through the loan application process. I'll ask you a few questions to understand your needs better. Please respond by recording short video answers. Are you ready to begin?",
    expectsUserResponse: true,
    maxRecordingTime: 10, // in seconds
  },
  {
    id: 'loan_purpose',
    aiVideoSrc: '/videos/ai-manager-purpose.mp4',
    aiPrompt: "Great! First, could you tell me the purpose of your loan? For example, is it for a home renovation, education, medical expenses, or something else?",
    expectsUserResponse: true,
    maxRecordingTime: 20,
  },
  {
    id: 'loan_amount',
    aiVideoSrc: '/videos/ai-manager-amount.mp4',
    aiPrompt: "Thank you. Now, what loan amount are you looking for? Please specify the amount in rupees.",
    expectsUserResponse: true,
    maxRecordingTime: 15,
  },
  {
    id: 'employment',
    aiVideoSrc: '/videos/ai-manager-employment.mp4',
    aiPrompt: "Could you share details about your employment? Are you salaried, self-employed, or a business owner? Please also mention your monthly income and how long you've been working in your current position.",
    expectsUserResponse: true,
    maxRecordingTime: 30,
  },
  {
    id: 'documents',
    aiVideoSrc: '/videos/ai-manager-documents.mp4',
    aiPrompt: "Thank you for the information. Now we need to verify your identity and income details. In the next step, you'll need to upload your Aadhaar card, PAN card, and income proof. Are you ready to proceed to document verification?",
    expectsUserResponse: true,
    maxRecordingTime: 10,
  },
  {
    id: 'closing',
    aiVideoSrc: '/videos/ai-manager-closing.mp4',
    aiPrompt: "Great! You've completed the interview part. Now, let's move on to document submission. Click 'Continue' to proceed.",
    expectsUserResponse: false,
  },
];

export default function LoanInterview() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiVideoEnded, setAiVideoEnded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [facingUser, setFacingUser] = useState(true);
  
  // Timer for recording countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (capturing) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => {
          if (prevTime >= interviewSteps[currentStep].maxRecordingTime - 1) {
            handleStopCapture();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [capturing, currentStep]);

  const handleStartCapture = () => {
    setCapturing(true);
    setRecordedChunks([]);
    setRecordingComplete(false);
    
    if (webcamRef.current && webcamRef.current.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.addEventListener('stop', handleStopRecording);
      mediaRecorderRef.current.start();
    }
  };

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks(prev => [...prev, data]);
    }
  };

  const handleStopCapture = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  };

  const handleStopRecording = () => {
    setRecordingComplete(true);
  };

  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      
      // Store the user's response for this step
      const stepId = interviewSteps[currentStep].id;
      const videoUrl = URL.createObjectURL(blob);
      setUserResponses(prev => ({ ...prev, [stepId]: videoUrl }));
      
      // Clear recorded chunks after saving
      setRecordedChunks([]);
    }
  };

  const handleNext = () => {
    if (currentStep < interviewSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setAiVideoEnded(false);
      setRecordingComplete(false);
    } else {
      // Interview complete, move to document upload
      router.push('/document-upload');
    }
  };

  const handleAiVideoEnded = () => {
    setAiVideoEnded(true);
  };

  const handleSwitchCamera = () => {
    setFacingUser(prev => !prev);
  };

  const currentAiVideo = interviewSteps[currentStep].aiVideoSrc;
  const currentAiPrompt = interviewSteps[currentStep].aiPrompt;
  const expectsUserResponse = interviewSteps[currentStep].expectsUserResponse;
  const maxRecordingTime = interviewSteps[currentStep].maxRecordingTime;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>Video Interview | VidFin Assist</title>
        <meta name="description" content="AI Branch Manager Interview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-display font-bold text-secondary-900">
              Video Interview
            </h1>
            <div className="text-secondary-500">
              Step {currentStep + 1} of {interviewSteps.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* AI Branch Manager Video */}
            <div>
              <h2 className="text-lg font-medium text-secondary-800 mb-3">
                AI Branch Manager
              </h2>
              <div className="relative rounded-xl overflow-hidden shadow-card bg-white">
                <div className="aspect-w-9 aspect-h-16 md:aspect-w-4 md:aspect-h-3">
                  <video 
                    className="w-full h-full object-cover"
                    src={currentAiVideo} 
                    autoPlay 
                    playsInline
                    muted
                    onEnded={handleAiVideoEnded}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-secondary-700">
                    {currentAiPrompt}
                  </p>
                </div>
              </div>
            </div>
            
            {/* User Video Response */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-secondary-800">
                  Your Response
                </h2>
                <button 
                  onClick={handleSwitchCamera} 
                  className="text-primary-600 flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Switch Camera
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-card bg-white">
                <div className="aspect-w-9 aspect-h-16 md:aspect-w-4 md:aspect-h-3">
                  {recordingComplete && recordedChunks.length > 0 ? (
                    <video 
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))} 
                      controls
                      playsInline
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Webcam
                      audio
                      ref={webcamRef}
                      videoConstraints={{
                        facingMode: facingUser ? 'user' : 'environment',
                      }}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {capturing && (
                    <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white rounded-full px-3 py-1">
                      <span className="animate-pulse mr-2">●</span>
                      <span>{maxRecordingTime - recordingTime}s</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-white flex justify-between items-center">
                  {expectsUserResponse ? (
                    <>
                      {!recordingComplete ? (
                        <div className="flex space-x-3">
                          {!capturing ? (
                            <button
                              onClick={handleStartCapture}
                              disabled={!aiVideoEnded}
                              className={`px-4 py-2 rounded-lg font-medium transition ${
                                aiVideoEnded 
                                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
                              }`}
                            >
                              Start Recording
                            </button>
                          ) : (
                            <button
                              onClick={handleStopCapture}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                            >
                              Stop Recording
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setRecordingComplete(false)}
                            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium transition hover:bg-primary-50"
                          >
                            Re-record
                          </button>
                          <button
                            onClick={() => {
                              handleDownload();
                              handleNext();
                            }}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                          >
                            Accept & Continue
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!aiVideoEnded}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        aiVideoEnded 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                          : 'bg-gray-300 cursor-not-allowed text-gray-500'
                      }`}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Tips for a Successful Video Response
            </h2>
            <ul className="space-y-2 text-secondary-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Find a quiet place with good lighting
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Speak clearly and at a normal pace
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Keep your answers concise and to the point
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Make sure your face is clearly visible in the frame
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                You can re-record if you're not satisfied with your answer
              </li>
            </ul>
          </div>
          
          <div className="bg-secondary-50 rounded-xl p-6">
            <div className="flex items-center text-secondary-700 mb-2">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Privacy Notice
            </div>
            <p className="text-sm text-secondary-600">
              Your video responses are encrypted and will only be used for loan assessment. 
              They won't be shared with third parties without your consent. 
              They may be stored for up to 90 days after your application is processed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 