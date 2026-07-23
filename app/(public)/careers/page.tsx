'use client';

import { useState, useEffect } from 'react';
import { jobService } from '@/features/job/job.service';
import { Job } from '@/types';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';
import { Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Bổ sung đầy đủ các State bắt buộc cho JobSearchBar
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryMin: '', salaryMax: '', skills: [] as string[],
        company: '', industry: '', education: ''
    });

    // Tùy chọn cho bộ lọc (Có thể call API hoặc lấy động từ danh sách jobs)
    const [filterOptions, setFilterOptions] = useState({
        locations: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'],
        workModes: ['Remote', 'Hybrid', 'Tại văn phòng'],
        jobLevels: ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Manager'],
        employmentTypes: ['Toàn thời gian', 'Bán thời gian', 'Hợp đồng'],
        skills: ['React', 'Node.js', 'Python', 'Java', 'UI/UX'],
        companies: [],
        industries: [],
        educations: ['Đại học', 'Cao đẳng']
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobService.getPublicJobs();
                setJobs(data);
            } catch (error) {
                toast.error('Không thể tải danh sách việc làm');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Đếm số lượng bộ lọc đang active
    const activeFiltersCount = Object.values(filters).filter(value =>
        Array.isArray(value) ? value.length > 0 : value !== ''
    ).length + (searchQuery ? 1 : 0);

    const clearFilters = () => {
        setFilters({
            location: '', workMode: '', jobLevel: '', employmentType: '',
            salaryMin: '', salaryMax: '', skills: [], company: '',
            industry: '', education: ''
        });
        setSearchQuery('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-2xl mb-2">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Tìm kiếm <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">công việc mơ ước</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                    Khám phá hàng ngàn cơ hội việc làm từ các doanh nghiệp hàng đầu.
                </p>
            </div>

            {/* Gọi đúng tên prop: onFiltersChange và truyền đủ các props */}
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

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Đang tải việc làm...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KHÔNG bọc thẻ <div> onClick nữa để tránh xung đột với nút bấm bên trong Card */}
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isPublic={true}  // Kích hoạt cờ Khách vãng lai
                        />
                    ))}

                    {jobs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 font-medium">Chưa có công việc nào đang mở.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}