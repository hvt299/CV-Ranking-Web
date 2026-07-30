'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobService } from '@/features/job/job.service';
import { Job } from '@/types';
import {
    Building2, MapPin, Briefcase, ChevronLeft, UploadCloud, Loader2,
    DollarSign, Clock, GraduationCap, CheckCircle2, Star, FileText,
    Zap, Flame, CalendarDays, Users, Share2, Timer, UserCheck,
    XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

// Hàm format tiền tệ nội bộ
const formatCurrency = (amount?: number) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    // Detect Scroll for Header
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (params.id) {
            jobService.getPublicJobById(params.id as string)
                .then(setJob)
                .catch(() => toast.error('Không tìm thấy thông tin công việc'))
                .finally(() => setIsLoading(false));
        }
    }, [params.id]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập hoặc đăng ký tài khoản Ứng viên để nộp hồ sơ!");
            router.push('/login');
            return;
        }
        // Nếu đã đăng nhập, chuyển hướng vào màn Dashboard ứng viên hoặc bật Modal ứng tuyển (Tuỳ luồng Phase tiếp theo)
        router.push('/apply');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center text-primary-500">
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
                    <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 p-10 rounded-3xl text-center max-w-lg shadow-sm">
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy công việc</h2>
                        <p className="text-slate-500 font-medium mb-8">Công việc này có thể đã hết hạn hoặc chiến dịch tuyển dụng đã bị đóng.</p>
                        <button onClick={() => router.push('/careers')} className="px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-100 transition-colors w-full">
                            Khám phá cơ hội khác
                        </button>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    // FIX NGHIÊM TRỌNG: Ép kiểu Boolean tường minh để tránh lỗi Type '""' is not assignable to type 'boolean | undefined'
    const isExpired = Boolean(job.deadline && new Date(job.deadline).getTime() < Date.now());

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20 animate-in fade-in duration-500">
                <button
                    onClick={() => router.push('/careers')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-6 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
                </button>

                {/* KHỐI HERO: Giới thiệu Tổng quan Công việc */}
                <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm mb-8 relative overflow-hidden group">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 blur-[80px] pointer-events-none rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                {job.is_hot && (
                                    <span className="flex items-center gap-1.5 bg-hot-100 dark:bg-hot-500/20 text-hot-600 dark:text-hot-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-hot-200 dark:border-hot-500/30">
                                        <Flame className="w-3.5 h-3.5" /> Việc Làm Hot
                                    </span>
                                )}
                                {isExpired && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                        Đã hết hạn
                                    </span>
                                )}
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
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
                                <span className="flex items-center gap-2" title={job.location?.full_address_snapshot || ''}>
                                    <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-md text-rose-500"><MapPin className="w-4 h-4" /></div>
                                    {job.location?.country && job.location.country !== 'Việt Nam' ? job.location.country : (job.location?.province_name || 'Toàn quốc')}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-md text-emerald-500"><DollarSign className="w-4 h-4" /></div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                                        {job.salary?.min_salary ? `${formatCurrency(job.salary.min_salary)} - ${formatCurrency(job.salary.max_salary!)} ${job.salary.currency}` : 'Thỏa thuận'}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-48">
                            <button
                                onClick={handleApplyClick}
                                disabled={isExpired}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]"
                            >
                                <UploadCloud className="w-5 h-5" /> {isExpired ? 'Đã hết hạn' : 'Ứng tuyển ngay'}
                            </button>
                            <button className="w-full py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors">
                                <Share2 className="w-4 h-4" /> Chia sẻ tin
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT: Layout 2 cột có Sidebar bám dính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CỘT TRÁI: Nội dung chi tiết (Mô tả, Yêu cầu, Quyền lợi) */}
                    <div className="lg:col-span-2 space-y-8 bg-white dark:bg-text border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-sm h-fit">

                        {job.description && (
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                    Mô tả công việc
                                </h3>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: job.description }}
                                />
                            </div>
                        )}

                        {job.requirements && (
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                                    Yêu cầu ứng viên
                                </h3>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                                />
                            </div>
                        )}

                        {job.benefits && (
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg"><Star className="w-5 h-5" /></div>
                                    Quyền lợi & Chế độ
                                </h3>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                                />
                            </div>
                        )}

                        {/* Bổ sung Other Info nếu có */}
                        {job.other_info && (
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                    Thông tin khác
                                </h3>
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: job.other_info }}
                                />
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI: Sidebar bám dính (Sticky) */}
                    <div className="lg:sticky lg:top-28 space-y-6 h-fit">

                        {/* Box 1: Tổng quan vị trí */}
                        <div className="bg-white dark:bg-text p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">Tổng quan vị trí</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Briefcase className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Hình thức làm việc</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{job.work_mode} • {job.employment_type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Thời gian làm việc</p>
                                        {/* FIX: Thêm hiển thị working_hours */}
                                        <p className="font-bold text-slate-700 dark:text-slate-200 line-clamp-2">{job.working_hours || 'Thỏa thuận'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Timer className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Thử việc</p>
                                        {/* FIX: Thêm hiển thị probation_period */}
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{job.probation_period || 'Theo quy định'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><GraduationCap className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Cấp bậc & Học vấn</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{job.job_level} • {job.education?.min_level || 'Không yêu cầu'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><UserCheck className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Kinh nghiệm tối thiểu</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{job.min_yoe ? `${job.min_yoe} năm kinh nghiệm` : 'Không yêu cầu kinh nghiệm'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Users className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Số lượng tuyển</p>
                                        {/* FIX: Thay slots bằng headcount */}
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{job.headcount ? `${job.headcount} người` : 'Không giới hạn'}</p>
                                    </div>
                                </div>

                                {/* Bổ sung Gender Requirement */}
                                {job.gender_requirement && job.gender_requirement !== 'Không yêu cầu' && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Users className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Giới tính ưu tiên</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">{job.gender_requirement}</p>
                                        </div>
                                    </div>
                                )}

                                {job.deadline && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><CalendarDays className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Hạn nộp hồ sơ</p>
                                            <p className={`font-bold ${isExpired ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {new Date(job.deadline).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box 2: YÊU CẦU KỸ NĂNG & CHỨNG CHỈ */}
                        <div className="bg-white dark:bg-text p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-500" /> Tiêu chí chuyên môn
                            </h3>

                            {job.required_skills && job.required_skills.length > 0 && (
                                <div className="space-y-2.5">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kỹ năng bắt buộc</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.required_skills.map((skill: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                                                {skill.name} {(skill.min_years ?? 0) > 0 && <span className="text-primary-500 ml-1">({skill.min_years}y)</span>}
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
                                                {skill.name}
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
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}