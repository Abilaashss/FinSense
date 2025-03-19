import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Head>
        <title>VidFin Assist | AI Branch Manager</title>
        <meta name="description" content="Video-based loan assistance with an AI branch manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <section className="flex flex-col md:flex-row items-center justify-between mb-20">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary-900 mb-4">
              Your Digital Loan <span className="text-primary-600">Branch Manager</span>
            </h1>
            <p className="text-lg text-secondary-700 mb-8">
              Experience a human-like loan application process with our AI-powered video assistance.
              No forms, just conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push('/onboarding')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Apply for a Loan
              </button>
              <button 
                onClick={() => router.push('/demo')}
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium transition"
              >
                Watch Demo
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-elevated bg-white">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                  <p className="text-primary-600 text-lg">Branch Manager Video Preview</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-medium">Meet Your Digital Branch Manager</h3>
                <p className="text-white/90">Available 24/7 to assist with your loan needs</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center text-secondary-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary-600">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="bg-secondary-50 -mx-4 px-4 py-16 rounded-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-secondary-700 mb-8">
              Our AI Branch Manager is ready to guide you through the loan application process
              with a personalized video experience.
            </p>
            <button 
              onClick={() => router.push('/onboarding')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
            >
              Start Your Application
            </button>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">VidFin Assist</h3>
              <p className="text-secondary-300">
                Making loan applications more human, more intuitive, and more accessible.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Loan Products</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-secondary-300 hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Contact Us</h3>
              <p className="text-secondary-300 mb-2">support@vidfinassist.com</p>
              <p className="text-secondary-300">+91 900 800 7000</p>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>© {new Date().getFullYear()} VidFin Assist. All rights reserved.</p>
          </div>
        </div>
      </footer>
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