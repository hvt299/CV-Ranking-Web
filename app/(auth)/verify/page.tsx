'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '@/features/auth/auth.service';
import confetti from 'canvas-confetti';
import AuthLogo from '@/components/ui/AuthLogo';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Link xác thực không hợp lệ hoặc bị thiếu.');
            return;
        }

        const verifyAccount = async () => {
            try {
                const res = await authService.verifyAccount(token);

                setStatus('success');
                setMessage(
                    res.data.message ||
                    'Tài khoản của bạn đã được kích hoạt thành công!'
                );

                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
                });
            } catch (error: any) {
                setStatus('error');
                setMessage(
                    error.response?.data?.detail ||
                    'Xác thực thất bại. Link có thể đã hết hạn.'
                );
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="flex flex-col items-center text-center">
            {status === 'loading' && (
                <>
                    <Loader2 className="mb-6 h-16 w-16 animate-spin text-primary-500" />

                    <h1 className="text-2xl font-bold text-text">
                        Đang xử lý...
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600 shadow-card">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-text">
                        Tuyệt vời!
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>

                    <Link
                        href="/login"
                        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover"
                    >
                        Đến trang Đăng nhập

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100 text-error-600 shadow-card">
                        <XCircle className="h-10 w-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-text">
                        Rất tiếc!
                    </h1>

                    <p className="mt-2 text-text-muted">{message}</p>

                    <div className="mt-8 flex w-full gap-4">
                        <Link
                            href="/login"
                            className="flex-1 rounded-xl border border-border bg-surface-hover py-3.5 text-center font-bold text-text transition-all hover:border-border-hover"
                        >
                            Đăng nhập
                        </Link>

                        <Link
                            href="/register"
                            className="flex-1 rounded-xl bg-button-primary-bg py-3.5 text-center font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover"
                        >
                            Đăng ký lại
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />

            {/* Ambient Background Elements */}
            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary-700/10 blur-[100px]" />

            <AuthLogo />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-card-border bg-card-bg p-10 shadow-card transition-colors duration-300">
                <Suspense
                    fallback={
                        <div className="text-center text-text-muted">
                            Đang xác thực...
                        </div>
                    }
                >
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}