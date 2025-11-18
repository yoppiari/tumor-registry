import Link from 'next/link';
import { ArrowPathIcon, ClipboardDocumentListIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Data Entry Management',
    description: 'WhatsApp-inspired interface untuk input data tumor yang efficient dan accurate.',
    icon: ClipboardDocumentListIcon,
    color: 'bg-primary-500',
  },
  {
    name: 'Research Discovery',
    description: 'Advanced search dan geographic visualization untuk cancer research collaboration.',
    icon: ChartBarIcon,
    color: 'bg-info-500',
  },
  {
    name: 'HIPAA Compliance',
    description: 'Enterprise-grade security dengan audit trails dan data encryption.',
    icon: ShieldCheckIcon,
    color: 'bg-success-500',
  },
  {
    name: 'Real-time Analytics',
    description: 'Intelligent dashboards untuk cancer pattern detection dan policy insights.',
    icon: ArrowPathIcon,
    color: 'bg-warning-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">INAMSOS</h1>
              <span className="ml-2 text-sm text-gray-500">
                Indonesia National Cancer Database System
              </span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/login" className="text-primary-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium">
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
              <span className="block text-primary-600">Transform</span>
              <span className="block">Cancer Research in Indonesia</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              INAMSOS mengubah scattered data menjadi centralized real-time intelligence system yang enables groundbreaking research dan evidence-based policy decisions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg text-base font-medium border border-primary-300 hover:bg-primary-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
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
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${feature.color} text-white mb-4`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-500 text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="mt-2 text-primary-100">Center Adoption Target</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="mt-2 text-primary-100">Annual Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">200%</div>
              <div className="mt-2 text-primary-100">Research Collaboration Growth</div>
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
          </div>
        </div>
      </footer>
    </div>
  );
}