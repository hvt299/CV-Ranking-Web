export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col transition-colors selection:bg-blue-500/30">
            <main className="flex-1 flex flex-col relative">
                {children}
            </main>
        </div>
    );
}