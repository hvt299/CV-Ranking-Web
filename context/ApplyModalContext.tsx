'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/modals/ApplyModal';

interface ApplyContextType {
    openApplyModal: (jobId: string, jobTitle?: string) => void;
    closeApplyModal: () => void;
}

const ApplyContext = createContext<ApplyContextType | undefined>(undefined);

function ApplyModalUrlHandler({ setIsOpen, setSelectedJobId, setSelectedJobTitle }: any) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        const applyJobId = searchParams.get('applyJobId');
        if (applyJobId && isAuthenticated) {
            setSelectedJobId(applyJobId);
            setSelectedJobTitle('Vị trí ứng tuyển');
            setIsOpen(true);

            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('applyJobId');
            const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, isAuthenticated, loading, pathname, router]);

    return null;
}

export function ApplyModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const openApplyModal = (jobId: string, jobTitle?: string) => {
        if (!isAuthenticated) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('applyJobId', jobId);
            const callbackUrl = encodeURIComponent(`${pathname}?${currentParams.toString()}`);
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        setSelectedJobId(jobId);
        setSelectedJobTitle(jobTitle || 'Vị trí ứng tuyển');
        setIsOpen(true);
    };

    const closeApplyModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            setSelectedJobId(null);
            setSelectedJobTitle(null);
        }, 300);
    };

    return (
        <ApplyContext.Provider value={{ openApplyModal, closeApplyModal }}>
            {/* BỌC SUSPENSE ĐỂ CÁCH LY LỖI BUILD CỦA NEXT.JS */}
            <Suspense fallback={null}>
                <ApplyModalUrlHandler
                    setIsOpen={setIsOpen}
                    setSelectedJobId={setSelectedJobId}
                    setSelectedJobTitle={setSelectedJobTitle}
                />
            </Suspense>

            {children}

            {isOpen && selectedJobId && (
                <ApplyModal
                    jobId={selectedJobId}
                    jobTitle={selectedJobTitle || 'Vị trí ứng tuyển'}
                    onClose={closeApplyModal}
                />
            )}
        </ApplyContext.Provider>
    );
}

export const useApplyModal = () => {
    const context = useContext(ApplyContext);
    if (!context) throw new Error('useApplyModal must be used within ApplyModalProvider');
    return context;
};