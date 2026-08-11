import { useState, useEffect, useCallback } from 'react';
import { candidateService } from './candidate.service';
import { jobService } from '@/features/job/job.service';
import { CV, Job, JobStatus } from '@/types';
import toast from 'react-hot-toast';

export function useTalentPool() {
    const [candidates, setCandidates] = useState<CV[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isMapping, setIsMapping] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [cvData, jobData] = await Promise.all([
                candidateService.getCandidatePool(),
                jobService.getJobs()
            ]);
            setCandidates(cvData);
            setJobs(jobData.filter(j => j.status === JobStatus.OPEN));
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu hệ thống!");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const uploadFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const validFiles = Array.from(files).filter(file => file.size <= MAX_FILE_SIZE);

        if (validFiles.length < files.length) {
            toast.error(`Đã bỏ qua ${files.length - validFiles.length} file vì vượt quá giới hạn 5MB.`);
        }

        if (validFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress({ current: 0, total: validFiles.length });
        let successCount = 0, failCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const formData = new FormData();
            formData.append('file', validFiles[i]);
            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                const data = await candidateService.uploadCV(formData);
                if (data.is_existing) {
                    toast.error(`CV ${validFiles[i].name} đã có trong kho!`);
                } else {
                    successCount++;
                }
            } catch (error: any) {
                failCount++;
                toast.error(`Lỗi ${validFiles[i].name}: ${error.response?.data?.detail || 'Lỗi file'}`);
            }
        }

        setIsUploading(false);
        if (successCount > 0) toast.success(`Đã thêm ${successCount} CV mới vào Kho!`);
        await fetchData();
    };

    const deleteCV = async (cvId: string, filename: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${filename} khỏi hệ thống không? Dữ liệu ứng tuyển ở các chiến dịch cũng sẽ bị xóa!`)) return;
        try {
            await candidateService.deleteCV(cvId);
            toast.success("Đã xóa vĩnh viễn CV!");
            setCandidates(prev => prev.filter(cv => cv.id !== cvId));
        } catch (error) {
            toast.error("Lỗi khi xóa CV");
        }
    };

    const mapCvToJob = async (cvId: string, jobId: string) => {
        if (!cvId || !jobId) return toast.error("Vui lòng chọn một chiến dịch!");
        try {
            await candidateService.mapCvToJob(cvId, jobId);
            toast.success("Đã đưa ứng viên vào chiến dịch & bắt đầu chấm điểm AI!");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi ghép CV");
            return false;
        }
    };

    const mapMultipleCvsToJob = async (cvIds: string[], jobId: string) => {
        if (!cvIds || cvIds.length === 0 || !jobId) return toast.error("Vui lòng chọn ứng viên và chiến dịch!");

        setIsMapping(true);
        try {
            const res = await candidateService.mapMultipleCvsToJob(cvIds, jobId);

            if (res.successful_maps > 0) {
                toast.success(res.message);
                if (res.errors && res.errors.length > 0) {
                    toast.error(`Có ${res.errors.length} hồ sơ gặp lỗi khi ghép.`);
                }
                return true;
            } else {
                toast.error("Không có hồ sơ nào được ghép thành công.");
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi ghép CV hàng loạt");
            return false;
        } finally {
            setIsMapping(false);
        }
    };

    return {
        candidates,
        jobs,
        isLoading,
        isUploading,
        uploadProgress,
        isMapping,
        uploadFiles,
        deleteCV,
        mapCvToJob,
        mapMultipleCvsToJob,
        refetch: fetchData
    };
}