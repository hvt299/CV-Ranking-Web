'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Search, Eye, EyeOff, User, Briefcase, Globe, MapPin, Users, Hexagon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';
import { useAuthFlow } from '@/features/auth/useAuthFlow';
import AuthLogo from '@/components/ui/AuthLogo';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import SocialRoleModal from '@/components/auth/SocialRoleModal';
import { parseVietnameseAddress } from '@/utils/format';

export default function LoginPage() {
    const { login: handleLogin, isLoading, socialLoginFlow } = useAuthFlow();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempSocialToken, setTempSocialToken] = useState('');
    const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin'>('google');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        await handleLogin({ email, password });
    };

    const handleSocialAuth = async (accessToken: string, provider: 'google' | 'linkedin', roleToSubmit?: string, companyData?: any) => {
        const payload: any = provider === 'google'
            ? { access_token: accessToken }
            : { code: accessToken, redirect_uri: `${window.location.origin}/linkedin` };

        if (roleToSubmit) payload.role = roleToSubmit;
        if (companyData) {
            payload.company_name = companyData.companyName;
            payload.tax_code = companyData.taxCode;
            payload.industry = companyData.industry;
            payload.size = companyData.size;
            payload.website = companyData.website;
            payload.location = parseVietnameseAddress(companyData.address); // Áp dụng hàm tách địa chỉ
        }

        const result = await socialLoginFlow(provider, payload);

        if (result?.requireRole) {
            setTempSocialToken(accessToken);
            setSocialProvider(provider);
            setShowRoleModal(true);
        } else if (result?.success) {
            setShowRoleModal(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => handleSocialAuth(tokenResponse.access_token, 'google'),
        onError: () => toast.error('Đăng nhập Google thất bại')
    });

    const { linkedInLogin } = useLinkedInAuth({
        onSuccess: (code) => handleSocialAuth(code, 'linkedin'),
        onError: (message) => toast.error(message),
    });

    return (
        <div className="min-h-screen bg-background dark:bg-text flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />

            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-700/10 dark:bg-primary-800/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Logo ATS SYSTEM */}
            <AuthLogo />

            <div className="max-w-md w-full bg-card-bg dark:bg-slate-800 rounded-card shadow-card-hover dark:shadow-none p-10 border border-card-border dark:border-slate-700 relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-button-primary-bg rounded-button flex items-center justify-center mb-4 shadow-card-hover dark:shadow-none">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-text dark:text-white">Chào mừng trở lại</h1>
                    <p className="text-text-muted text-sm mt-1">Đăng nhập để tiếp tục quản lý tuyển dụng</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-input-bg dark:bg-text border border-input-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus transition-all text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 placeholder:font-medium" placeholder="name@company.com" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-semibold text-text dark:text-slate-300">Mật khẩu</label>
                            <Link href="/forgot-password" className="text-sm text-primary-600 font-medium hover:underline transition-colors">Quên mật khẩu?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-input-bg dark:bg-text border border-input-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus transition-all text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 placeholder:font-medium"
                                placeholder="••••••••"
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text dark:hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-error-700 text-xs font-semibold bg-error-50 dark:bg-rose-500/10 p-3 rounded-lg border border-error-100 dark:border-rose-500/20">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-button-primary-bg hover:bg-button-primary-hover disabled:bg-primary-400 dark:disabled:bg-primary-800 text-white font-bold py-3.5 rounded-button flex items-center justify-center gap-2 group mt-2 shadow-card-hover transition-colors">
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-border dark:bg-slate-700 flex-1"></div>
                    <span className="text-xs font-semibold text-text-subtle uppercase">Hoặc</span>
                    <div className="h-px bg-border dark:bg-slate-700 flex-1"></div>
                </div>

                <AuthSocialButtons onGoogleClick={loginWithGoogle} onLinkedInClick={linkedInLogin} mode="login" />

                <p className="text-center mt-8 text-text-muted text-sm font-medium">
                    Chưa có tài khoản? <Link href="/register" className="text-primary-600 font-bold hover:underline transition-colors">Tạo tài khoản</Link>
                </p>
            </div>

            <SocialRoleModal
                isOpen={showRoleModal}
                isLoading={isLoading}
                onSubmit={(role, companyData) => handleSocialAuth(tempSocialToken, socialProvider, role, companyData)}
            />
        </div>
    );
}