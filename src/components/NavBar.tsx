import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-2 transition-transform hover:scale-105">
              <div className="relative h-14 flex items-center">
                {/* Standard Chartered logo */}
                <img 
                  src="/images/standard-chartered-logo.svg" 
                  alt="Standard Chartered" 
                  className="h-12"
                />
                <span className="text-scblue-dark font-bold text-2xl ml-2 border-l-2 border-scblue-dark pl-2">
                  FinSense 
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 