import { useState, useEffect, useCallback } from 'react';
import { jobService } from './job.service';
import { Job } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook quản lý danh sách Jobs và thao tác Xóa
 */
export function useJobList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await jobService.getJobs();
            setJobs(data);
        } catch (error) {
            toast.error("Không thể tải danh sách công việc");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const deleteJob = async (jobId: string) => {
        if (!confirm("Cảnh báo: Xóa chiến dịch này sẽ xóa TOÀN BỘ CV bên trong. Bạn chắc chắn chứ?")) return;
        try {
            await jobService.deleteJob(jobId);
            toast.success("Đã xóa chiến dịch và các CV liên quan");
            setJobs(prev => prev.filter(job => job.id !== jobId));
        } catch (error) {
            toast.error("Lỗi khi xóa chiến dịch");
        }
    };

    return { jobs, isLoading, fetchJobs, deleteJob };
}

/**
 * Hook lấy Bảng xếp hạng ứng viên cho 1 Job
 */
export function useJobRanking(jobId: string) {
    const [jobInfo, setJobInfo] = useState<Job | null>(null);
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRanking = useCallback(async () => {
        if (!jobId) return;
        setIsLoading(true);
        try {
            const data = await jobService.getJobRanking(jobId);
            setJobInfo(data.job_info);
            setCandidates(data.leaderboard);
            if (data.company_info) setCompanyInfo(data.company_info);
        } catch (error) {
            toast.error("Không thể tải danh sách ứng viên!");
        } finally {
            setIsLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    return { jobInfo, companyInfo, candidates, setCandidates, isLoading, refetch: fetchRanking };
}