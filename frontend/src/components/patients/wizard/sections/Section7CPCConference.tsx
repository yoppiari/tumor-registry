'use client';

import React from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 7: CPC (Clinico-Pathological Conference)
 *
 * INAMSOS ORIGINAL FIELDS (SIMPLE):
 * - Tanggal
 * - Konsultan hadir
 * - Keputusan
 */

interface Section7Data {
  cpcDate?: string;           // Tanggal
  consultantsPresent?: string; // Konsultan hadir
  decision?: string;           // Keputusan
}

export function Section7CPCConference() {
  const { getSection, updateSection } = useFormContext();
  const savedData = (getSection('section7') as Partial<Section7Data>) || {};

  const sectionData: Partial<Section7Data> = {
    cpcDate: savedData.cpcDate || '',
    consultantsPresent: savedData.consultantsPresent || '',
    decision: savedData.decision || '',
  };

  const updateField = <K extends keyof Section7Data>(field: K, value: Section7Data[K]) => {
    updateSection('section7', {
      ...sectionData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          CPC (Clinico-Pathological Conference)
        </h2>
        <p className="text-gray-600">
          Dokumentasi konferensi klinis-patologis untuk kasus ini
        </p>
      </div>

      {/* Simple CPC Form - As per INAMSOS Document */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Tanggal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal
          </label>
          <input
            type="date"
            value={sectionData.cpcDate || ''}
            onChange={(e) => updateField('cpcDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Tanggal pelaksanaan CPC
          </p>
        </div>

        {/* Konsultan hadir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konsultan Hadir
          </label>
          <textarea
            value={sectionData.consultantsPresent || ''}
            onChange={(e) => updateField('consultantsPresent', e.target.value)}
            rows={4}
            placeholder="Contoh:&#10;1. Dr. Ahmad Sutanto, Sp.OT(K)Onk - Konsultan Ortopedi Onkologi&#10;2. Dr. Siti Rahayu, Sp.PA - Konsultan Patologi Anatomi&#10;3. Dr. Budi Santoso, Sp.Rad(K)Onk - Konsultan Radiologi Onkologi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Daftar nama konsultan yang hadir dalam CPC
          </p>
        </div>

        {/* Keputusan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keputusan
          </label>
          <textarea
            value={sectionData.decision || ''}
            onChange={(e) => updateField('decision', e.target.value)}
            rows={6}
            placeholder="Contoh:&#10;Keputusan CPC:&#10;1. Diagnosis: Osteosarcoma femur distal kanan stadium IIB&#10;2. Rencana terapi:&#10;   - Kemoterapi neo-adjuvant (protokol MAP) 3 siklus&#10;   - Wide excision dengan limb salvage reconstruction&#10;   - Kemoterapi adjuvant 3 siklus&#10;3. Follow-up: Evaluasi setiap 3 bulan tahun pertama"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Keputusan dan rekomendasi dari CPC
          </p>
        </div>
      </div>

      {/* Optional Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Catatan:</p>
            <p>CPC adalah forum multidisiplin untuk mendiskusikan diagnosis dan rencana terapi kasus tumor muskuloskeletal. Keputusan CPC menjadi acuan utama dalam penatalaksanaan pasien.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
