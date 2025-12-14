'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import clinicalPhotosService, { ClinicalPhoto, UploadClinicalPhotoParams } from '@/services/clinical-photos.service';
import { useRouter } from 'next/navigation';

interface PhotoWithMetadata {
  id: string;
  patientId: string;
  patientName?: string;
  mrNumber?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  anatomicalLocation?: string;
  viewType?: string;
  description?: string;
  uploadDate: string;
  uploadedBy?: string;
}

export default function ClinicalPhotosPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoWithMetadata[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoWithMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTypeFilter, setViewTypeFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithMetadata | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadPatientId, setUploadPatientId] = useState('');
  const [uploadViewType, setUploadViewType] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadPhotos();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchQuery, viewTypeFilter]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call to get all photos
      // For now, return empty array as backend needs an endpoint for all photos
      setPhotos([]);
    } catch (error) {
      console.error('Error loading clinical photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = [...photos];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by view type
    if (viewTypeFilter !== 'all') {
      filtered = filtered.filter((p) => p.viewType === viewTypeFilter);
    }

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    setFilteredPhotos(filtered);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadPatientId) {
      alert('Please select a file and enter patient ID');
      return;
    }

    try {
      setUploading(true);

      const params: UploadClinicalPhotoParams = {
        patientId: uploadPatientId,
        file: uploadFile,
        viewType: uploadViewType,
        description: uploadDescription,
      };

      await clinicalPhotosService.uploadPhoto(params);

      alert('Photo uploaded successfully!');

      // Reset form
      setUploadFile(null);
      setUploadPreview('');
      setUploadPatientId('');
      setUploadViewType('');
      setUploadDescription('');
      setShowUploadModal(false);

      // Reload photos
      loadPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await clinicalPhotosService.deletePhoto(photoId);
      alert('Photo deleted successfully');
      loadPhotos();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const getViewTypeBadge = (viewType?: string) => {
    const colors: Record<string, string> = {
      ANTERIOR: 'bg-blue-100 text-blue-800',
      POSTERIOR: 'bg-green-100 text-green-800',
      LATERAL_LEFT: 'bg-purple-100 text-purple-800',
      LATERAL_RIGHT: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };

    const color = colors[viewType || ''] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {viewType || 'Unknown'}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clinical photos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Photos Management</h1>
            <p className="text-gray-600">Upload and manage clinical photography documentation</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">📸</span>
            Upload Photo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Photos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{photos.length}</p>
            </div>
            <div className="text-4xl">🖼️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {
                  photos.filter((p) => {
                    const uploadDate = new Date(p.uploadDate);
                    const now = new Date();
                    return (
                      uploadDate.getMonth() === now.getMonth() &&
                      uploadDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {new Set(photos.map((p) => p.patientId)).size}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {(photos.reduce((sum, p) => sum + (p.fileSize || 0), 0) / (1024 * 1024)).toFixed(1)}
                <span className="text-sm ml-1">MB</span>
              </p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Patient name, MR number, or description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
            <select
              value={viewTypeFilter}
              onChange={(e) => setViewTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Views</option>
              <option value="ANTERIOR">Anterior</option>
              <option value="POSTERIOR">Posterior</option>
              <option value="LATERAL_LEFT">Lateral Left</option>
              <option value="LATERAL_RIGHT">Lateral Right</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Clinical Photos ({filteredPhotos.length})
        </h2>

        {filteredPhotos.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg font-medium">No clinical photos found</p>
            <p className="text-sm mt-2">
              {photos.length === 0
                ? 'Start by uploading clinical photos for your patients'
                : 'Try adjusting your search filters'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={photo.fileUrl}
                    alt={photo.description || 'Clinical photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">{getViewTypeBadge(photo.viewType)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {photo.patientName || 'Unknown Patient'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{photo.mrNumber || '-'}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {photo.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(photo.uploadDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Clinical Photo</h2>
                <button
                  onClick={() => !uploading && setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                />
                {uploadPreview && (
                  <div className="mt-4">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                <input
                  type="text"
                  value={uploadPatientId}
                  onChange={(e) => setUploadPatientId(e.target.value)}
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                />
              </div>

              {/* View Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                <select
                  value={uploadViewType}
                  onChange={(e) => setUploadViewType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                >
                  <option value="">Select view type</option>
                  <option value="ANTERIOR">Anterior</option>
                  <option value="POSTERIOR">Posterior</option>
                  <option value="LATERAL_LEFT">Lateral Left</option>
                  <option value="LATERAL_RIGHT">Lateral Right</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={3}
                  placeholder="Photo description (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !uploadPatientId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Clinical Photo Detail</h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedPhoto.fileUrl}
                  alt={selectedPhoto.description || 'Clinical photo'}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold">{selectedPhoto.patientName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MR Number</p>
                  <p className="font-semibold">{selectedPhoto.mrNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">View Type</p>
                  <div className="mt-1">{getViewTypeBadge(selectedPhoto.viewType)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upload Date</p>
                  <p className="font-semibold">
                    {new Date(selectedPhoto.uploadDate).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-semibold">
                    {selectedPhoto.fileSize
                      ? `${(selectedPhoto.fileSize / 1024).toFixed(1)} KB`
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded By</p>
                  <p className="font-semibold">{selectedPhoto.uploadedBy || '-'}</p>
                </div>
              </div>

              {selectedPhoto.description && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{selectedPhoto.description}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => window.open(selectedPhoto.fileUrl, '_blank')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
