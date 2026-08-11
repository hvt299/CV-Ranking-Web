'use client';

import ProfileForm from '@/components/shared/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Hồ sơ cá nhân</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý thông tin liên hệ, ảnh đại diện và bảo mật tài khoản.</p>
                </div>
            </div>

            <ProfileForm />
        </div>
    );
}