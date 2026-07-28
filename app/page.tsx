'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/types';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import HeroSection from '@/components/landing/HeroSection';
import CompanyMarquee from '@/components/landing/CompanyMarquee';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import HotJobsSection from '@/components/landing/HotJobsSection';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import WorkflowSection from '@/components/landing/WorkflowSection';
import FaqSection from '@/components/landing/FaqSection';
import BottomCTA from '@/components/landing/BottomCTA';
import PublicFooter from '@/components/layout/PublicFooter';
import { systemService } from '@/features/system/system.service';
import { Briefcase, XCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [sortBy, setSortBy] = useState('newest');

    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryRange: '', experienceRange: '', isHot: false,
        skills: [] as string[], company: '', industry: '', education: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [] as any[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[], industries: [] as string[], educations: [] as string[]
    });

    const jobsSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [jobsRes, locationsRes] = await Promise.all([
                    apiClient.get('/apply/jobs'),
                    systemService.getLocations()
                ]);

                const data = jobsRes.data;
                setJobs(data);
                setFilteredJobs(data);

                // Giữ nguyên Object Location từ Master Data để truyền xuống HeroSection phân loại
                const locations = locationsRes;

                const workModes = [...new Set(data.map((job: any) => job.work_mode).filter(Boolean))] as string[];
                const jobLevels = [...new Set(data.map((job: any) => job.job_level).filter(Boolean))] as string[];
                const employmentTypes = [...new Set(data.map((job: any) => job.employment_type).filter(Boolean))] as string[];
                const companies = [...new Set(data.map((job: any) => job.company_name).filter(Boolean))] as string[];
                const industries = [...new Set(data.map((job: any) => job.industry).filter(Boolean))] as string[];

                setFilterOptions({ locations, workModes, jobLevels, employmentTypes, skills: [], companies, industries, educations: [] });
                setUniqueCompanies(companies);
            } catch (error) {
                toast.error('Không thể tải dữ liệu hệ thống');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query)
            );
        }

        if (filters.isHot) filtered = filtered.filter(job => job.is_hot);
        if (filters.industry) filtered = filtered.filter(job => job.industry === filters.industry);

        // FIX: Sửa lỗi Property 'city' does not exist -> Dùng province_name và country
        if (filters.location) {
            const locQuery = filters.location.toLowerCase();
            filtered = filtered.filter(job =>
                job.location?.province_name?.toLowerCase().includes(locQuery) ||
                job.location?.country?.toLowerCase().includes(locQuery)
            );
        }

        if (filters.workMode) filtered = filtered.filter(job => job.work_mode === filters.workMode);
        if (filters.jobLevel) filtered = filtered.filter(job => job.job_level === filters.jobLevel);

        if (filters.salaryRange) {
            const [minStr, maxStr] = filters.salaryRange.split('-');
            const reqMin = parseInt(minStr);
            const reqMax = parseInt(maxStr);
            filtered = filtered.filter(job => {
                const jobMax = job.salary?.max_salary || 0;
                return jobMax >= reqMin && jobMax <= reqMax;
            });
        }

        if (filters.experienceRange) {
            const [minExp, maxExp] = filters.experienceRange.split('-');
            filtered = filtered.filter(job => {
                const jobExp = job.min_yoe || 0;
                return jobExp >= parseFloat(minExp) && jobExp <= parseFloat(maxExp);
            });
        }

        if (filters.skills.length > 0) {
            filtered = filtered.filter(job => filters.skills.some(skill => {
                const jobSkills = job.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                return jobSkills.includes(skill);
            }));
        }
        setFilteredJobs(filtered);
    }, [jobs, debouncedSearchQuery, filters]);

    useEffect(() => {
        let sorted = [...filteredJobs];
        switch (sortBy) {
            case 'newest': sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
            case 'oldest': sorted.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()); break;
            case 'salary_high': sorted.sort((a, b) => (b.salary?.max_salary || 0) - (a.salary?.max_salary || 0)); break;
            case 'salary_low': sorted.sort((a, b) => (a.salary?.min_salary || 0) - (b.salary?.min_salary || 0)); break;
        }
        setFilteredJobs(sorted);
    }, [sortBy, filteredJobs.length]);

    const clearFilters = () => {
        setFilters({ location: '', workMode: '', jobLevel: '', employmentType: '', salaryRange: '', experienceRange: '', isHot: false, skills: [], company: '', industry: '', education: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const scrollToJobs = () => jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    const handleSelectCompany = (companyName: string) => { setFilters({ ...filters, company: companyName }); scrollToJobs(); };

    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : (value !== '' && value !== false)).length + (searchQuery ? 1 : 0);
    const displayHotJobs = jobs.filter(j => j.is_hot).slice(0, 3).length > 0 ? jobs.filter(j => j.is_hot).slice(0, 3) : jobs.slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 overflow-x-hidden transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} scrollToJobs={scrollToJobs} filterOptions={filterOptions} />
            <CompanyMarquee companies={uniqueCompanies} onSelectCompany={handleSelectCompany} />
            <FeaturesSection />
            <StatsSection />
            <HotJobsSection jobs={displayHotJobs} onScrollToJobs={scrollToJobs} />

            {/* Khối All Jobs: Nền chính (Slate-50 / #050505) */}
            <section className="bg-slate-50 dark:bg-[#050505] transition-colors">
                <div id="jobs" ref={jobsSectionRef} className="max-w-7xl mx-auto py-20 px-4 space-y-8 scroll-mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">Tất cả <span className="text-blue-600">Việc làm</span></h2>
                        <p className="text-slate-500 mt-3 font-medium">Khám phá {filteredJobs.length} cơ hội nghề nghiệp với hệ thống xếp hạng công bằng AI.</p>
                    </div>

                    <JobSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} filters={filters} onFiltersChange={setFilters} filterOptions={filterOptions} onClearFilters={clearFilters} activeFiltersCount={activeFiltersCount} />

                    <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Có <span className="text-blue-600">{filteredJobs.length}</span> vị trí phù hợp</span>
                        <div className="flex items-center gap-4">
                            {activeFiltersCount > 0 && <button onClick={clearFilters} className="text-red-500 font-bold hover:underline">Xóa ({activeFiltersCount}) bộ lọc</button>}
                            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                                <label className="font-bold">Sắp xếp:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                    <option value="salary_high">Lương cao nhất</option>
                                    <option value="salary_low">Lương thấp nhất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                                <XCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Chưa tìm thấy việc làm phù hợp</h3>
                                <p className="text-slate-500 font-medium mb-6">Thử giảm bớt các tiêu chí lọc hoặc dùng từ khóa chung chung hơn.</p>
                                <button onClick={clearFilters} className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                                    Xóa toàn bộ bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredJobs.map(job => <JobCard key={job.id} job={job} onApplySuccess={() => toast.success("Gửi hồ sơ thành công!")} />)}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <WorkflowSection />
            <FaqSection />
            <BottomCTA />
            <PublicFooter />
        </div>
    );
}