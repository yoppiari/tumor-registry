'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest, Center } from '@/types/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
    role: 'data_entry',
    centerId: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterRequest & { confirmPassword?: string }>>({});
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      const response = await fetch('/api/v1/centers');
      if (response.ok) {
        const data = await response.json();
        setCenters(data.centers || []);
      }
    } catch (error) {
      console.error('Failed to load centers:', error);
    } finally {
      setIsLoadingCenters(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<RegisterRequest & { confirmPassword?: string }> = {};

    if (!formData.email) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      errors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
    }

    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.name) {
      errors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.centerId) {
      errors.centerId = 'Pusat layanan wajib dipilih';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof RegisterRequest]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      onSuccess?.();
      router.push('/verify-email');
    } catch (error: any) {
      const errorMessage = error.message || 'Pendaftaran gagal. Silakan coba lagi.';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'data_entry', label: 'Data Entry', description: 'Menginput data pasien' },
    { value: 'researcher', label: 'Peneliti', description: 'Melakukan analisis dan penelitian' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Daftar Akun INAMSOS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Indonesia National Cancer Database System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    fieldErrors.name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="Dr. John Doe"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Alamat
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="nama@rumahsakit.co.id"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role Pengguna
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    fieldErrors.role ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {fieldErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="centerId" className="block text-sm font-medium text-gray-700">
                Pusat Layanan Kanker
              </label>
              <div className="mt-1">
                <select
                  id="centerId"
                  name="centerId"
                  required
                  value={formData.centerId}
                  onChange={handleInputChange}
                  disabled={isLoadingCenters}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    fieldErrors.centerId ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50`}
                >
                  <option value="">
                    {isLoadingCenters ? 'Memuat data pusat layanan...' : 'Pilih pusat layanan'}
                  </option>
                  {centers.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name} - {center.city}, {center.province}
                    </option>
                  ))}
                </select>
                {fieldErrors.centerId && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.centerId}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              Saya setuju dengan{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Syarat & Ketentuan
              </a>{' '}
              dan{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Kebijakan Privasi
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCenters}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Masuk di sini
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}