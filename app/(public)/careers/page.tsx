'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/features/job/job.service';
import { systemService } from '@/features/system/system.service';
import { Job } from '@/types';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import { Briefcase, Loader2, LayoutGrid, List, Flame, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

export default function PublicJobsPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('newest');

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryRange: '', experienceRange: '', isHot: false,
        skills: [] as string[], company: '', industry: '', education: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [] as any[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[], industries: [] as string[], educations: [] as string[]
    });

    // Detect Scroll for Header
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [jobsData, locationsRes] = await Promise.all([
                    jobService.getPublicJobs(),
                    systemService.getLocations()
                ]);

                setJobs(jobsData);

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
                job.description?.toLowerCase().includes(query)
            );
        }

        if (filters.isHot) result = result.filter(job => job.is_hot);
        if (filters.industry) result = result.filter(job => job.industry === filters.industry);
        if (filters.company) result = result.filter(job => job.company_name === filters.company);

        if (filters.location) {
            const locQuery = filters.location.toLowerCase();
            result = result.filter(job =>
                job.location?.province_name?.toLowerCase().includes(locQuery) ||
                job.location?.country?.toLowerCase().includes(locQuery)
            );
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

    const clearFilters = () => {
        setFilters({ location: '', workMode: '', jobLevel: '', employmentType: '', salaryRange: '', experienceRange: '', isHot: false, skills: [], company: '', industry: '', education: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const handleCardClick = (e: React.MouseEvent, jobId: string) => {
        // Chỉ trigger khi người dùng KHÔNG bấm vào Nút "Ứng tuyển" hoặc Nút "Mở JD"
        if ((e.target as Element).closest('button')) return;
        router.push(`/careers/${jobId}`);
    };

    const hotJobs = filteredJobs.filter(j => j.is_hot);
    const regularJobs = filteredJobs.filter(j => !j.is_hot);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Pattern */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

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

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 space-y-10">
                <div className="relative z-20">
                    <JobSearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        filters={filters}
                        onFiltersChange={(newFilters: any) => setFilters(newFilters)}
                        filterOptions={filterOptions}
                        onClearFilters={clearFilters}
                        activeFiltersCount={activeFiltersCount}
                    />
                </div>

                {/* Khu vực Điều hướng Lọc Phụ & Chế độ xem */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-text p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Tìm thấy <span className="text-primary-600 dark:text-primary-400">{filteredJobs.length}</span> vị trí phù hợp
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                            <label className="font-bold hidden sm:block">Sắp xếp:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#1e293b] text-slate-800 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer">
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="salary_high">Lương cao nhất</option>
                                <option value="salary_low">Lương thấp nhất</option>
                            </select>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-[#1e293b] p-1 rounded-xl">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Lưới">
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Danh sách">
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-primary-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Đang tải việc làm...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-text rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Chưa tìm thấy việc làm phù hợp</h3>
                        <p className="text-slate-500 font-medium mb-6">Thử giảm bớt các tiêu chí lọc hoặc dùng từ khóa chung chung hơn.</p>
                        <button onClick={clearFilters} className="mt-4 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                            Xóa toàn bộ bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* DANH SÁCH HOT JOBS */}
                        {hotJobs.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                    <Flame className="w-6 h-6 text-rose-500" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Việc Làm HOT</h2>
                                </div>
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                                    {hotJobs.map(job => (
                                        <div
                                            key={job.id}
                                            onClick={(e) => handleCardClick(e, job.id!)}
                                            className="cursor-pointer group bg-white dark:bg-text rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-slate-400 hover:-translate-y-1 transition-all shadow-sm overflow-hidden"
                                        >
                                            <div className="pointer-events-auto h-full">
                                                <JobCard job={job} isPublic={true} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DANH SÁCH REGULAR JOBS */}
                        {regularJobs.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                    <Briefcase className="w-6 h-6 text-blue-500" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Việc Làm Mới Nhất</h2>
                                </div>
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                                    {regularJobs.map(job => (
                                        <div
                                            key={job.id}
                                            onClick={(e) => handleCardClick(e, job.id!)}
                                            className="cursor-pointer group bg-white dark:bg-text rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all shadow-sm overflow-hidden"
                                        >
                                            <div className="pointer-events-auto h-full">
                                                <JobCard job={job} isPublic={true} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}