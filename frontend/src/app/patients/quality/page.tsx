'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';

export default function QualityCheckPage() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const mockIssues = [
    {
      id: 1,
      patientId: 'P001',
      patientName: 'John Doe',
      issue: 'Data diagnosis tidak lengkap',
      severity: 'high',
      field: 'diagnosis.stage',
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Jane Smith',
      issue: 'Tanggal lahir tidak valid',
      severity: 'medium',
      field: 'personalInfo.birthDate',
    },
    {
      id: 3,
      patientId: 'P003',
      patientName: 'Bob Johnson',
      issue: 'NIK duplikat ditemukan',
      severity: 'high',
      field: 'personalInfo.nik',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quality Check Data Pasien</h1>
        <p className="text-gray-600">Validasi dan verifikasi kualitas data pasien</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Patients</div>
          <div className="text-2xl font-bold text-gray-900">1,247</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Quality Issues</div>
          <div className="text-2xl font-bold text-red-600">23</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">12</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Data Quality Score</div>
          <div className="text-2xl font-bold text-green-600">94%</div>
        </div>
      </div>

      {/* Quality Issues Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Data Quality Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {issue.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.patientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{issue.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">{issue.field}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-emerald-600 hover:text-emerald-900 mr-3">
                      Review
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">Fix</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Quality Check Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
          Run Quality Check
        </button>
      </div>
    </Layout>
  );
}
