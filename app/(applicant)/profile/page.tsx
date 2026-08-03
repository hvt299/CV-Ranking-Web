'use client';

import ProfileForm from '@/components/shared/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Thông tin cá nhân</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Quản lý thông tin, ảnh đại diện và cài đặt tài khoản của bạn</p>
            </div>

            <ProfileForm />
        </div>
    );
}