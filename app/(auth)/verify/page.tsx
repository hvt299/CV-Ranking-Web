'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

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
                const res = await api.get(`/auth/verify?token=${token}`);
                setStatus('success');
                setMessage(res.data.message || 'Tài khoản của bạn đã được kích hoạt thành công!');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.detail || 'Xác thực thất bại. Link có thể đã hết hạn.');
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="flex flex-col items-center text-center">
            {status === 'loading' && (
                <>
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Đang xử lý...</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tuyệt vời!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{message}</p>
                    <Link href="/login" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg dark:shadow-none flex items-center justify-center gap-2 group">
                        Đến trang Đăng nhập
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Rất tiếc!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{message}</p>
                    <div className="flex gap-4 w-full mt-8">
                        <Link href="/login" className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-3.5 rounded-xl transition-all">
                            Đăng nhập
                        </Link>
                        <Link href="/register" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg dark:shadow-none">
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <Suspense fallback={<div className="text-center text-slate-500 dark:text-slate-400">Đang xác thực...</div>}>
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}