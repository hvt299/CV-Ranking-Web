'use client';

import { useState } from 'react';
import { Building2, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

// Import các sub-components đã được tách
import ProfileForm from '@/components/shared/ProfileForm';
import CompanySettingsSection from '@/components/companies/settings/CompanySettingsSection';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [mainTab, setMainTab] = useState<'personal' | 'business'>('personal');

    if (!user) return null;

    // Chỉ HR Owner mới có quyền chỉnh sửa thông tin Doanh nghiệp
    const isOwner = user.role === UserRole.HR_OWNER;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-32">

            {/* HEADER CÀI ĐẶT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Cài đặt Hệ thống</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản cá nhân và cấu hình doanh nghiệp.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setMainTab('personal')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'personal' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <UserIcon className="w-4 h-4" /> Cá nhân
                    </button>
                    {isOwner && (
                        <button
                            onClick={() => setMainTab('business')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${mainTab === 'business' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Building2 className="w-4 h-4" /> Doanh nghiệp
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT RENDER TÙY THEO TAB */}
            <div className="w-full">
                {mainTab === 'personal' ? (
                    <ProfileForm />
                ) : isOwner ? (
                    <CompanySettingsSection user={user} />
                ) : null}
            </div>

        </div>
    );
}