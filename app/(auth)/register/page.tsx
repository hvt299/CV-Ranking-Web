'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, UserPlus, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

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
                full_name: fullName,
                email: email,
                password: password
            });

            toast.success('Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác thực tài khoản.', { duration: 5000 });
            router.push('/login');
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                const errorMessage = detail[0].msg.replace('Value error, ', '');
                setError(errorMessage);
            } else {
                setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await api.post('/auth/google', {
                    access_token: tokenResponse.access_token
                });
                login(res.data.access_token);
                toast.success('Đăng nhập bằng Google thành công!');
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Lỗi xác thực Google từ máy chủ');
            }
        },
        onError: () => toast.error('Đăng nhập Google thất bại')
    });

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Tạo tài khoản mới</h1>
                    <p className="text-slate-500 text-sm mt-1">Gia nhập hệ thống quản lý tuyển dụng AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email công việc</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email" required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
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

                    {error && <p className="text-rose-500 text-xs font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group mt-2"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hoặc</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="mt-6">
                    {/* NÚT GOOGLE */}
                    <button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3"
                    >
                        {/* Biểu tượng SVG Google siêu nét */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Đăng nhập với Google
                    </button>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập ngay</Link>
                </p>
            </div>
        </div>
    );
}