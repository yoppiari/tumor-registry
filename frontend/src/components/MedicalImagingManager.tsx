import React, { useState, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

interface MedicalImage {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: 'dicom' | 'xray' | 'mri' | 'ct' | 'ultrasound' | 'pathology' | 'other';
  tags: string[];
  uploadDate: string;
  patientId: string;
  description?: string;
  thumbnailUrl?: string;
  downloadUrl: string;
  metadata?: {
    dimensions?: { width: number; height: number };
    equipment?: string;
    studyDate?: string;
    modality?: string;
  };
}

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  acceptedTypes: string[];
  color: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'dicom',
    name: 'DICOM',
    icon: <DocumentIcon className="w-5 h-5" />,
    acceptedTypes: ['application/dicom', 'image/dcm'],
    color: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  {
    id: 'xray',
    name: 'X-Ray',
    icon: <PhotoIcon className="w-5 h-5" />,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/tiff'],
    color: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  {
    id: 'mri',
    name: 'MRI',
    icon: <MagnifyingGlassIcon className="w-5 h-5" />,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/dcm'],
    color: 'bg-green-100 text-green-700 border-green-300'
  },
  {
    id: 'ct',
    name: 'CT Scan',
    icon: <FolderIcon className="w-5 h-5" />,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/dcm'],
    color: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  {
    id: 'ultrasound',
    name: 'Ultrasound',
    icon: <PhotoIcon className="w-5 h-5" />,
    acceptedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  },
  {
    id: 'pathology',
    name: 'Pathology',
    icon: <MagnifyingGlassIcon className="w-5 h-5" />,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/tiff'],
    color: 'bg-pink-100 text-pink-700 border-pink-300'
  },
  {
    id: 'other',
    name: 'Other',
    icon: <DocumentIcon className="w-5 h-5" />,
    acceptedTypes: ['application/pdf', 'image/*'],
    color: 'bg-gray-100 text-gray-700 border-gray-300'
  }
];

interface DragDropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({ onFiles, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && !disabled) {
      onFiles(files);
    }
  }, [onFiles, disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFiles]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.dcm,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Drop files here' : 'Upload medical images'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Supports DICOM, JPEG, PNG, TIFF, PDF (Max 50MB per file)
          </p>
        </div>
      </div>
    </div>
  );
};

interface UploadProgressProps {
  files: File[];
  onProgress: (index: number, progress: number) => void;
  onComplete: (index: number, result: MedicalImage) => void;
  onError: (index: number, error: string) => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  files,
  onProgress,
  onComplete,
  onError
}) => {
  const [uploadStates, setUploadStates] = useState<( 'pending' | 'uploading' | 'complete' | 'error')[]>(
    new Array(files.length).fill('pending')
  );

  const simulateUpload = useCallback(async (file: File, index: number): Promise<MedicalImage> => {
    setUploadStates(prev => {
      const newStates = [...prev];
      newStates[index] = 'uploading';
      return newStates;
    });

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      onProgress(index, progress);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Determine category based on file type and name
    const category = determineCategory(file);

    // Mock successful upload
    const mockResult: MedicalImage = {
      id: `img_${Date.now()}_${index}`,
      filename: `${Date.now()}_${file.name}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category,
      tags: extractTags(file.name, category),
      uploadDate: new Date().toISOString(),
      patientId: 'current_patient_id', // This would come from props/context
      downloadUrl: URL.createObjectURL(file),
      metadata: {
        dimensions: file.type.startsWith('image/') ? { width: 800, height: 600 } : undefined,
        studyDate: new Date().toISOString().split('T')[0],
        modality: category.toUpperCase()
      }
    };

    setUploadStates(prev => {
      const newStates = [...prev];
      newStates[index] = 'complete';
      return newStates;
    });

    return mockResult;
  }, [onProgress]);

  const determineCategory = (file: File): MedicalImage['category'] => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const name = file.name.toLowerCase();

    if (extension === 'dcm' || file.type === 'application/dicom') return 'dicom';
    if (name.includes('mri')) return 'mri';
    if (name.includes('ct') || name.includes('scan')) return 'ct';
    if (name.includes('ultrasound') || name.includes('us')) return 'ultrasound';
    if (name.includes('pathology') || name.includes('biopsy')) return 'pathology';
    if (name.includes('x-ray') || name.includes('xray')) return 'xray';

    return 'other';
  };

  const extractTags = (filename: string, category: MedicalImage['category']): string[] => {
    const tags: string[] = [category];
    const name = filename.toLowerCase();

    // Extract common medical terms from filename
    const medicalTerms = ['chest', 'abdomen', 'pelvis', 'brain', 'spine', 'contrast', 'mri', 'ct', 'ultrasound'];
    medicalTerms.forEach(term => {
      if (name.includes(term)) {
        tags.push(term);
      }
    });

    return tags;
  };

  React.useEffect(() => {
    files.forEach(async (file, index) => {
      try {
        const result = await simulateUpload(file, index);
        onComplete(index, result);
      } catch (error) {
        onError(index, error instanceof Error ? error.message : 'Upload failed');
      }
    });
  }, [files, simulateUpload, onComplete, onError]);

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PhotoIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {uploadStates[index] === 'uploading' && (
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            )}

            {uploadStates[index] === 'complete' && (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}

            {uploadStates[index] === 'error' && (
              <XCircleIcon className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ImageGalleryProps {
  images: MedicalImage[];
  onImageSelect: (image: MedicalImage) => void;
  onImageUpdate: (imageId: string, updates: Partial<MedicalImage>) => void;
  onImageDelete: (imageId: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageSelect,
  onImageUpdate,
  onImageDelete
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({images.length})
          </button>

          {CATEGORIES.map(category => {
            const count = images.filter(img => img.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map(image => {
          const category = CATEGORIES.find(cat => cat.id === image.category);

          return (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => onImageSelect(image)}
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {image.thumbnailUrl ? (
                  <img
                    src={image.thumbnailUrl}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color || 'bg-gray-100 text-gray-700'}`}>
                  {category?.name || image.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images found</p>
        </div>
      )}
    </div>
  );
};

