'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);

      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // User is authenticated but doesn't have the required role
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-600">Memeriksa autentikasi...</p>
          </div>
        </div>
      )
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  // User doesn't have the required role
  if (requiredRole && user?.role !== requiredRole) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}

// Higher-order component for protecting routes with specific roles
export function withRoleProtection<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole: ProtectedRouteProps['requiredRole']
) {
  return function ProtectedComponent(props: T) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}