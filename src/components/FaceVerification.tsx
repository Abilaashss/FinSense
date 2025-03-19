import React, { useState, useRef, useEffect } from 'react';

interface FaceVerificationProps {
  onVerificationComplete: (success: boolean) => void;
}

export default function FaceVerification({ onVerificationComplete }: FaceVerificationProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [processingText, setProcessingText] = useState('Starting verification...');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);



  // Start the scanning process
  const startScan = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate face detection process with changing status messages
      setProcessingText('Detecting face...');
      setTimeout(() => {
        setProcessingText('Matching with records...');
        setFaceCaptured(true);
        
        setTimeout(() => {
          setProcessingText('Verification successful!');
          setIsVerified(true);
          
          // Stop all tracks on the stream
          stream.getTracks().forEach(track => track.stop());
          
          // Notify parent component that verification is complete
          setTimeout(() => {
            onVerificationComplete(true);
          }, 1500);
          
        }, 2000);
      }, 2000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      setProcessingText('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  // Handle automatic verification for demo
  useEffect(() => {
    // If verification is marked complete and video stream exists, stop it
    if (isVerified && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, [isVerified]);

  return (
    <div className="face-verification">
      <div className="mb-8 bg-scblue-dark p-1 rounded-xl overflow-hidden shadow-md">
        <div 
          className="aspect-w-4 aspect-h-3 bg-black rounded-lg overflow-hidden relative"
          style={{ minHeight: '300px' }}
        >
          {isScanning ? (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain"
                autoPlay 
                playsInline 
                muted
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'none' }}></canvas>
              
              {/* Verification overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {faceCaptured && (
                  <div className="absolute inset-0">
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="w-64 h-64 border-4 border-green-500 rounded-full animate-pulse opacity-70"></div>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <div className="flex items-center">
                    {isVerified ? (
                      <div className="flex items-center text-green-400">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-medium">Verification Successful</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-400">
                        <div className="animate-spin mr-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{processingText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gray-900 cursor-pointer" 
              onClick={startScan}
            >
              <div className="text-center p-6">
                <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Start Face Verification</h3>
                <p className="text-gray-300 text-sm">
                  Click to start the camera and complete the face verification process.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <h3 className="text-md font-medium text-yellow-800 mb-1">How Face Verification Works</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Ensure your face is clearly visible and well-lit
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Remove glasses or face coverings
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              The system will match your face with your ID for security
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 