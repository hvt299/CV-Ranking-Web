'use client';

import { useAuth } from '@/context/AuthContext';
import { LogIn, User } from 'lucide-react';
import Link from 'next/link';

export default function AuthStatus() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                <LogIn className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                    Bạn chưa đăng nhập.{' '}
                    <Link href="/login" className="font-medium underline hover:no-underline">
                        Đăng nhập ngay
                    </Link>
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
                Xin chào, <span className="font-medium">{user?.full_name}</span>
            </span>
        </div>
    );
}