import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section2Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RELIGIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const EDUCATION_LEVELS = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];

export const Section2Identity: React.FC<Section2Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 2: Patient Identity</h2>
      <p className="text-gray-600 mb-6">
        Basic demographic and contact information
      </p>

      <div className="space-y-6">
        {/* Medical Record Number */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Record Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.medicalRecordNumber}
              onChange={(e) => updateFormData('medicalRecordNumber', e.target.value)}
              placeholder="MR-2025-00001"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.medicalRecordNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.medicalRecordNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.medicalRecordNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIK (Indonesian National ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nik}
              onChange={(e) => updateFormData('nik', e.target.value)}
              placeholder="3173051234567890"
              maxLength={16}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.nik ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nik && <p className="mt-1 text-sm text-red-500">{errors.nik}</p>}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter patient's full name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Date of Birth & Place */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Place of Birth
            </label>
            <input
              type="text"
              value={formData.placeOfBirth}
              onChange={(e) => updateFormData('placeOfBirth', e.target.value)}
              placeholder="e.g., Jakarta"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {GENDERS.map((gender) => (
              <label
                key={gender.value}
                className={`flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.gender === gender.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender.value}
                  checked={formData.gender === gender.value}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{gender.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
        </div>

        {/* Blood Type, Religion, Marital Status */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type
            </label>
            <select
              value={formData.bloodType || ''}
              onChange={(e) => updateFormData('bloodType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Religion
            </label>
            <select
              value={formData.religion || ''}
              onChange={(e) => updateFormData('religion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {RELIGIONS.map((religion) => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              value={formData.maritalStatus || ''}
              onChange={(e) => updateFormData('maritalStatus', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {MARITAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Occupation & Education */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              value={formData.occupation || ''}
              onChange={(e) => updateFormData('occupation', e.target.value)}
              placeholder="e.g., Teacher, Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level
            </label>
            <select
              value={formData.education || ''}
              onChange={(e) => updateFormData('education', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => updateFormData('phoneNumber', e.target.value)}
              placeholder="+628123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="patient@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address || ''}
            onChange={(e) => updateFormData('address', e.target.value)}
            placeholder="Full address"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
