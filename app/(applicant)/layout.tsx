import ApplicantHeader from '@/components/layout/ApplicantHeader';
import NotificationToast from '@/components/shared/NotificationToast';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors duration-300 font-sans">
            {/* Header tích hợp chung Navbar */}
            <ApplicantHeader />

            {/* Không gian làm việc */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
                {children}
            </main>

            {/* Chữ bản quyền */}
            <footer className="py-6 text-center text-xs font-medium text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800">
                © 2026 ATS System. Nền tảng Quản trị Tuyển dụng AI.
            </footer>

            {/* Trình lắng nghe Notification Global */}
            <NotificationToast />
        </div>
    );
}