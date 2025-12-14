'use client';

import React, { useState, useEffect } from 'react';
import medicalImagingService, { MedicalImage } from '@/services/medical-imaging.service';

interface RadiologyImagesTabProps {
  patientId: string;
  patientName: string;
}

export function RadiologyImagesTab({ patientId, patientName }: RadiologyImagesTabProps) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<MedicalImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  const [modalityFilter, setModalityFilter] = useState('all');

  useEffect(() => {
    loadImages();
  }, [patientId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await medicalImagingService.getImagesByPatient(patientId);
      setImages(data);
    } catch (error) {
      console.error('Error loading radiology images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = modalityFilter === 'all'
    ? images
    : images.filter(img => img.modality === modalityFilter);

  const getModalityBadge = (modality: string) => {
    const colors: Record<string, string> = {
      XRAY: 'bg-blue-100 text-blue-800',
      CT: 'bg-purple-100 text-purple-800',
      MRI: 'bg-pink-100 text-pink-800',
      ULTRASOUND: 'bg-green-100 text-green-800',
      'PET-SCAN': 'bg-red-100 text-red-800',
      'BONE-SCAN': 'bg-yellow-100 text-yellow-800',
    };

    const color = colors[modality] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{modality}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading radiology images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Radiology Images</h3>
          <p className="text-sm text-gray-600">{images.length} images for {patientName}</p>
        </div>
        <div>
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Modalities</option>
            <option value="XRAY">X-Ray</option>
            <option value="CT">CT Scan</option>
            <option value="MRI">MRI</option>
            <option value="ULTRASOUND">Ultrasound</option>
            <option value="PET-SCAN">PET Scan</option>
            <option value="BONE-SCAN">Bone Scan</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">X-Ray</p>
          <p className="text-2xl font-bold text-blue-900">{images.filter(img => img.modality === 'XRAY').length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">CT Scan</p>
          <p className="text-2xl font-bold text-purple-900">{images.filter(img => img.modality === 'CT').length}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <p className="text-sm text-pink-600 font-medium">MRI</p>
          <p className="text-2xl font-bold text-pink-900">{images.filter(img => img.modality === 'MRI').length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Ultrasound</p>
          <p className="text-2xl font-bold text-green-900">{images.filter(img => img.modality === 'ULTRASOUND').length}</p>
        </div>
      </div>

      {/* Images List */}
      {filteredImages.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🏥</div>
          <p className="text-lg font-medium">No radiology images yet</p>
          <p className="text-sm mt-2">
            {images.length === 0
              ? 'Radiology images will appear here when uploaded through the patient entry form'
              : 'Try adjusting the modality filter'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Body Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{getModalityBadge(image.modality)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{image.bodyPart || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(image.studyDate).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{image.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Radiology Study Detail</h2>
                <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedImage.url}
                  alt={`${selectedImage.modality} - ${selectedImage.bodyPart}`}
                  className="w-full rounded-lg bg-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Study Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Modality</p>
                      <div className="mt-1">{getModalityBadge(selectedImage.modality)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Body Part</p>
                      <p className="font-medium">{selectedImage.bodyPart || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Study Date</p>
                      <p className="font-medium">{new Date(selectedImage.studyDate).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Patient Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Patient Name</p>
                      <p className="font-medium">{patientName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedImage.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-900">{selectedImage.description}</p>
                </div>
              )}

              {selectedImage.findings && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Findings</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedImage.findings}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => window.open(selectedImage.url, '_blank')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
