'use client';

import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const handleRegisterSuccess = () => {
    // Redirect will be handled by the RegisterForm component
    console.log('Registration successful');
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onError={handleRegisterError}
        />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 INAMSOS. Indonesia National Cancer Database System.</p>
        <div className="mt-2 space-x-4">
          <Link href="/privacy" className="hover:text-gray-700">
            Kebijakan Privasi
          </Link>
          <Link href="/terms" className="hover:text-gray-700">
            Syarat & Ketentuan
          </Link>
          <Link href="/help" className="hover:text-gray-700">
            Bantuan
          </Link>
        </div>
      </div>
    </div>
  );
}