'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/register', {
                email: email,
                password: password
            });

            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(`Lỗi dữ liệu: ${detail[0].msg}`);
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Tạo tài khoản mới</h1>
                    <p className="text-slate-500 text-sm mt-1">Gia nhập hệ thống AI ATS</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email công việc</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password" required minLength={6}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-rose-500 text-xs font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group mt-2"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-emerald-600 font-bold hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}