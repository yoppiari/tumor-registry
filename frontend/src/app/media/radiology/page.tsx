'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface RadiologyImage {
  id: string;
  patientId: string;
  patientName?: string;
  mrNumber?: string;
  modality: string;
  bodyPart?: string;
  studyDate: string;
  description?: string;
  findings?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadDate: string;
  uploadedBy?: string;
}

export default function RadiologyManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<RadiologyImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<RadiologyImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<RadiologyImage | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterImages();
  }, [images, searchQuery, modalityFilter]);

  const loadImages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await medicalImagingService.getImagesByType('RADIOLOGY');
      setImages([]);
    } catch (error) {
      console.error('Error loading radiology images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...images];

    if (searchQuery) {
      filtered = filtered.filter(
        (img) =>
          img.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.mrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.bodyPart?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.findings?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (modalityFilter !== 'all') {
      filtered = filtered.filter((img) => img.modality === modalityFilter);
    }

    filtered.sort((a, b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime());

    setFilteredImages(filtered);
  };

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

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading radiology images...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Radiology Images</h1>
            <p className="text-gray-600">Manage diagnostic imaging (X-Ray, CT, MRI, Ultrasound)</p>
          </div>
          <button
            onClick={() => router.push('/patients/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">📤</span>
            Upload Image
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{images.length}</p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">X-Ray</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {images.filter((img) => img.modality === 'XRAY').length}
              </p>
            </div>
            <div className="text-2xl">📷</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CT Scan</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {images.filter((img) => img.modality === 'CT').length}
              </p>
            </div>
            <div className="text-2xl">🔬</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MRI</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">
                {images.filter((img) => img.modality === 'MRI').length}
              </p>
            </div>
            <div className="text-2xl">🧲</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ultrasound</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {images.filter((img) => img.modality === 'ULTRASOUND').length}
              </p>
            </div>
            <div className="text-2xl">📡</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Patient name, MR number, body part, or findings"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modality</label>
            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Images Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Radiology Studies ({filteredImages.length})</h2>
        </div>

        {filteredImages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-lg font-medium">No radiology images found</p>
            <p className="text-sm mt-2">
              {images.length === 0
                ? 'Radiology images will appear here when uploaded'
                : 'Try adjusting your search filters'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MR Number
                  </th>
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
                    Findings
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{image.patientName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{image.mrNumber || '-'}</div>
                    </td>
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
                      <div className="text-sm text-gray-900 line-clamp-2">{image.findings || 'No findings recorded'}</div>
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
      </div>

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
                  src={selectedImage.fileUrl}
                  alt={`${selectedImage.modality} - ${selectedImage.bodyPart}`}
                  className="w-full rounded-lg bg-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Patient Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Patient Name</p>
                      <p className="font-medium">{selectedImage.patientName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">MR Number</p>
                      <p className="font-medium">{selectedImage.mrNumber || '-'}</p>
                    </div>
                  </div>
                </div>

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
                  onClick={() => window.open(selectedImage.fileUrl, '_blank')}
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
    </Layout>
  );
}
