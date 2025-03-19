import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

type DecisionStatus = 'approved' | 'rejected' | 'pending' | 'more_info';

interface LoanDetails {
  amount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  processingFee: number;
  disbursalDate: string;
}

export default function LoanDecision() {
  const router = useRouter();
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>('pending');
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string[]>([]);
  
  // Simulate loan decision process
  useEffect(() => {
    const timer = setTimeout(() => {
      // This would normally come from an API call to the backend
      // For demo purposes, we're randomly selecting an outcome
      const outcomes: DecisionStatus[] = ['approved', 'rejected', 'more_info'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      setDecisionStatus(randomOutcome);
      
      if (randomOutcome === 'approved') {
        // Generate mock loan details
        setLoanDetails({
          amount: 250000,
          interestRate: 10.5,
          tenure: 24, // months
          emi: 11500,
          processingFee: 2500,
          disbursalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString() // 2 days from now
        });
      } else if (randomOutcome === 'rejected') {
        // Set mock rejection reasons
        setRejectionReasons([
          'Insufficient income for requested loan amount',
          'Credit score below required threshold',
          'High existing debt-to-income ratio'
        ]);
      } else if (randomOutcome === 'more_info') {
        // Set additional information needed
        setAdditionalInfo([
          'Latest 3 months bank statements',
          'Additional income proof for self-employed income',
          'Address verification document'
        ]);
      }
    }, 3000); // Simulate a 3-second processing time
    
    return () => clearTimeout(timer);
  }, []);
  
  // Render different components based on decision status
  const renderDecisionContent = () => {
    switch (decisionStatus) {
      case 'approved':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-card p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                Congratulations! Your Loan is Approved
              </h2>
              <p className="text-secondary-600 text-center">
                Our AI Branch Manager has approved your loan application based on your information and documents.
              </p>
            </div>
            
            <div className="border-t border-b border-secondary-200 py-6 mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Loan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-secondary-500 text-sm">Loan Amount</p>
                  <p className="text-secondary-900 font-semibold text-xl">₹{loanDetails?.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Interest Rate</p>
                  <p className="text-secondary-900 font-semibold text-xl">{loanDetails?.interestRate}% p.a.</p>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Tenure</p>
                  <p className="text-secondary-900 font-semibold text-xl">{loanDetails?.tenure} months</p>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Monthly EMI</p>
                  <p className="text-secondary-900 font-semibold text-xl">₹{loanDetails?.emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Processing Fee</p>
                  <p className="text-secondary-900 font-semibold text-xl">₹{loanDetails?.processingFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Expected Disbursal Date</p>
                  <p className="text-secondary-900 font-semibold text-xl">{loanDetails?.disbursalDate}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              Next Steps
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">E-Sign Loan Agreement</h4>
                  <p className="text-secondary-600">You'll receive an email with a link to electronically sign your loan agreement.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Set Up Auto-Debit</h4>
                  <p className="text-secondary-600">We'll guide you through setting up an auto-debit from your bank account for EMI payments.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Loan Disbursal</h4>
                  <p className="text-secondary-600">Once all documentation is complete, the loan amount will be credited to your bank account.</p>
                </div>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition"
              >
                Download Approval Letter
              </button>
            </div>
          </motion.div>
        );
      
      case 'rejected':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-card p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                We're Sorry, Your Loan Application Was Not Approved
              </h2>
              <p className="text-secondary-600 text-center">
                Our AI Branch Manager was unable to approve your loan application at this time.
              </p>
            </div>
            
            <div className="border-t border-b border-secondary-200 py-6 mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Reasons for Rejection
              </h3>
              <ul className="space-y-3">
                {rejectionReasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-secondary-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              What Can You Do Now?
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Apply for a Lower Loan Amount</h4>
                  <p className="text-secondary-600">You may have better chances with a smaller loan amount that better matches your income.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Improve Your Credit Score</h4>
                  <p className="text-secondary-600">Pay off existing loans and credit card bills on time to improve your credit score.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-600 font-medium text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Apply with a Co-applicant</h4>
                  <p className="text-secondary-600">Adding a co-applicant with good credit and income can strengthen your application.</p>
                </div>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Back to Home
              </button>
              <button 
                onClick={() => router.push('/loan-alternatives')}
                className="px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition"
              >
                Explore Other Options
              </button>
            </div>
          </motion.div>
        );
      
      case 'more_info':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-card p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                Additional Information Required
              </h2>
              <p className="text-secondary-600 text-center">
                We need some additional documents to complete processing your loan application.
              </p>
            </div>
            
            <div className="border-t border-b border-secondary-200 py-6 mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Documents Required
              </h3>
              <ul className="space-y-3">
                {additionalInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-secondary-700">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              Next Steps
            </h3>
            <p className="text-secondary-600 mb-6">
              Please upload the required documents within 7 days to continue with your loan application.
              Your application will be reviewed immediately once the documents are uploaded.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/additional-documents')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Upload Documents
              </button>
              <button 
                onClick={() => router.push('/contact-support')}
                className="px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition"
              >
                Contact Support
              </button>
            </div>
          </motion.div>
        );
      
      case 'pending':
      default:
        return (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                Processing Your Application
              </h2>
              <p className="text-secondary-600">
                Our AI Branch Manager is analyzing your information and documents to make a loan decision.
                This typically takes just a few moments.
              </p>
            </div>
            
            <div className="w-full max-w-md mx-auto bg-secondary-50 rounded-full h-2.5 mb-8">
              <div className="bg-primary-600 h-2.5 rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-secondary-500">
              Please do not refresh this page. You will be redirected automatically once a decision is made.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>Loan Decision | VidFin Assist</title>
        <meta name="description" content="Your loan application decision" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-secondary-900 text-center mb-8">
            Loan Application Decision
          </h1>
          
          {renderDecisionContent()}
        </div>
      </main>
    </div>
  );
} 