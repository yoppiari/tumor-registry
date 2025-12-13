'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon as SettingsIcon,
  Bars3Icon as MenuIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon as FilterIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

interface MobilePageProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  floatingAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  rightActions?: React.ReactNode;
}

export default function MobilePage({
  children,
  title,
  showBackButton = false,
  showSearch = false,
  showNotifications = true,
  floatingAction,
  rightActions
}: MobilePageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
    console.log('Searching for:', query);
  };

  const handleNotificationClick = () => {
    // Navigate to notifications
    router.push('/mobile/notifications');
  };

  const handleMenuItem = (path: string) => {
    router.push(path);
    setShowMenu(false);
  };

  const navigationItems = [
    { path: '/mobile', icon: HomeIcon, label: 'Beranda', active: pathname === '/mobile' },
    { path: '/mobile/patients', icon: UserIcon, label: 'Pasien', active: pathname === '/mobile/patients' },
    { path: '/mobile/appointments', icon: CalendarIcon, label: 'Janji', active: pathname === '/mobile/appointments' },
    { path: '/mobile/treatments', icon: HeartIcon, label: 'Pengobatan', active: pathname === '/mobile/treatments' },
    { path: '/mobile/reports', icon: DocumentTextIcon, label: 'Laporan', active: pathname === '/mobile/reports' },
    { path: '/mobile/analytics', icon: ChartBarIcon, label: 'Analitik', active: pathname === '/mobile/analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
            )}
            {title && (
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <div className="flex-1 max-w-xs">
                {showSearchBar ? (
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Cari..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => setShowSearchBar(false)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    >
                      <XCircleIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                  </button>
                )}
              </div>
            )}
            {rightActions}
            {showNotifications && (
              <button
                onClick={handleNotificationClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BellIcon className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MenuIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="py-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleMenuItem(item.path)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3 ${
                    item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <hr className="my-2 border-gray-200" />
              <button
                onClick={() => handleMenuItem('/mobile/settings')}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3 text-gray-700"
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="font-medium">Pengaturan</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuItem(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.active ? (
                <item.icon className="h-6 w-6" />
              ) : (
                <item.icon className="h-6 w-6" />
              )}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      {floatingAction && (
        <button
          onClick={floatingAction.onPress}
          className="fixed bottom-20 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors z-40"
        >
          {floatingAction.icon}
        </button>
      )}

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

// Mobile-specific components
interface MobileCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  onClick?: () => void;
  className?: string;
}

export function MobileCard({
  children,
  title,
  subtitle,
  icon,
  color = 'blue',
  onClick,
  className = ''
}: MobileCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color]} border rounded-lg p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {icon && (
        <div className="flex items-center mb-3">
          <div className="p-2 bg-white bg-opacity-70 rounded-lg">
            {icon}
          </div>
          <div className="ml-3">
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function MobileListItem({
  title,
  subtitle,
  icon,
  badge,
  onClick,
  showChevron = true,
  className = ''
}: MobileListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center flex-1">
        {icon && <div className="mr-3">{icon}</div>}
        <div className="flex-1">
          <div className="font-medium text-gray-900">{title}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {badge}
          </span>
        )}
        {showChevron && (
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );
}

interface MobileStatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  status: 'good' | 'warning' | 'critical';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  onClick?: () => void;
}

export function MobileStatusCard({
  title,
  value,
  unit,
  trend,
  trendPercentage,
  status = 'good',
  icon,
  color = 'blue',
  onClick
}: MobileStatusCardProps) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  return (
    <MobileCard
      color={color}
      onClick={onClick}
      className="h-full"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
          </p>
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <span className={`${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </span>
              {trendPercentage && (
                <span className={statusColors[status]}>
                  {Math.abs(trendPercentage)}%
                </span>
              )}
            </div>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </MobileCard>
  );
}

interface MobileAlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function MobileAlert({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  action
}: MobileAlertProps) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const typeIcons = {
    info: <BellIcon className="h-5 w-5" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5" />,
    error: <XCircleIcon className="h-5 w-5" />,
    success: <CheckCircleIcon className="h-5 w-5" />
  };

  return (
    <div className={`${typeStyles[type]} border rounded-lg p-4 my-2`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {typeIcons[type]}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <p className="text-sm mt-1">{message}</p>}
          {action && (
            <button
              onClick={action.onPress}
              className="mt-2 px-3 py-1 text-sm font-medium border border-current rounded hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0"
          >
            <XCircleIcon className="h-5 w-5 text-current" />
          </button>
        )}
      </div>
    </div>
  );
}

// Mobile Loading State
interface MobileLoadingProps {
  message?: string;
  showLogo?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function MobileLoading({ message, showLogo = true, size = 'medium' }: MobileLoadingProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {showLogo && (
        <div className="mb-4">
          <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        </div>
      )}
      {message && (
        <p className="text-gray-600 text-sm text-center">{message}</p>
      )}
    </div>
  );
}

// Mobile Stats Cards
interface MobileStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
  }>;
  columns?: 2 | 3;
}

export function MobileStats({ stats, columns = 2 }: MobileStatsProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-3 p-4`}>
      {stats.map((stat, index) => (
        <MobileStatusCard
          key={index}
          title={stat.label}
          value={stat.value}
          trend={stat.change && stat.change > 0 ? 'up' : stat.change < 0 ? 'down' : 'stable'}
          trendPercentage={Math.abs(stat.change)}
          icon={stat.icon}
          status={Math.abs(stat.change || 0) > 10 ? 'critical' : Math.abs(stat.change || 0) > 5 ? 'warning' : 'good'}
        />
      ))}
    </div>
  );
}