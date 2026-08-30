'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobService } from '@/features/job/job.service';
import apiClient from '@/lib/api-client';
import { Job, Company } from '@/types';
import {
    Building2, MapPin, Briefcase, ChevronLeft, UploadCloud, Loader2,
    DollarSign, Clock, GraduationCap, CheckCircle2, Star, FileText,
    Zap, Flame, CalendarDays, Users, Share2, Timer, UserCheck,
    XCircle, Heart, Globe, ExternalLink,
    Send
} from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import JobCard from '@/components/jobs/JobCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { formatSalaryRange, getDeadlineCountdown } from '@/utils/format';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { ROUTES } from '@/constants/routes';

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const { openApplyModal } = useUIStore();

    const [job, setJob] = useState<Job | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (params.id) {
            jobService.getPublicJobById(params.id as string)
                .then((jobData) => {
                    setJob(jobData);
                    setIsLoading(false);

                    if (jobData.company_id) {
                        apiClient.get(`/companies/public/${jobData.company_id}`)
                            .then(res => setCompany(res.data))
                            .catch(() => console.warn('Không thể tải thông tin công ty'));
                    }

                    jobService.getPublicJobs()
                        .then(allJobs => {
                            const related = allJobs.filter((j: Job) =>
                                j.id !== jobData.id &&
                                (j.company_id === jobData.company_id || j.industry === jobData.industry)
                            ).slice(0, 4);
                            setRelatedJobs(related);
                        })
                        .catch(() => console.warn('Không thể tải việc làm liên quan'));
                })
                .catch(() => {
                    toast.error('Không tìm thấy thông tin công việc');
                    setIsLoading(false);
                });
        }
    }, [params.id]);

    const handleApplyClick = () => {
        if (job?.id && job?.title) {
            openApplyModal(job.id, job.title);
        } else {
            toast.error('Dữ liệu công việc chưa sẵn sàng, vui lòng thử lại!');
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!job?.id) return;
        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(job.id)}`;
        navigator.clipboard.writeText(link);
        toast.success('Đã sao chép link công việc!');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center text-blue-500">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Đang tải thông tin việc làm...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl text-center max-w-lg shadow-sm">
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy công việc</h2>
                        <p className="text-slate-500 font-medium mb-8">Công việc này có thể đã hết hạn hoặc chiến dịch tuyển dụng đã bị đóng.</p>
                        <button onClick={() => router.push(ROUTES.PUBLIC_JOBS)} className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 transition-colors w-full">
                            Khám phá cơ hội khác
                        </button>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    const isExpired = Boolean(job.deadline && new Date(job.deadline).getTime() < Date.now());

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20 font-sans animate-in fade-in duration-500">

                <button
                    onClick={() => router.push(ROUTES.PUBLIC_JOBS)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold mb-6 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
                </button>

                {/* KHỐI HERO: TIÊU ĐỀ & HÀNH ĐỘNG */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                {job.is_hot && (
                                    <span className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                        <Flame className="w-3.5 h-3.5" /> Việc Làm Hot
                                    </span>
                                )}
                                {isExpired && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                        Đã hết hạn
                                    </span>
                                )}
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    Đăng ngày: {new Date(job.created_at || Date.now()).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500"><Building2 className="w-4 h-4" /></div>
                                    {job.company_name || 'Công ty Ẩn danh'}
                                </span>
                                <span className="flex items-center gap-2" title={[job.location?.street_address, job.location?.ward_name, job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || ''}>
                                    <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-md text-rose-500"><MapPin className="w-4 h-4" /></div>
                                    {job.location?.country && job.location.country !== 'Việt Nam'
                                        ? job.location.country
                                        : [job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || 'Toàn quốc'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-md text-emerald-500"><DollarSign className="w-4 h-4" /></div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                                        {formatSalaryRange(job.salary)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col gap-3 shrink-0 w-48">
                            <button
                                onClick={handleApplyClick}
                                disabled={isExpired}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                            >
                                <UploadCloud className="w-5 h-5" /> {isExpired ? 'Đã hết hạn' : 'Ứng tuyển ngay'}
                            </button>
                            <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-500 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors">
                                    <Heart className="w-4 h-4" /> Lưu
                                </button>
                                <button onClick={handleShare} className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors hover:text-blue-500">
                                    <Share2 className="w-4 h-4" /> Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LAYOUT 70 - 30 */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* CỘT TRÁI (70%): Nội dung chi tiết JD */}
                    <div className="w-full lg:w-[70%] space-y-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-sm space-y-10">

                            {job.description && (
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                        Mô tả công việc
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose" dangerouslySetInnerHTML={{ __html: job.description }} />
                                </div>
                            )}

                            {job.requirements && (
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                                        Yêu cầu ứng viên
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                </div>
                            )}

                            {job.benefits && (
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg"><Star className="w-5 h-5" /></div>
                                        Quyền lợi & Chế độ
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                                </div>
                            )}

                            {job.other_info && (
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                        Thông tin khác
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose" dangerouslySetInnerHTML={{ __html: job.other_info }} />
                                </div>
                            )}

                            {/* Địa điểm & Thời gian */}
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg"><MapPin className="w-5 h-5" /></div>
                                    Địa điểm và Thời gian
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> Địa điểm làm việc:</p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm ml-6">
                                            {job.location?.country && job.location.country !== 'Việt Nam'
                                                ? [job.location.street_address, job.location.country].filter(Boolean).join(', ')
                                                : [job.location?.street_address, job.location?.ward_name, job.location?.district_name, job.location?.province_name].filter(Boolean).join(', ') || 'Chưa cập nhật chi tiết'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Thời gian làm việc:</p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm ml-6">{job.working_hours || 'Theo quy định của công ty'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Việc làm liên quan */}
                        {relatedJobs.length > 0 && (
                            <div className="pt-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase className="w-6 h-6 text-blue-500" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Việc làm liên quan</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {relatedJobs.map(relatedJob => (
                                        <JobCard key={relatedJob.id} job={relatedJob} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI (30%): Company Widget & Các yêu cầu chi tiết */}
                    <aside className="w-full lg:w-[30%] shrink-0 space-y-6 lg:sticky lg:top-24">

                        {/* Company Widget */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-4 mb-5">
                                <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center p-1 shrink-0 hover:scale-105 transition-transform">
                                    {company?.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-slate-300" />
                                    )}
                                </Link>
                                <div>
                                    <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="font-bold text-slate-900 dark:text-white hover:text-blue-600 line-clamp-2 transition-colors">
                                        {company?.name || job.company_name || 'Đang cập nhật'}
                                    </Link>
                                    <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id)} className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1 hover:underline">
                                        Xem trang công ty <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 text-sm">
                                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Quy mô: <span className="font-bold">
                                            {COMPANY_SIZES.find(size => size.value === company?.size)?.label || 'Đang cập nhật'}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-300">Ngành nghề: <span className="font-bold line-clamp-1">
                                        {INDUSTRIES.find(i => i.value === company?.industry)?.label || 'Đang cập nhật'}
                                    </span></span>
                                </div>
                                {company?.website && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                                        <a href={company.website} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline line-clamp-1">Website công ty</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tổng quan Thông tin chung */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">Thông tin chung</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Ngành nghề</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-right line-clamp-1 max-w-[60%]">
                                        {INDUSTRIES.find(i => i.value === job.industry)?.label || job.industry || 'Đang cập nhật'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Cấp bậc</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.job_level}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Hình thức</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.work_mode} - {job.employment_type}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Timer className="w-4 h-4" /> Kinh nghiệm</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.min_yoe ? `Tối thiểu ${job.min_yoe} năm` : 'Không yêu cầu'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Học vấn</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.education?.min_level || 'Không yêu cầu'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Users className="w-4 h-4" /> Số lượng tuyển</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.headcount ? `${job.headcount} người` : 'Không giới hạn'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Giới tính</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.gender_requirement || 'Không yêu cầu'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-2">
                                    <span className="text-slate-500 flex items-center gap-2"><Timer className="w-4 h-4" /> Thử việc</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.probation_period || 'Theo quy định'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Hạn nộp</span>
                                    <div className="text-right">
                                        <div className={`font-bold ${isExpired ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                                        </div>
                                        {!isExpired && job.deadline && (
                                            <div className="text-[11px] font-black text-rose-500 mt-0.5 bg-rose-50 dark:bg-rose-500/10 inline-block px-1.5 py-0.5 rounded uppercase">
                                                {getDeadlineCountdown(job.deadline)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tiêu chí chuyên môn */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <Zap className="w-4 h-4 text-amber-500" /> Tiêu chí chuyên môn
                            </h3>

                            {job.required_skills && job.required_skills.length > 0 && (
                                <div className="space-y-2.5">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kỹ năng bắt buộc</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.required_skills.map((skill: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                                                {typeof skill === 'string' ? skill : skill.name} {(skill.min_years ?? 0) > 0 && <span className="text-blue-500 ml-1">({skill.min_years}y)</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.preferred_skills && job.preferred_skills.length > 0 && (
                                <div className="space-y-2.5 pt-2">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Điểm cộng (Ưu tiên)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.preferred_skills.map((skill: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.languages && job.languages.length > 0 && (
                                <div className="space-y-2.5 pt-2">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ngoại ngữ</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.languages.map((lang: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800/30">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.required_certifications && job.required_certifications.length > 0 && (
                                <div className="space-y-2.5 pt-2">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Chứng chỉ yêu cầu</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.required_certifications.map((cert: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800/30">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </aside>
                </div>
            </main>

            {/* STICKY BOTTOM BAR CHO MOBILE/TABLET */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center gap-3">
                <button className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
                <button
                    onClick={handleApplyClick}
                    disabled={isExpired}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                    <Send className="w-5 h-5" /> {isExpired ? 'Đã hết hạn' : 'Ứng tuyển ngay'}
                </button>
            </div>
            {/* Khoảng đệm chống che khuất nội dung */}
            <div className="lg:hidden h-24 bg-slate-50 dark:bg-[#050505]"></div>

            <PublicFooter />
        </div>
    );
}