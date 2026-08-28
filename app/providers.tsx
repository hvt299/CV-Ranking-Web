'use client';

import { Suspense } from 'react';
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import GlobalUrlListener from '@/components/shared/GlobalUrlListener';
import ApplyModalGate from '@/components/modals/ApplyModalGate';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

                    <Suspense fallback={null}>
                        <GlobalUrlListener />
                    </Suspense>

                    {children}

                    <ApplyModalGate />

                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}