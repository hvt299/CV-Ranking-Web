'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
            toast.success('Link khôi phục đã được gửi!');
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">

                {!isSent ? (
                    <>
                        <div className="flex flex-col items-center mb-8 text-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                                <KeyRound className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quên mật khẩu?</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email công việc</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email" required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg dark:shadow-none flex items-center justify-center gap-2 mt-4">
                                {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kiểm tra Email</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến <strong className="text-slate-800 dark:text-white">{email}</strong>. Vui lòng kiểm tra hộp thư đến hoặc thư mục Spam.</p>
                    </div>
                )}

                <div className="text-center mt-8">
                    <Link href="/login" className="text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-180" /> Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}