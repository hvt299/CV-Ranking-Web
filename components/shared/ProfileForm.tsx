'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, Link, Save, Briefcase, Camera, Loader2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useMyProfile } from '@/features/application/useApplication';
import { UserRole } from '@/types';
import apiClient from '@/lib/api-client';

export default function ProfileForm() {
    const { user, updateUser } = useAuth();
    const { profile, setProfile, isLoading, isSaving, updateProfile } = useMyProfile();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    if (isLoading || !user) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
            </div>
        );
    }

    const isApplicant = user.role === UserRole.APPLICANT;
    const isHR = user.role === UserRole.HR_OWNER || user.role === UserRole.HR_MEMBER;

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updateUser) {
            await updateProfile(profile, updateUser);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Vui lòng chọn ảnh dưới 2MB");
            return;
        }

        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await apiClient.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newAvatarUrl = res.data?.data?.url || res.data?.url;
            if (newAvatarUrl) {
                setProfile((prev: any) => ({ ...prev, avatar_url: newAvatarUrl, avatar: newAvatarUrl }));
                if (updateUser) {
                    await updateUser({ ...user, avatar_url: newAvatarUrl });
                }
                toast.success("Cập nhật ảnh đại diện thành công!");
            }
        } catch (error) {
            toast.error("Lỗi khi tải ảnh lên!");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">

                {/* Khu vực Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md">
                            {isUploadingAvatar ? (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                </div>
                            ) : (
                                <img src={profile.avatar_url || user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110">
                            <Camera className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">Ảnh đại diện</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">JPG, PNG tối đa 2MB. Ảnh sẽ hiển thị công khai trên nền tảng.</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* THÔNG TIN CHUNG (Ai cũng có) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Họ và tên <span className="text-error-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text" required
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, full_name: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email" disabled
                                    value={profile.email || ''}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, phone: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="0912..."
                                />
                            </div>
                        </div>

                        {/* BLOCK DÀNH RIÊNG CHO HR */}
                        {isHR && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số máy lẻ (Tùy chọn)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profile.extension_phone || ''}
                                        onChange={(e) => setProfile((prev: any) => ({ ...prev, extension_phone: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="Ext: 101"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BLOCK DÀNH RIÊNG CHO HR (Chức danh nội bộ) */}
                    {isHR && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Chức danh / Vai trò nội bộ</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.job_title_internal || ''}
                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, job_title_internal: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="VD: Trưởng phòng Tuyển dụng, Chuyên viên Nhân sự..."
                                />
                            </div>
                        </div>
                    )}

                    {/* BLOCK DÀNH RIÊNG CHO APPLICANT */}
                    {isApplicant && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    Tiêu đề hồ sơ (Headline) <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary-100 text-primary-700">SEO CV</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profile.headline || ''}
                                        onChange={(e) => setProfile((prev: any) => ({ ...prev, headline: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        placeholder="VD: Senior React Developer với 5 năm kinh nghiệm..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Khu vực sinh sống</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profile.current_location?.province_name || ''}
                                            onChange={(e) => setProfile((prev: any) => ({ ...prev, current_location: { ...prev.current_location, province_name: e.target.value } }))}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            placeholder="Hà Nội, TP.HCM..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lương mong muốn tối thiểu (VND)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            value={profile.expected_salary_min || ''}
                                            onChange={(e) => setProfile((prev: any) => ({ ...prev, expected_salary_min: Number(e.target.value) }))}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            placeholder="15000000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">GitHub</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="url"
                                            value={profile.github || ''}
                                            onChange={(e) => setProfile((prev: any) => ({ ...prev, github: e.target.value }))}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">LinkedIn</label>
                                    <div className="relative">
                                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="url"
                                            value={profile.linkedin || ''}
                                            onChange={(e) => setProfile((prev: any) => ({ ...prev, linkedin: e.target.value }))}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* BIO (Giới thiệu bản thân - Dùng chung) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giới thiệu bản thân</label>
                        <textarea
                            value={profile.bio || ''}
                            onChange={(e) => setProfile((prev: any) => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                            placeholder={isApplicant ? "Viết vài dòng giới thiệu về bản thân, kỹ năng và định hướng..." : "Giới thiệu ngắn về bạn..."}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving || isUploadingAvatar}
                            className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary-500/20"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}