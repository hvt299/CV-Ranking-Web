'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/types';
import { jobService } from '@/features/job/job.service';
import toast from 'react-hot-toast';

import PublicHeader from '@/components/layout/PublicHeader';
import HeroSection from '@/components/landing/HeroSection';
import CompanyMarquee from '@/components/landing/CompanyMarquee';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import { useRouter } from 'next/navigation';
import HotJobsSection from '@/components/landing/HotJobsSection';
import LatestJobsSection from '@/components/landing/LatestJobsSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import FaqSection from '@/components/landing/FaqSection';
import BottomCTA from '@/components/landing/BottomCTA';
import PublicFooter from '@/components/layout/PublicFooter';
import { systemService } from '@/features/system/system.service';

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [uniqueCompanies, setUniqueCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '',
        salaryRange: '', experienceRange: '', isHot: false,
        skills: [] as string[], company: '', industry: '', education: ''
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
                const [data, locationsRes] = await Promise.all([
                    jobService.getPublicJobs(),
                    systemService.getLocations()
                ]);

                setJobs(data);

                const locations = locationsRes;
                const industries = [...new Set(data.map((job: any) => job.industry).filter(Boolean))] as string[];

                const uniqueCompsMap = new Map();
                data.forEach((job: any) => {
                    if (job.company_name && job.company_id && !uniqueCompsMap.has(job.company_id)) {
                        uniqueCompsMap.set(job.company_id, { id: job.company_id, name: job.company_name });
                    }
                });

                setFilterOptions({ locations, workModes: [], jobLevels: [], employmentTypes: [], skills: [], companies: [], industries, educations: [] });
                setUniqueCompanies(Array.from(uniqueCompsMap.values()));
            } catch (error) {
                toast.error('Không thể tải dữ liệu hệ thống');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleSelectCompany = (companyName: string) => {
        router.push(`/careers?company=${encodeURIComponent(companyName)}`);
    };

    return (
        <div className="min-h-screen bg-background dark:bg-slate-950 text-text dark:text-slate-300 font-sans selection:bg-primary-500/30 selection:text-primary-600 dark:selection:text-primary-200 overflow-x-hidden transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />
            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
            <CompanyMarquee companies={uniqueCompanies} onSelectCompany={handleSelectCompany} />
            <FeaturesSection />
            <StatsSection />

            {/* 1. Việc làm Nổi bật (Hot Jobs) */}
            <HotJobsSection jobs={jobs} />

            {/* 2. Việc làm Mới nhất (Latest Jobs) */}
            <LatestJobsSection jobs={jobs} />

            <WorkflowSection />
            <FaqSection />
            <BottomCTA />
            <PublicFooter />
        </div>
    );
}