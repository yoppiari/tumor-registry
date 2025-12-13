'use client';

import React, { useState, useRef } from 'react';
import medicalImagingService, {
  MedicalImageType,
  ImageCategory,
  UploadImageDto,
  MedicalImage,
} from '@/services/medical-imaging.service';

interface MedicalImageUploaderProps {
  patientId: string;
  onUploadComplete?: (image: MedicalImage) => void;
  allowedTypes?: MedicalImageType[];
  category?: ImageCategory;
}

export const MedicalImageUploader: React.FC<MedicalImageUploaderProps> = ({
  patientId,
  onUploadComplete,
  allowedTypes,
  category: defaultCategory,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [imageType, setImageType] = useState<MedicalImageType>(MedicalImageType.XRAY);
  const [category, setCategory] = useState<ImageCategory>(
    defaultCategory || ImageCategory.DIAGNOSTIC
  );
  const [description, setDescription] = useState('');
  const [findings, setFindings] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [modality, setModality] = useState('');
  const [studyDate, setStudyDate] = useState(new Date().toISOString().split('T')[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!medicalImagingService.isValidImageFile(file)) {
      setError('Invalid file type. Please select a valid image file.');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100MB limit.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess(false);

    // Generate preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      const metadata: UploadImageDto = {
        patientId,
        imageType,
        category,
        description: description || undefined,
        findings: findings || undefined,
        bodyPart: bodyPart || undefined,
        modality: modality || undefined,
        studyDate: studyDate || undefined,
      };

      const uploadedImage = await medicalImagingService.uploadImage(
        selectedFile,
        metadata,
        (progress) => setUploadProgress(progress)
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 3000);

      if (onUploadComplete) {
        onUploadComplete(uploadedImage);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setFindings('');
    setBodyPart('');
    setModality('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const imageTypes = allowedTypes || Object.values(MedicalImageType);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Medical Image</h3>

      {/* File Upload Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image File *
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.dcm"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className={`w-16 h-16 mb-4 ${
                selectedFile ? 'text-green-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {selectedFile ? (
              <div>
                <p className="text-green-700 font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-green-600 mt-1">
                  {medicalImagingService.formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 font-semibold">Click to select file</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports: JPG, PNG, TIFF, BMP, DICOM (max 100MB)
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <img
            src={preview}
            alt="Preview"
            className="max-w-md max-h-64 rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Type *
          </label>
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value as MedicalImageType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {imageTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ImageCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.values(ImageCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Study Date
          </label>
          <input
            type="date"
            value={studyDate}
            onChange={(e) => setStudyDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Part
          </label>
          <input
            type="text"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
            placeholder="e.g., Left Femur, Right Tibia"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modality
          </label>
          <input
            type="text"
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            placeholder="e.g., CT, MRI, X-Ray"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Brief description of the image..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Clinical Findings
        </label>
        <textarea
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          rows={3}
          placeholder="Document any relevant clinical findings or observations..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Image uploaded successfully!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            !selectedFile || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <button
          onClick={resetForm}
          disabled={uploading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
