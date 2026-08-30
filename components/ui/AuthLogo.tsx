'use client';

import { ROUTES } from '@/constants/routes';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function AuthLogo() {
    return (
        <div className="absolute top-8 left-8">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-800 rounded-button flex items-center justify-center shadow-card-hover group-hover:scale-105 transition-transform">
                    <Hexagon
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                    />
                </div>

                <span className="font-black text-xl tracking-tight text-text dark:text-white">
                    ATS
                    <span className="text-primary-600 dark:text-primary-400">
                        SYSTEM
                    </span>
                </span>
            </Link>
        </div>
    );
}