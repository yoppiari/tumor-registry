'use client';

import React, { useState, useRef } from 'react';

export interface ClinicalPhoto {
  file: File;
  preview: string;
  description?: string;
  viewAngle?: 'ANTERIOR' | 'POSTERIOR' | 'LATERAL_LEFT' | 'LATERAL_RIGHT' | 'OTHER';
}

interface ClinicalPhotoUploadProps {
  patientId?: string;
  onPhotosChange: (photos: ClinicalPhoto[]) => void;
  maxPhotos?: number;
  maxFileSizeMB?: number;
}

const VIEW_ANGLES = [
  { value: 'ANTERIOR', label: 'Anterior (Depan)' },
  { value: 'POSTERIOR', label: 'Posterior (Belakang)' },
  { value: 'LATERAL_LEFT', label: 'Lateral Kiri' },
  { value: 'LATERAL_RIGHT', label: 'Lateral Kanan' },
  { value: 'OTHER', label: 'Lainnya' },
] as const;

export function ClinicalPhotoUpload({
  patientId,
  onPhotosChange,
  maxPhotos = 10,
  maxFileSizeMB = 10,
}: ClinicalPhotoUploadProps) {
  const [photos, setPhotos] = useState<ClinicalPhoto[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError('');

    if (photos.length + files.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const validFiles: ClinicalPhoto[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSizeMB) {
        setError(`File ${file.name} exceeds ${maxFileSizeMB}MB limit`);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        viewAngle: 'ANTERIOR', // Default
      });
    });

    const updatedPhotos = [...photos, ...validFiles];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].preview);
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  const handleUpdatePhoto = (index: number, field: keyof ClinicalPhoto, value: any) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = { ...updatedPhotos[index], [field]: value };
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-3 text-sm font-medium text-gray-900">
          Klik atau seret foto untuk upload
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, JPEG up to {maxFileSizeMB}MB (Max {maxPhotos} photos)
        </p>
        <p className="text-xs text-blue-600 mt-2 font-medium">
          {photos.length} / {maxPhotos} foto ter-upload
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
              {/* Preview Image */}
              <div className="relative aspect-video mb-3 bg-gray-100 rounded overflow-hidden">
                <img
                  src={photo.preview}
                  alt={`Clinical photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Metadata */}
              <div className="space-y-2">
                {/* View Angle */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sudut Pandang
                  </label>
                  <select
                    value={photo.viewAngle || 'ANTERIOR'}
                    onChange={(e) => handleUpdatePhoto(index, 'viewAngle', e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {VIEW_ANGLES.map((angle) => (
                      <option key={angle.value} value={angle.value}>
                        {angle.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={photo.description || ''}
                    onChange={(e) => handleUpdatePhoto(index, 'description', e.target.value)}
                    placeholder="Contoh: Lesi terlihat jelas di area..."
                    rows={2}
                    className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* File Info */}
                <p className="text-xs text-gray-500">
                  {photo.file.name} ({(photo.file.size / 1024).toFixed(0)} KB)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guidelines */}
      {photos.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Panduan Foto Klinis</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Minimal 3 foto dari sudut berbeda (anterior, lateral, posterior)</li>
                <li>Pastikan pencahayaan baik dan fokus jelas</li>
                <li>Sertakan penggaris atau referensi ukuran jika memungkinkan</li>
                <li>Tutup identitas pasien yang tidak perlu (wajah, tato, dll)</li>
                <li>Format: JPG, PNG (max {maxFileSizeMB}MB per foto)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
