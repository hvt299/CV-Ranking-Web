import LandingClient from '@/components/landing/LandingClient';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background dark:bg-slate-950 text-text dark:text-slate-300 font-sans selection:bg-primary-500/30 selection:text-primary-600 dark:selection:text-primary-200 overflow-x-hidden transition-colors duration-300">
            <LandingClient />
        </main>
    );
}