'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    Users,
    Star,
    Eye,
    Globe,
    FileText,
    CheckCircle2,
    Briefcase,
    ChevronLeft,
    Loader2,
    XCircle,
    Share2,
    ShieldCheck,
    Map,
    Zap,
    DollarSign,
    Calendar,
    Heart,
    Image as ImageIcon,
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
import { ROUTES } from '@/constants/routes';

export default function PublicCompanyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    const [company, setCompany] = useState<Company | null>(null);
    const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!company?.id) return;

        const link = `${window.location.origin}${ROUTES.PUBLIC_COMPANY_DETAIL(company.id)}`;

        try {
            await navigator.clipboard.writeText(link);
            toast.success('Đã sao chép link công ty!');
        } catch {
            toast.error('Không thể sao chép liên kết');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!params.id) return;

        const fetchData = async () => {
            try {
                const [compRes, jobsRes] = await Promise.all([
                    apiClient.get(`/companies/public/${params.id}`),
                    jobService.getPublicJobs(),
                ]);

                setCompany(compRes.data);

                const jobsForThisCompany = jobsRes.filter(
                    (job: Job) => String(job.company_id) === String(params.id)
                );

                setCompanyJobs(jobsForThisCompany);
            } catch (error) {
                console.error('Failed to fetch company:', error);
                toast.error('Không tìm thấy thông tin công ty');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#05070b] transition-colors duration-300">
                <PublicHeader
                    isScrolled={isScrolled}
                    isAuthenticated={isAuthenticated}
                    user={user}
                />

                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600 dark:text-blue-400" />

                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Đang tải hồ sơ doanh nghiệp...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * =========================================================
     * NOT FOUND
     * =========================================================
     */

    if (!company) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#05070b] transition-colors duration-300">
                <PublicHeader
                    isScrolled={isScrolled}
                    isAuthenticated={isAuthenticated}
                    user={user}
                />

                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div
                        className="
                            w-full max-w-lg
                            p-10
                            rounded-3xl
                            text-center
                            bg-white dark:bg-[#111827]
                            border border-slate-200 dark:border-slate-800
                            shadow-sm dark:shadow-2xl dark:shadow-black/20
                            transition-colors duration-300
                        "
                    >
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />

                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            Không tìm thấy công ty
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Công ty này không tồn tại hoặc chưa được hệ thống xác thực
                            (KYC).
                        </p>

                        <button
                            onClick={() => router.push(ROUTES.PUBLIC_COMPANIES)}
                            className="
                                w-full
                                px-6 py-3
                                rounded-xl
                                font-bold
                                bg-blue-50 dark:bg-blue-500/10
                                text-blue-600 dark:text-blue-400
                                border border-transparent
                                hover:bg-blue-100 dark:hover:bg-blue-500/20
                                transition-colors
                            "
                        >
                            Khám phá công ty khác
                        </button>
                    </div>
                </div>

                <PublicFooter />
            </div>
        );
    }

    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    const companyLocation = company.location
        ? company.location.country &&
            company.location.country !== 'Việt Nam'
            ? Array.from(
                new Set(
                    [
                        company.location.street_address,
                        company.location.country,
                    ].filter(Boolean)
                )
            ).join(', ')
            : Array.from(
                new Set(
                    [
                        company.location.street_address,
                        company.location.ward_name,
                        company.location.district_name,
                        company.location.province_name,
                    ].filter(Boolean)
                )
            ).join(', ')
        : '';

    /*
     * =========================================================
     * MAIN
     * =========================================================
     */

    return (
        <div
            className="
                min-h-screen
                flex flex-col
                bg-slate-50 dark:bg-[#05070b]
                text-slate-900 dark:text-slate-100
                transition-colors duration-300
            "
        >
            <PublicHeader
                isScrolled={isScrolled}
                isAuthenticated={isAuthenticated}
                user={user}
            />

            <main
                className="
                    flex-1
                    w-full max-w-7xl
                    mx-auto
                    px-4 sm:px-6
                    pt-28 pb-20
                    animate-in fade-in duration-500
                "
            >
                {/* =====================================================
                    BACK BUTTON
                ====================================================== */}

                <button
                    onClick={() => router.push(ROUTES.PUBLIC_COMPANIES)}
                    className="
                        flex items-center gap-2
                        mb-6
                        w-fit
                        font-bold
                        text-slate-500 dark:text-slate-400
                        hover:text-blue-600 dark:hover:text-blue-400
                        transition-colors
                    "
                >
                    <ChevronLeft className="w-4 h-4" />
                    Danh sách công ty
                </button>

                {/* =====================================================
                    HERO
                ====================================================== */}

                <div
                    className="
                        relative
                        mb-8
                        overflow-hidden
                        rounded-3xl
                        bg-white dark:bg-[#111827]
                        border border-slate-200 dark:border-slate-800
                        shadow-sm dark:shadow-xl dark:shadow-black/20
                        transition-colors duration-300
                    "
                >
                    {/* Banner */}

                    <div
                        className="
                            relative
                            w-full
                            h-48 md:h-64
                            overflow-hidden
                            bg-slate-100 dark:bg-slate-900
                        "
                    >
                        {company.banner_url ? (
                            <img
                                src={company.banner_url}
                                alt={`Banner ${company.name}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                                <div
                                    className="
                                        absolute inset-0
                                        opacity-40
                                        bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))]
                                        from-blue-400
                                        via-transparent
                                        to-transparent
                                        blur-xl
                                    "
                                />

                                <div
                                    className="
                                        absolute inset-0
                                        bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
                                        bg-size-[12px_12px]
                                    "
                                />

                                <Building2 className="relative z-10 w-16 h-16 text-slate-300 dark:text-slate-700" />
                            </div>
                        )}
                    </div>

                    {/* Company info */}

                    <div className="relative px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full flex-1 min-w-0">
                                {/* Logo */}

                                <div
                                    className="
                                        relative z-10
                                        shrink-0
                                        flex items-center justify-center
                                        w-32 h-32 md:w-40 md:h-40
                                        -mt-16 md:-mt-20
                                        overflow-hidden
                                        rounded-3xl
                                        bg-white dark:bg-slate-900
                                        border-4 border-white dark:border-slate-900
                                        shadow-lg dark:shadow-black/40
                                    "
                                >
                                    {company.logo_url ? (
                                        <img
                                            src={company.logo_url}
                                            alt={`Logo ${company.name}`}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                    )}
                                </div>

                                {/* Name / Rating */}

                                <div
                                    className="
                                        z-10
                                        flex-1
                                        min-w-0
                                        w-full
                                        pt-2 md:pt-0
                                        mb-2
                                        text-center md:text-left
                                    "
                                >
                                    <h1
                                        className="
                                            mb-3
                                            text-2xl md:text-4xl
                                            leading-tight
                                            font-black
                                            text-slate-900 dark:text-white
                                        "
                                    >
                                        <span className="inline line-clamp-2">
                                            {company.name}

                                            <span
                                                title="Đã xác thực (Verified KYC)"
                                                className="inline-flex items-center justify-center align-middle ml-2 -mt-1 shrink-0"
                                            >
                                                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 drop-shadow-sm" />
                                            </span>
                                        </span>
                                    </h1>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <span
                                            className="
                                                flex items-center gap-1.5
                                                px-3 py-1
                                                rounded-lg
                                                bg-slate-100 dark:bg-slate-800
                                                border border-slate-200 dark:border-slate-700
                                                text-sm font-bold
                                                text-slate-600 dark:text-slate-300
                                            "
                                        >
                                            <Star
                                                className={`w-4 h-4 ${company.avg_rating > 0
                                                        ? 'text-amber-500 fill-amber-500'
                                                        : 'text-slate-400 dark:text-slate-600'
                                                    }`}
                                            />

                                            {company.avg_rating > 0
                                                ? `${company.avg_rating.toFixed(
                                                    1
                                                )} (${company.review_count})`
                                                : 'Chưa đánh giá'}
                                        </span>

                                        <span
                                            className="
                                                flex items-center gap-1.5
                                                px-3 py-1
                                                rounded-lg
                                                bg-slate-100 dark:bg-slate-800
                                                border border-slate-200 dark:border-slate-700
                                                text-sm font-bold
                                                text-slate-600 dark:text-slate-300
                                            "
                                        >
                                            <Eye className="w-4 h-4" />

                                            {(company.view_count || 0).toLocaleString(
                                                'vi-VN'
                                            )}{' '}
                                            lượt xem
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}

                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    className="
                                        flex-1 md:flex-none
                                        shrink-0
                                        flex items-center justify-center gap-2
                                        px-6 py-3.5
                                        rounded-xl
                                        font-bold
                                        bg-slate-50 dark:bg-slate-800
                                        hover:bg-slate-100 dark:hover:bg-slate-700
                                        text-slate-700 dark:text-slate-300
                                        border border-slate-200 dark:border-slate-700
                                        hover:text-rose-500
                                        transition-all
                                    "
                                >
                                    <Heart className="w-4 h-4" />
                                    Lưu
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="
                                        flex-1 md:flex-none
                                        shrink-0
                                        flex items-center justify-center gap-2
                                        px-6 py-3.5
                                        rounded-xl
                                        font-bold
                                        bg-slate-50 dark:bg-slate-800
                                        hover:bg-slate-100 dark:hover:bg-slate-700
                                        text-slate-700 dark:text-slate-300
                                        border border-slate-200 dark:border-slate-700
                                        hover:text-blue-500
                                        transition-all
                                    "
                                >
                                    <Share2 className="w-4 h-4" />
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    CONTENT
                ====================================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* =================================================
                        LEFT
                    ================================================== */}

                    <div className="lg:col-span-2 space-y-8 h-fit">
                        {/* =================================================
                            GALLERY
                        ================================================== */}

                        {company.gallery_urls &&
                            company.gallery_urls.length > 0 && (
                                <section
                                    className="
                                        p-6 md:p-8
                                        rounded-3xl
                                        bg-white dark:bg-[#111827]
                                        border border-slate-200 dark:border-slate-800
                                        shadow-sm dark:shadow-xl dark:shadow-black/10
                                        transition-colors
                                    "
                                >
                                    <div
                                        className="
                                            flex items-center justify-between
                                            pb-4 mb-6
                                            border-b border-slate-100 dark:border-slate-800
                                        "
                                    >
                                        <h3
                                            className="
                                                flex items-center gap-2
                                                text-lg
                                                font-black
                                                uppercase
                                                tracking-wider
                                                text-slate-800 dark:text-white
                                            "
                                        >
                                            <div
                                                className="
                                                    p-1.5
                                                    rounded-lg
                                                    bg-rose-50 dark:bg-rose-500/10
                                                    text-rose-500
                                                "
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                            </div>

                                            Không gian làm việc
                                        </h3>
                                    </div>

                                    <div
                                        className={`
                                            grid gap-4
                                            ${company.gallery_urls.length >= 3
                                                ? 'grid-cols-2 md:grid-cols-3'
                                                : 'grid-cols-1 md:grid-cols-2'
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                relative
                                                col-span-2 md:col-span-2
                                                row-span-2
                                                h-64 md:h-80
                                                overflow-hidden
                                                rounded-2xl
                                                cursor-pointer
                                                bg-slate-100 dark:bg-slate-800
                                                shadow-sm dark:shadow-black/20
                                                group
                                            "
                                        >
                                            <img
                                                src={company.gallery_urls[0]}
                                                alt="Văn phòng"
                                                className="
                                                    w-full h-full
                                                    object-cover
                                                    transition-transform duration-700
                                                    group-hover:scale-105
                                                "
                                            />

                                            <div
                                                className="
                                                    absolute inset-0
                                                    bg-black/10
                                                    group-hover:bg-transparent
                                                    transition-colors
                                                "
                                            />
                                        </div>

                                        {company.gallery_urls
                                            .slice(1, 3)
                                            .map((url, idx) => (
                                                <div
                                                    key={idx}
                                                    className="
                                                        hidden md:block
                                                        h-30 md:h-38
                                                        overflow-hidden
                                                        rounded-2xl
                                                        cursor-pointer
                                                        bg-slate-100 dark:bg-slate-800
                                                        shadow-sm dark:shadow-black/20
                                                        group
                                                    "
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Gallery ${idx + 2}`}
                                                        className="
                                                            w-full h-full
                                                            object-cover
                                                            transition-transform duration-700
                                                            group-hover:scale-105
                                                        "
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </section>
                            )}

                        {/* =================================================
                            BENEFITS
                        ================================================== */}

                        {company.benefits &&
                            company.benefits.length > 0 && (
                                <section
                                    className="
                                        p-8 md:p-10
                                        rounded-3xl
                                        bg-white dark:bg-[#111827]
                                        border border-slate-200 dark:border-slate-800
                                        shadow-sm dark:shadow-xl dark:shadow-black/10
                                    "
                                >
                                    <h3
                                        className="
                                            flex items-center gap-2
                                            mb-6
                                            pb-4
                                            border-b border-slate-100 dark:border-slate-800
                                            text-lg
                                            font-black
                                            uppercase
                                            tracking-wider
                                            text-slate-800 dark:text-white
                                        "
                                    >
                                        <div
                                            className="
                                                p-1.5
                                                rounded-lg
                                                bg-amber-50 dark:bg-amber-500/10
                                                text-amber-500
                                            "
                                        >
                                            <Zap className="w-5 h-5" />
                                        </div>

                                        Phúc lợi dành cho bạn
                                    </h3>

                                    <div className="flex flex-wrap gap-3">
                                        {company.benefits.map(
                                            (
                                                benefit: string,
                                                idx: number
                                            ) => (
                                                <span
                                                    key={idx}
                                                    className="
                                                        flex items-center gap-2
                                                        px-4 py-2.5
                                                        rounded-xl
                                                        border
                                                        bg-amber-50 dark:bg-amber-500/10
                                                        border-amber-100 dark:border-amber-800/30
                                                        text-amber-700 dark:text-amber-400
                                                        font-bold text-sm
                                                        shadow-sm
                                                        hover:-translate-y-0.5
                                                        transition-transform
                                                    "
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                                    {benefit}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                        {/* =================================================
                            ABOUT
                        ================================================== */}

                        <section
                            className="
                                p-8 md:p-10
                                rounded-3xl
                                bg-white dark:bg-[#111827]
                                border border-slate-200 dark:border-slate-800
                                shadow-sm dark:shadow-xl dark:shadow-black/10
                            "
                        >
                            <h3
                                className="
                                    flex items-center gap-2
                                    mb-6
                                    pb-4
                                    border-b border-slate-100 dark:border-slate-800
                                    text-lg
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-slate-800 dark:text-white
                                "
                            >
                                <div
                                    className="
                                        p-1.5
                                        rounded-lg
                                        bg-blue-50 dark:bg-blue-500/10
                                        text-blue-500
                                    "
                                >
                                    <FileText className="w-5 h-5" />
                                </div>

                                Về chúng tôi
                            </h3>

                            {company.description ? (
                                <div
                                    className="
                                        prose
                                        prose-slate
                                        dark:prose-invert
                                        max-w-none
                                        text-slate-600 dark:text-slate-300
                                        leading-loose
                                    "
                                    dangerouslySetInnerHTML={{
                                        __html: company.description,
                                    }}
                                />
                            ) : (
                                <div
                                    className="
                                        py-10
                                        text-center
                                        rounded-2xl
                                        bg-slate-50 dark:bg-slate-800/50
                                        border border-dashed
                                        border-slate-200 dark:border-slate-700
                                    "
                                >
                                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />

                                    <p className="text-slate-500 dark:text-slate-400 italic text-sm font-medium">
                                        Doanh nghiệp chưa cập nhật thông tin
                                        giới thiệu chi tiết.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* =================================================
                            LEGAL
                        ================================================== */}

                        <section
                            className="
                                p-8 md:p-10
                                rounded-3xl
                                bg-white dark:bg-[#111827]
                                border border-slate-200 dark:border-slate-800
                                shadow-sm dark:shadow-xl dark:shadow-black/10
                            "
                        >
                            <h3
                                className="
                                    flex items-center gap-2
                                    mb-6
                                    pb-4
                                    border-b border-slate-100 dark:border-slate-800
                                    text-lg
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-slate-800 dark:text-white
                                "
                            >
                                <div
                                    className="
                                        p-1.5
                                        rounded-lg
                                        bg-emerald-50 dark:bg-emerald-500/10
                                        text-emerald-500
                                    "
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>

                                Thông tin pháp lý
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p
                                        className="
                                            mb-1
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400 dark:text-slate-500
                                        "
                                    >
                                        Mã số thuế
                                    </p>

                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                        {company.tax_code || 'Đang cập nhật'}
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="
                                            mb-1
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400 dark:text-slate-500
                                        "
                                    >
                                        Trạng thái định danh
                                    </p>

                                    <p
                                        className="
                                            flex items-center gap-1.5
                                            mt-1
                                            font-bold
                                            text-emerald-600 dark:text-emerald-400
                                        "
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        Đã xác minh (KYC)
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* =====================================================
                        RIGHT SIDEBAR
                    ====================================================== */}

                    <aside className="lg:sticky lg:top-28 space-y-8 h-fit">
                        {/* =================================================
                            OVERVIEW
                        ================================================== */}

                        <section
                            className="
                                p-6
                                rounded-3xl
                                bg-white dark:bg-[#111827]
                                border border-slate-200 dark:border-slate-800
                                shadow-sm dark:shadow-xl dark:shadow-black/10
                            "
                        >
                            <h3
                                className="
                                    mb-2
                                    pb-3
                                    border-b border-slate-100 dark:border-slate-800
                                    text-sm
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-slate-800 dark:text-white
                                "
                            >
                                Tổng quan
                            </h3>

                            <div className="space-y-4">
                                {/* Industries */}

                                {(company.industries?.length ?? 0) > 0 && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <div
                                            className="
                                                shrink-0
                                                p-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                text-slate-500 dark:text-slate-400
                                            "
                                        >
                                            <Briefcase className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <p
                                                className="
                                                    mb-1
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Lĩnh vực hoạt động
                                            </p>

                                            <div className="flex flex-wrap gap-1.5">
                                                {(company.industries || []).map(
                                                    (
                                                        ind: string,
                                                        idx: number
                                                    ) => (
                                                        <span
                                                            key={idx}
                                                            className="
                                                                px-2 py-1
                                                                rounded-md
                                                                border
                                                                bg-slate-100 dark:bg-slate-800
                                                                border-slate-200 dark:border-slate-700
                                                                text-xs
                                                                font-bold
                                                                text-slate-600 dark:text-slate-300
                                                            "
                                                        >
                                                            {INDUSTRIES.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    ind
                                                            )?.label || ind}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Size */}

                                {company.size && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div
                                            className="
                                                shrink-0
                                                p-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                text-slate-500 dark:text-slate-400
                                            "
                                        >
                                            <Users className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <p
                                                className="
                                                    mb-0.5
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Quy mô công ty
                                            </p>

                                            <p className="font-bold text-slate-700 dark:text-slate-200">
                                                {COMPANY_SIZES.find(
                                                    (size) =>
                                                        size.value ===
                                                        company.size
                                                )?.label || 'Đang cập nhật'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Website */}

                                {company.website && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div
                                            className="
                                                shrink-0
                                                p-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                text-slate-500 dark:text-slate-400
                                            "
                                        >
                                            <Globe className="w-4 h-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    mb-0.5
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Website
                                            </p>

                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    block
                                                    font-bold
                                                    text-blue-600 dark:text-blue-400
                                                    hover:underline
                                                    line-clamp-1
                                                "
                                            >
                                                {company.website.replace(
                                                    /^https?:\/\//,
                                                    ''
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}

                                {companyLocation && (
                                    <div className="flex items-start gap-3 text-sm pt-2">
                                        <div
                                            className="
                                                shrink-0
                                                mt-0.5
                                                p-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                text-slate-500 dark:text-slate-400
                                            "
                                        >
                                            <MapPin className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <p
                                                className="
                                                    mb-1
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Trụ sở chính
                                            </p>

                                            <p
                                                className="
                                                    font-medium
                                                    leading-relaxed
                                                    text-slate-700 dark:text-slate-300
                                                "
                                            >
                                                {companyLocation}
                                            </p>

                                            <button
                                                className="
                                                    flex items-center gap-1
                                                    mt-1.5
                                                    text-xs
                                                    font-bold
                                                    text-blue-600 dark:text-blue-400
                                                    hover:underline
                                                "
                                            >
                                                <Map className="w-3 h-3" />
                                                Xem bản đồ
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Created */}

                                {company.created_at && (
                                    <div
                                        className="
                                            flex items-center gap-3
                                            pt-2
                                            border-t border-slate-100 dark:border-slate-800
                                            text-sm
                                        "
                                    >
                                        <div
                                            className="
                                                shrink-0
                                                p-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                text-slate-500 dark:text-slate-400
                                            "
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <p
                                                className="
                                                    mb-0.5
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Thành viên từ
                                            </p>

                                            <p className="font-bold text-slate-700 dark:text-slate-200">
                                                {new Date(
                                                    company.created_at
                                                ).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Social */}

                                {company.social_links &&
                                    (company.social_links.facebook ||
                                        company.social_links.linkedin ||
                                        company.social_links.youtube) && (
                                        <div
                                            className="
                                                pt-3 mt-2
                                                border-t border-slate-100 dark:border-slate-800
                                            "
                                        >
                                            <p
                                                className="
                                                    mb-3
                                                    text-[11px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wider
                                                    text-slate-400 dark:text-slate-500
                                                "
                                            >
                                                Mạng xã hội
                                            </p>

                                            <div className="flex items-center gap-3">
                                                {/* Facebook */}

                                                {company.social_links
                                                    .facebook && (
                                                        <a
                                                            href={
                                                                company.social_links
                                                                    .facebook
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="
                                                            p-2.5
                                                            rounded-xl
                                                            bg-blue-50 dark:bg-blue-500/10
                                                            hover:bg-blue-100 dark:hover:bg-blue-500/20
                                                            text-blue-600 dark:text-blue-400
                                                            transition-colors
                                                        "
                                                            title="Facebook"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4"
                                                            >
                                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                            </svg>
                                                        </a>
                                                    )}

                                                {/* LinkedIn */}

                                                {company.social_links
                                                    .linkedin && (
                                                        <a
                                                            href={
                                                                company.social_links
                                                                    .linkedin
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="
                                                            p-2.5
                                                            rounded-xl
                                                            bg-blue-50 dark:bg-blue-500/10
                                                            hover:bg-blue-100 dark:hover:bg-blue-500/20
                                                            text-blue-500 dark:text-blue-400
                                                            transition-colors
                                                        "
                                                            title="LinkedIn"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4"
                                                            >
                                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                                <rect
                                                                    x="2"
                                                                    y="9"
                                                                    width="4"
                                                                    height="12"
                                                                />
                                                                <circle
                                                                    cx="4"
                                                                    cy="4"
                                                                    r="2"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}

                                                {/* YouTube */}

                                                {company.social_links
                                                    .youtube && (
                                                        <a
                                                            href={
                                                                company.social_links
                                                                    .youtube
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="
                                                            p-2.5
                                                            rounded-xl
                                                            bg-rose-50 dark:bg-rose-500/10
                                                            hover:bg-rose-100 dark:hover:bg-rose-500/20
                                                            text-rose-500 dark:text-rose-400
                                                            transition-colors
                                                        "
                                                            title="YouTube"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4"
                                                            >
                                                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z" />

                                                                <polygon points="10 15 15 12 10 9 10 15" />
                                                            </svg>
                                                        </a>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </section>

                        {/* =================================================
                            JOBS
                        ================================================== */}

                        <section
                            className="
                                p-6
                                rounded-3xl
                                bg-white dark:bg-[#111827]
                                border border-slate-200 dark:border-slate-800
                                shadow-sm dark:shadow-xl dark:shadow-black/10
                            "
                        >
                            <h3
                                className="
                                    flex items-center gap-1.5
                                    mb-2
                                    pb-3
                                    border-b border-slate-100 dark:border-slate-800
                                    text-sm
                                    font-black
                                    uppercase
                                    tracking-wider
                                    text-slate-800 dark:text-white
                                "
                            >
                                <Zap className="w-4 h-4 text-amber-500" />

                                Đang mở ({companyJobs.length})
                            </h3>

                            {companyJobs.length > 0 ? (
                                <div className="space-y-4">
                                    {companyJobs.slice(0, 3).map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() =>
                                                router.push(
                                                    ROUTES.PUBLIC_JOB_DETAIL(
                                                        job.id
                                                    )
                                                )
                                            }
                                            className="
                                                cursor-pointer
                                                group
                                                p-4
                                                rounded-xl
                                                border
                                                border-slate-200 dark:border-slate-700
                                                bg-white dark:bg-slate-900/60
                                                hover:bg-slate-50 dark:hover:bg-slate-800
                                                hover:border-blue-400 dark:hover:border-blue-500
                                                transition-all
                                            "
                                        >
                                            <h4
                                                className="
                                                    mb-1.5
                                                    line-clamp-1
                                                    text-sm
                                                    font-bold
                                                    text-slate-800 dark:text-slate-200
                                                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                                                    transition-colors
                                                "
                                            >
                                                {job.title}
                                            </h4>

                                            <div
                                                className="
                                                    flex items-center gap-3
                                                    text-xs
                                                    font-semibold
                                                    text-slate-500 dark:text-slate-400
                                                "
                                            >
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />

                                                    {job.location?.province_name ||
                                                        'Toàn quốc'}
                                                </span>

                                                <span
                                                    className="
                                                        flex items-center gap-1
                                                        text-emerald-600 dark:text-emerald-400
                                                    "
                                                >
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                    Thỏa thuận
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {companyJobs.length > 3 && (
                                        <button
                                            className="
                                                w-full
                                                py-2.5
                                                rounded-xl
                                                bg-slate-50 dark:bg-slate-800
                                                hover:bg-slate-100 dark:hover:bg-slate-700
                                                text-blue-600 dark:text-blue-400
                                                font-bold text-sm
                                                transition-colors
                                            "
                                        >
                                            Xem tất cả {companyJobs.length} vị trí
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />

                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Chưa có chiến dịch tuyển dụng nào đang
                                        mở.
                                    </p>
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}