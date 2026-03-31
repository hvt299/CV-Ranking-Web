'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', {
                email: email,
                password: password
            });

            login(res.data.access_token, email);
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(`Lỗi dữ liệu: ${detail[0].msg}`);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại!');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                        <Briefcase className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Chào mừng trở lại!</h1>
                    <p className="text-slate-500 text-sm mt-1">Hệ thống Quản lý Tuyển dụng AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email công việc</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="name@company.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group">
                        Đăng nhập ngay
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-blue-600 font-bold hover:underline">Đăng ký HR</Link>
                </p>
            </div>
        </div>
    );
}