'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useJobRanking } from "@/features/job/useJob";
import JobDetailHeader from '@/components/jobs/detail/JobDetailHeader';
import JobDetailTabs from '@/components/jobs/detail/JobDetailTabs';
import TabJobInfo from '@/components/jobs/detail/TabJobInfo';
import TabAIConfig from '@/components/jobs/detail/TabAIConfig';
import TabCandidates from '@/components/jobs/detail/TabCandidates';

export default function JobLeaderboardPage() {
    const params = useParams();
    const jobId = params.id as string;

    const { jobInfo, companyInfo, candidates, setCandidates, isLoading } = useJobRanking(jobId);

    const [activeTab, setActiveTab] = useState<'candidates' | 'job_info' | 'ai_config'>('candidates');

    if (isLoading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;
    }

    if (!jobInfo) {
        return <div className="text-center py-20 text-slate-500 font-bold">Không tìm thấy thông tin chiến dịch.</div>;
    }

    return (
        <div className="space-y-8 pb-20">

            {/* PHASE 1: HEADER */}
            <JobDetailHeader jobInfo={jobInfo} companyInfo={companyInfo} />

            {/* VÙNG NỘI DUNG CHÍNH */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-125">

                {/* PHASE 1: THANH TABS NGANG */}
                <JobDetailTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    candidateCount={candidates.length}
                />

                {/* KHU VỰC RENDER CONTENT THEO TAB */}
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 min-h-0">
                    {activeTab === 'candidates' && (
                        <TabCandidates
                            candidates={candidates}
                            setCandidates={setCandidates}
                            jobTitle={jobInfo.title}
                        />
                    )}

                    {activeTab === 'job_info' && (
                        <TabJobInfo jobInfo={jobInfo} />
                    )}

                    {activeTab === 'ai_config' && (
                        <TabAIConfig jobInfo={jobInfo} />
                    )}
                </div>
            </div>
        </div>
    );
}