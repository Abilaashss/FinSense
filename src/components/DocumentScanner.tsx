import { useState, useRef, useEffect } from 'react';

interface DocumentScannerProps {
  onVerificationComplete: (success: boolean, documentType: 'aadhaar' | 'pan', documentNumber: string) => void;
}

export default function DocumentScanner({ onVerificationComplete }: DocumentScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [documentType, setDocumentType] = useState<'aadhaar' | 'pan'>('aadhaar');
  const [isVerified, setIsVerified] = useState(false);
  const [documentCaptured, setDocumentCaptured] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set hardcoded document numbers
  const HARDCODED_AADHAAR = "0000 1111 2222";
  const HARDCODED_PAN = "ABCDE1234F";

  // Start the scanning process
  const startScan = async () => {
    try {
      setIsScanning(true);
      setDocumentCaptured(false);
      setIsVerified(false);
      setDocumentNumber('');
      setCapturedImage(null);
      setProcessingText(`Accessing camera...`);
      
      // First stop any existing camera stream
      stopCamera();
      
      console.log(`Starting scan for document type: ${documentType}`);
      
      // Use more compatible camera constraints
      const constraints = { 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          // Don't force environment camera as it fails on desktop
          facingMode: 'user'  
        } 
      };
      
      console.log('Requesting camera with constraints:', JSON.stringify(constraints));
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera stream obtained successfully');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Use a promise to ensure video starts playing
        await new Promise((resolve, reject) => {
          if (!videoRef.current) return reject('Video ref not available');
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(resolve)
              .catch(err => {
                console.error("Error playing video:", err);
                reject(err);
              });
          };
          
          videoRef.current.onerror = (e) => {
            console.error("Video element error:", e);
            reject(e);
          };
        });
        
        // Log video information to help with debugging
        console.log(`Video ready: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
        setProcessingText(`Position your ${documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} card in the frame and click capture`);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      setProcessingText(`Camera access failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      
      // Add a manual retry button
      setTimeout(() => {
        setProcessingText('Camera access denied. Please check permissions and click "Scan Again" to retry.');
      }, 3000);
    }
  };

  const captureDocument = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data URL
    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageDataUrl);
    setDocumentCaptured(true);
    
    // Simulate document processing
    setProcessingText('Processing document...');
    
    setTimeout(() => {
      setProcessingText('Reading document information...');
      
      setTimeout(() => {
        setProcessingText('Verification successful!');
        setIsVerified(true);
        
        // Set the document number based on the document type
        const docNumber = documentType === 'aadhaar' ? HARDCODED_AADHAAR : HARDCODED_PAN;
        setDocumentNumber(docNumber);
        
        // Notify parent component that verification is complete
        onVerificationComplete(true, documentType, docNumber);
        
        // Stop camera after successful verification
        stopCamera();
      }, 1500);
    }, 1500);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTypeChange = (type: 'aadhaar' | 'pan') => {
    setDocumentType(type);
    
    // Reset verification state
    setIsVerified(false);
    setDocumentCaptured(false);
    setCapturedImage(null);
    setDocumentNumber('');
    
    // Stop any existing camera stream
    stopCamera();
    
    // Add a small delay before restarting the camera to ensure proper cleanup
    setTimeout(() => {
      // Automatically start scanning when document type changes
      startScan();
    }, 300);
  };
  
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
  };

  const verifyManualInput = () => {
    if (documentNumber) {
      setIsVerified(true);
      onVerificationComplete(true, documentType, documentNumber);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Add this useEffect to handle camera loading indicator
  useEffect(() => {
    if (isScanning && videoRef.current) {
      const videoElement = videoRef.current;
      
      // Create a function to hide the loading indicator
      const handleVideoPlaying = () => {
        const loadingElement = document.getElementById('camera-loading');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
        console.log('Video is playing, camera ready');
      };
      
      // Listen for the playing event
      videoElement.addEventListener('playing', handleVideoPlaying);
      
      // Cleanup function
      return () => {
        videoElement.removeEventListener('playing', handleVideoPlaying);
      };
    }
  }, [isScanning]);

  return (
    <div className="document-scanner">
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => handleTypeChange('aadhaar')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center ${
              documentType === 'aadhaar'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1zm-2 0H7v2h8v-2z" clipRule="evenodd" />
            </svg>
            Aadhaar Card
          </button>
          <button
            onClick={() => handleTypeChange('pan')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center ${
              documentType === 'pan'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            PAN Card
          </button>
        </div>

        <div className="bg-scblue-dark p-1 rounded-xl overflow-hidden shadow-md">
          <div 
            className="aspect-w-4 aspect-h-3 bg-black rounded-lg overflow-hidden relative"
            style={{ minHeight: '220px', maxHeight: '350px' }}
          >
            {isScanning && !documentCaptured ? (
              <>
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-contain"
                  autoPlay 
                  playsInline 
                  muted
                />
                
                {/* Add loading indicator that shows until video is playing */}
                <div id="camera-loading" className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center">
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mb-2"></div>
                    <p className="text-white text-sm">{processingText || 'Initializing camera...'}</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`border-3 border-dashed ${
                    documentType === 'aadhaar' 
                      ? 'border-green-400 w-3/4 h-2/5' 
                      : 'border-blue-400 w-3/5 h-2/5'
                  }`}></div>
                </div>
                
                {/* Hide the capture button until video is clearly playing */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={captureDocument}
                    className={`px-5 py-2.5 ${
                      documentType === 'aadhaar' 
                        ? 'bg-green-600' 
                        : 'bg-blue-600'
                    } text-white rounded-lg font-medium shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-opacity-50 border border-white border-opacity-30 transition-all`}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    Capture {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card
                  </button>
                </div>
              </>
            ) : documentCaptured && capturedImage ? (
              <div className="relative">
                <img src={capturedImage} alt="Captured document" className="w-full h-full object-contain" />
                {!isVerified && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                        <p className="text-secondary-700">{processingText}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                  <h3 className="text-white text-lg font-medium mb-2">
                    Scan {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Click to start the camera and capture your {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} card.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-secondary-900 mb-3">
            {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card Details
          </h3>
          
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-grow">
              <label htmlFor="documentNumber" className="block text-sm font-medium text-secondary-700 mb-1">
                {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Number
              </label>
              <input
                type="text"
                id="documentNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={documentType === 'aadhaar' ? 'XXXX XXXX XXXX' : 'ABCDE1234F'}
                value={documentNumber}
                onChange={handleManualInput}
                readOnly={isVerified}
              />
              <p className="mt-1 text-sm text-secondary-500">
                {isVerified ? 'Verified' : 'Enter manually or scan'}
              </p>
            </div>
            
            {!isVerified && !isScanning && (
              <button
                onClick={verifyManualInput}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mt-6 md:mt-0"
                disabled={!documentNumber}
              >
                Verify
              </button>
            )}
            
            {isVerified && (
              <div className="flex items-center text-green-600 mt-6 md:mt-0">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Verified Successfully</span>
              </div>
            )}
          </div>
          
          {isVerified && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <p className="text-sm text-secondary-600">
                  {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} verification complete
                </p>
                <button
                  onClick={() => {
                    setIsVerified(false);
                    setDocumentCaptured(false);
                    setDocumentNumber('');
                    setCapturedImage(null);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
} 