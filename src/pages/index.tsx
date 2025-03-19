import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const playIntroVideo = () => {
    const introVideo = document.getElementById('introVideo') as HTMLVideoElement;
    if (introVideo) {
      introVideo.play();
      setIsPlayingVideo(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>AI Branch Manager | Standard Chartered</title>
        <meta name="description" content="Video-based loan assistance with an AI branch manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section with Standard Chartered gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
          {/* Left Column with Gradient Background */}
          <div className={`bg-sc-gradient text-white py-20 px-8 md:px-12 lg:px-16 min-h-[80vh] flex flex-col justify-center transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="max-w-xl">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm mb-4 animate-pulse">
                New Feature Available
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                <span className="block">About AI</span>
                <span className="text-primary-200">Branch Manager</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                We use advanced video technology to deliver a full-service banking experience through AI-powered video conversations. Experience banking that's personal, accessible, and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/onboarding')}
                  className="bg-white text-scblue-dark px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  Apply for a Loan
                </button>
                <button 
                  onClick={() => router.push('/demo')}
                  className="border-2 border-white/70 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition"
                >
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column with Content */}
          <div className={`bg-white py-16 px-8 md:px-12 lg:px-16 flex items-center transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-300`}>
            <div className="w-full max-w-xl">
              <div className="mb-8">
                <div className="h-1 w-20 bg-primary-500 mb-6"></div>
                <h2 className="text-3xl font-semibold text-scblue-dark">Who we are</h2>
              </div>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Our AI Branch Manager is a digital solution that provides the same level of service and expertise as a physical branch, available 24/7 through video interactions.
              </p>
              <div className="relative rounded-xl overflow-hidden shadow-elevated group transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-9 w-full bg-black">
                  <video 
                    id="introVideo"
                    src="/videos/intro.mp4"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    poster="/images/branch-manager-poster.svg"
                    controls={isPlayingVideo}
                    onEnded={() => setIsPlayingVideo(false)}
                  />
                  {!isPlayingVideo && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 cursor-pointer"
                      onClick={playIntroVideo}
                    >
                      <h3 className="text-white text-xl font-medium">Meet Your Digital Branch Manager</h3>
                      <p className="text-white/90 mt-2">Available 24/7 to assist with your loan needs</p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-primary-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-secondary-900 font-medium">Fast application processing</h4>
                    <p className="text-secondary-600 text-sm">Complete your loan application in minutes, not days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
              AI-Powered Features
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-6">
              How It Works
            </h2>
            <p className="text-secondary-600 text-lg">
              Our AI Branch Manager uses cutting-edge technology to make your banking experience seamless and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary-600">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 flex-grow">{feature.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-primary-500 font-medium flex items-center group cursor-pointer">
                    Learn more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-primary-200 transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-secondary-700 mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-medium">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">{testimonial.name}</h4>
                    <p className="text-sm text-secondary-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-sc-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 z-0"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Our AI Branch Manager is ready to guide you through the loan application process
              with a personalized video experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/onboarding')}
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-medium transition shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
            >
              Start Your Application
            </button>
            <button 
              onClick={() => router.push('/demo')}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium transition"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: '👤',
    title: 'Virtual Branch Manager',
    description: 'Interact with our AI branch manager through video conversations that feel just like being at a real bank branch.'
  },
  {
    icon: '🎥',
    title: 'Video Responses',
    description: 'Simply record your answers instead of filling out lengthy forms. Our system handles the rest.'
  },
  {
    icon: '📄',
    title: 'Easy Document Upload',
    description: 'Quickly snap pictures of your ID and income documents. Our system extracts the information automatically.'
  },
  {
    icon: '✅',
    title: 'Instant Loan Decision',
    description: 'Get immediate feedback on your loan application status with clear next steps.'
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data and video responses are encrypted and protected with bank-level security.'
  },
  {
    icon: '🗣️',
    title: 'Multi-Language Support',
    description: 'Interact with our system in your preferred language for a comfortable experience.'
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    text: "The AI Branch Manager made getting a loan so much easier than traditional methods. I completed everything in one evening!"
  },
  {
    name: "Michael Chen",
    role: "Freelance Developer",
    text: "As someone with an irregular income, I was worried about loan approval. The video interview allowed me to explain my situation properly."
  },
  {
    name: "Priya Patel",
    role: "Healthcare Professional",
    text: "The 24/7 availability was perfect for my busy schedule. I applied for my loan at midnight after my shift ended!"
  }
]; 