'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  datasetUsed: string;
  doi: string;
  abstract: string;
}

export default function ResearchPublicationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [journalFilter, setJournalFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear().toString(),
    doi: '',
    abstract: '',
    datasetUsed: '',
  });

  const stats = {
    totalPublications: publications.length,
    totalCitations: publications.reduce((sum, p) => sum + p.citations, 0),
    avgImpactFactor: '3.45', // Mock value
    thisYear: publications.filter(p => p.year === new Date().getFullYear()).length,
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchPublications();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    let filtered = [...publications];

    if (yearFilter) {
      filtered = filtered.filter(p => p.year.toString() === yearFilter);
    }

    if (journalFilter) {
      filtered = filtered.filter(p => p.journal === journalFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authors.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPublications(filtered);
  }, [yearFilter, journalFilter, searchQuery, publications]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPublications: Publication[] = [
        {
          id: 'PUB-001',
          title: 'Survival Analysis of Stage II-III Breast Cancer Patients in Indonesian Population',
          authors: 'Siti Aminah, Ahmad Hartono, Bambang Sutrisno, et al.',
          journal: 'Asian Pacific Journal of Cancer Prevention',
          year: 2025,
          citations: 12,
          datasetUsed: 'INAMSOS Breast Cancer Registry 2020-2024',
          doi: '10.31557/APJCP.2025.26.1.123',
          abstract: 'Background: Breast cancer is the most common cancer among Indonesian women. This study analyzes survival rates and prognostic factors. Methods: Retrospective cohort study using INAMSOS registry data. Results: 5-year survival rate was 68% for stage II and 45% for stage III.',
        },
        {
          id: 'PUB-002',
          title: 'Epidemiological Trends of Lung Cancer in Indonesia: A 5-Year Analysis',
          authors: 'Eko Prasetyo, Ratna Dewi, Maya Sari',
          journal: 'The Lancet Regional Health - Western Pacific',
          year: 2025,
          citations: 28,
          datasetUsed: 'INAMSOS National Cancer Registry 2020-2024',
          doi: '10.1016/j.lanwpc.2025.100892',
          abstract: 'We analyzed 5-year epidemiological trends of lung cancer in Indonesia using national registry data. Incidence rates, histological types, and geographic distribution were examined. Significant regional variations were observed.',
        },
        {
          id: 'PUB-003',
          title: 'Cost-Effectiveness Analysis of Chemotherapy Protocols for Colorectal Cancer',
          authors: 'Budi Santoso, Dewi Lestari, Hendra Wijaya, et al.',
          journal: 'Journal of Clinical Oncology',
          year: 2024,
          citations: 45,
          datasetUsed: 'INAMSOS Colorectal Cancer Registry 2019-2023',
          doi: '10.1200/JCO.2024.42.16.2345',
          abstract: 'This study evaluates cost-effectiveness of different chemotherapy protocols for colorectal cancer in Indonesian healthcare setting. FOLFOX showed superior cost-effectiveness compared to other regimens.',
        },
        {
          id: 'PUB-004',
          title: 'Cervical Cancer Screening Patterns and Risk Factors in Young Indonesian Women',
          authors: 'Rina Kusuma, Lina Permata, Andry Hartono',
          journal: 'International Journal of Gynecological Cancer',
          year: 2024,
          citations: 34,
          datasetUsed: 'INAMSOS Cervical Cancer Registry 2018-2023',
          doi: '10.1136/ijgc-2024-005234',
          abstract: 'We investigated cervical cancer risk factors and screening patterns among women <35 years. Low screening uptake and high-risk HPV prevalence were identified as key concerns requiring targeted interventions.',
        },
        {
          id: 'PUB-005',
          title: 'Genetic Markers and Personalized Medicine in Hepatocellular Carcinoma',
          authors: 'Bambang Sutrisno, Ahmad Fauzi, Siti Aminah, et al.',
          journal: 'Nature Communications',
          year: 2024,
          citations: 67,
          datasetUsed: 'INAMSOS Liver Cancer Genomic Study 2021-2024',
          doi: '10.1038/s41467-024-48923-1',
          abstract: 'Comprehensive genomic profiling of hepatocellular carcinoma in Indonesian patients identified novel genetic markers associated with treatment response and prognosis, paving way for personalized medicine approaches.',
        },
        {
          id: 'PUB-006',
          title: 'Radiotherapy Outcomes in Head and Neck Cancer: Multi-center Study',
          authors: 'Eko Prasetyo, Ratna Dewi, Hendra Wijaya',
          journal: 'Radiotherapy and Oncology',
          year: 2024,
          citations: 23,
          datasetUsed: 'INAMSOS Head & Neck Cancer Registry 2020-2023',
          doi: '10.1016/j.radonc.2024.109876',
          abstract: 'Multi-center analysis of radiotherapy outcomes for head and neck cancer across 8 Indonesian cancer centers. Treatment adherence and outcomes were comparable to international standards.',
        },
        {
          id: 'PUB-007',
          title: 'Immunotherapy Efficacy in Advanced Non-Small Cell Lung Cancer',
          authors: 'Maya Sari, Andry Hartono, Bambang Sutrisno',
          journal: 'Journal of Thoracic Oncology',
          year: 2023,
          citations: 56,
          datasetUsed: 'INAMSOS Lung Cancer Immunotherapy Cohort 2020-2023',
          doi: '10.1016/j.jtho.2023.05.012',
          abstract: 'Real-world evidence of immunotherapy efficacy in advanced NSCLC patients from Indonesian population. Response rates and survival outcomes were analyzed with biomarker correlation.',
        },
        {
          id: 'PUB-008',
          title: 'Pediatric Leukemia Treatment Outcomes: National Registry Analysis',
          authors: 'Budi Santoso, Dewi Lestari, Rina Kusuma, et al.',
          journal: 'The Lancet Haematology',
          year: 2023,
          citations: 41,
          datasetUsed: 'INAMSOS Pediatric Cancer Registry 2018-2022',
          doi: '10.1016/S2352-3026(23)00156-8',
          abstract: 'Comprehensive analysis of pediatric leukemia treatment outcomes from Indonesian national registry. Five-year survival rates improved significantly over the study period, attributed to standardized protocols.',
        },
        {
          id: 'PUB-009',
          title: 'Palliative Care Integration in Cancer Treatment: Indonesian Experience',
          authors: 'Lina Permata, Ahmad Fauzi, Ratna Dewi',
          journal: 'Journal of Pain and Symptom Management',
          year: 2023,
          citations: 18,
          datasetUsed: 'INAMSOS Palliative Care Registry 2019-2022',
          doi: '10.1016/j.jpainsymman.2023.03.015',
          abstract: 'Evaluation of palliative care integration in cancer treatment across Indonesian cancer centers. Early palliative care improved quality of life and reduced hospital admissions.',
        },
        {
          id: 'PUB-010',
          title: 'Nutritional Status and Treatment Outcomes in Cancer Patients',
          authors: 'Siti Aminah, Budi Santoso, Maya Sari',
          journal: 'Clinical Nutrition',
          year: 2023,
          citations: 29,
          datasetUsed: 'INAMSOS Multi-cancer Registry 2019-2022',
          doi: '10.1016/j.clnu.2023.02.018',
          abstract: 'Impact of nutritional status on cancer treatment outcomes was assessed. Malnutrition was prevalent and significantly associated with worse treatment tolerance and survival outcomes.',
        },
      ];

      setPublications(mockPublications);
      setFilteredPublications(mockPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueYears = Array.from(new Set(publications.map(p => p.year))).sort((a, b) => b - a);
  const uniqueJournals = Array.from(new Set(publications.map(p => p.journal))).sort();

  const handleAddPublication = () => {
    setFormData({
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear().toString(),
      doi: '',
      abstract: '',
      datasetUsed: '',
    });
    setShowAddModal(true);
  };

  const handleSubmitPublication = () => {
    // Validation
    if (!formData.title || !formData.authors || !formData.journal ||
        !formData.year || !formData.doi || !formData.datasetUsed) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const newPublication: Publication = {
      id: `PUB-${String(publications.length + 1).padStart(3, '0')}`,
      title: formData.title,
      authors: formData.authors,
      journal: formData.journal,
      year: parseInt(formData.year),
      doi: formData.doi,
      abstract: formData.abstract,
      datasetUsed: formData.datasetUsed,
      citations: 0,
    };

    setPublications(prev => [newPublication, ...prev]);
    alert('Publikasi berhasil ditambahkan');
    setShowAddModal(false);
  };

  const handleDownloadCitation = (publication: Publication) => {
    const citation = `${publication.authors} (${publication.year}). ${publication.title}. ${publication.journal}. doi:${publication.doi}`;
    alert(`Sitasi:\n\n${citation}\n\nFitur download dalam format BibTeX/RIS akan segera diimplementasikan.`);
  };

  const handleResetFilters = () => {
    setYearFilter('');
    setJournalFilter('');
    setSearchQuery('');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Publikasi Penelitian</h1>
            <p className="text-gray-600">Publikasi yang menggunakan data INAMSOS</p>
          </div>
          <button
            onClick={handleAddPublication}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            + Tambah Publikasi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Publikasi</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPublications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sitasi</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCitations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Impact Factor</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgImpactFactor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tahun Ini</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.thisYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Semua Tahun</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Journal Filter */}
          <div>
            <select
              value={journalFilter}
              onChange={(e) => setJournalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Semua Jurnal</option>
              {uniqueJournals.map(journal => (
                <option key={journal} value={journal}>{journal}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(yearFilter || journalFilter || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Publikasi ({filteredPublications.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurnal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sitasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dataset INAMSOS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPublications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {publication.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {publication.authors}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {publication.journal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{publication.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {publication.citations}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {publication.datasetUsed}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Link
                      </a>
                      <button
                        onClick={() => handleDownloadCitation(publication)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Sitasi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada publikasi yang sesuai dengan filter</p>
          </div>
        )}
      </div>

      {/* Add Publication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tambah Publikasi</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Publikasi *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan judul publikasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penulis *
                  </label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: John Doe, Jane Smith, et al."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jurnal *
                    </label>
                    <input
                      type="text"
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nama jurnal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="2025"
                      min="1900"
                      max="2100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOI *
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10.1234/example.2025.123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dataset INAMSOS yang Digunakan *
                  </label>
                  <input
                    type="text"
                    value={formData.datasetUsed}
                    onChange={(e) => setFormData({ ...formData, datasetUsed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: INAMSOS Breast Cancer Registry 2020-2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan abstrak publikasi"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitPublication}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Tambah Publikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
