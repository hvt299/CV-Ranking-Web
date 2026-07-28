'use client';

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import { useExploreJobs } from '@/features/application/useApplication';

export default function ApplyPage() {
    const { jobs, cvLibrary, isLoading, filterOptions } = useExploreJobs();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryMin: '', salaryMax: '', skills: [] as string[], company: '',
        industry: '', education: ''
    });

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();

            result = result.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.required_skills?.some((skill: any) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return skillName?.toLowerCase().includes(query);
                })
            );
        }

        // FIX: Thay thế `city` bằng `province_name` và `country` để khớp với Schema LocationDetail mới
        if (filters.location) {
            const locQuery = filters.location.toLowerCase();
            result = result.filter(job =>
                job.location?.province_name?.toLowerCase().includes(locQuery) ||
                job.location?.country?.toLowerCase().includes(locQuery)
            );
        }
        if (filters.workMode) result = result.filter(job => job.work_mode === filters.workMode);
        if (filters.jobLevel) result = result.filter(job => job.job_level === filters.jobLevel);
        if (filters.employmentType) result = result.filter(job => job.employment_type === filters.employmentType);
        if (filters.company) result = result.filter(job => job.company_name === filters.company);
        if (filters.industry) result = result.filter(job => job.industry === filters.industry);
        if (filters.education) result = result.filter(job => job.education?.min_level === filters.education);

        if (filters.salaryMin) {
            result = result.filter(job => job.salary?.min_salary && job.salary.min_salary >= Number(filters.salaryMin));
        }
        if (filters.salaryMax) {
            result = result.filter(job => job.salary?.max_salary && job.salary.max_salary <= Number(filters.salaryMax));
        }

        if (filters.skills.length > 0) {
            result = result.filter(job =>
                filters.skills.some(skill => {
                    const jobSkills = job.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                    return jobSkills.includes(skill);
                })
            );
        }

        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
                break;
            case 'salary_high':
                result.sort((a, b) => (b.salary?.max_salary || 0) - (a.salary?.max_salary || 0));
                break;
            case 'salary_low':
                result.sort((a, b) => (a.salary?.min_salary || 0) - (b.salary?.min_salary || 0));
                break;
            case 'relevance':
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    result.sort((a, b) => {
                        const aSkills = a.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                        const bSkills = b.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];

                        const aMatches = aSkills.filter((s: string) => s.toLowerCase().includes(query)).length;
                        const bMatches = bSkills.filter((s: string) => s.toLowerCase().includes(query)).length;
                        return bMatches - aMatches;
                    });
                }
                break;
        }

        return result;
    }, [jobs, searchQuery, filters, sortBy]);

    const clearFilters = () => {
        setFilters({ location: '', workMode: '', jobLevel: '', employmentType: '', salaryMin: '', salaryMax: '', skills: [], company: '', industry: '', education: '' });
        setSearchQuery('');
        setSortBy('newest');
    };

    const saveFilterPreset = (name: string) => {
        const preset = { searchQuery, filters, sortBy, name, savedAt: new Date().toISOString() };
        const savedPresets = JSON.parse(localStorage.getItem('jobSearchPresets') || '[]');
        const updatedPresets = [...savedPresets.filter((p: any) => p.name !== name), preset];
        localStorage.setItem('jobSearchPresets', JSON.stringify(updatedPresets));
        toast.success(`Đã lưu bộ lọc "${name}"`);
    };

    const loadFilterPreset = (preset: any) => {
        setSearchQuery(preset.searchQuery || '');
        setFilters(preset.filters || { location: '', workMode: '', jobLevel: '', employmentType: '', salaryMin: '', salaryMax: '', skills: [], company: '', industry: '', education: '' });
        setSortBy(preset.sortBy || 'newest');
        toast.success(`Đã tải bộ lọc "${preset.name}"`);
    };

    const getSavedPresets = () => JSON.parse(localStorage.getItem('jobSearchPresets') || '[]');
    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : value !== '').length + (searchQuery ? 1 : 0);

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 pb-20 space-y-6">

            {/* TIÊU ĐỀ TRANG ĐƯỢC CHUẨN HÓA UI */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-8 h-8 text-blue-500" /> Khám phá Cơ hội
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Lọc vị trí phù hợp với năng lực và nộp CV trực tiếp từ thư viện cá nhân.</p>
            </div>

            {/* THANH TÌM KIẾM CHUNG */}
            <JobSearchBar
                searchQuery={searchQuery} onSearchChange={setSearchQuery}
                filters={filters} onFiltersChange={setFilters}
                filterOptions={filterOptions} onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                onSavePreset={saveFilterPreset} onLoadPreset={loadFilterPreset}
                savedPresets={getSavedPresets()}
            />

            {/* THANH SUMMARY & SORTING CHUẨN UI SAAS */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                    Có <span className="text-blue-600 dark:text-blue-400">{filteredJobs.length}</span> vị trí phù hợp
                </span>

                <div className="flex items-center gap-4">
                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="text-rose-500 font-bold hover:underline hover:text-rose-600 transition-colors">
                            Xóa ({activeFiltersCount}) bộ lọc
                        </button>
                    )}

                    <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                        <label className="font-bold hidden sm:block">Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="salary_high">Lương cao nhất</option>
                            <option value="salary_low">Lương thấp nhất</option>
                            {searchQuery && <option value="relevance">Liên quan nhất</option>}
                        </select>
                    </div>
                </div>
            </div>

            {/* DANH SÁCH JOB CARD */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                        {jobs.length === 0 ? 'Hệ thống hiện chưa có vị trí nào đang tuyển.' : 'Không tìm thấy việc làm phù hợp.'}
                    </p>
                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                            Xóa bộ lọc và thử lại
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            cvLibrary={cvLibrary}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}