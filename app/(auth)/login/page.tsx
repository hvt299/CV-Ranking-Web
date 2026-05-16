'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempGoogleToken, setTempGoogleToken] = useState('');
    const [selectedGoogleRole, setSelectedGoogleRole] = useState<'hr' | 'applicant'>('applicant');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', {
                email: email,
                password: password
            });

            login(res.data.access_token);
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

    const handleGoogleAuth = async (accessToken: string, targetRole?: string) => {
        try {
            setIsLoading(true);
            const res = await api.post('/auth/google', {
                access_token: accessToken,
                role: targetRole
            });

            if (res.status === 202 && res.data.action === 'require_role') {
                setTempGoogleToken(accessToken);
                setShowRoleModal(true);
                setIsLoading(false);
                return;
            }

            login(res.data.access_token);
            toast.success('Đăng nhập thành công!');
            setShowRoleModal(false);

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.detail || 'Lỗi đăng nhập Google');
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            handleGoogleAuth(tokenResponse.access_token);
        },
        onError: () => toast.error('Đăng nhập Google thất bại')
    });

    const submitGoogleRole = () => {
        handleGoogleAuth(tempGoogleToken, selectedGoogleRole);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                        <Briefcase className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Chào mừng trở lại!</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hệ thống quản lý tuyển dụng AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email công việc</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                placeholder="name@company.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                            <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-rose-500 text-xs font-medium bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-3 rounded-lg">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 group">
                        Đăng nhập ngay
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hoặc</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Đăng nhập với Google
                    </button>
                </div>

                <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Đăng ký ngay</Link>
                </p>
            </div>

            {/* ================= MODAL CHỌN ROLE DÀNH CHO GOOGLE LOGIN ================= */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center">Chào mừng người mới! 🎉</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm">
                            Hệ thống nhận thấy đây là lần đầu bạn đăng nhập. Vui lòng chọn vai trò để hoàn tất hồ sơ.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setSelectedGoogleRole('applicant')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedGoogleRole === 'applicant'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-md shadow-blue-500/10'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <span className="text-4xl mb-1">👤</span>
                                <span className="font-bold text-sm">Ứng viên</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedGoogleRole('hr')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedGoogleRole === 'hr'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-md shadow-blue-500/10'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <span className="text-4xl mb-1">💼</span>
                                <span className="font-bold text-sm">Nhà tuyển dụng</span>
                            </button>
                        </div>

                        <button
                            onClick={submitGoogleRole}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex justify-center items-center gap-2"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Hoàn tất'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}