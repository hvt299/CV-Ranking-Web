export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">
            {/* TODO: Sẽ tách thành <ApplicantNavbar /> sau */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex justify-between items-center font-bold">
                    <span>Applicant Portal (Navbar Ngang)</span>
                    {/* Nút Avatar User ở đây */}
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}