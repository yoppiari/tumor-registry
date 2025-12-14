'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MediaStats {
  clinicalPhotos: number;
  radiologyImages: number;
  pathologyReports: number;
  totalFiles: number;
  totalSize: number;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'radiology' | 'pathology';
  patientId: string;
  patientName?: string;
  mrNumber?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate: string;
  uploadedBy?: string;
}

export default function MediaGalleryPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MediaStats>({
    clinicalPhotos: 0,
    radiologyImages: 0,
    pathologyReports: 0,
    totalFiles: 0,
    totalSize: 0,
  });
  const [recentMedia, setRecentMedia] = useState<MediaItem[]>([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photo' | 'radiology' | 'pathology'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const [photos, radiology, pathology] = await Promise.all([
      //   clinicalPhotosService.getAllPhotos(),
      //   medicalImagingService.getImagesByType('RADIOLOGY'),
      //   pathologyService.getAllReports(),
      // ]);

      setStats({
        clinicalPhotos: 0,
        radiologyImages: 0,
        pathologyReports: 0,
        totalFiles: 0,
        totalSize: 0,
      });

      setRecentMedia([]);
    } catch (error) {
      console.error('Error loading media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      photo: '📸',
      radiology: '🏥',
      pathology: '🔬',
    };
    return icons[type] || '📄';
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      photo: 'bg-blue-100 text-blue-800',
      radiology: 'bg-purple-100 text-purple-800',
      pathology: 'bg-green-100 text-green-800',
    };

    const color = colors[type] || 'bg-gray-100 text-gray-800';
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{label}</span>;
  };

  const filteredMedia = mediaTypeFilter === 'all'
    ? recentMedia
    : recentMedia.filter(item => item.type === mediaTypeFilter);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading media gallery...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
        <p className="text-gray-600">Centralized view of all clinical media</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clinical Photos</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.clinicalPhotos}</p>
            </div>
            <div className="text-4xl">📸</div>
          </div>
          <Link
            href="/media/photos"
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium block"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Radiology Images</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.radiologyImages}</p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
          <Link
            href="/media/radiology"
            className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium block"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pathology Reports</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.pathologyReports}</p>
            </div>
            <div className="text-4xl">🔬</div>
          </div>
          <Link
            href="/media/pathology"
            className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium block"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Storage</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(stats.totalSize / (1024 * 1024 * 1024)).toFixed(2)}
                <span className="text-base ml-1">GB</span>
              </p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {stats.totalFiles} files total
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 mb-8">
        <h2 className="text-white text-lg font-semibold mb-4">Quick Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/media/photos"
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📸</div>
              <div>
                <p className="font-medium text-gray-900">Clinical Photo</p>
                <p className="text-sm text-gray-600">Upload patient photos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/media/radiology"
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏥</div>
              <div>
                <p className="font-medium text-gray-900">Radiology Image</p>
                <p className="text-sm text-gray-600">Upload X-Ray, CT, MRI</p>
              </div>
            </div>
          </Link>

          <Link
            href="/media/pathology"
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="font-medium text-gray-900">Pathology Report</p>
                <p className="text-sm text-gray-600">Upload biopsy reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setMediaTypeFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mediaTypeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMediaTypeFilter('photo')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mediaTypeFilter === 'photo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setMediaTypeFilter('radiology')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mediaTypeFilter === 'radiology'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Radiology
              </button>
              <button
                onClick={() => setMediaTypeFilter('pathology')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mediaTypeFilter === 'pathology'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pathology
              </button>
            </div>
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-lg font-medium">No media files yet</p>
            <p className="text-sm mt-2">
              Upload clinical photos, radiology images, or pathology reports to get started
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                href="/media/photos"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upload First File
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">{getTypeIcon(item.type)}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate flex-1">
                        {item.title}
                      </h3>
                      {getTypeBadge(item.type)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{item.patientName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.mrNumber || '-'}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.uploadDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Storage Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Storage by Type</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Clinical Photos</span>
                <span className="font-medium">
                  {stats.clinicalPhotos > 0 ? Math.round((stats.clinicalPhotos / stats.totalFiles) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.clinicalPhotos > 0 ? (stats.clinicalPhotos / stats.totalFiles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Radiology Images</span>
                <span className="font-medium">
                  {stats.radiologyImages > 0 ? Math.round((stats.radiologyImages / stats.totalFiles) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${stats.radiologyImages > 0 ? (stats.radiologyImages / stats.totalFiles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pathology Reports</span>
                <span className="font-medium">
                  {stats.pathologyReports > 0 ? Math.round((stats.pathologyReports / stats.totalFiles) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.pathologyReports > 0 ? (stats.pathologyReports / stats.totalFiles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload Activity</h3>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-gray-900">{stats.totalFiles}</p>
            <p className="text-sm text-gray-600 mt-2">Total Files</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Storage Capacity</h3>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-gray-900">
              {(stats.totalSize / (1024 * 1024 * 1024)).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Gigabytes Used</p>
            <p className="text-xs text-gray-500 mt-1">MinIO Storage</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
