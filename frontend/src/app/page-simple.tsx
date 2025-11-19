import Link from 'next/link';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">INAMSOS</h1>
              <span className="ml-2 text-sm text-gray-500">
                Indonesia National Cancer Database System
              </span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/login" className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-green-600">Transform</span>
              <span className="block">Cancer Research in Indonesia</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              INAMSOS mengubah scattered data menjadi centralized real-time intelligence system yang enables groundbreaking research dan evidence-based policy decisions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="bg-white text-green-600 px-8 py-3 rounded-lg text-base font-medium border border-green-300 hover:bg-green-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Comprehensive Cancer Intelligence Platform
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Built for Indonesian healthcare context dengan focus pada research advancement
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Data Entry Management
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Efficient interface untuk input data tumor yang accurate dan standardized.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Research Discovery
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Advanced search dan geographic visualization untuk cancer research collaboration.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              HIPAA Compliance
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Enterprise-grade security dengan audit trails dan data encryption.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 text-white mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Real-time Analytics
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Intelligent dashboards untuk cancer pattern detection dan policy insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="mt-2 text-green-100">Center Adoption Target</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="mt-2 text-green-100">Annual Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">200%</div>
              <div className="mt-2 text-green-100">Research Collaboration Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">
              © 2025 INAMSOS. Database Tumor Nasional untuk kolegium Indonesia.
            </p>
            <div className="mt-4">
              <span className="text-sm text-gray-400">
                Pilot Deployment: RS Kanker Dharmais, RSUPN Cipto Mangunkusumo, RS Kanker Soeharto
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}