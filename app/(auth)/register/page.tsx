'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, UserPlus, Building, Briefcase, Users, Eye, EyeOff, User, PhoneCall } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';
import { useAuthFlow } from '@/features/auth/useAuthFlow';
import AuthLogo from '@/components/ui/AuthLogo';
import HrEnterpriseForm from '@/components/auth/HrEnterpriseForm';
import AuthSocialButtons from '@/components/auth/AuthSocialButtons';
import SocialRoleModal from '@/components/auth/SocialRoleModal';
import { getPasswordStrength, parseVietnameseAddress } from '@/utils/format';

export default function RegisterPage() {
    const { register: handleRegister, isLoading, socialLoginFlow } = useAuthFlow();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [role, setRole] = useState<UserRole.HR_OWNER | UserRole.APPLICANT>(UserRole.APPLICANT);
    const [hrInfo, setHrInfo] = useState({ companyName: '', taxCode: '', industry: '', size: '', address: '', website: '' });

    const [error, setError] = useState('');

    // Modal social dùng chung với Login — không tự quản state riêng nữa
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempSocialToken, setTempSocialToken] = useState('');
    const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin'>('google');

    const [isDarkMode, setIsDarkMode] = useState(false);

    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeConsulting, setAgreeConsulting] = useState(false);
    const passStrength = getPasswordStrength(password);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('invite_token');
        if (token) {
            setInviteToken(token);
            setRole(UserRole.HR_MEMBER as any);
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.email) setEmail(payload.email);
            } catch (e) { }
        }

        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!agreeTerms) return setError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư!');
        if (password !== confirmPassword) return setError('Mật khẩu xác nhận không khớp!');
        if (passStrength.score < 2) return setError('Mật khẩu quá yếu! Yêu cầu chữ hoa, số và ký tự đặc biệt.');
        if (role === UserRole.HR_OWNER && (!hrInfo.companyName.trim() || !hrInfo.taxCode.trim())) {
            return setError('Vui lòng nhập Tên công ty và Mã số thuế!');
        }

        const payload = {
            full_name: fullName, email, password, role,
            invite_token: inviteToken,
            ...(role === UserRole.HR_OWNER && !inviteToken && {
                company_name: hrInfo.companyName,
                tax_code: hrInfo.taxCode,
                industry: hrInfo.industry,
                size: hrInfo.size,
                website: hrInfo.website,
                location: parseVietnameseAddress(hrInfo.address) // Bóc tách tự động ra LocationDetail
            })
        };

        await handleRegister(payload, !!inviteToken);
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
            payload.location = parseVietnameseAddress(companyData.address); // Bóc tách tự động ra LocationDetail
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
        onSuccess: (res) => handleSocialAuth(res.access_token, 'google'),
        onError: () => toast.error('Đăng nhập Google thất bại')
    });

    const { linkedInLogin } = useLinkedInAuth({
        onSuccess: (code) => handleSocialAuth(code, 'linkedin'),
        onError: (message) => toast.error(message),
    });

    return (
        <div className="min-h-screen bg-background dark:bg-text flex items-center justify-center p-4 py-10 transition-colors duration-300 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />

            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-700/10 dark:bg-primary-800/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Logo ATS SYSTEM */}
            <AuthLogo />

            <div className="max-w-xl w-full bg-card-bg dark:bg-slate-800 rounded-card shadow-card-hover dark:shadow-none p-8 md:p-10 border border-card-border dark:border-slate-700 relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-button-primary-bg rounded-button flex items-center justify-center mb-4 shadow-card-hover dark:shadow-none">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-text dark:text-white">Tạo tài khoản mới</h1>
                    <p className="text-text-muted text-sm mt-1">Gia nhập hệ thống quản lý tuyển dụng AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Phần chọn vai trò (Chỉ hiển thị khi không có inviteToken) */}
                    {!inviteToken && (
                        <div>
                            <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-2">Bạn là</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole(UserRole.APPLICANT)}
                                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-button border-2 transition-all ${role === UserRole.APPLICANT ? 'border-primary-600 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-card' : 'border-border dark:border-slate-700 text-text-muted hover:border-primary-200 dark:hover:border-slate-600'}`}
                                >
                                    <User className="w-6 h-6 mb-1" />
                                    <span className="font-bold text-sm">Ứng viên</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole(UserRole.HR_OWNER)}
                                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-button border-2 transition-all ${role === UserRole.HR_OWNER ? 'border-primary-600 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-card' : 'border-border dark:border-slate-700 text-text-muted hover:border-primary-200 dark:hover:border-slate-600'}`}
                                >
                                    <Briefcase className="w-6 h-6 mb-1" />
                                    <span className="font-bold text-sm">Nhà tuyển dụng</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Thông báo nếu có inviteToken */}
                    {inviteToken && (
                        <div className="bg-info-50 dark:bg-indigo-900/20 border border-info-100 dark:border-indigo-800 p-4 rounded-2xl flex items-center gap-3">
                            <div className="p-2 bg-info-100 dark:bg-info-500/20 text-info-600 rounded-full shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-info-700 dark:text-info-500">Thư mời gia nhập Hệ thống</p>
                                <p className="text-xs text-info-600/80 dark:text-info-500/80">Bạn đang tạo tài khoản nhân sự. Vui lòng thiết lập mật khẩu</p>
                            </div>
                        </div>
                    )}

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-1.5">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-input-bg dark:bg-text border border-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-sm text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 transition-all" placeholder="Nguyễn Văn A" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={!!inviteToken} className="w-full pl-9 pr-3 py-2.5 bg-input-bg dark:bg-text border border-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-sm text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 disabled:opacity-50 transition-all" placeholder="name@company.com" />
                            </div>
                        </div>
                    </div>

                    {/* Khu vực thông tin nhà tuyển dụng — dùng chung HrEnterpriseForm với Login/SocialRoleModal */}
                    {role === UserRole.HR_OWNER && !inviteToken && (
                        <div className="animate-in fade-in slide-in-from-top-2 p-5 bg-primary-50/50 dark:bg-slate-800/50 rounded-2xl border border-primary-100 dark:border-slate-700 space-y-4 mt-2">
                            <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400 flex items-center gap-2"><Building className="w-4 h-4" /> Hồ sơ Doanh nghiệp</h3>
                            <HrEnterpriseForm hrInfo={hrInfo} setHrInfo={setHrInfo} isDarkMode={isDarkMode} />
                        </div>
                    )}

                    {/* Phần mật khẩu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-1.5">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                                <input type={showPassword ? "text" : "password"} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-9 pr-10 py-2.5 bg-input-bg dark:bg-text border border-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-sm text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 transition-all" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text dark:hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* THANH ĐO PASSWORD STRENGTH */}
                            <div className="mt-2">
                                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
                                    <div className={`flex-1 ${passStrength.score >= 1 ? passStrength.color : 'bg-border dark:bg-slate-700'} transition-colors`}></div>
                                    <div className={`flex-1 ${passStrength.score >= 2 ? passStrength.color : 'bg-border dark:bg-slate-700'} transition-colors`}></div>
                                    <div className={`flex-1 ${passStrength.score >= 3 ? passStrength.color : 'bg-border dark:bg-slate-700'} transition-colors`}></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-text-muted dark:text-text-subtle font-medium">Ít nhất 8 ký tự, 1 chữ hoa, 1 số & 1 ký tự đặc biệt</span>
                                    <span className={`text-[10px] font-bold ${passStrength.color.replace('bg-', 'text-')}`}>{passStrength.label}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text dark:text-slate-300 mb-1.5">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
                                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-9 pr-10 py-2.5 bg-input-bg dark:bg-text border border-border dark:border-slate-700 rounded-button outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-input-focus text-sm text-text dark:text-white placeholder-text-subtle dark:placeholder-slate-500 transition-all" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text dark:hover:text-white transition-colors">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI ĐIỀU KHOẢN */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-start gap-2.5 bg-input-bg dark:bg-slate-800/50 p-3.5 rounded-button border border-border dark:border-slate-700">
                            <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer shrink-0" />
                            <div>
                                <label htmlFor="agreeTerms" className="text-sm text-text dark:text-slate-300 cursor-pointer block leading-relaxed font-medium">
                                    Tôi đã đọc và đồng ý với <Link href="/terms" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Chính sách Quyền riêng tư</Link> của hệ thống.
                                </label>
                                <p className="text-xs text-error-700 italic mt-1 font-medium">* Chúng tôi không thể cung cấp dịch vụ nếu không nhận được sự đồng ý ở mục này.</p>
                            </div>
                        </div>

                        {role === UserRole.HR_OWNER && !inviteToken && (
                            <div className="flex items-start gap-2.5 bg-input-bg dark:bg-slate-800/50 p-3.5 rounded-button border border-border dark:border-slate-700">
                                <input type="checkbox" id="agreeConsulting" checked={agreeConsulting} onChange={e => setAgreeConsulting(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border-hover text-primary-600 focus:ring-primary-500 cursor-pointer shrink-0" />
                                <div>
                                    <label htmlFor="agreeConsulting" className="text-sm text-text dark:text-slate-300 cursor-pointer block leading-relaxed font-medium">
                                        Tôi đồng ý nhận thông tin tư vấn để được hỗ trợ đăng tin nhanh, cách tối ưu hiệu quả tin đăng và các giải pháp tuyển dụng phù hợp.
                                    </label>
                                    <p className="text-xs text-text-muted dark:text-text-subtle mt-1 font-medium italic"><b className="text-text dark:text-slate-300">Khuyên dùng:</b> Nếu không có sự đồng ý, chuyên viên sẽ không thể liên hệ hỗ trợ xác thực tài khoản nhanh chóng.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-error-700 text-xs font-semibold bg-error-50 dark:bg-error-500/10 p-3 rounded-lg border border-error-100 dark:border-rose-500/20">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-button-primary-bg hover:bg-button-primary-hover disabled:bg-primary-400 dark:disabled:bg-primary-800 text-white font-bold py-3.5 rounded-button flex items-center justify-center gap-2 mt-4 shadow-card-hover transition-colors">
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-border dark:bg-slate-700 flex-1"></div>
                    <span className="text-xs font-semibold text-text-subtle uppercase">Hoặc</span>
                    <div className="h-px bg-border dark:bg-slate-700 flex-1"></div>
                </div>

                <AuthSocialButtons onGoogleClick={loginWithGoogle} onLinkedInClick={linkedInLogin} mode="register" />

                <div className="mt-8 text-center space-y-4">
                    <p className="text-slate-600 dark:text-text-subtle text-sm font-medium">
                        Đã có tài khoản? <Link href="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-colors">Đăng nhập ngay</Link>
                    </p>
                    <div className="flex flex-col items-center justify-center gap-1.5 pt-6 border-t border-border dark:border-slate-800">
                        <span className="text-xs text-text-muted dark:text-text-subtle font-medium">Bạn gặp khó khăn khi tạo tài khoản?</span>
                        <span className="text-xs text-text-muted dark:text-text-subtle flex items-center gap-1.5">
                            Vui lòng gọi tới số <a href="tel:1900000000" className="flex items-center gap-1 font-bold text-text dark:text-white hover:text-primary-600 transition-colors"><PhoneCall className="w-3.5 h-3.5" /> 1900 000 000</a> (giờ hành chính).
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal social dùng chung — hiển thị y hệt Login: đủ chọn vai trò + HrEnterpriseForm + checkbox điều khoản */}
            <SocialRoleModal
                isOpen={showRoleModal}
                isLoading={isLoading}
                onSubmit={(role, companyData) => handleSocialAuth(tempSocialToken, socialProvider, role, companyData)}
            />
        </div>
    );
}