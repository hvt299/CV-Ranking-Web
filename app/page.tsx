'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, BrainCircuit, FileSearch } from 'lucide-react';

export default function LandingPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl text-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-200 dark:border-blue-500/20">
                    <Sparkles className="w-4 h-4" /> AI ATS Platform v1.0
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight mb-6">
                    Tuyển dụng thông minh <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                        Dẫn đầu bằng AI
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                    Hệ thống tự động phân tích, bóc tách và xếp hạng hàng trăm CV chỉ trong vài giây. Giúp HR tìm đúng người, đúng việc, tiết kiệm 80% thời gian.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group">
                            Vào Bảng Điều Khiển
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group">
                                Bắt đầu miễn phí
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-2xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                Đăng nhập hệ thống
                            </Link>
                        </>
                    )}
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-20 text-left">
                    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Chấm điểm NLP</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Phân tích ngữ nghĩa JD và CV để tìm ra độ tương thích chuyên sâu, không chỉ là đếm từ khóa.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                            <FileSearch className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Xếp hạng Real-time</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Bảng Leaderboard trực quan, chấm điểm kỹ năng và kinh nghiệm rõ ràng từng ứng viên.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
