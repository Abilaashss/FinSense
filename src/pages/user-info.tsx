import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

// Available languages for the loan application process
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
];

export default function UserInfo() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    language: 'en',
  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    // Get the loan type from the query parameter
    const { type } = router.query;
    if (type) {
      setSelectedLoanType(type as string);
    }
  }, [router.query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear the error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate mobile number (basic check for now)
    const mobileRegex = /^\d{10}$/;
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Store user info in session storage (alternatively could use context or redux)
      sessionStorage.setItem('userInfo', JSON.stringify(formData));
      
      // Get the redirectTo path if available
      const { redirectTo } = router.query;
      const targetPath = redirectTo ? redirectTo as string : '/loan-application';
      
      // Simulate processing delay
      setTimeout(() => {
        // Redirect to loan application page with loan type and language
        router.push({
          pathname: targetPath,
          query: { 
            type: selectedLoanType,
            lang: formData.language
          }
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Your Information | Standard Chartered AI Branch Manager</title>
        <meta name="description" content="Enter your information to continue with the loan application" />
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

        <div className={`max-w-2xl mx-auto transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-card p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-display font-bold text-scblue-dark mb-2">
                Enter Your Information
              </h1>
              <p className="text-secondary-600">
                Please provide your details to continue with your {selectedLoanType?.replace('-', ' ')} application
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Mobile Field */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-secondary-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`}
                    placeholder="10-digit mobile number"
                  />
                  {formErrors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.mobile}</p>
                  )}
                </div>

                {/* Language Selection */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-secondary-700 mb-1">
                    Preferred Language
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {availableLanguages.map((language) => (
                      <div 
                        key={language.code}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.language === language.code 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, language: language.code }))}
                      >
                        <span className="text-2xl mr-2">{language.flag}</span>
                        <span className="text-secondary-800 font-medium">{language.name}</span>
                        {formData.language === language.code && (
                          <svg className="w-5 h-5 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms and Privacy Notice */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-secondary-600">
                    By continuing, you agree to Standard Chartered's <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>. Your information will be used to process your loan application and for communication purposes.
                  </p>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Continue to Loan Application'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center text-sm text-secondary-500">
            <p>Need help? <a href="#" className="text-primary-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </main>
    </div>
  );
} 