'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Building2, MapPin, Users, Star, Eye, Globe, FileText, CheckCircle2, Briefcase, ChevronLeft,
    Loader2, XCircle, Share2, ShieldCheck, Map, Zap, DollarSign, Calendar, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api-client';
import { jobService } from '@/features/job/job.service';
import { Company, Job } from '@/types';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';

export default function PublicCompanyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    const [company, setCompany] = useState<Company | null>(null);
    const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleShare = () => {
        if (!company?.id) return;
        const link = `${window.location.origin}/companies/${company.id}`;
        navigator.clipboard.writeText(link);
        toast.success('Đã sao chép link công ty!');
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (params.id) {
            const fetchData = async () => {
                try {
                    const [compRes, jobsRes] = await Promise.all([
                        apiClient.get(`/companies/public/${params.id}`),
                        jobService.getPublicJobs()
                    ]);

                    setCompany(compRes.data);

                    const jobsForThisCompany = jobsRes.filter((j: Job) => j.company_id === params.id);
                    setCompanyJobs(jobsForThisCompany);

                } catch (error) {
                    toast.error('Không tìm thấy thông tin công ty');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex flex-col items-center justify-center text-blue-500">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Đang tải hồ sơ doanh nghiệp...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors">
                <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 p-10 rounded-3xl text-center max-w-lg shadow-sm">
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy công ty</h2>
                        <p className="text-slate-500 font-medium mb-8">Công ty này không tồn tại hoặc chưa được hệ thống xác thực (KYC).</p>
                        <button onClick={() => router.push('/companies')} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-colors w-full">
                            Khám phá công ty khác
                        </button>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20 animate-in fade-in duration-500">
                <button
                    onClick={() => router.push('/companies')}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold mb-6 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" /> Danh sách công ty
                </button>

                {/* KHỐI HERO: Banner & Thông tin cơ bản */}
                <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-8 relative">
                    {/* Banner */}
                    <div className="h-48 md:h-64 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {company.banner_url ? (
                            <img src={company.banner_url} alt={`Banner ${company.name}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent blur-xl" />
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[12px_12px]" />
                                <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 relative z-10" />
                            </div>
                        )}
                    </div>

                    <div className="px-6 md:px-10 pb-8 relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full flex-1 min-w-0">
                                {/* Logo nổi */}
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden shrink-0 z-10 relative -mt-16 md:-mt-20">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-slate-300" />
                                    )}
                                </div>

                                <div className="text-center md:text-left mb-2 z-10 flex-1 min-w-0 pt-2 md:pt-0 w-full">
                                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 leading-tight text-center md:text-left">
                                        <span className="inline line-clamp-2">
                                            {company.name}
                                            <span title="Đã xác thực (Verified KYC)" className="inline-flex items-center justify-center align-middle ml-2 -mt-1 shrink-0">
                                                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 drop-shadow-sm" />
                                            </span>
                                        </span>
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                            <Star className={`w-4 h-4 ${company.avg_rating > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                                            {company.avg_rating > 0 ? `${company.avg_rating.toFixed(1)} (${company.review_count})` : 'Chưa đánh giá'}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                            <Eye className="w-4 h-4" /> {(company.view_count || 0).toLocaleString()} lượt xem
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button className="flex-1 md:flex-none px-6 py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 hover:text-rose-500">
                                    <Heart className="w-4 h-4" /> Lưu
                                </button>
                                <button onClick={handleShare} className="flex-1 md:flex-none px-6 py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 hover:text-blue-500">
                                    <Share2 className="w-4 h-4" /> Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT: Layout 2 cột có Sidebar bám dính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CỘT TRÁI: Nội dung giới thiệu */}
                    <div className="lg:col-span-2 space-y-8 h-fit">
                        {/* Box: Giới thiệu công ty */}
                        <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                                Giới thiệu về công ty
                            </h3>

                            {company.description ? (
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: company.description }}
                                />
                            ) : (
                                <p className="text-slate-500 italic text-center py-6">Công ty chưa cập nhật thông tin giới thiệu.</p>
                            )}
                        </div>

                        {/* Box: Thông tin pháp lý & Thuế */}
                        <div className="bg-white dark:bg-text border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                                Thông tin pháp lý
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mã số thuế</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{company.tax_code || 'Đang cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trạng thái định danh</p>
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                                        <ShieldCheck className="w-4 h-4" /> Đã xác minh (KYC)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Sidebar bám dính (Sticky) */}
                    <div className="lg:sticky lg:top-28 space-y-8 h-fit">

                        {/* Box 1: Tổng quan nhanh */}
                        <div className="bg-white dark:bg-text p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">Tổng quan</h3>

                            <div className="space-y-4">
                                {company.industry && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Briefcase className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Ngành nghề</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">
                                                {INDUSTRIES.find(i => i.value === company?.industry)?.label || 'Đang cập nhật'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.size && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Users className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Quy mô công ty</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">
                                                {COMPANY_SIZES.find(size => size.value === company.size)?.label || 'Đang cập nhật'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.website && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Globe className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Website</p>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline line-clamp-1">
                                                {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {(company.location?.street_address || company.location?.province_name) && (
                                    <div className="flex items-start gap-3 text-sm pt-2">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0 mt-0.5"><MapPin className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Trụ sở chính</p>
                                            <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {company.location.country && company.location.country !== 'Việt Nam'
                                                    ? Array.from(new Set([company.location.street_address, company.location.country].filter(Boolean))).join(', ')
                                                    : Array.from(new Set([company.location?.street_address, company.location?.ward_name, company.location?.district_name, company.location?.province_name].filter(Boolean))).join(', ') || 'Đang cập nhật'}
                                            </p>
                                            <button className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-1.5 flex items-center gap-1 hover:underline">
                                                <Map className="w-3 h-3" /> Xem bản đồ
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {company.created_at && (
                                    <div className="flex items-center gap-3 text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0"><Calendar className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Thành viên từ</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">{new Date(company.created_at).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box 2: Chiến dịch tuyển dụng (Mini Job List) */}
                        <div className="bg-white dark:bg-text p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <Zap className="w-4 h-4 text-amber-500" /> Đang mở ({companyJobs.length})
                            </h3>

                            {companyJobs.length > 0 ? (
                                <div className="space-y-4">
                                    {companyJobs.slice(0, 3).map(job => (
                                        <div key={job.id} onClick={() => router.push(`/careers/${job.id}`)} className="cursor-pointer group block border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 mb-1.5 transition-colors text-sm">
                                                {job.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location?.province_name || 'Toàn quốc'}</span>
                                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> Thỏa thuận</span>
                                            </div>
                                        </div>
                                    ))}
                                    {companyJobs.length > 3 && (
                                        <button className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            Xem tất cả {companyJobs.length} vị trí
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Chưa có chiến dịch tuyển dụng nào đang mở.</p>
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