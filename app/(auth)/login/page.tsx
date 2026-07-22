'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Search, Eye, EyeOff, User, Briefcase, Globe, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api-client'
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedInAuth } from '@/hooks/useLinkedInAuth'
import toast from 'react-hot-toast';
import { UserRole } from '@/types';
import Select from 'react-select';
import { INDUSTRIES } from '@/constants/job.constants';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [tempSocialToken, setTempSocialToken] = useState('');
    const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin'>('google');

    const [selectedSocialRole, setSelectedSocialRole] = useState<UserRole.HR_OWNER | UserRole.APPLICANT>(UserRole.APPLICANT);

    // ĐÃ FIX: Gộp chung thành 1 object state đồng bộ với register
    const [socialHrInfo, setSocialHrInfo] = useState({
        companyName: '',
        taxCode: '',
        industry: '',
        size: '',
        address: '',
        website: ''
    });

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // ĐÃ FIX: Hàm lookup cập nhật đúng vào socialHrInfo
    const handleLookupTax = async (code: string) => {
        if (!code.trim()) return toast.error("Vui lòng nhập Mã số thuế");
        try {
            const res = await apiClient.get(`/companies/lookup-tax/${code}`);
            setSocialHrInfo(prev => ({
                ...prev,
                companyName: res.data.company_name,
                address: res.data.address || ''
            }));
            toast.success("Đã tìm thấy thông tin công ty!");
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Không tìm thấy dữ liệu từ Mã số thuế này");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            const res = await apiClient.post('/auth/login', { email, password });
            login(res.data.access_token);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') setError(detail);
            else if (Array.isArray(detail)) setError(detail[0].msg.replace('Value error, ', ''));
            else setError('Lỗi đăng nhập. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    // ĐÃ FIX: Payload đẩy lên Backend nhận đầy đủ thông tin HR
    const handleSocialAuth = async (accessToken: string, provider: 'google' | 'linkedin', roleToSubmit?: string, companyData?: any) => {
        try {
            setIsLoading(true);
            const payload: any = { access_token: accessToken };
            if (roleToSubmit) payload.role = roleToSubmit;

            if (companyData) {
                payload.company_name = companyData.companyName;
                payload.tax_code = companyData.taxCode;
                payload.industry = companyData.industry;
                payload.size = companyData.size;
                payload.address = companyData.address;
                payload.website = companyData.website;
            }

            const endpoint = provider === 'google' ? '/auth/google' : '/auth/linkedin';
            const res = await apiClient.post(endpoint, payload);

            if (res.status === 202 && res.data.action === 'require_role') {
                setTempSocialToken(accessToken);
                setSocialProvider(provider);
                setShowRoleModal(true);
                setIsLoading(false);
                return;
            }

            login(res.data.access_token);
            toast.success('Đăng nhập thành công!');
            setShowRoleModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.detail || `Lỗi đăng nhập ${provider}`);
            setIsLoading(false);
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

    // ĐÃ FIX: Truyền socialHrInfo thay vì các biến cũ
    const submitSocialRole = () => {
        if (selectedSocialRole === UserRole.HR_OWNER && (!socialHrInfo.companyName.trim() || !socialHrInfo.taxCode.trim())) {
            toast.error('Vui lòng nhập Tên Công ty và Mã số thuế!');
            return;
        }
        handleSocialAuth(tempSocialToken, socialProvider, selectedSocialRole, socialHrInfo);
    };

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
            borderColor: state.isFocused ? '#3b82f6' : isDarkMode ? '#334155' : '#cbd5e1',
            borderRadius: '0.75rem',
            minHeight: '42px',
            padding: '0 4px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            fontSize: '0.875rem',
            color: isDarkMode ? '#e2e8f0' : '#334155',
        }),
        input: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
        singleValue: (base: any) => ({ ...base, color: isDarkMode ? '#e2e8f0' : '#334155' }),
        placeholder: (base: any) => ({ ...base, color: isDarkMode ? '#94a3b8' : '#64748b' }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '0.75rem', overflow: 'hidden', fontSize: '0.875rem',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? isDarkMode ? '#334155' : '#eff6ff' : 'transparent',
            color: isDarkMode ? '#e2e8f0' : '#334155',
            cursor: 'pointer',
            ':active': { backgroundColor: isDarkMode ? '#475569' : '#dbeafe' },
        }),
        dropdownIndicator: (base: any) => ({ ...base, color: isDarkMode ? '#94a3b8' : '#64748b' }),
        clearIndicator: (base: any) => ({ ...base, color: isDarkMode ? '#94a3b8' : '#64748b' }),
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 dark:shadow-none">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Chào mừng trở lại</h1>
                    <p className="text-slate-500 text-sm mt-1">Đăng nhập để tiếp tục quản lý tuyển dụng</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500" placeholder="name@company.com" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                            <Link href="/forgot-password" className="text-sm text-blue-600 font-medium hover:underline">Quên mật khẩu?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-rose-500 text-xs font-medium bg-rose-50 p-3 rounded-lg">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group mt-2">
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">Hoặc</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="mt-6 space-y-3">
                    <button type="button" onClick={() => loginWithGoogle()} className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Tiếp tục với Google
                    </button>
                    <button type="button" onClick={() => linkedInLogin()} className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2" />
                        </svg>
                        Tiếp tục với LinkedIn
                    </button>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Chưa có tài khoản? <Link href="/register" className="text-blue-600 font-bold hover:underline">Tạo tài khoản</Link>
                </p>
            </div>

            {/* MODAL BỔ SUNG THÔNG TIN KHI DÙNG SOCIAL */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-bold text-center mb-2">Chào mừng người mới! 🎉</h3>
                        <p className="text-slate-500 text-center text-sm mb-6">Vui lòng chọn vai trò để hoàn tất hồ sơ.</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button type="button" onClick={() => setSelectedSocialRole(UserRole.APPLICANT)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedSocialRole === UserRole.APPLICANT ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                                <User className="w-8 h-8 mb-1" />
                                <span className="font-bold text-sm">Ứng viên</span>
                            </button>
                            <button type="button" onClick={() => setSelectedSocialRole(UserRole.HR_OWNER)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedSocialRole === UserRole.HR_OWNER ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                                <Briefcase className="w-8 h-8 mb-1" />
                                <span className="font-bold text-sm">Nhà tuyển dụng</span>
                            </button>
                        </div>

                        {selectedSocialRole === UserRole.HR_OWNER && (
                            <div className="mb-6 space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Mã số thuế <span className="text-rose-500">*</span></label>
                                        <div className="flex gap-2">
                                            <input type="text" required value={socialHrInfo.taxCode} onChange={e => setSocialHrInfo({ ...socialHrInfo, taxCode: e.target.value })} className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-sm outline-none focus:border-blue-500" placeholder="VD: 0312..." />
                                            <button type="button" onClick={() => handleLookupTax(socialHrInfo.taxCode)} className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0 transition-colors"><Search className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Tên Công ty <span className="text-rose-500">*</span></label>
                                        <input type="text" required value={socialHrInfo.companyName} onChange={e => setSocialHrInfo({ ...socialHrInfo, companyName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-sm outline-none focus:border-blue-500" placeholder="TechCorp" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Ngành nghề</label>
                                        <Select
                                            options={INDUSTRIES}
                                            styles={customSelectStyles}
                                            placeholder="Tìm..."
                                            noOptionsMessage={() => "Không tìm thấy"}
                                            onChange={(selected: any) => setSocialHrInfo({ ...socialHrInfo, industry: selected?.value || '' })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Quy mô</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <select value={socialHrInfo.size} onChange={e => setSocialHrInfo({ ...socialHrInfo, size: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-sm outline-none focus:border-blue-500 appearance-none">
                                                <option value="">Chọn quy mô</option>
                                                <option value="1-50">1-50 nhân sự</option>
                                                <option value="51-200">51-200 nhân sự</option>
                                                <option value="201-1000">201-1000 nhân sự</option>
                                                <option value="1000+">Hơn 1000</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold mb-1">Địa chỉ</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="text" value={socialHrInfo.address} onChange={e => setSocialHrInfo({ ...socialHrInfo, address: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-sm outline-none focus:border-blue-500" placeholder="Địa chỉ trụ sở chính" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold mb-1">Website (Tùy chọn)</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="url" value={socialHrInfo.website} onChange={e => setSocialHrInfo({ ...socialHrInfo, website: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-sm outline-none focus:border-blue-500" placeholder="https://www.company.com" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={submitSocialRole} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold">
                            {isLoading ? 'Đang xử lý...' : 'Hoàn tất'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}