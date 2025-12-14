'use client';

import React, { useState, useEffect } from 'react';
import clinicalPhotosService, { ClinicalPhoto, UploadClinicalPhotoParams } from '@/services/clinical-photos.service';

interface ClinicalPhotosTabProps {
  patientId: string;
  patientName: string;
}

export function ClinicalPhotosTab({ patientId, patientName }: ClinicalPhotosTabProps) {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<ClinicalPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ClinicalPhoto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadViewType, setUploadViewType] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');

  useEffect(() => {
    loadPhotos();
  }, [patientId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await clinicalPhotosService.getPhotosByPatient(patientId);
      // Ensure data is always an array
      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading clinical photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
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
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }

    try {
      setUploading(true);

      const params: UploadClinicalPhotoParams = {
        patientId,
        file: uploadFile,
        viewType: uploadViewType,
        description: uploadDescription,
      };

      await clinicalPhotosService.uploadPhoto(params);

      alert('Photo uploaded successfully!');

      // Reset form
      setUploadFile(null);
      setUploadPreview('');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Clinical Photos</h3>
          <p className="text-sm text-gray-600">{photos.length} photos for {patientName}</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="mr-2">📸</span>
          Upload Photo
        </button>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-lg font-medium">No clinical photos yet</p>
          <p className="text-sm mt-2">Upload clinical photos to document this patient's condition</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={`${photo.preview}-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={photo.preview}
                  alt={photo.description || 'Clinical photo'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">{getViewTypeBadge(photo.viewAngle)}</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 line-clamp-2">
                  {photo.description || 'No description'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(photo.file.lastModified).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <p className="text-sm text-gray-600 mt-2">Patient: {patientName}</p>
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
                disabled={uploading || !uploadFile}
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
                  src={selectedPhoto.preview}
                  alt={selectedPhoto.description || 'Clinical photo'}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold">{patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">View Type</p>
                  <div className="mt-1">{getViewTypeBadge(selectedPhoto.viewAngle)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold">
                    {selectedPhoto.description || 'No description'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-semibold">
                    {selectedPhoto.file.size
                      ? `${(selectedPhoto.file.size / 1024).toFixed(1)} KB`
                      : 'Unknown'}
                  </p>
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
                  onClick={() => window.open(selectedPhoto.preview, '_blank')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(selectedPhoto.preview)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
