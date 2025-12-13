'use client';

import React, { useState } from 'react';
import { Patient } from '@/types/patient';
import { usePatient } from '@/contexts/PatientContext';

interface PatientDetailProps {
  patient: Patient;
  onEdit?: (patient: Patient) => void;
  className?: string;
}

export default function PatientDetail({ patient, onEdit, className = '' }: PatientDetailProps) {
  const { updatePatient } = usePatient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeceasedModal, setShowDeceasedModal] = useState(false);
  const [deceasedData, setDeceasedData] = useState({
    dateOfDeath: '',
    causeOfDeath: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '-';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatGender = (gender: string) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
  };

  const formatTreatmentStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'new': 'Baru',
      'ongoing': 'Sedang Berjalan',
      'completed': 'Selesai',
      'palliative': 'Paliatif',
      'lost_to_followup': 'Hilang Follow-up',
      'deceased': 'Meninggal'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'ongoing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'palliative': 'bg-purple-100 text-purple-800',
      'lost_to_followup': 'bg-orange-100 text-orange-800',
      'deceased': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatBloodType = (bloodType?: string, rhFactor?: string) => {
    if (!bloodType) return '-';
    return `${bloodType}${rhFactor ? (rhFactor === 'positive' ? '+' : '-') : ''}`;
  };

  const handleMarkAsDeceased = async () => {
    try {
      await updatePatient(patient.id, {
        isDeceased: true,
        dateOfDeath: deceasedData.dateOfDeath,
        causeOfDeath: deceasedData.causeOfDeath
      });
      setShowDeceasedModal(false);
      setDeceasedData({ dateOfDeath: '', causeOfDeath: '' });
    } catch (error) {
      console.error('Failed to mark patient as deceased:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">No. RM: {patient.medicalRecordNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.treatmentStatus)}`}>
              {formatTreatmentStatus(patient.treatmentStatus)}
            </span>
            {patient.isDeceased && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Meninggal
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => {
              onEdit?.(patient);
              setIsEditing(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit Data
          </button>
          {!patient.isDeceased && (
            <button
              onClick={() => setShowDeceasedModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Tandai Meninggal
            </button>
          )}
          <button
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cetak
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
              <p className="text-gray-900">
                {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} tahun)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
              <p className="text-gray-900">{formatGender(patient.gender)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
              <p className="text-gray-900">{formatBloodType(patient.bloodType, patient.rhFactor)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NIK</label>
              <p className="text-gray-900">{patient.identityNumber || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telepon</label>
              <p className="text-gray-900">{patient.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{patient.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
              <p className="text-gray-900">{patient.occupation || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
              <p className="text-gray-900">{patient.educationLevel || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status Pernikahan</label>
              <p className="text-gray-900">
                {patient.maritalStatus === 'single' ? 'Lajang' :
                 patient.maritalStatus === 'married' ? 'Menikah' :
                 patient.maritalStatus === 'divorced' ? 'Cerai' :
                 patient.maritalStatus === 'widowed' ? 'Duda/Janda' : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alamat</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">
              {patient.address.street && <>{patient.address.street}, <br /></>}
              {patient.address.village && <>Desa {patient.address.village}, <br /></>}
              {patient.address.district && <>Kec. {patient.address.district}, <br /></>}
              {patient.address.city && <>Kota {patient.address.city}, <br /></>}
              {patient.address.province && <>Provinsi {patient.address.province} <br /></>}
              {patient.address.postalCode && <>{patient.address.postalCode}<br /></>}
              {patient.address.country && <>{patient.address.country}</>}
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak Darurat</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <p className="text-gray-900">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hubungan</label>
                <p className="text-gray-900">
                  {patient.emergencyContact.relationship === 'spouse' ? 'Suami/Istri' :
                   patient.emergencyContact.relationship === 'parent' ? 'Orang Tua' :
                   patient.emergencyContact.relationship === 'child' ? 'Anak' :
                   patient.emergencyContact.relationship === 'sibling' ? 'Saudara Kandung' :
                   patient.emergencyContact.relationship === 'friend' ? 'Teman' :
                   patient.emergencyContact.relationship === 'other' ? 'Lainnya' : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telepon</label>
                <p className="text-gray-900">{patient.emergencyContact.phone}</p>
              </div>
              {patient.emergencyContact.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <p className="text-gray-900">{patient.emergencyContact.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kanker</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi Primer</label>
              <p className="text-gray-900">{patient.primaryCancerDiagnosis?.primarySite || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Laterality</label>
              <p className="text-gray-900">
                {patient.primaryCancerDiagnosis?.laterality === 'left' ? 'Kiri' :
                 patient.primaryCancerDiagnosis?.laterality === 'right' ? 'Kanan' :
                 patient.primaryCancerDiagnosis?.laterality === 'bilateral' ? 'Bilateral' :
                 patient.primaryCancerDiagnosis?.laterality === 'midline' ? 'Midline' :
                 patient.primaryCancerDiagnosis?.laterality === 'unknown' ? 'Tidak Diketahui' : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Morfologi</label>
              <p className="text-gray-900">{patient.primaryCancerDiagnosis?.morphology || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Perilaku</label>
              <p className="text-gray-900">
                {patient.primaryCancerDiagnosis?.behavior === 'benign' ? 'Jinak' :
                 patient.primaryCancerDiagnosis?.behavior === 'borderline' ? 'Batas' :
                 patient.primaryCancerDiagnosis?.behavior === 'invasive' ? 'Invasif' :
                 patient.primaryCancerDiagnosis?.behavior === 'in_situ' ? 'In Situ' : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stadium Kanker</label>
              <p className="text-gray-900">{patient.cancerStage || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grading</label>
              <p className="text-gray-900">{patient.cancerGrade || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Histologi</label>
              <p className="text-gray-900">{patient.histology || '-'}</p>
            </div>
          </div>

          {/* TNM Classification */}
          {patient.tnmClassification && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Klasifikasi TNM</label>
              <div className="bg-gray-50 p-3 rounded-lg inline-flex space-x-4">
                <span className="font-mono">T{patient.tnmClassification.t}</span>
                <span className="font-mono">N{patient.tnmClassification.n}</span>
                <span className="font-mono">M{patient.tnmClassification.m}</span>
              </div>
            </div>
          )}

          {/* Molecular Markers */}
          {patient.molecularMarkers && patient.molecularMarkers.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marker Molekuler</label>
              <div className="space-y-2">
                {patient.molecularMarkers.map((marker, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{marker.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        marker.result === 'positive' ? 'bg-green-100 text-green-800' :
                        marker.result === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {marker.result === 'positive' ? 'Positif' :
                         marker.result === 'negative' ? 'Negatif' : 'Tidak Diketahui'}
                      </span>
                    </div>
                    {marker.testDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tes: {formatDate(marker.testDate)}
                      </p>
                    )}
                    {marker.methodology && (
                      <p className="text-xs text-gray-500">
                        Metode: {marker.methodology}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Treatment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengobatan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Diagnosis</label>
              <p className="text-gray-900">{formatDate(patient.dateOfDiagnosis)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kunjungan Pertama</label>
              <p className="text-gray-900">{formatDate(patient.dateOfFirstVisit)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pusat Pengobatan</label>
              <p className="text-gray-900">{patient.treatmentCenter}</p>
            </div>
            {patient.treatmentCenterName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pusat</label>
                <p className="text-gray-900">{patient.treatmentCenterName}</p>
              </div>
            )}
            {patient.lastVisitDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Kunjungan Terakhir</label>
                <p className="text-gray-900">{formatDate(patient.lastVisitDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Deceased Information */}
        {patient.isDeceased && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Informasi Kematian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700">Tanggal Meninggal</label>
                <p className="text-red-900">{formatDate(patient.dateOfDeath || '')}</p>
              </div>
              {patient.causeOfDeath && (
                <div>
                  <label className="block text-sm font-medium text-red-700">Sebab Kematian</label>
                  <p className="text-red-900">{patient.causeOfDeath}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dibuat Oleh</label>
              <p className="text-gray-900">{patient.createdBy}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Dibuat</label>
              <p className="text-gray-900">{formatDate(patient.createdAt)}</p>
            </div>
            {patient.updatedBy && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Diperbarui Oleh</label>
                <p className="text-gray-900">{patient.updatedBy}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
              <p className="text-gray-900">{formatDate(patient.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deceased Modal */}
      {showDeceasedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tandai Pasien Meninggal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Meninggal *
                </label>
                <input
                  type="date"
                  value={deceasedData.dateOfDeath}
                  onChange={(e) => setDeceasedData(prev => ({ ...prev, dateOfDeath: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sebab Kematian
                </label>
                <textarea
                  value={deceasedData.causeOfDeath}
                  onChange={(e) => setDeceasedData(prev => ({ ...prev, causeOfDeath: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sebab kematian (opsional)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowDeceasedModal(false);
                  setDeceasedData({ dateOfDeath: '', causeOfDeath: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={handleMarkAsDeceased}
                disabled={!deceasedData.dateOfDeath}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}