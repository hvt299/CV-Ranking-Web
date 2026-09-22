import React from 'react';
import AuthLogo from '@/components/ui/AuthLogo';

interface AuthShellProps {
    children: React.ReactNode;
    variant: 'login' | 'register';
}

export default function AuthShell({ children, variant }: AuthShellProps) {
    const isLogin = variant === 'login';
    const cardMaxWidth = isLogin ? 'max-w-[520px]' : 'max-w-[1000px]';

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-16 transition-colors duration-300 relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-20 pointer-events-none" />

            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-info-500/10 dark:bg-info-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Logo ATS SYSTEM top-left for SaaS feel */}
            <AuthLogo />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div 
                    className={`w-full bg-card-bg rounded-card shadow-card-hover dark:shadow-none p-6 sm:p-8 md:p-10 border border-card-border transition-[max-width,height] duration-500 ease-in-out ${cardMaxWidth}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
