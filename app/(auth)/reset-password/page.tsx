'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/features/auth/auth.service';
import AuthLogo from '@/components/ui/AuthLogo';
import { getPasswordStrength } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Token không hợp lệ!');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (passStrength.score < 2) {
            toast.error('Mật khẩu quá yếu! Yêu cầu chữ hoa, số và ký tự đặc biệt.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({
                token: token,
                new_password: password
            });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
            router.push(ROUTES.LOGIN);
        } catch (error: any) {
            const detail = error.response?.data?.detail;

            if (typeof detail === 'string') {
                toast.error(detail);
            } else if (Array.isArray(detail)) {
                const errorMessage = detail[0].msg.replace('Value error, ', '');
                toast.error(errorMessage);
            } else {
                toast.error('Liên kết không hợp lệ hoặc đã hết hạn.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-error-600 dark:text-error-500">
                    Lỗi xác thực
                </h1>

                <p className="mb-6 text-text-muted">
                    Liên kết đặt lại mật khẩu của bạn không hợp lệ hoặc bị thiếu.
                </p>

                <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="font-bold text-primary-600 hover:underline"
                >
                    Yêu cầu liên kết mới
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-button-primary-bg shadow-card">
                    <ShieldCheck className="h-6 w-6 text-button-primary-text" />
                </div>

                <h1 className="text-2xl font-bold text-text">
                    Tạo mật khẩu mới
                </h1>

                <p className="mt-2 text-sm text-text-muted">
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text">
                        Mật khẩu mới
                    </label>

                    <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-12 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-text-subtle hover:text-text"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2">
                        <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
                            <div
                                className={`flex-1 ${passStrength.score >= 1
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />

                            <div
                                className={`flex-1 ${passStrength.score >= 2
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />

                            <div
                                className={`flex-1 ${passStrength.score >= 3
                                    ? passStrength.color
                                    : 'bg-border'
                                    } transition-colors`}
                            />
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-text-muted">
                                Ít nhất 8 ký tự, 1 chữ hoa, 1 số & 1 ký tự đặc biệt
                            </span>

                            <span
                                className={`text-[10px] font-bold ${passStrength.color.replace(
                                    'bg-',
                                    'text-'
                                )}`}
                            >
                                {passStrength.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text">
                        Xác nhận Mật khẩu mới
                    </label>

                    <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="w-full rounded-xl border border-input-border bg-input-bg py-3 pr-12 pl-12 text-sm font-medium text-text outline-none transition-all placeholder:font-medium placeholder:text-text-subtle focus:border-input-focus focus:ring-2 focus:ring-primary-500/20"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-text-subtle hover:text-text"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-button-primary-bg py-3.5 font-bold text-button-primary-text shadow-card transition-all hover:bg-button-primary-hover disabled:opacity-60"
                >
                    {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 transition-colors duration-300">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />

            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary-500/10 blur-[100px]" />

            <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary-700/10 blur-[100px]" />

            <AuthLogo />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-card-border bg-card-bg p-10 shadow-card transition-colors duration-300">
                <Suspense
                    fallback={
                        <div className="text-center text-text-muted">
                            Đang tải dữ liệu...
                        </div>
                    }
                >
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    );
}