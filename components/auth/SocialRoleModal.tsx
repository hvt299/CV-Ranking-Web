'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Briefcase } from 'lucide-react';
import { UserRole } from '@/types';
import HrEnterpriseForm, { HrInfoState, DEFAULT_HR_INFO } from './HrEnterpriseForm';
import toast from 'react-hot-toast';

interface SocialRoleModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onSubmit: (role: UserRole.HR_OWNER | UserRole.APPLICANT, hrInfo: any) => void;
}

export default function SocialRoleModal({ isOpen, isLoading, onSubmit }: SocialRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole.HR_OWNER | UserRole.APPLICANT>(UserRole.APPLICANT);
    const [hrInfo, setHrInfo] = useState<HrInfoState>(DEFAULT_HR_INFO);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeConsulting, setAgreeConsulting] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!agreeTerms) return toast.error('Vui lòng đồng ý với Điều khoản dịch vụ!');
        if (selectedRole === UserRole.HR_OWNER && (!hrInfo.companyName.trim() || !hrInfo.taxCode.trim() || !hrInfo.industry || !hrInfo.size)) {
            return toast.error('Vui lòng điền đầy đủ Tên công ty, MST, Ngành nghề và Quy mô!');
        }
        onSubmit(selectedRole, hrInfo);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-700 custom-scrollbar">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Chào mừng người mới!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6 font-medium">Vui lòng chọn vai trò để hoàn tất hồ sơ.</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button type="button" onClick={() => setSelectedRole(UserRole.APPLICANT)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedRole === UserRole.APPLICANT ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-500/50'}`}>
                        <User className="w-8 h-8 mb-1" />
                        <span className="font-bold text-sm">Ứng viên</span>
                    </button>
                    <button type="button" onClick={() => setSelectedRole(UserRole.HR_OWNER)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedRole === UserRole.HR_OWNER ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-500/50'}`}>
                        <Briefcase className="w-8 h-8 mb-1" />
                        <span className="font-bold text-sm">Nhà tuyển dụng</span>
                    </button>
                </div>

                {selectedRole === UserRole.HR_OWNER && (
                    <div className="mb-6 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <HrEnterpriseForm hrInfo={hrInfo} setHrInfo={setHrInfo} isDarkMode={isDarkMode} />
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-slate-600 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                        <input type="checkbox" id="agreeSocialTerms" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                        <div>
                            <label htmlFor="agreeSocialTerms" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer block leading-relaxed font-medium">
                                Tôi đã đọc và đồng ý với <Link href="/terms" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Chính sách Quyền riêng tư</Link> của hệ thống.
                            </label>
                            <p className="text-xs text-rose-600 dark:text-rose-400 italic mt-1 font-medium">* Chúng tôi không thể cung cấp dịch vụ nếu không nhận được sự đồng ý ở mục này.</p>
                        </div>
                    </div>

                    {selectedRole === UserRole.HR_OWNER && (
                        <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-slate-600 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                            <input type="checkbox" id="agreeConsulting" checked={agreeConsulting} onChange={e => setAgreeConsulting(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" />
                            <div>
                                <label htmlFor="agreeConsulting" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer block leading-relaxed font-medium">
                                    Tôi đồng ý nhận thông tin tư vấn để được hỗ trợ đăng tin nhanh, cách tối ưu hiệu quả tin đăng và các giải pháp tuyển dụng phù hợp.
                                </label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium italic"><b className="text-slate-700 dark:text-slate-300">Khuyên dùng:</b> Nếu không có sự đồng ý, chuyên viên sẽ không thể liên hệ hỗ trợ xác thực tài khoản nhanh chóng.</p>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white py-3.5 rounded-xl mt-4 font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98]">
                    {isLoading ? 'Đang xử lý...' : 'Hoàn tất & Gia nhập'}
                </button>
            </div>
        </div >
    );
}