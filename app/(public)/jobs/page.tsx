'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobService } from '@/features/job/job.service';
import { systemService } from '@/features/system/system.service';
import { Company, Job } from '@/types';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import { Briefcase, Loader2, LayoutGrid, List, XCircle, ChevronLeft, ChevronRight, Flame, Link, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { HotJobItem } from '@/components/landing/HotJobsSection';
import { LatestJobItem } from '@/components/landing/LatestJobsSection';
import { ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PublicJobsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuthStore();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('newest');

    const [currentPage, setCurrentPage] = useState(1);
    const [hotPage, setHotPage] = useState(1);
    const [latestPage, setLatestPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
    const [filters, setFilters] = useState({
        provinceCodes: searchParams.get('provinces')?.split(',').filter(Boolean) || [] as string[],
        districtCodes: searchParams.get('districts')?.split(',').filter(Boolean) || [] as string[],
        wardCodes: searchParams.get('wards')?.split(',').filter(Boolean) || [] as string[],
        foreignLocation: searchParams.get('foreign') || '',
        workMode: '', jobLevel: '', employmentType: '',
        salaryRange: '', experienceRange: '', isHot: false,
        skills: [] as string[], company: '', industry: searchParams.get('industry') || '', education: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [] as any[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[], industries: [] as string[], educations: [] as string[]
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [jobsData, companiesData, locationsRes] = await Promise.all([
                    jobService.getPublicJobs(),
                    apiClient.get('/companies/public/list').then(res => res.data), // Fetch danh sách công ty để lấy logo
                    systemService.getLocations()
                ]);

                // Map logo công ty vào danh sách job
                const jobsWithLogos = jobsData.map((job: Job) => {
                    const matchedCompany = companiesData.find((c: Company) => c.id === job.company_id);
                    return {
                        ...job,
                        company_logo: matchedCompany?.logo_url || null
                    };
                });

                setJobs(jobsWithLogos);

                const workModes = [...new Set(jobsData.map((job: any) => job.work_mode).filter(Boolean))] as string[];
                const jobLevels = [...new Set(jobsData.map((job: any) => job.job_level).filter(Boolean))] as string[];
                const employmentTypes = [...new Set(jobsData.map((job: any) => job.employment_type).filter(Boolean))] as string[];
                const companies = [...new Set(jobsData.map((job: any) => job.company_name).filter(Boolean))] as string[];
                const industries = [...new Set(jobsData.map((job: any) => job.industry).filter(Boolean))] as string[];

                setFilterOptions({ locations: locationsRes, workModes, jobLevels, employmentTypes, skills: [], companies, industries, educations: [] });
            } catch (error) {
                toast.error('Không thể tải danh sách việc làm');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.location?.street_address?.toLowerCase().includes(query)
            );
        }

        if (filters.isHot) result = result.filter(job => job.is_hot);
        if (filters.industry) result = result.filter(job => job.industry === filters.industry);
        if (filters.company) result = result.filter(job => job.company_name === filters.company);

        const hasLocationFilter = filters.provinceCodes.length > 0 || filters.districtCodes.length > 0 || filters.wardCodes.length > 0 || filters.foreignLocation;
        if (hasLocationFilter) {
            result = result.filter(job => {
                const matchProv = filters.provinceCodes.includes(job.location?.province_code || '');
                const matchDist = filters.districtCodes.includes(job.location?.district_code || '');
                const matchWard = filters.wardCodes.includes(job.location?.ward_code || '');
                const matchForeign = filters.foreignLocation && job.location?.country !== 'Việt Nam' && job.location?.street_address?.toLowerCase().includes(filters.foreignLocation.toLowerCase());

                return matchProv || matchDist || matchWard || matchForeign;
            });
        }

        if (filters.workMode) result = result.filter(job => job.work_mode === filters.workMode);
        if (filters.jobLevel) result = result.filter(job => job.job_level === filters.jobLevel);

        if (filters.salaryRange) {
            const [minStr, maxStr] = filters.salaryRange.split('-');
            const reqMin = parseInt(minStr);
            const reqMax = parseInt(maxStr);
            result = result.filter(job => {
                const jobMax = job.salary?.max_salary || 0;
                return jobMax >= reqMin && jobMax <= reqMax;
            });
        }

        if (filters.experienceRange) {
            const [minExp, maxExp] = filters.experienceRange.split('-');
            result = result.filter(job => {
                const jobExp = job.min_yoe || 0;
                return jobExp >= parseFloat(minExp) && jobExp <= parseFloat(maxExp);
            });
        }

        if (filters.skills.length > 0) {
            result = result.filter(job => filters.skills.some(skill => {
                const jobSkills = job.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                return jobSkills.includes(skill);
            }));
        }

        switch (sortBy) {
            case 'newest': result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
            case 'oldest': result.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()); break;
            case 'salary_high': result.sort((a, b) => (b.salary?.max_salary || 0) - (a.salary?.max_salary || 0)); break;
            case 'salary_low': result.sort((a, b) => (a.salary?.min_salary || 0) - (b.salary?.min_salary || 0)); break;
        }

        return result;
    }, [jobs, searchQuery, filters, sortBy]);

    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : (value !== '' && value !== false)).length + (searchQuery ? 1 : 0);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery, sortBy]);

    const clearFilters = () => {
        setFilters({ provinceCodes: [], districtCodes: [], wardCodes: [], foreignLocation: '', workMode: '', jobLevel: '', employmentType: '', salaryRange: '', experienceRange: '', isHot: false, skills: [], company: '', industry: '', education: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const handleCardClick = (e: React.MouseEvent, jobId: string) => {
        if ((e.target as Element).closest('button')) return;
        router.push(ROUTES.PUBLIC_JOB_DETAIL(jobId));
    };

    const hotJobs = filteredJobs.filter(j => j.is_hot);
    const regularJobs = filteredJobs.filter(j => !j.is_hot);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Pattern */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                {/* Background image - giống HeroSection */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center opacity-[0.22] dark:opacity-[0.22]"
                    />

                    {/* Light mode overlay */}
                    <div className="absolute inset-0 bg-linear-to-b from-background/45 via-background/70 to-background/95 dark:hidden" />

                    {/* Dark mode overlay */}
                    <div className="absolute inset-0 hidden bg-linear-to-b from-[#020617]/55 dark:block" />

                    {/* Dark mode color tint */}
                    <div className="absolute inset-0 hidden bg-blue-950/20 mix-blend-multiply dark:block" />
                </div>

                {/* Grid vuông - giống HeroSection */}
                <div
                    className="absolute inset-0 opacity-[0.065] dark:opacity-[0.055]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
                        backgroundSize: '4rem 4rem',
                        maskImage:
                            'radial-gradient(ellipse 80% 75% at 50% 25%, black 30%, transparent 90%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 80% 75% at 50% 25%, black 30%, transparent 90%)',
                    }}
                />

                {/* Primary glow */}
                <div className="absolute left-1/2 top-[-12%] h-130 w-205 -translate-x-1/2 rounded-full bg-primary-500/10 blur-[140px] dark:bg-primary-500/10" />

                {/* Soft side glows */}
                <div className="absolute left-[-15%] top-[20%] h-105 w-105 rounded-full bg-primary-400/4.5 blur-[120px] dark:bg-primary-500/6" />

                <div className="absolute right-[-15%] top-[30%] h-105 w-105 rounded-full bg-blue-300/4 blur-[120px] dark:bg-blue-500/5" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background via-background/65 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Khám phá <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">công việc mơ ước</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Hơn {jobs.length > 0 ? jobs.length : 'hàng ngàn'} cơ hội việc làm từ các doanh nghiệp hàng đầu đang chờ đón bạn.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-350 mx-auto px-4 sm:px-6 w-full py-12 flex flex-col gap-20">

                {/* ================= PHẦN 1: BỘ LỌC & KẾT QUẢ TÌM KIẾM (Layout 25% - 75%) ================= */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* CỘT TRÁI (25%): Bộ lọc dính (Sticky Sidebar) */}
                    <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24">
                        <JobSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            filters={filters}
                            onFiltersChange={(newFilters: any) => setFilters(newFilters)}
                            filterOptions={filterOptions}
                            onClearFilters={clearFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                    </aside>

                    {/* CỘT PHẢI (75%): Kết quả lọc */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-6">

                        {/* Header điều hướng (ViewMode, Sort) */}
                        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Tìm thấy <span className="text-blue-600 dark:text-blue-400">{filteredJobs.length}</span> vị trí phù hợp
                            </span>

                            <div className="flex items-center gap-4">
                                {activeFiltersCount > 0 && (
                                    <button onClick={clearFilters} className="text-rose-500 font-bold hover:underline hidden md:block">
                                        Xóa ({activeFiltersCount}) bộ lọc
                                    </button>
                                )}
                                <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                                    <label className="font-bold hidden sm:block">Sắp xếp:</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer">
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                        <option value="salary_high">Lương cao nhất</option>
                                        <option value="salary_low">Lương thấp nhất</option>
                                    </select>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Lưới">
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Danh sách">
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">Đang tải việc làm...</p>
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                                <XCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-slate-500 font-medium mb-4">Không tìm thấy việc làm phù hợp với tiêu chí lọc.</p>
                                <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Grid kết quả lọc */}
                                <div
                                    className={`grid gap-5 ${viewMode === 'grid'
                                        ? 'grid-cols-1 xl:grid-cols-2'
                                        : 'grid-cols-1'
                                        }`}
                                >
                                    {filteredJobs
                                        .slice((currentPage - 1) * 10, currentPage * 10)
                                        .map(job => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                viewMode={viewMode}
                                            />
                                        ))}
                                </div>

                                {/* Phân trang Kết quả lọc */}
                                {Math.ceil(filteredJobs.length / 10) > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-4">
                                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> / {Math.ceil(filteredJobs.length / 10)}
                                        </span>
                                        <button disabled={currentPage === Math.ceil(filteredJobs.length / 10)} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ================= PHẦN 2: VIỆC LÀM HOT ================= */}
                {jobs.filter(j => j.is_hot).length > 0 && (
                    <div className="w-full border-t border-slate-200 pt-16 dark:border-slate-800">
                        <div className="group/shop relative overflow-hidden rounded-2xl border border-orange-200/70 bg-linear-to-br from-orange-50/40 via-white to-rose-50/30 shadow-sm transition-all duration-500 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-orange-500/20 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 dark:hover:border-orange-500/40">

                            {/* Background animation */}
                            <motion.div
                                className="pointer-events-none absolute -left-32 top-0 h-40 w-72 rounded-full bg-orange-400/10 blur-3xl"
                                animate={{
                                    x: [0, 100, 0],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />

                            <motion.div
                                className="pointer-events-none absolute -right-32 bottom-0 h-40 w-72 rounded-full bg-rose-400/10 blur-3xl"
                                animate={{
                                    x: [0, -100, 0],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />

                            {/* Header */}
                            <div className="relative z-10 border-b border-orange-100/70 px-5 py-5 dark:border-slate-800 md:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <motion.div
                                            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/25"
                                            animate={{
                                                scale: [1, 1.05, 0.98, 1.04, 1],
                                                rotate: [0, -2, 2, -1, 0]
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 rounded-xl bg-orange-400/40 blur-md"
                                                animate={{
                                                    opacity: [0.3, 0.7, 0.35, 0.65, 0.3],
                                                    scale: [0.9, 1.15, 0.95, 1.1, 0.9]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut'
                                                }}
                                            />

                                            <Flame className="relative z-10 h-6 w-6 fill-current" />
                                        </motion.div>

                                        <div className="min-w-0">
                                            <h2 className="truncate text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-2xl">
                                                Việc Làm{' '}
                                                <span className="bg-linear-to-r from-orange-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                                                    Hot
                                                </span>
                                            </h2>

                                            <p className="mt-0.5 hidden text-sm text-slate-400 sm:block">
                                                Những vị trí có mức đãi ngộ tốt nhất đang chờ đón bạn.
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`${ROUTES.PUBLIC_JOBS}?is_hot=true`}
                                        className="flex shrink-0 items-center gap-1 text-sm font-bold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
                                    >
                                        Xem tất cả
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* Filter */}
                                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-orange-50/60 px-4 py-2.5 dark:bg-orange-500/5">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="hidden shrink-0 text-sm font-medium text-slate-500 sm:inline dark:text-slate-400">
                                            Sắp xếp theo:
                                        </span>

                                        <select className="h-9 cursor-pointer rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                            <option value="default">Mặc định</option>
                                            <option value="salary_desc">Lương cao nhất</option>
                                            <option value="latest">Mới cập nhật</option>
                                        </select>
                                    </div>

                                    <span className="shrink-0 text-sm font-medium text-slate-400">
                                        {jobs.filter(j => j.is_hot).length} việc làm
                                    </span>
                                </div>
                            </div>

                            {/* Jobs */}
                            <div className="relative z-10 bg-linear-to-b from-transparent via-orange-50/10 to-orange-50/20 p-5 dark:via-orange-950/5 dark:to-orange-950/10 md:p-6">
                                <motion.div
                                    key={hotPage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                >
                                    {jobs
                                        .filter(j => j.is_hot)
                                        .slice((hotPage - 1) * 9, hotPage * 9)
                                        .map(job => (
                                            <HotJobItem key={job.id} job={job} />
                                        ))}
                                </motion.div>

                                {/* Pagination */}
                                {Math.ceil(jobs.filter(j => j.is_hot).length / 9) > 1 && (
                                    <div className="mt-6 flex justify-center">
                                        <div className="flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50/60 p-1 dark:border-slate-800 dark:bg-slate-800/70">
                                            <button
                                                disabled={hotPage === 1}
                                                onClick={() => setHotPage(p => p - 1)}
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            <div className="min-w-16 px-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                                                <span className="text-orange-600 dark:text-orange-500">{hotPage}</span>
                                                <span className="mx-1">/</span>
                                                {Math.ceil(jobs.filter(j => j.is_hot).length / 9)}
                                            </div>

                                            <button
                                                disabled={hotPage === Math.ceil(jobs.filter(j => j.is_hot).length / 9)}
                                                onClick={() => setHotPage(p => p + 1)}
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= PHẦN 3: VIỆC LÀM MỚI NHẤT ================= */}
                <div className="w-full border-t border-slate-200 pt-16 dark:border-slate-800">
                    <div className="group/shop relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/40 via-white to-cyan-50/30 shadow-sm transition-all duration-500 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-blue-500/15 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/10">

                        {/* Background animation nhẹ */}
                        <motion.div
                            className="pointer-events-none absolute -left-32 top-0 h-36 w-72 rounded-full bg-blue-400/5 blur-3xl"
                            animate={{
                                x: [0, 80, 0],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />

                        <motion.div
                            className="pointer-events-none absolute -right-32 bottom-0 h-36 w-72 rounded-full bg-cyan-400/5 blur-3xl"
                            animate={{
                                x: [0, -70, 0],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: 9,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />

                        {/* Header */}
                        <div className="relative z-10 border-b border-blue-100/70 px-5 py-5 dark:border-slate-800 md:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <motion.div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                        animate={{
                                            y: [0, -2, 0],
                                            scale: [1, 1.02, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        <Clock3 className="h-5 w-5" />
                                    </motion.div>

                                    <div className="min-w-0">
                                        <h2 className="truncate text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-2xl">
                                            Việc Làm{' '}
                                            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                                Mới Nhất
                                            </span>
                                        </h2>

                                        <p className="mt-0.5 hidden text-sm text-slate-400 sm:block">
                                            Cập nhật liên tục hàng ngàn cơ hội từ các doanh nghiệp hàng đầu.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={ROUTES.PUBLIC_JOBS}
                                    className="flex shrink-0 items-center gap-1 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Xem tất cả
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Filter */}
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50/60 px-4 py-2.5 dark:bg-blue-500/5">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="hidden shrink-0 text-sm font-medium text-slate-500 sm:inline dark:text-slate-400">
                                        Sắp xếp theo:
                                    </span>

                                    <select className="h-9 cursor-pointer rounded-lg border border-blue-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                        <option value="latest">Mới nhất</option>
                                        <option value="salary_desc">Lương cao nhất</option>
                                    </select>
                                </div>

                                <span className="shrink-0 text-sm font-medium text-slate-400">
                                    {jobs.length} việc làm
                                </span>
                            </div>
                        </div>

                        {/* Jobs */}
                        <div className="relative z-10 bg-linear-to-b from-transparent via-blue-50/10 to-blue-50/20 p-5 dark:via-blue-950/5 dark:to-blue-950/10 md:p-6">
                            <motion.div
                                key={latestPage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {[...jobs]
                                    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                                    .slice((latestPage - 1) * 9, latestPage * 9)
                                    .map(job => (
                                        <LatestJobItem key={job.id} job={job} />
                                    ))}
                            </motion.div>

                            {/* Pagination */}
                            {Math.ceil(jobs.length / 9) > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 p-1 dark:border-slate-800 dark:bg-slate-800/70">
                                        <button
                                            disabled={latestPage === 1}
                                            onClick={() => setLatestPage(p => p - 1)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>

                                        <div className="min-w-16 px-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                                            <span className="text-blue-600 dark:text-blue-400">{latestPage}</span>
                                            <span className="mx-1">/</span>
                                            {Math.ceil(jobs.length / 9)}
                                        </div>

                                        <button
                                            disabled={latestPage === Math.ceil(jobs.length / 9)}
                                            onClick={() => setLatestPage(p => p + 1)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
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