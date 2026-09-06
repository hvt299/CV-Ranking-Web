'use client';

import { Suspense } from 'react';
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import GlobalUrlListener from '@/components/shared/GlobalUrlListener';
import ApplyModalGate from '@/components/modals/ApplyModalGate';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';

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

                    {/* Toaster tích hợp Nút X, giới hạn 1.5 giây và kéo giãn chiều rộng */}
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 1500,
                            style: { maxWidth: '600px', minWidth: '350px' }
                        }}
                    >
                        {(t) => (
                            <ToastBar toast={t}>
                                {({ icon, message }) => (
                                    <>
                                        {icon}
                                        {message}
                                        {t.type !== 'loading' && (
                                            <button
                                                onClick={() => toast.dismiss(t.id)}
                                                className="p-1 ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </ToastBar>
                        )}
                    </Toaster>

                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}