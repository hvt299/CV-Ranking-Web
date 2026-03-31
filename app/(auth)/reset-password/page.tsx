'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token: token,
                new_password: password
            });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
            router.push('/login');
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
                <h1 className="text-2xl font-bold text-rose-600 mb-2">Lỗi xác thực</h1>
                <p className="text-slate-500 mb-6">Liên kết đặt lại mật khẩu của bạn không hợp lệ hoặc bị thiếu.</p>
                <Link href="/forgot-password" className="text-blue-600 font-bold hover:underline">Yêu cầu liên kết mới</Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                    <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Tạo mật khẩu mới</h1>
                <p className="text-slate-500 text-sm mt-2">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu mới</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="password" required minLength={8}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                        *Tối thiểu 8 ký tự, gồm 1 chữ hoa, 1 chữ thường, 1 số & 1 ký tự đặc biệt.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận Mật khẩu mới</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="password" required
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                    {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
                <Suspense fallback={<div className="text-center text-slate-500">Đang tải dữ liệu...</div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    );
}