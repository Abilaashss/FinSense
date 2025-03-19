import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

// Import Tesseract.js for OCR
import Tesseract from 'tesseract.js';

type DocumentType = 'aadhaar' | 'pan' | 'income_proof';

interface DocumentState {
  file: File | null;
  preview: string;
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
  extractedData?: Record<string, string>;
}

export default function DocumentUpload() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  
  const [documents, setDocuments] = useState<Record<DocumentType, DocumentState>>({
    aadhaar: { file: null, preview: '', status: 'pending' },
    pan: { file: null, preview: '', status: 'pending' },
    income_proof: { file: null, preview: '', status: 'pending' }
  });
  
  const [captureMode, setCaptureMode] = useState<DocumentType | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const documentConfig = {
    aadhaar: {
      title: 'Aadhaar Card',
      description: 'Upload both sides of your Aadhaar card',
      acceptedFormats: '.jpg, .jpeg, .png, .pdf',
    },
    pan: {
      title: 'PAN Card',
      description: 'Upload your PAN card',
      acceptedFormats: '.jpg, .jpeg, .png, .pdf',
    },
    income_proof: {
      title: 'Income Proof',
      description: 'Upload your latest salary slip, Form 16, or bank statement',
      acceptedFormats: '.jpg, .jpeg, .png, .pdf',
    },
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            file,
            preview: reader.result as string,
            status: 'processing'
          }
        }));
        
        // Process the document with OCR
        processDocument(file, type);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const captureImage = (type: DocumentType) => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        // Convert base64 to file
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `${type}_capture.jpg`, { type: 'image/jpeg' });
            
            setDocuments(prev => ({
              ...prev,
              [type]: {
                ...prev[type],
                file,
                preview: imageSrc,
                status: 'processing'
              }
            }));
            
            // Process the document with OCR
            processDocument(file, type);
          });
      }
      
      // Exit capture mode
      setCaptureMode(null);
    }
  };

  const processDocument = async (file: File, type: DocumentType) => {
    try {
      // Update status to processing
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'processing'
        }
      }));
      
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );
      
      const text = result.data.text;
      console.log('Extracted text:', text);
      
      // Extract relevant information based on document type
      let extractedData: Record<string, string> = {};
      
      if (type === 'aadhaar') {
        // Extract Aadhaar number (12 digits)
        const aadhaarMatch = text.match(/\d{4}\s\d{4}\s\d{4}/g) || text.match(/\d{12}/g);
        if (aadhaarMatch) {
          extractedData.aadhaarNumber = aadhaarMatch[0].replace(/\s/g, '');
        }
        
        // Extract name (this is a simplistic approach)
        const nameMatch = text.match(/Name:\s*([^\n]*)/i);
        if (nameMatch && nameMatch[1]) {
          extractedData.name = nameMatch[1].trim();
        }
        
        // Extract DOB
        const dobMatch = text.match(/DOB:\s*([0-9\/\-\.]+)/i) || text.match(/Date of Birth:\s*([0-9\/\-\.]+)/i);
        if (dobMatch && dobMatch[1]) {
          extractedData.dob = dobMatch[1].trim();
        }
      } else if (type === 'pan') {
        // Extract PAN number (10 characters, 5 letters, 4 numbers, 1 letter)
        const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/g);
        if (panMatch) {
          extractedData.panNumber = panMatch[0];
        }
        
        // Extract name
        const nameMatch = text.match(/Name:\s*([^\n]*)/i) || text.match(/([A-Z]+\s[A-Z]+\s[A-Z]+)/);
        if (nameMatch && nameMatch[1]) {
          extractedData.name = nameMatch[1].trim();
        }
      } else if (type === 'income_proof') {
        // Extract salary/income amount
        const incomeMatch = text.match(/Rs\.\s*([0-9,\.]+)/i) || text.match(/₹\s*([0-9,\.]+)/i) || text.match(/INR\s*([0-9,\.]+)/i);
        if (incomeMatch && incomeMatch[1]) {
          extractedData.income = incomeMatch[1].replace(/,/g, '').trim();
        }
        
        // Extract employment type if available
        const employmentTypeMatch = text.match(/Employment Type:\s*([^\n]*)/i);
        if (employmentTypeMatch && employmentTypeMatch[1]) {
          extractedData.employmentType = employmentTypeMatch[1].trim();
        }
      }
      
      // Update document state with extracted data
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'success',
          extractedData
        }
      }));
      
    } catch (error) {
      console.error('Error processing document:', error);
      
      // Update document state with error
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'error',
          error: 'Failed to process document. Please try again.'
        }
      }));
    }
  };

  const handleDeleteDocument = (type: DocumentType) => {
    setDocuments(prev => ({
      ...prev,
      [type]: { file: null, preview: '', status: 'pending' }
    }));
  };

  const handleStartCapture = (type: DocumentType) => {
    setCaptureMode(type);
  };

  const handleCancelCapture = () => {
    setCaptureMode(null);
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleContinue = () => {
    // Check if all required documents are uploaded
    const allUploaded = Object.values(documents).every(doc => doc.status === 'success');
    
    if (allUploaded) {
      // Proceed to loan decision page
      router.push('/loan-decision');
    }
  };

  const isAllDocumentsUploaded = Object.values(documents).every(doc => doc.status === 'success');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>Document Upload | VidFin Assist</title>
        <meta name="description" content="Upload documents for loan verification" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-6">
            Document Verification
          </h1>
          
          <p className="text-lg text-secondary-700 mb-8">
            Please upload clear photos or scans of the following documents. We'll extract the necessary information automatically.
          </p>
          
          {captureMode ? (
            <div className="bg-white rounded-xl shadow-card p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Capture {documentConfig[captureMode].title}
                </h2>
                <button 
                  onClick={handleFlipCamera}
                  className="text-primary-600 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Flip Camera
                </button>
              </div>
              
              <div className="relative rounded-lg overflow-hidden bg-secondary-100 mb-4">
                <div className="aspect-w-16 aspect-h-9">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: facingMode
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 border-2 border-dashed border-primary-500 m-8 pointer-events-none"></div>
              </div>
              
              <p className="text-secondary-600 mb-4 text-center">
                Position your {documentConfig[captureMode].title} within the dashed border and ensure all details are clearly visible.
              </p>
              
              <div className="flex justify-between">
                <button 
                  onClick={handleCancelCapture}
                  className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => captureImage(captureMode)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Capture Image
                </button>
              </div>
            </div>
          ) : (
            <>
              {Object.entries(documentConfig).map(([type, config]) => (
                <div key={type} className="bg-white rounded-xl shadow-card p-6 mb-8">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                    {config.title}
                  </h2>
                  <p className="text-secondary-600 mb-4">
                    {config.description}
                  </p>
                  
                  {documents[type as DocumentType].preview ? (
                    <div className="mb-4">
                      <div className="relative rounded-lg overflow-hidden bg-secondary-100 mb-2">
                        <img 
                          src={documents[type as DocumentType].preview} 
                          alt={`${config.title} preview`}
                          className="w-full h-auto max-h-64 object-contain mx-auto"
                        />
                        <button 
                          onClick={() => handleDeleteDocument(type as DocumentType)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {documents[type as DocumentType].status === 'processing' && (
                        <div className="flex items-center justify-center text-secondary-600 mb-2">
                          <svg className="animate-spin mr-2 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing document...
                        </div>
                      )}
                      
                      {documents[type as DocumentType].status === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center text-green-700 mb-1">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Document processed successfully
                          </div>
                          
                          {documents[type as DocumentType].extractedData && (
                            <div className="text-sm text-secondary-700">
                              <h3 className="font-medium mb-1">Extracted Information:</h3>
                              <ul className="space-y-1">
                                {Object.entries(documents[type as DocumentType].extractedData || {}).map(([key, value]) => (
                                  <li key={key} className="flex items-start">
                                    <span className="font-medium mr-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                    <span>{value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {documents[type as DocumentType].status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 text-red-700">
                          <div className="flex items-center mb-1">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {documents[type as DocumentType].error || 'Error processing document'}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <button 
                        onClick={() => handleStartCapture(type as DocumentType)}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-100 transition"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take Photo
                      </button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          id={`file-${type}`}
                          accept={config.acceptedFormats}
                          onChange={(e) => handleFileChange(e, type as DocumentType)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <label 
                          htmlFor={`file-${type}`}
                          className="flex items-center justify-center w-full h-full px-4 py-3 bg-secondary-50 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-100 transition"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload File
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-secondary-500">
                    Accepted formats: {config.acceptedFormats}
                  </p>
                </div>
              ))}
              
              <div className="bg-secondary-50 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                      Document Security
                    </h3>
                    <p className="text-secondary-600">
                      Your documents are securely encrypted and will only be used for verification purposes.
                      They won't be shared with third parties and will be automatically deleted after 90 days.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleContinue}
                  disabled={!isAllDocumentsUploaded}
                  className={`px-8 py-3 rounded-lg font-medium transition shadow-md ${
                    isAllDocumentsUploaded
                      ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  Continue to Loan Decision
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 