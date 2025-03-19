import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function ApplicationSubmitted() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Application Submitted | Standard Chartered AI Branch Manager</title>
        <meta name="description" content="Your loan application has been successfully submitted" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className={`max-w-3xl mx-auto transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-lg text-secondary-700 mb-8 max-w-xl mx-auto leading-relaxed">
              Thank you for applying with Standard Chartered AI Branch Manager. Your application has been received and is being processed.
            </p>
            
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 mb-8 text-left">
              <h2 className="text-xl font-medium text-secondary-900 mb-4">What happens next?</h2>
              
              <ol className="space-y-4 ml-6 list-decimal">
                <li className="text-secondary-700">
                  <span className="font-medium text-secondary-800">Document Verification:</span>
                  <p className="mt-1">Our system will review your application and may request additional documents if needed.</p>
                </li>
                <li className="text-secondary-700">
                  <span className="font-medium text-secondary-800">Application Processing:</span>
                  <p className="mt-1">Your application will be processed within 24-48 hours.</p>
                </li>
                <li className="text-secondary-700">
                  <span className="font-medium text-secondary-800">Decision Notification:</span>
                  <p className="mt-1">You will receive an email and SMS notification with the decision on your application.</p>
                </li>
                <li className="text-secondary-700">
                  <span className="font-medium text-secondary-800">Loan Disbursement:</span>
                  <p className="mt-1">If approved, the loan amount will be disbursed to your account within 24 hours after you accept the terms.</p>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/application-status')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Check Application Status
              </button>
              
              <button 
                onClick={() => router.push('/')}
                className="border border-secondary-300 text-secondary-800 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition"
              >
                Return to Home
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-secondary-600">
              Application Reference ID: <span className="font-medium text-secondary-800">SC-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </p>
            <p className="text-sm text-secondary-500 mt-2">
              Please save this reference ID for future correspondence.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 