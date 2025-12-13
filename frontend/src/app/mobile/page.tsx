'use client';

import MobilePage from '@/components/mobile/MobilePage';
import { HomeIcon, UserIcon, CalendarIcon, HeartIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function MobileHomePage() {
  return (
    <MobilePage title="INAMSOS Mobile" showSearch={true}>
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton icon={<UserIcon className="h-6 w-6" />} label="Pasien" href="/mobile/patients" />
            <QuickActionButton icon={<CalendarIcon className="h-6 w-6" />} label="Janji" href="/mobile/appointments" />
            <QuickActionButton icon={<HeartIcon className="h-6 w-6" />} label="Pengobatan" href="/mobile/treatments" />
            <QuickActionButton icon={<ChartBarIcon className="h-6 w-6" />} label="Analitik" href="/mobile/analytics" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <p className="text-sm text-gray-500">Tidak ada aktivitas baru</p>
        </div>
      </div>
    </MobilePage>
  );
}

function QuickActionButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="text-blue-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </a>
  );
}
