import React, { useState } from 'react';
import { SectionProps } from '../MultiStepWizard';

/**
 * Section 10: Review & Submit
 *
 * Final review section that displays all collected data
 * organized by section for user verification before submission
 */

export const Section10Review: React.FC<SectionProps> = ({ data, isActive }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['section1', 'section2']) // Default expanded sections
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedSections(
      new Set([
        'section1',
        'section2',
        'section3',
        'section4',
        'section5',
        'section6',
        'section7',
        'section8',
        'section9',
      ])
    );
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Helper to safely access nested data
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Helper to format values
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Section configurations
  const reviewSections = [
    {
      id: 'section1',
      title: 'Center & Pathology Type',
      icon: '🏥',
      fields: [
        { label: 'Center', key: 'centerId' },
        { label: 'Pathology Type', key: 'pathologyType' },
        { label: 'Subspecialist', key: 'subspecialistName' },
        { label: 'Entry Date', key: 'entryDate' },
      ],
    },
    {
      id: 'section2',
      title: 'Patient Identity',
      icon: '👤',
      fields: [
        { label: 'Medical Record Number', key: 'medicalRecordNumber' },
        { label: 'NIK', key: 'nik' },
        { label: 'Name', key: 'name' },
        { label: 'Date of Birth', key: 'dateOfBirth' },
        { label: 'Place of Birth', key: 'placeOfBirth' },
        { label: 'Gender', key: 'gender' },
        { label: 'Blood Type', key: 'bloodType' },
        { label: 'Religion', key: 'religion' },
        { label: 'Marital Status', key: 'maritalStatus' },
        { label: 'Occupation', key: 'occupation' },
        { label: 'Education', key: 'education' },
        { label: 'Phone Number', key: 'phoneNumber' },
        { label: 'Email', key: 'email' },
        { label: 'Address', key: 'address' },
        { label: 'Province', key: 'province' },
        { label: 'Regency', key: 'regency' },
        { label: 'District', key: 'district' },
        { label: 'Village', key: 'village' },
        { label: 'Postal Code', key: 'postalCode' },
      ],
    },
    {
      id: 'section3',
      title: 'Clinical Data',
      icon: '🩺',
      fields: [
        { label: 'Chief Complaint', key: 'chiefComplaint' },
        { label: 'Onset Date', key: 'onsetDate' },
        { label: 'Symptom Duration (months)', key: 'symptomDuration' },
        { label: 'Presenting Symptoms', key: 'presentingSymptoms' },
        { label: 'Tumor Size at Presentation (cm)', key: 'tumorSizeAtPresentation' },
        { label: 'Family History of Cancer', key: 'familyHistoryCancer' },
        { label: 'Tumor Syndrome', key: 'tumorSyndromeId' },
        { label: 'Karnofsky Performance Score', key: 'karnofskysScore' },
      ],
    },
    {
      id: 'section4',
      title: 'Diagnostic Investigations',
      icon: '🔬',
      fields: [
        { label: 'Biopsy Date', key: 'biopsyDate' },
        { label: 'Biopsy Type', key: 'biopsyType' },
        { label: 'Biopsy Result', key: 'biopsyResult' },
        { label: 'Imaging Studies', key: 'imagingStudies' },
      ],
    },
    {
      id: 'section5',
      title: 'Diagnosis & Location',
      icon: '📋',
      fields: [
        { label: 'WHO Bone Tumor Classification', key: 'whoBoneTumorId' },
        { label: 'WHO Soft Tissue Tumor Classification', key: 'whoSoftTissueTumorId' },
        { label: 'Bone Location', key: 'boneLocationId' },
        { label: 'Soft Tissue Location', key: 'softTissueLocationId' },
        { label: 'Histopathology Grade', key: 'histopathologyGrade' },
        { label: 'Histopathology Details', key: 'histopathologyDetails' },
      ],
    },
    {
      id: 'section6',
      title: 'Staging',
      icon: '📊',
      fields: [
        { label: 'Enneking Stage', key: 'ennekingStage' },
        { label: 'AJCC Stage', key: 'ajccStage' },
        { label: 'Metastasis Present', key: 'metastasisPresent' },
        { label: 'Metastasis Sites', key: 'metastasisSites' },
      ],
    },
    {
      id: 'section7',
      title: 'CPC Conference',
      icon: '💬',
      fields: [
        { label: 'CPC Date', key: 'cpcDate' },
        { label: 'CPC Attendees', key: 'cpcAttendees' },
        { label: 'Case Summary', key: 'cpcCaseSummary' },
        { label: 'Recommended Treatment', key: 'cpcRecommendedTreatment' },
        { label: 'Treatment Plan', key: 'cpcTreatmentPlan' },
        { label: 'CPC Decision', key: 'cpcDecision' },
        { label: 'Notes', key: 'cpcNotes' },
        { label: 'Next Review Date', key: 'cpcNextReviewDate' },
      ],
    },
    {
      id: 'section8',
      title: 'Treatment Management',
      icon: '💊',
      fields: [
        { label: 'Treatment Start Date', key: 'treatmentStartDate' },
        { label: 'Treatment End Date', key: 'treatmentEndDate' },
        { label: 'Surgery Date', key: 'surgeryDate' },
        { label: 'Surgery Type', key: 'surgeryType' },
        { label: 'Surgery Details', key: 'surgeryDetails' },
        { label: 'Chemotherapy Protocol', key: 'chemotherapyProtocol' },
        { label: 'Chemotherapy Cycles', key: 'chemotherapyCycles' },
        { label: 'Radiotherapy Dose', key: 'radiotherapyDose' },
        { label: 'Radiotherapy Fractions', key: 'radiotherapyFractions' },
        { label: 'Treatment Response', key: 'treatmentResponse' },
        { label: 'Complications', key: 'complications' },
        { label: 'Adverse Events', key: 'adverseEvents' },
      ],
    },
    {
      id: 'section9',
      title: 'Follow-up Plan',
      icon: '📅',
      fields: [
        { label: 'Follow-up Schedule', key: 'followUpSchedule' },
        { label: 'Next Follow-up Date', key: 'nextFollowUpDate' },
        { label: 'Monitoring Plan', key: 'monitoringPlan' },
        { label: 'Imaging Follow-up', key: 'imagingFollowUp' },
        { label: 'Lab Follow-up', key: 'labFollowUp' },
        { label: 'Quality of Life', key: 'qualityOfLife' },
        { label: 'Functional Status', key: 'functionalStatus' },
        { label: 'Survival Status', key: 'survivalStatus' },
        { label: 'Date of Last Contact', key: 'dateOfLastContact' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Patient Registration
        </h2>
        <p className="text-gray-700">
          Please carefully review all information before submitting. You can navigate back to any
          section to make changes if needed.
        </p>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Expand All
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {reviewSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionData = data[section.id] || {};
          const hasData = section.fields.some((field) => {
            const value = getNestedValue(sectionData, field.key);
            return value !== null && value !== undefined && value !== '';
          });

          return (
            <div
              key={section.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    {!hasData && (
                      <p className="text-sm text-gray-500">No data entered</p>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const value = getNestedValue(sectionData, field.key);
                      const displayValue = formatValue(value);
                      const isEmpty = displayValue === '—';

                      return (
                        <div key={field.key} className="flex flex-col">
                          <dt className="text-sm font-medium text-gray-600 mb-1">
                            {field.label}
                          </dt>
                          <dd
                            className={`text-sm ${
                              isEmpty ? 'text-gray-400 italic' : 'text-gray-900'
                            }`}
                          >
                            {displayValue}
                          </dd>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> Please verify all information is accurate before
              submitting. You can use the sidebar navigation or "Previous" button to go back and
              edit any section.
            </p>
          </div>
        </div>
      </div>

      {/* Data Quality Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Data Completeness</h4>
        <div className="space-y-2">
          {reviewSections.map((section) => {
            const sectionData = data[section.id] || {};
            const totalFields = section.fields.length;
            const filledFields = section.fields.filter((field) => {
              const value = getNestedValue(sectionData, field.key);
              return value !== null && value !== undefined && value !== '';
            }).length;
            const percentage = Math.round((filledFields / totalFields) * 100);

            return (
              <div key={section.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{section.title}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage === 100
                          ? 'bg-green-500'
                          : percentage >= 50
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
