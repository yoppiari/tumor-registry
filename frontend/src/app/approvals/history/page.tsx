'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

interface ApprovalHistory {
  id: string;
  requestId: string;
  title: string;
  requester: string;
  institution: string;
  submittedDate: string;
  decisionDate: string;
  status: 'approved' | 'rejected' | 'expired' | 'revoked';
  decidedBy: string;
  approvalNotes?: string;
  rejectionReason?: string;
  dataType: string;
  purpose: string;
  requestDetails: string;
  timeline: {
    event: string;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
}

export default function ApprovalsHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalProcessed: 0,
    approved: 0,
    rejected: 0,
    avgDecisionTime: '',
  });
  const [history, setHistory] = useState<ApprovalHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalHistory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDecisionMaker, setFilterDecisionMaker] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isAuthenticated) {
      fetchHistoryData();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    filterData();
  }, [filterStatus, filterDecisionMaker, filterDateRange, searchQuery, history]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockHistory: ApprovalHistory[] = [
        {
          id: 'APH001',
          requestId: 'REQ2025-048',
          title: 'Studi Korelasi Faktor Risiko Kanker Payudara di Indonesia',
          requester: 'Dr. Siti Rahmawati, M.Kes',
          institution: 'Universitas Indonesia - Fakultas Kesehatan Masyarakat',
          submittedDate: '2025-11-15',
          decisionDate: '2025-11-18',
          status: 'approved',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          approvalNotes: 'Proposal penelitian sangat baik dengan metodologi yang kuat. Data yang diminta sesuai dengan tujuan penelitian. Telah memenuhi semua persyaratan etik penelitian.',
          dataType: 'Demografis, Klinis, Histologi, Follow-up',
          purpose: 'Penelitian Akademik - Disertasi S3',
          requestDetails: 'Penelitian ini bertujuan mengidentifikasi faktor risiko utama kanker payudara pada populasi Indonesia dengan fokus pada variabel demografis, genetik, dan gaya hidup.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-11-15 09:30', actor: 'Dr. Siti Rahmawati' },
            { event: 'Dokumen Dilengkapi', timestamp: '2025-11-15 14:20', actor: 'Dr. Siti Rahmawati', notes: 'Surat rekomendasi pembimbing dan persetujuan etik ditambahkan' },
            { event: 'Review Dimulai', timestamp: '2025-11-16 08:15', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Klarifikasi Diminta', timestamp: '2025-11-17 10:00', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Meminta penjelasan lebih detail tentang metode sampling' },
            { event: 'Respon Klarifikasi', timestamp: '2025-11-17 15:45', actor: 'Dr. Siti Rahmawati' },
            { event: 'Disetujui', timestamp: '2025-11-18 11:30', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
        {
          id: 'APH002',
          requestId: 'REQ2025-047',
          title: 'Analisis Survival Rate Pasien Kanker Paru Stadium Lanjut',
          requester: 'Dr. Budi Santoso, Sp.P(K)',
          institution: 'RS Kanker Dharmais Jakarta',
          submittedDate: '2025-11-10',
          decisionDate: '2025-11-14',
          status: 'approved',
          decidedBy: 'Dr. Ratna Dewi Kusuma',
          approvalNotes: 'Penelitian klinis yang relevan untuk meningkatkan protokol treatment. Akses data pasien disetujui dengan ketentuan anonymization yang ketat.',
          dataType: 'Klinis, Treatment, Follow-up, Outcome',
          purpose: 'Clinical Trial - Evaluasi Protokol Treatment',
          requestDetails: 'Evaluasi efektivitas protokol treatment terbaru untuk kanker paru stadium lanjut dengan membandingkan survival rate dan quality of life pasien.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-11-10 13:20', actor: 'Dr. Budi Santoso' },
            { event: 'Review Dimulai', timestamp: '2025-11-11 09:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Konsultasi Komite Etik', timestamp: '2025-11-12 14:00', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Dikonsultasikan dengan komite etik rumah sakit' },
            { event: 'Disetujui dengan Syarat', timestamp: '2025-11-14 10:15', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Disetujui dengan syarat laporan progress setiap 3 bulan' },
          ],
        },
        {
          id: 'APH003',
          requestId: 'REQ2025-046',
          title: 'Studi Pola Metastasis Kanker Kolorektal',
          requester: 'Dr. Eko Prasetyo',
          institution: 'Universitas Gadjah Mada - FK',
          submittedDate: '2025-11-08',
          decisionDate: '2025-11-12',
          status: 'rejected',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          rejectionReason: 'Metodologi penelitian belum cukup detail. Informed consent untuk penggunaan data retrospektif belum terdokumentasi dengan baik. Silakan lengkapi dokumen dan ajukan kembali.',
          dataType: 'Klinis, Imaging, Histologi',
          purpose: 'Penelitian Akademik - Tesis S2',
          requestDetails: 'Menganalisis pola metastasis kanker kolorektal berdasarkan data imaging dan histologi untuk prediksi prognosis.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-11-08 11:00', actor: 'Dr. Eko Prasetyo' },
            { event: 'Review Dimulai', timestamp: '2025-11-09 08:30', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Dokumen Kurang Lengkap', timestamp: '2025-11-10 14:20', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Informed consent dan approval etik belum dilampirkan' },
            { event: 'Ditolak', timestamp: '2025-11-12 09:45', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
        {
          id: 'APH004',
          requestId: 'REQ2025-045',
          title: 'Evaluasi Quality of Life Pasca Kemoterapi',
          requester: 'Dr. Maya Indah Sari',
          institution: 'Universitas Airlangga - PSSKM',
          submittedDate: '2025-11-05',
          decisionDate: '2025-11-20',
          status: 'expired',
          decidedBy: '-',
          rejectionReason: 'Permintaan expired karena peneliti tidak merespon permintaan klarifikasi dalam waktu yang ditentukan (14 hari).',
          dataType: 'Follow-up, Patient-Reported Outcome',
          purpose: 'Penelitian Akademik - Tesis S2',
          requestDetails: 'Mengukur quality of life pasien kanker pasca kemoterapi menggunakan kuesioner terstandarisasi.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-11-05 10:15', actor: 'Dr. Maya Indah Sari' },
            { event: 'Review Dimulai', timestamp: '2025-11-06 09:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Klarifikasi Diminta', timestamp: '2025-11-07 11:30', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Meminta detail instrumen penelitian dan timeline' },
            { event: 'Reminder Dikirim', timestamp: '2025-11-14 10:00', actor: 'Sistem', notes: 'Reminder otomatis - batas waktu 6 hari lagi' },
            { event: 'Expired', timestamp: '2025-11-20 23:59', actor: 'Sistem', notes: 'Tidak ada respon dalam 14 hari' },
          ],
        },
        {
          id: 'APH005',
          requestId: 'REQ2025-044',
          title: 'Analisis Genetic Markers Kanker Serviks pada Populasi Jawa',
          requester: 'Prof. Dr. Hadi Susanto, M.Sc',
          institution: 'Institut Teknologi Bandung - SITH',
          submittedDate: '2025-11-01',
          decisionDate: '2025-11-05',
          status: 'approved',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          approvalNotes: 'Penelitian genomik yang sangat penting untuk populasi Indonesia. Proposal excellent dengan track record peneliti yang kuat. Disetujui penuh.',
          dataType: 'Molekuler, Genetik, Histologi, Demografis',
          purpose: 'Penelitian Dasar - Grant Nasional',
          requestDetails: 'Identifikasi genetic markers spesifik pada pasien kanker serviks populasi Jawa untuk pengembangan early detection tools.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-11-01 08:00', actor: 'Prof. Dr. Hadi Susanto' },
            { event: 'Fast Track Review', timestamp: '2025-11-01 09:30', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Priority review - peneliti senior dengan grant nasional' },
            { event: 'Review Selesai', timestamp: '2025-11-02 16:00', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Disetujui', timestamp: '2025-11-05 10:00', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
        {
          id: 'APH006',
          requestId: 'REQ2025-043',
          title: 'Studi Epidemiologi Kanker Anak di Indonesia',
          requester: 'Dr. Dewi Kartika',
          institution: 'Universitas Indonesia - FKUI',
          submittedDate: '2025-10-28',
          decisionDate: '2025-11-02',
          status: 'approved',
          decidedBy: 'Dr. Ratna Dewi Kusuma',
          approvalNotes: 'Penelitian penting untuk data kanker pediatrik nasional. Disetujui dengan catatan special handling untuk data anak-anak.',
          dataType: 'Demografis, Klinis, Epidemiologi',
          purpose: 'Penelitian Akademik - Publikasi Journal',
          requestDetails: 'Analisis epidemiologi kanker anak mencakup distribusi, trend, dan faktor risiko untuk penyusunan strategi preventif nasional.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-10-28 14:30', actor: 'Dr. Dewi Kartika' },
            { event: 'Review Dimulai', timestamp: '2025-10-29 09:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Konsultasi Tim', timestamp: '2025-10-30 10:00', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Meeting dengan pediatric oncology team' },
            { event: 'Disetujui dengan Ketentuan', timestamp: '2025-11-02 11:20', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Extra anonymization untuk data pediatrik' },
          ],
        },
        {
          id: 'APH007',
          requestId: 'REQ2025-042',
          title: 'Evaluasi Cost-Effectiveness Treatment Kanker Payudara',
          requester: 'Dr. Rina Handayani',
          institution: 'Kementerian Kesehatan RI - Puslitbang',
          submittedDate: '2025-10-25',
          decisionDate: '2025-10-28',
          status: 'rejected',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          rejectionReason: 'Data biaya treatment bersifat sensitif dan memerlukan approval khusus dari masing-masing center. Silakan ajukan request terpisah ke setiap center dengan MoU formal.',
          dataType: 'Treatment, Outcome, Cost Data',
          purpose: 'Policy Research - Pemerintah',
          requestDetails: 'Analisis cost-effectiveness berbagai protokol treatment kanker payudara untuk rekomendasi kebijakan JKN.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-10-25 09:15', actor: 'Dr. Rina Handayani' },
            { event: 'Review Dimulai', timestamp: '2025-10-26 08:00', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Konsultasi Legal', timestamp: '2025-10-27 14:00', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Konsultasi dengan tim legal terkait data cost' },
            { event: 'Ditolak', timestamp: '2025-10-28 10:30', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
        {
          id: 'APH008',
          requestId: 'REQ2025-041',
          title: 'Penelitian Biomarker Prediktif Response Imunoterapi',
          requester: 'Dr. Fajar Nugroho, Ph.D',
          institution: 'Universitas Padjadjaran - FMIPA',
          submittedDate: '2025-10-20',
          decisionDate: '2025-10-25',
          status: 'approved',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          approvalNotes: 'Penelitian cutting-edge dengan potential impact tinggi. Tim peneliti kompeten dengan fasilitas laboratorium memadai. Disetujui.',
          dataType: 'Molekuler, Treatment, Outcome, Tissue Samples',
          purpose: 'Penelitian Dasar - Kolaborasi Internasional',
          requestDetails: 'Identifikasi biomarker yang dapat memprediksi respon pasien terhadap imunoterapi untuk personalized medicine.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-10-20 11:00', actor: 'Dr. Fajar Nugroho' },
            { event: 'Review Dimulai', timestamp: '2025-10-21 08:30', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Site Visit Request', timestamp: '2025-10-22 10:00', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Kunjungan ke lab untuk verifikasi fasilitas' },
            { event: 'Site Visit Completed', timestamp: '2025-10-23 14:00', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Fasilitas lab sangat memadai' },
            { event: 'Disetujui', timestamp: '2025-10-25 09:00', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
        {
          id: 'APH009',
          requestId: 'REQ2025-040',
          title: 'Analisis Trend Kanker Nasofaring di Sumatera',
          requester: 'Dr. Linda Wijaya',
          institution: 'Universitas Sumatera Utara - FK',
          submittedDate: '2025-10-15',
          decisionDate: '2025-11-01',
          status: 'revoked',
          decidedBy: 'Dr. Ratna Dewi Kusuma',
          rejectionReason: 'Approval dicabut karena ditemukan pelanggaran protokol penggunaan data. Peneliti membagikan raw data ke pihak ketiga tanpa izin.',
          dataType: 'Demografis, Epidemiologi, Klinis',
          purpose: 'Penelitian Akademik - Publikasi',
          requestDetails: 'Analisis trend insidensi dan karakteristik kanker nasofaring di wilayah Sumatera selama 10 tahun terakhir.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-10-15 10:30', actor: 'Dr. Linda Wijaya' },
            { event: 'Review Dimulai', timestamp: '2025-10-16 08:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Disetujui', timestamp: '2025-10-20 11:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Data Access Granted', timestamp: '2025-10-21 09:00', actor: 'Sistem' },
            { event: 'Pelanggaran Terdeteksi', timestamp: '2025-10-30 15:20', actor: 'Sistem Audit', notes: 'Data sharing unauthorized terdeteksi' },
            { event: 'Investigasi Dimulai', timestamp: '2025-10-30 16:00', actor: 'Dr. Ratna Dewi Kusuma' },
            { event: 'Approval Dicabut', timestamp: '2025-11-01 10:00', actor: 'Dr. Ratna Dewi Kusuma', notes: 'Access terminated, case reported' },
          ],
        },
        {
          id: 'APH010',
          requestId: 'REQ2025-039',
          title: 'Studi Komparatif Treatment Outcome Berbagai Center',
          requester: 'Prof. Dr. Bambang Sutrisno',
          institution: 'Universitas Airlangga - FK',
          submittedDate: '2025-10-10',
          decisionDate: '2025-10-15',
          status: 'approved',
          decidedBy: 'Prof. Dr. Ahmad Hidayat',
          approvalNotes: 'Penelitian benchmarking yang sangat bermanfaat untuk quality improvement. Approved dengan syarat hasil akan dishare ke semua participating centers.',
          dataType: 'Treatment, Outcome, Center Performance',
          purpose: 'Quality Improvement - Multi Center',
          requestDetails: 'Perbandingan treatment outcome antar cancer centers untuk identifikasi best practices dan quality improvement.',
          timeline: [
            { event: 'Permintaan Diajukan', timestamp: '2025-10-10 09:00', actor: 'Prof. Dr. Bambang Sutrisno' },
            { event: 'Multi-Center Coordination', timestamp: '2025-10-11 10:00', actor: 'Prof. Dr. Ahmad Hidayat', notes: 'Koordinasi dengan 5 cancer centers' },
            { event: 'MoU Preparation', timestamp: '2025-10-12 14:00', actor: 'Tim Legal', notes: 'Penyusunan MoU multi-center' },
            { event: 'Semua Center Setuju', timestamp: '2025-10-14 16:00', actor: 'Prof. Dr. Ahmad Hidayat' },
            { event: 'Disetujui', timestamp: '2025-10-15 10:00', actor: 'Prof. Dr. Ahmad Hidayat' },
          ],
        },
      ];

      setHistory(mockHistory);
      setFilteredHistory(mockHistory);

      // Calculate stats
      const approved = mockHistory.filter(h => h.status === 'approved').length;
      const rejected = mockHistory.filter(h => h.status === 'rejected').length;
      const totalProcessed = mockHistory.length;

      // Calculate average decision time
      let totalDays = 0;
      let validEntries = 0;
      mockHistory.forEach(h => {
        if (h.decisionDate && h.decisionDate !== '-') {
          const submitted = new Date(h.submittedDate);
          const decided = new Date(h.decisionDate);
          const days = Math.floor((decided.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
          totalDays += days;
          validEntries++;
        }
      });
      const avgDays = validEntries > 0 ? Math.round(totalDays / validEntries) : 0;

      setStats({
        totalProcessed,
        approved,
        rejected,
        avgDecisionTime: `${avgDays} hari`,
      });
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...history];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(h => h.status === filterStatus);
    }

    // Filter by decision maker
    if (filterDecisionMaker !== 'all') {
      filtered = filtered.filter(h => h.decidedBy === filterDecisionMaker);
    }

    // Filter by date range
    if (filterDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filterDateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(h => new Date(h.decisionDate) >= filterDate);
    }

    // Search by title or requester
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(query) ||
        h.requester.toLowerCase().includes(query) ||
        h.institution.toLowerCase().includes(query)
      );
    }

    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewDetails = (record: ApprovalHistory) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleExportHistory = () => {
    // Create CSV content
    const headers = ['Request ID', 'Title', 'Requester', 'Institution', 'Submitted Date', 'Decision Date', 'Status', 'Decided By'];
    const rows = filteredHistory.map(h => [
      h.requestId,
      h.title,
      h.requester,
      h.institution,
      h.submittedDate,
      h.decisionDate,
      getStatusText(h.status),
      h.decidedBy,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approvals_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      case 'revoked': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      case 'expired': return 'Kadaluarsa';
      case 'revoked': return 'Dicabut';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique decision makers for filter
  const decisionMakers = Array.from(new Set(history.map(h => h.decidedBy).filter(d => d !== '-')));

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Persetujuan</h1>
          <p className="text-gray-600">Histori keputusan persetujuan akses data penelitian</p>
        </div>
        <button
          onClick={handleExportHistory}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export Riwayat</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Diproses</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProcessed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rata-rata Waktu</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgDecisionTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
            <input
              type="text"
              placeholder="Judul atau peneliti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
              <option value="expired">Kadaluarsa</option>
              <option value="revoked">Dicabut</option>
            </select>
          </div>

          {/* Decision Maker Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pembuat Keputusan</label>
            <select
              value={filterDecisionMaker}
              onChange={(e) => setFilterDecisionMaker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua</option>
              {decisionMakers.map(dm => (
                <option key={dm} value={dm}>{dm}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Waktu</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Waktu</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
              <option value="quarter">3 Bulan Terakhir</option>
              <option value="year">1 Tahun Terakhir</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredHistory.length}</span> dari{' '}
            <span className="font-semibold">{history.length}</span> riwayat
          </p>
          {(filterStatus !== 'all' || filterDecisionMaker !== 'all' || filterDateRange !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterDecisionMaker('all');
                setFilterDateRange('all');
                setSearchQuery('');
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Penelitian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peneliti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Ajuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Keputusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diputuskan Oleh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.requestId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{record.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.requester}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{record.institution}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.submittedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.decisionDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.decidedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500">Tidak ada riwayat yang cocok dengan filter</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Halaman <span className="font-medium">{currentPage}</span> dari{' '}
                <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Detail Riwayat Persetujuan</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusText(selectedRecord.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Request ID: {selectedRecord.requestId}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Request Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Judul Penelitian</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tujuan Penelitian</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Peneliti</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.requester}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Institusi</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Jenis Data yang Diminta</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.dataType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diputuskan Oleh</label>
                    <p className="text-gray-900 mt-1">{selectedRecord.decidedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Pengajuan</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedRecord.submittedDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tanggal Keputusan</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedRecord.decisionDate)}</p>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Detail Permintaan</label>
                  <p className="text-gray-900 mt-1">{selectedRecord.requestDetails}</p>
                </div>

                {/* Decision Notes */}
                {selectedRecord.status === 'approved' && selectedRecord.approvalNotes && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-green-800">Catatan Persetujuan</label>
                    <p className="text-green-900 mt-1">{selectedRecord.approvalNotes}</p>
                  </div>
                )}

                {(selectedRecord.status === 'rejected' || selectedRecord.status === 'expired' || selectedRecord.status === 'revoked') && selectedRecord.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-red-800">
                      {selectedRecord.status === 'rejected' ? 'Alasan Penolakan' :
                       selectedRecord.status === 'revoked' ? 'Alasan Pencabutan' : 'Keterangan'}
                    </label>
                    <p className="text-red-900 mt-1">{selectedRecord.rejectionReason}</p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline Proses</h4>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {selectedRecord.timeline.map((event, idx) => (
                        <li key={idx}>
                          <div className="relative pb-8">
                            {idx !== selectedRecord.timeline.length - 1 && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.event.includes('Disetujui') ? 'bg-green-500' :
                                  event.event.includes('Ditolak') || event.event.includes('Dicabut') ? 'bg-red-500' :
                                  event.event.includes('Expired') ? 'bg-gray-500' :
                                  'bg-blue-500'
                                }`}>
                                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <circle cx="10" cy="10" r="3" />
                                  </svg>
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{event.event}</p>
                                  {event.notes && (
                                    <p className="mt-1 text-sm text-gray-500">{event.notes}</p>
                                  )}
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <div>{formatDateTime(event.timestamp)}</div>
                                  <div className="text-xs text-gray-400">{event.actor}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
