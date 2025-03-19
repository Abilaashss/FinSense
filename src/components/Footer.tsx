export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="text-secondary-400 text-sm">
          © {new Date().getFullYear()} Standard Chartered. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 