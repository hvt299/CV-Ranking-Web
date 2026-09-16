'use client';

import { ROUTES } from '@/constants/routes';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function AuthLogo() {
    return (
        <div className="absolute top-8 left-8">
            <Link
                href={ROUTES.HOME}
                className="group relative z-50 flex items-center gap-2"
            >
                {/* Logo Mark */}
                <div className="relative flex h-10 w-10 items-center justify-center">
                    {/* Ambient glow */}
                    <div className="absolute inset-0 rounded-button bg-primary-500/20 blur-md transition-all duration-500 group-hover:bg-primary-500/35 group-hover:blur-lg" />

                    {/* Main mark */}
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-button bg-linear-to-br from-primary-600 to-primary-800 shadow-card-hover transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-primary-600/30">
                        {/* Subtle light sweep */}
                        <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                        {/* Hexagon */}
                        <Hexagon
                            className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                            fill="currentColor"
                        />
                    </div>
                </div>

                {/* Wordmark */}
                <span className="text-xl font-black tracking-tight text-text dark:text-white">
                    ATS
                    <span className="text-primary-600 transition-colors duration-300 group-hover:text-primary-500 dark:text-primary-400 dark:group-hover:text-primary-300">
                        SYSTEM
                    </span>
                </span>
            </Link>
        </div>
    );
}