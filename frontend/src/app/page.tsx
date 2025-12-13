import Link from 'next/link';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">INAMSOS</h1>
              <span className="ml-2 text-sm text-gray-500">
                Indonesia National Musculoskeletal Tumor Registry
              </span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/login" className="text-primary-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
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
              <span className="block text-primary-600">Advancing</span>
              <span className="block">Musculoskeletal Oncology Care</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Sistem registri tumor muskuloskeletal nasional pertama di Indonesia yang mengintegrasikan data klinis, staging (Enneking & AJCC), outcome bedah (LIMB_SALVAGE), dan follow-up jangka panjang untuk research dan clinical excellence.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg text-base font-medium border border-primary-300 hover:bg-primary-50 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
            Comprehensive Musculoskeletal Tumor Registry
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Platform terintegrasi untuk bone & soft tissue tumors dengan standardisasi WHO classification, dual staging systems, dan outcome tracking
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white mb-4 shadow-md">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              10-Section Wizard
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Guided multi-step form untuk comprehensive patient data: identitas, klinis, diagnosis, staging, CPC, treatment, dan follow-up dengan auto-save.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-info-500 text-white mb-4 shadow-md">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Dual Staging Systems
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Enneking staging (IA-III) untuk surgical planning dan AJCC TNM (8th edition) untuk research standardization dengan auto-calculation.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success-500 text-white mb-4 shadow-md">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              LIMB_SALVAGE Tracking
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Prominent tracking untuk limb salvage vs amputation rates - key surgical outcome metric untuk musculoskeletal oncology quality benchmarking.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-warning-500 text-white mb-4 shadow-md">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              MSTS Functional Assessment
            </h3>
            <p className="text-gray-500 text-center text-sm leading-relaxed">
              Musculoskeletal Tumor Society scoring (0-30 scale) untuk 14-visit follow-up protocol dengan auto-calculation dan longitudinal trend analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10</div>
              <div className="mt-2 text-green-100">Comprehensive Data Sections</div>
              <div className="mt-1 text-xs text-green-200">Identity → Treatment → 14-visit Follow-up</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">85%+</div>
              <div className="mt-2 text-green-100">Target Limb Salvage Rate</div>
              <div className="mt-1 text-xs text-green-200">WHO benchmark untuk advanced centers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10 Years</div>
              <div className="mt-2 text-green-100">Long-term Follow-up Protocol</div>
              <div className="mt-1 text-xs text-green-200">14 scheduled visits dengan MSTS tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500">
              © 2025 INAMSOS. Indonesia National Musculoskeletal Tumor Registry.
            </p>
            <div className="mt-4">
              <span className="text-sm text-gray-400">
                Supported by: Indonesian Orthopedic Association (PABOI) | Indonesian Society of Surgical Oncology (PERABOI)
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-400">
                Participating Centers: RSUD Dr. Zainoel Abidin (Aceh) | RSUPN Cipto Mangunkusumo | RS Kanker Dharmais | RSUP Dr. Sardjito | RSUD Dr. Soetomo
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}