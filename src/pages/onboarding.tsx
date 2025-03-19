import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    mobile: '',
    preferredLanguage: 'en',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and proceed to video interview
      router.push('/loan-interview');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return userInfo.fullName.trim().length > 0;
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(userInfo.email);
      case 2:
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(userInfo.mobile);
      case 3:
        return true; // Language selection is always valid
      default:
        return false;
    }
  };

  const handleLoanSelection = (type: string) => {
    router.push({
      pathname: '/user-info',
      query: { type, redirectTo: '/loan-application-v2' }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Get Started | Standard Chartered AI Branch Manager</title>
        <meta name="description" content="Start your loan application with AI Branch Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className={`max-w-4xl mx-auto transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-scblue-dark mb-4">
              Choose Your Loan Type
            </h1>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Select the type of loan you're interested in and our AI Branch Manager will guide you through the application process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loanTypes.map((loan, index) => (
              <div 
                key={loan.id}
                className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleLoanSelection(loan.id)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`h-2 ${loan.colorClass}`}></div>
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-lg ${loan.bgClass} flex items-center justify-center mb-4`}>
                    <span className="text-3xl">{loan.icon}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900 mb-2">{loan.title}</h2>
                  <p className="text-secondary-600 mb-4">{loan.description}</p>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-secondary-800 mb-2">Documents Required:</h3>
                    <ul className="text-sm text-secondary-600 space-y-1">
                      {loan.documents.map((doc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary-500 mr-2">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoanSelection(loan.id);
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-50 rounded-xl p-6 mt-12 border border-primary-100">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:flex-1">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Not sure which loan is right for you?</h3>
                <p className="text-secondary-700">Our AI Branch Manager can help you decide based on your needs.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => router.push('/loan-advisor')}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition"
                >
                  Talk to AI Advisor
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const steps = [
  {
    title: 'What is your full name?',
    content: ({ userInfo, handleInputChange }: any) => (
      <div>
        <p className="text-secondary-600 mb-6">Please enter your name as it appears on your official documents.</p>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userInfo.fullName}
            onChange={handleInputChange}
            className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="e.g. John Smith"
          />
        </div>
      </div>
    )
  },
  {
    title: 'What is your email address?',
    content: ({ userInfo, handleInputChange }: any) => (
      <div>
        <p className="text-secondary-600 mb-6">We'll use this to send you updates about your application.</p>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="e.g. john@example.com"
          />
        </div>
      </div>
    )
  },
  {
    title: 'What is your mobile number?',
    content: ({ userInfo, handleInputChange }: any) => (
      <div>
        <p className="text-secondary-600 mb-6">We'll use this to verify your identity and send important updates.</p>
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-secondary-700 mb-1">
            Mobile Number
          </label>
          <div className="flex">
            <div className="flex-shrink-0 bg-secondary-100 border border-secondary-300 border-r-0 rounded-l-lg px-3 flex items-center">
              <span className="text-secondary-600">+91</span>
            </div>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={userInfo.mobile}
              onChange={handleInputChange}
              className="flex-grow p-3 border border-secondary-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Select your preferred language',
    content: ({ userInfo, handleInputChange }: any) => (
      <div>
        <p className="text-secondary-600 mb-6">Choose the language you'd like to use for your video interview.</p>
        <div className="mb-4">
          <label htmlFor="preferredLanguage" className="block text-sm font-medium text-secondary-700 mb-1">
            Preferred Language
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={userInfo.preferredLanguage}
            onChange={handleInputChange}
            className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition appearance-none bg-white"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="bn">Bengali</option>
            <option value="mr">Marathi</option>
          </select>
        </div>
      </div>
    )
  }
];

const loanTypes = [
  {
    id: 'home-loan',
    title: 'Home Loan',
    description: 'Finance your dream home with competitive interest rates and flexible repayment options.',
    icon: '🏠',
    colorClass: 'bg-blue-500',
    bgClass: 'bg-blue-50 text-blue-500',
    documents: [
      'Identity & Address Proof',
      'Income Proof (Salary slips/ITR)',
      'Property Documents',
      'Employment Proof'
    ]
  },
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    description: 'Get quick access to funds for your personal needs with minimal documentation.',
    icon: '💼',
    colorClass: 'bg-green-500',
    bgClass: 'bg-green-50 text-green-500',
    documents: [
      'Identity & Address Proof',
      'Income Proof (Salary slips/Bank statements)',
      'Employment Proof'
    ]
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description: 'Grow your business with customized financing solutions for your business needs.',
    icon: '🏢',
    colorClass: 'bg-purple-500',
    bgClass: 'bg-purple-50 text-purple-500',
    documents: [
      'Business & Personal ID Proof',
      'Business Registration Documents',
      'Financial Statements',
      'Tax Returns',
      'Business Plan'
    ]
  }
]; 