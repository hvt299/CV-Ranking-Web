'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/features/auth/auth.service';
import AuthLogo from '@/components/ui/AuthLogo';
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setIsSent(true);
            toast.success('Link khôi phục đã được gửi!');
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />

            {/* Ambient Background Elements */}
            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary-700/10 blur-[100px]" />

            <AuthLogo />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-card-border bg-card-bg p-10 shadow-card transition-colors duration-300">
                {!isSent ? (
                    <>
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-button-primary-bg shadow-card">
                                <KeyRound className="h-6 w-6 text-button-primary-text" />
                            </div>

                            <h1 className="text-2xl font-bold text-text">
                                Quên mật khẩu?
                            </h1>

                            <p className="mt-2 text-sm text-text-muted">
                                Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-text">
                                    Email công việc
                                </label>

                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                                    <input
                                        type="email"
                                        required
                                        className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-4 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover disabled:opacity-60"
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600 shadow-card">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <h1 className="text-2xl font-bold text-text">
                            Kiểm tra Email
                        </h1>

                        <p className="mt-2 text-text-muted">
                            Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến{' '}
                            <strong className="text-text">{email}</strong>. Vui
                            lòng kiểm tra hộp thư đến hoặc thư mục Spam.
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href={ROUTES.LOGIN}
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}