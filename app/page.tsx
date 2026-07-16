'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, BrainCircuit, FileSearch, Briefcase, Building2, Search, Hexagon } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import { Job, UserRole } from '@/types';

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '', salaryMin: '', salaryMax: '', skills: [] as string[], company: ''
    });

    const [filterOptions, setFilterOptions] = useState({
        locations: [] as string[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[]
    });

    const jobsSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.get('/apply/jobs').then(res => {
            const data = res.data;
            setJobs(data);
            setFilteredJobs(data);

            const locations = [...new Set(data.map((job: any) => job.location?.city).filter(Boolean))] as string[];
            const workModes = [...new Set(data.map((job: any) => job.work_mode).filter(Boolean))] as string[];
            const jobLevels = [...new Set(data.map((job: any) => job.job_level).filter(Boolean))] as string[];
            const employmentTypes = [...new Set(data.map((job: any) => job.employment_type).filter(Boolean))] as string[];
            const skills = [...new Set(data.flatMap((job: any) => job.required_skills || []))] as string[];
            const companies = [...new Set(data.map((job: any) => job.company_name).filter(Boolean))] as string[];

            setFilterOptions({ locations, workModes, jobLevels, employmentTypes, skills, companies });
            setUniqueCompanies(companies);
        }).catch(() => {
            toast.error('Không thể tải danh sách việc làm');
        }).finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.required_skills?.some((skill: any) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return skillName?.toLowerCase().includes(query);
                })
            );
        }

        if (filters.location) filtered = filtered.filter(job => job.location?.city === filters.location);
            if (filters.workMode) filtered = filtered.filter(job => job.work_mode === filters.workMode);
            if (filters.jobLevel) filtered = filtered.filter(job => job.job_level === filters.jobLevel);
            if (filters.employmentType) filtered = filtered.filter(job => job.employment_type === filters.employmentType);
        if (filters.company) filtered = filtered.filter(job => job.company_name === filters.company);
        if (filters.salaryMin) filtered = filtered.filter(job => job.salary?.min_salary && job.salary.min_salary >= parseInt(filters.salaryMin));
        if (filters.salaryMax) filtered = filtered.filter(job => job.salary?.max_salary && job.salary.max_salary <= parseInt(filters.salaryMax));
        if (filters.skills.length > 0) {
            filtered = filtered.filter(job =>
                filters.skills.some(skill => {
                    const jobSkills = job.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                    return jobSkills.includes(skill);
                })
            );
        }

        setFilteredJobs(filtered);
    }, [jobs, searchQuery, filters]);

    useEffect(() => {
        let sorted = [...filteredJobs];
        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
                break;
            case 'salary_high':
                sorted.sort((a, b) => (b.salary?.max_salary || 0) - (a.salary?.max_salary || 0));
                break;
            case 'salary_low':
                sorted.sort((a, b) => (a.salary?.min_salary || 0) - (b.salary?.min_salary || 0));
                break;
        }
        setFilteredJobs(sorted);
    }, [sortBy, filteredJobs.length]);

    const clearFilters = () => {
        setFilters({ location: '', workMode: '', jobLevel: '', employmentType: '', salaryMin: '', salaryMax: '', skills: [], company: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const scrollToJobs = () => {
        jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSelectCompany = (companyName: string) => {
        setFilters({ ...filters, company: companyName });
        scrollToJobs();
    };

    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : value !== '').length + (searchQuery ? 1 : 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
            {/* ================= NAVBAR TRANG CHỦ ================= */}
            <nav className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 cursor-pointer">
                    <Hexagon className="w-8 h-8 text-blue-600" fill="currentColor" />
                    <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">ATS<span className="text-blue-600">SYSTEM</span></span>
                </div>
                <div className="flex gap-3">
                    {isAuthenticated ? (
                        <Link href={user?.role === UserRole.APPLICANT ? '/apply' : '/dashboard'} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                            Vào hệ thống
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Đăng nhập</Link>
                            <Link href="/register" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">Đăng ký</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ================= HERO SECTION ================= */}
            <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 flex flex-col items-center justify-center text-center px-4">
                {/* Background Decor Effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-sm mb-6 border border-blue-200 dark:border-blue-500/20 animate-in zoom-in duration-500 delay-100">
                        <Sparkles className="w-4 h-4" /> AI ATS Platform v2.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight mb-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        Tuyển dụng thông minh <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                            Dẫn đầu bằng AI
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium animate-in slide-in-from-bottom-8 duration-700 delay-300">
                        Hệ thống phân tích ngữ nghĩa BGE-M3. Chấm điểm kỹ năng, kinh nghiệm và chống gian lận (Anti-Stuffing) chuẩn xác trong từng CV.
                    </p>

                    {/* THANH TÌM KIẾM NHANH TRÊN HERO */}
                    <div className="w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-10 duration-700 delay-500">
                        <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-slate-800 p-2 rounded-2xl sm:rounded-full shadow-2xl shadow-blue-900/5 dark:shadow-none border border-slate-200 dark:border-slate-700 gap-2">
                            <div className="flex items-center flex-1 w-full pl-4 pr-2 py-2">
                                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none outline-none px-3 text-slate-700 dark:text-white font-medium placeholder-slate-400"
                                    placeholder="Tìm việc làm, kỹ năng (VD: React, NodeJS), công ty..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && scrollToJobs()}
                                />
                            </div>
                            <button onClick={scrollToJobs} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl sm:rounded-full transition-all shadow-md shrink-0">
                                Tìm Việc Ngay
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                            <span>Gợi ý:</span>
                            {['Frontend', 'Backend', 'Marketing', 'Designer'].map((tag, i) => (
                                <span key={i} onClick={() => { setSearchQuery(tag); scrollToJobs(); }} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= TOP EMPLOYERS (COMPANIES) ================= */}
            {uniqueCompanies.length > 0 && (
                <div className="py-12 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Đối tác tuyển dụng hàng đầu</h2>
                        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                            {uniqueCompanies.slice(0, 10).map((company, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelectCompany(company)}
                                    className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center group"
                                >
                                    <Building2 className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    {company}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= JOBS LISTING SECTION ================= */}
            <div ref={jobsSectionRef} className="max-w-7xl mx-auto py-20 px-4 space-y-8 scroll-mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">Việc làm <span className="text-blue-600">Nổi bật</span></h2>
                    <p className="text-slate-500 mt-3 font-medium">Khám phá {filteredJobs.length} cơ hội nghề nghiệp với hệ thống xếp hạng công bằng AI.</p>
                </div>

                {/* BỘ LỌC CHI TIẾT */}
                <JobSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={filters}
                    onFiltersChange={setFilters}
                    filterOptions={filterOptions}
                    onClearFilters={clearFilters}
                    activeFiltersCount={activeFiltersCount}
                />

                {/* TÓM TẮT TÌM KIẾM */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Có <span className="text-blue-600">{filteredJobs.length}</span> vị trí phù hợp
                    </span>
                    <div className="flex items-center gap-4">
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-red-500 font-bold hover:underline">Xóa ({activeFiltersCount}) bộ lọc</button>
                        )}
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                            <label className="font-bold">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="salary_high">Lương cao nhất</option>
                                <option value="salary_low">Lương thấp nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH JOBS */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Không tìm thấy việc làm</h3>
                            <p className="text-slate-500">Thử thay đổi từ khóa hoặc giảm bớt bộ lọc để tìm được nhiều kết quả hơn.</p>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-200 transition-colors">
                                    Xóa bộ lọc ngay
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredJobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApplySuccess={() => { toast.success("Gửi hồ sơ thành công!"); }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= FEATURES HIGHLIGHT ================= */}
            <div className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">AI Scoring Matrix</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Đánh giá 4 chiều (4-Factor Weighting) độ phù hợp của CV với JD. Minh bạch, rõ ràng, không thiên vị.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileSearch className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">Anti-Stuffing System</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Công nghệ xử lý ngôn ngữ NLP bóc tách cấu trúc ngữ nghĩa, tự động phạt điểm các CV cố tình nhồi nhét từ khóa.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ArrowRight className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">Ứng tuyển 1 chạm</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Luồng ứng tuyển siêu tốc. Quản lý trạng thái dễ dàng thông qua hệ thống chuông báo thời gian thực.</p>
                    </div>
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <footer className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium border-t border-slate-200 dark:border-slate-800">
                <p>© 2026 AI CV Ranking Platform.</p>
            </footer>
        </div>
    );
}