'use client';
import { useUIStore } from '@/store/useUIStore';
import ApplyModal from './ApplyModal';

export default function ApplyModalGate() {
    const { isApplyModalOpen, applyJobId, applyJobTitle, closeApplyModal } = useUIStore();

    if (!isApplyModalOpen || !applyJobId) return null;

    return (
        <ApplyModal
            jobId={applyJobId}
            jobTitle={applyJobTitle || 'Vị trí ứng tuyển'}
            onClose={closeApplyModal}
        />
    );
}