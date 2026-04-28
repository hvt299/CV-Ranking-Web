'use client';

import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import JobSearchBar from '@/components/shared/JobSearchBar';
import JobCard from '@/components/shared/JobCard';

export default function ApplyPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, salary_high, salary_low, relevance
    const [filters, setFilters] = useState({
        location: '',
        workMode: '',
        jobLevel: '',
        salaryMin: '',
        salaryMax: '',
        skills: [] as string[],
        company: ''
    });

    // Available filter options
    const [filterOptions, setFilterOptions] = useState({
        locations: [] as string[],
        workModes: [] as string[],
        jobLevels: [] as string[],
        skills: [] as string[],
        companies: [] as string[]
    });

    useEffect(() => {
        api.get('/apply/jobs').then(res => {
            setJobs(res.data);
            setFilteredJobs(res.data);
            
            // Extract filter options from jobs data
            const locations = [...new Set(res.data.map((job: any) => job.location?.city).filter(Boolean))] as string[];
            const workModes = [...new Set(res.data.map((job: any) => job.work_mode).filter(Boolean))] as string[];
            const jobLevels = [...new Set(res.data.map((job: any) => job.job_level).filter(Boolean))] as string[];
            const skills = [...new Set(res.data.flatMap((job: any) => job.required_skills || []))] as string[];
            const companies = [...new Set(res.data.map((job: any) => job.company_name).filter(Boolean))] as string[];
            
            setFilterOptions({
                locations,
                workModes,
                jobLevels,
                skills,
                companies
            });
        }).catch(() => {
            toast.error('Không thể tải danh sách việc làm');
        }).finally(() => setIsLoading(false));
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = jobs;

        // Text search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job => 
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.required_skills?.some((skill: string) => skill.toLowerCase().includes(query))
            );
        }

        // Apply filters
        if (filters.location) {
            filtered = filtered.filter(job => job.location?.city === filters.location);
        }
        if (filters.workMode) {
            filtered = filtered.filter(job => job.work_mode === filters.workMode);
        }
        if (filters.jobLevel) {
            filtered = filtered.filter(job => job.job_level === filters.jobLevel);
        }
        if (filters.company) {
            filtered = filtered.filter(job => job.company_name === filters.company);
        }
        if (filters.salaryMin) {
            filtered = filtered.filter(job => 
                job.salary?.min_salary && job.salary.min_salary >= parseInt(filters.salaryMin)
            );
        }
        if (filters.salaryMax) {
            filtered = filtered.filter(job => 
                job.salary?.max_salary && job.salary.max_salary <= parseInt(filters.salaryMax)
            );
        }
        if (filters.skills.length > 0) {
            filtered = filtered.filter(job => 
                filters.skills.some(skill => 
                    job.required_skills?.includes(skill)
                )
            );
        }

        setFilteredJobs(filtered);
    }, [jobs, searchQuery, filters]);

    // Sort jobs
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
            case 'relevance':
                // Sort by number of matching skills if search query exists
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    sorted.sort((a, b) => {
                        const aMatches = (a.required_skills || []).filter((skill: string) => 
                            skill.toLowerCase().includes(query)
                        ).length;
                        const bMatches = (b.required_skills || []).filter((skill: string) => 
                            skill.toLowerCase().includes(query)
                        ).length;
                        return bMatches - aMatches;
                    });
                }
                break;
        }
        
        setFilteredJobs(sorted);
    }, [sortBy]); // Only depend on sortBy to avoid infinite loop

    const clearFilters = () => {
        setFilters({
            location: '',
            workMode: '',
            jobLevel: '',
            salaryMin: '',
            salaryMax: '',
            skills: [],
            company: ''
        });
        setSearchQuery('');
        setSortBy('newest');
    };

    // Save and load filter presets
    const saveFilterPreset = (name: string) => {
        const preset = {
            searchQuery,
            filters,
            sortBy,
            name,
            savedAt: new Date().toISOString()
        };
        
        const savedPresets = JSON.parse(localStorage.getItem('jobSearchPresets') || '[]');
        const updatedPresets = [...savedPresets.filter((p: any) => p.name !== name), preset];
        localStorage.setItem('jobSearchPresets', JSON.stringify(updatedPresets));
        toast.success(`Đã lưu bộ lọc "${name}"`);
    };

    const loadFilterPreset = (preset: any) => {
        setSearchQuery(preset.searchQuery || '');
        setFilters(preset.filters || {
            location: '',
            workMode: '',
            jobLevel: '',
            salaryMin: '',
            salaryMax: '',
            skills: [],
            company: ''
        });
        setSortBy(preset.sortBy || 'newest');
        toast.success(`Đã tải bộ lọc "${preset.name}"`);
    };

    const getSavedPresets = () => {
        return JSON.parse(localStorage.getItem('jobSearchPresets') || '[]');
    };

    const activeFiltersCount = Object.values(filters).filter(value => 
        Array.isArray(value) ? value.length > 0 : value !== ''
    ).length + (searchQuery ? 1 : 0);

    const handleApplySuccess = () => {
        // Refresh jobs list or update UI as needed
        // Could also show a success message or update application status
    };

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 pb-20 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Việc làm đang tuyển</h1>
                <p className="text-slate-500 mt-1">Tìm vị trí phù hợp và nộp CV trực tiếp</p>
            </div>

            {/* Search and Filter Section */}
            <JobSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFiltersChange={setFilters}
                filterOptions={filterOptions}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                onSavePreset={saveFilterPreset}
                onLoadPreset={loadFilterPreset}
                savedPresets={getSavedPresets()}
            />

            {/* Results Summary and Sort */}
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Tìm thấy {filteredJobs.length} việc làm</span>
                <div className="flex items-center gap-4">
                    {activeFiltersCount > 0 && (
                        <span>Đã áp dụng {activeFiltersCount} bộ lọc</span>
                    )}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">
                        {jobs.length === 0 
                            ? 'Hiện chưa có vị trí nào đang tuyển' 
                            : 'Không tìm thấy việc làm phù hợp với tiêu chí tìm kiếm'
                        }
                    </p>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="mt-3 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Xóa bộ lọc và thử lại
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onApplySuccess={handleApplySuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
