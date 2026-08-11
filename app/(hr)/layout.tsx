'use client';

import MainLayout from "@/components/layout/MainLayout";
import { HRViewProvider } from "@/context/HRViewContext";

export default function HrLayout({ children }: { children: React.ReactNode }) {
    return (
        <HRViewProvider>
            <MainLayout>{children}</MainLayout>
        </HRViewProvider>
    );
}