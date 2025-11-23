'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface Researcher {
  id: string;
  name: string;
  institution: string;
  expertise: string[];
  publications: number;
  photo: string;
  email: string;
}

interface Project {
  id: string;
  title: string;
  members: number;
  datasets: number;
  status: 'Active' | 'Planning' | 'Completed';
  lastActivity: string;
  description: string;
  lead: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  institution: string;
}

export default function ResearchCollaborationPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [filteredResearchers, setFilteredResearchers] = useState<Researcher[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [collabMessage, setCollabMessage] = useState('');

  const stats = {
    activeProjects: activeProjects.filter(p => p.status === 'Active').length,
    collaborators: researchers.length,
    sharedDatasets: activeProjects.reduce((sum, p) => sum + p.datasets, 0),
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredResearchers(
        researchers.filter(r =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredResearchers(researchers);
    }
  }, [searchQuery, researchers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls

      const mockProjects: Project[] = [
        {
          id: 'PROJ-001',
          title: 'Studi Multi-center Kanker Payudara',
          members: 8,
          datasets: 3,
          status: 'Active',
          lastActivity: '2025-11-20',
          description: 'Kolaborasi penelitian kanker payudara melibatkan 5 rumah sakit di Indonesia',
          lead: 'Dr. Siti Rahayu',
        },
        {
          id: 'PROJ-002',
          title: 'Analisis Genomik Kanker Paru',
          members: 5,
          datasets: 2,
          status: 'Active',
          lastActivity: '2025-11-19',
          description: 'Penelitian genomik untuk identifikasi biomarker kanker paru',
          lead: 'Prof. Ahmad Wijaya',
        },
        {
          id: 'PROJ-003',
          title: 'Efektivitas Imunoterapi di Indonesia',
          members: 6,
          datasets: 4,
          status: 'Planning',
          lastActivity: '2025-11-18',
          description: 'Evaluasi efektivitas dan biaya imunoterapi pada berbagai jenis kanker',
          lead: 'Dr. Ratna Dewi',
        },
        {
          id: 'PROJ-004',
          title: 'Registry Kanker Anak Nasional',
          members: 12,
          datasets: 5,
          status: 'Completed',
          lastActivity: '2025-10-30',
          description: 'Pembentukan registry nasional untuk kanker anak',
          lead: 'Dr. Budi Santoso',
        },
      ];

      const mockResearchers: Researcher[] = [
        {
          id: 'RES-001',
          name: 'Prof. Dr. Andry Hartono, Sp.Onk',
          institution: 'Universitas Indonesia',
          expertise: ['Onkologi Medis', 'Kanker Payudara', 'Imunoterapi'],
          publications: 45,
          photo: 'https://ui-avatars.com/api/?name=Andry+Hartono&background=10b981&color=fff',
          email: 'andry.hartono@ui.ac.id',
        },
        {
          id: 'RES-002',
          name: 'Dr. Siti Aminah, M.Sc',
          institution: 'Universitas Gadjah Mada',
          expertise: ['Epidemiologi Kanker', 'Biostatistik', 'Data Science'],
          publications: 32,
          photo: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=3b82f6&color=fff',
          email: 'siti.aminah@ugm.ac.id',
        },
        {
          id: 'RES-003',
          name: 'Prof. Bambang Sutrisno, Ph.D',
          institution: 'Institut Teknologi Bandung',
          expertise: ['Bioinformatika', 'Genomik', 'Machine Learning'],
          publications: 58,
          photo: 'https://ui-avatars.com/api/?name=Bambang+Sutrisno&background=8b5cf6&color=fff',
          email: 'bambang.s@itb.ac.id',
        },
        {
          id: 'RES-004',
          name: 'Dr. Rina Kusuma, Sp.PA',
          institution: 'Universitas Airlangga',
          expertise: ['Patologi Anatomi', 'Histopatologi', 'Molekuler Patologi'],
          publications: 28,
          photo: 'https://ui-avatars.com/api/?name=Rina+Kusuma&background=ec4899&color=fff',
          email: 'rina.kusuma@unair.ac.id',
        },
        {
          id: 'RES-005',
          name: 'Prof. Dr. Eko Prasetyo, Sp.Rad(K)',
          institution: 'Universitas Padjadjaran',
          expertise: ['Radiologi Onkologi', 'Radioterapi', 'Imaging'],
          publications: 41,
          photo: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=f59e0b&color=fff',
          email: 'eko.prasetyo@unpad.ac.id',
        },
        {
          id: 'RES-006',
          name: 'Dr. Maya Sari, M.Biomed',
          institution: 'Universitas Hasanuddin',
          expertise: ['Biologi Molekuler', 'Cancer Biology', 'Stem Cell'],
          publications: 24,
          photo: 'https://ui-avatars.com/api/?name=Maya+Sari&background=14b8a6&color=fff',
          email: 'maya.sari@unhas.ac.id',
        },
        {
          id: 'RES-007',
          name: 'Prof. Hendra Wijaya, Ph.D',
          institution: 'Universitas Diponegoro',
          expertise: ['Onkologi Bedah', 'Surgical Oncology', 'Minimal Invasive'],
          publications: 36,
          photo: 'https://ui-avatars.com/api/?name=Hendra+Wijaya&background=6366f1&color=fff',
          email: 'hendra.w@undip.ac.id',
        },
        {
          id: 'RES-008',
          name: 'Dr. Lina Permata, Sp.KFR',
          institution: 'Universitas Brawijaya',
          expertise: ['Rehabilitasi Medik', 'Cancer Rehabilitation', 'Palliative Care'],
          publications: 19,
          photo: 'https://ui-avatars.com/api/?name=Lina+Permata&background=f43f5e&color=fff',
          email: 'lina.permata@ub.ac.id',
        },
      ];

      const mockTeam: TeamMember[] = [
        {
          id: 'TM-001',
          name: 'Dr. Ahmad Fauzi',
          role: 'Principal Investigator',
          institution: 'RS Cipto Mangunkusumo',
        },
        {
          id: 'TM-002',
          name: 'Dr. Dewi Lestari',
          role: 'Co-Investigator',
          institution: 'RS Dharmais',
        },
        {
          id: 'TM-003',
          name: 'Adi Nugroho, M.Sc',
          role: 'Data Analyst',
          institution: 'Universitas Indonesia',
        },
        {
          id: 'TM-004',
          name: 'Sari Wijayanti',
          role: 'Research Assistant',
          institution: 'RS Sardjito',
        },
      ];

      setActiveProjects(mockProjects);
      setResearchers(mockResearchers);
      setFilteredResearchers(mockResearchers);
      setTeamMembers(mockTeam);
    } catch (error) {
      console.error('Error fetching collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendCollabRequest = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setCollabMessage('');
    setShowCollabModal(true);
  };

  const handleSubmitCollabRequest = () => {
    if (!collabMessage.trim()) {
      alert('Mohon masukkan pesan kolaborasi');
      return;
    }

    alert(`Permintaan kolaborasi berhasil dikirim ke ${selectedResearcher?.name}!`);
    setShowCollabModal(false);
    setSelectedResearcher(null);
    setCollabMessage('');
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
        <h1 className="text-2xl font-bold text-gray-900">Kolaborasi Penelitian</h1>
        <p className="text-gray-600">Kelola kolaborasi penelitian dan jaringan peneliti</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Proyek Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kolaborator</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.collaborators}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dataset Dibagikan</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sharedDatasets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Proyek Aktif</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            + Proyek Baru
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="mr-4">Lead: {project.lead}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{project.members} anggota</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span>{project.datasets} dataset</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{project.lastActivity}</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Find Collaborators */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cari Kolaborator</h2>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, institusi, atau expertise..."
              className="flex-1 px-3 py-2 border-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Researchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResearchers.map((researcher) => (
            <div key={researcher.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  src={researcher.photo}
                  alt={researcher.name}
                  className="h-16 w-16 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{researcher.name}</h3>
                  <p className="text-sm text-gray-500">{researcher.institution}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {researcher.expertise.map((exp, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{researcher.publications} publikasi</span>
                </div>
              </div>

              <button
                onClick={() => handleSendCollabRequest(researcher)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Kirim Permintaan
              </button>
            </div>
          ))}
        </div>

        {filteredResearchers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada peneliti yang sesuai dengan pencarian</p>
          </div>
        )}
      </div>

      {/* My Team */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tim Penelitian Saya</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.institution}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 font-medium mr-3">
                      Profil
                    </button>
                    <button className="text-green-600 hover:text-green-900 font-medium">
                      Kontak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collaboration Request Modal */}
      {showCollabModal && selectedResearcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Kirim Permintaan Kolaborasi</h2>
                <button
                  onClick={() => setShowCollabModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <img
                    src={selectedResearcher.photo}
                    alt={selectedResearcher.name}
                    className="h-12 w-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedResearcher.name}</p>
                    <p className="text-sm text-gray-500">{selectedResearcher.institution}</p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan Kolaborasi *
                </label>
                <textarea
                  value={collabMessage}
                  onChange={(e) => setCollabMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jelaskan proposal kolaborasi Anda, topik penelitian, dan bagaimana Anda ingin berkolaborasi..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCollabModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitCollabRequest}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Kirim Permintaan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
