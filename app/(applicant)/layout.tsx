'use client';

import ApplicantLayout from '@/components/layout/ApplicantLayout';

export default function ApplicantLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ApplicantLayout>
            {children}
        </ApplicantLayout>
    );
}