interface MedicalImagingManagerProps {
  patientId: string;
}

export const MedicalImagingManager: React.FC<MedicalImagingManagerProps> = ({ patientId }) => {
  const [images, setImages] = useState<MedicalImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    setPendingFiles(prev => [...prev, ...files]);
  }, []);

  const handleUploadProgress = useCallback((index: number, progress: number) => {
    // Update progress in UI if needed
  }, []);

  const handleUploadComplete = useCallback((index: number, result: MedicalImage) => {
    setImages(prev => [...prev, result]);
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUploadError = useCallback((index: number, error: string) => {
    console.error('Upload error:', error);
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleImageSelect = useCallback((image: MedicalImage) => {
    setSelectedImage(image);
  }, []);

  const handleImageUpdate = useCallback((imageId: string, updates: Partial<MedicalImage>) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    ));
  }, []);

  const handleImageDelete = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  }, [selectedImage]);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Medical Imaging</h1>
              <p className="text-gray-500 mt-1">Manage patient medical images and scans</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <PhotoIcon className="w-4 h-4" />
              <span>{images.length} images</span>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {pendingFiles.length === 0 && (
          <div className="p-6">
            <DragDropZone onFiles={handleFiles} />
          </div>
        )}

        {/* Upload Progress */}
        {pendingFiles.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Uploading Files</h3>
            <UploadProgress
              files={pendingFiles}
              onProgress={handleUploadProgress}
              onComplete={handleUploadComplete}
              onError={handleUploadError}
            />
          </div>
        )}

        {/* Image Gallery */}
        {images.length > 0 && pendingFiles.length === 0 && (
          <div className="flex-1 p-6">
            <ImageGallery
              images={images}
              onImageSelect={handleImageSelect}
              onImageUpdate={handleImageUpdate}
              onImageDelete={handleImageDelete}
            />
          </div>
        )}
      </div>

      {/* Image Preview Sidebar */}
      {selectedImage && (
        <div className="w-80 border-l border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Image Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Preview */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {selectedImage.thumbnailUrl ? (
                <img
                  src={selectedImage.thumbnailUrl}
                  alt={selectedImage.originalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Filename</label>
                <p className="text-sm text-gray-900">{selectedImage.originalName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    CATEGORIES.find(cat => cat.id === selectedImage.category)?.color || 'bg-gray-100 text-gray-700'
                  }`}>
                    {CATEGORIES.find(cat => cat.id === selectedImage.category)?.icon}
                    {selectedImage.category}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Size</label>
                <p className="text-sm text-gray-900">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Upload Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedImage.uploadDate).toLocaleDateString()}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {selectedImage.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={selectedImage.description || ''}
                  onChange={(e) => handleImageUpdate(selectedImage.id, { description: e.target.value })}
                  placeholder="Add description..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <a
                  href={selectedImage.downloadUrl}
                  download={selectedImage.originalName}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  Download
                </a>

                <button
                  onClick={() => handleImageDelete(selectedImage.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalImagingManager;