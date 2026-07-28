'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobService } from '@/features/job/job.service';
import { Job } from '@/types';
import JobDetailsContent from '@/components/jobs/JobDetailsContent';
import { Building2, MapPin, Briefcase, ChevronLeft, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            jobService.getPublicJobById(params.id as string)
                .then(setJob)
                .catch(() => toast.error('Không tìm thấy công việc'))
                .finally(() => setIsLoading(false));
        }
    }, [params.id]);

    // Bẫy khách vãng lai: Bấm ứng tuyển là ra trang Login
    const handleApplyClick = () => {
        toast.error("Vui lòng đăng nhập hoặc đăng ký tài khoản Ứng viên để nộp hồ sơ!");
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang tải thông tin việc làm...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-20 min-h-[60vh] flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl">
                    <p className="text-slate-500 font-bold mb-4">Không tìm thấy thông tin công việc hoặc chiến dịch đã đóng!</p>
                    <button onClick={() => router.push('/careers')} className="text-blue-600 font-bold hover:underline">
                        Xem các cơ hội khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full animate-in fade-in duration-500">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            {/* Khối Header Job (Không có thư viện CV, chỉ hiển thị thông tin) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="w-5 h-5 text-slate-400" />
                                {job.company_name || 'Công ty Ẩn danh'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-5 h-5 text-rose-500" />
                                {/* FIX: Thay thế city bằng province_name hoặc country */}
                                {job.location?.country && job.location.country !== 'Việt Nam'
                                    ? job.location.country
                                    : (job.location?.province_name || 'Toàn quốc')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                {job.work_mode} • {job.employment_type}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleApplyClick}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 shrink-0 w-full md:w-auto transition-transform active:scale-95"
                    >
                        <UploadCloud className="w-5 h-5" /> Ứng tuyển ngay
                    </button>
                </div>
            </div>

            {/* Nội dung chi tiết - Tái sử dụng JobDetailsContent hoàn hảo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <JobDetailsContent jobInfo={job} />
            </div>
        </div>
    );
}