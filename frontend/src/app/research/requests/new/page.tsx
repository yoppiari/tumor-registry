'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ResearchRequestWizard } from '@/components/research/wizard/ResearchRequestWizard';
import researchRequestsService, { CreateResearchRequestDto } from '@/services/research-requests.service';

export default function NewResearchRequestPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleComplete = async (data: CreateResearchRequestDto) => {
    try {
      let requestId = draftId;

      // Create or update draft
      if (!draftId) {
        const created = await researchRequestsService.create(data);
        requestId = created.id;
        setDraftId(created.id);
      } else {
        await researchRequestsService.update(draftId, data);
      }

      // Submit for approval
      if (requestId) {
        await researchRequestsService.submit(requestId);
        alert('✅ Research request berhasil di-submit untuk approval!');
        router.push('/research/requests');
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat submit request';
      alert(`❌ Gagal submit request: ${errorMessage}`);
    }
  };

  const handleSaveDraft = async (data: Partial<CreateResearchRequestDto>) => {
    try {
      if (draftId) {
        await researchRequestsService.update(draftId, data);
      } else {
        // Create draft on first save
        const created = await researchRequestsService.create(data as CreateResearchRequestDto);
        setDraftId(created.id);
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      // Silent fail for auto-save - don't alert user
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Research Data Request
          </h1>
          <p className="text-gray-600 mt-2">
            Permintaan akses data untuk penelitian muskuloskeletal tumor
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            4 Langkah - Checklist-Based Selection
          </div>
        </div>

        <ResearchRequestWizard
          onComplete={handleComplete}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </Layout>
  );
}
