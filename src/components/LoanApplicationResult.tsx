import React from 'react';
import { useRouter } from 'next/router';

interface LoanApplicationResultProps {
  applicationId: string;
  loanType: string;
  status: 'approved' | 'rejected' | 'pending';
  reasons: string[];
  nextSteps: string[];
  interestRate?: number;
  loanAmount?: number;
  tenure?: number;
  monthlyEMI?: number;
  cibilScore?: number;
  userInfo?: {
    fullName: string;
  };
}

export default function LoanApplicationResult({
  applicationId,
  loanType,
  status,
  reasons = [],
  nextSteps = [],
  interestRate,
  loanAmount,
  tenure,
  monthlyEMI,
  cibilScore,
  userInfo
}: LoanApplicationResultProps) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className={`p-6 ${status === 'approved' ? 'bg-green-50' : status === 'rejected' ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status === 'approved' ? 'bg-green-100 text-green-800' :
              status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status === 'approved' ? 'Approved' : 
               status === 'rejected' ? 'Rejected' : 'Pending'}
            </span>
            <h1 className="mt-2 text-2xl font-display font-bold text-secondary-900">{loanType} Application Result</h1>
          </div>
          <div className="mt-3 md:mt-0">
            <p className="text-sm text-secondary-600">Application ID</p>
            <p className="font-mono font-medium text-secondary-900">{applicationId}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {userInfo && (
          <div className="mb-6">
            <p className="text-secondary-700">Dear <span className="font-medium">{userInfo.fullName}</span>,</p>
            <p className="mt-2 text-secondary-700">
              {status === 'approved'
                ? `We're pleased to inform you that your ${loanType} application has been approved.`
                : status === 'rejected'
                ? `We regret to inform you that your ${loanType} application has been rejected.`
                : `Your ${loanType} application is currently being processed.`}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Decision Factors */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Decision Factors</h3>
            <ul className="space-y-3">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 mr-2 ${status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {status === 'approved' 
                      ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    }
                  </span>
                  <span className="text-secondary-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Loan Details or Next Steps */}
          <div>
            {status === 'approved' && interestRate && loanAmount && tenure && monthlyEMI ? (
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Loan Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Loan Amount:</span>
                    <span className="font-medium text-secondary-900">₹{loanAmount} Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Interest Rate:</span>
                    <span className="font-medium text-secondary-900">{interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tenure:</span>
                    <span className="font-medium text-secondary-900">{tenure} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Monthly EMI:</span>
                    <span className="font-medium text-secondary-900">₹{monthlyEMI.toLocaleString()}</span>
                  </div>
                  {cibilScore && (
                    <div className="flex justify-between">
                      <span className="text-secondary-600">CIBIL Score:</span>
                      <span className="font-medium text-secondary-900">{cibilScore}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`rounded-lg p-5 border ${status === 'approved' ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  {status === 'approved' ? 'Next Steps' : 'Recommendations'}
                </h3>
                <ul className="space-y-3">
                  {nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-primary-600 flex items-center justify-center mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-secondary-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Need Further Assistance?</h3>
              <p className="text-secondary-700 mb-4 md:mb-0">
                If you have any questions about your application or would like to discuss other loan options, our customer service team is here to help.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/onboarding')}
                className="px-5 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Home
              </button>
              <a
                href="tel:+918000900000"
                className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 