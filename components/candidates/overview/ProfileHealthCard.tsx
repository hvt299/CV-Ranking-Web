import Link from 'next/link';
import { ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

interface ProfileHealthCardProps {
    user: any;
    profile: any;
}

export default function ProfileHealthCard({ user, profile }: ProfileHealthCardProps) {
    let score = 20;
    if (profile?.phone) score += 20;
    if (profile?.headline) score += 20;
    if (profile?.bio) score += 20;
    if (profile?.github || profile?.linkedin || profile?.current_location?.province_name) score += 20;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            {/* Background trang trí */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 border-primary-100 dark:border-primary-900/50 bg-white dark:bg-slate-800">
                    <img
                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name}&background=random`}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </div>

            <div className="flex-1 relative z-10 text-center md:text-left w-full">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">
                    {getGreeting()}, <span className="text-primary-600 dark:text-primary-400">{user?.full_name?.split(' ').pop() || 'Bạn'}</span>!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-2 max-w-3xl">
                    {profile?.headline || 'Hãy cập nhật tiêu đề hồ sơ (Headline) để AI dễ dàng nhận diện và đề xuất việc làm cho bạn.'}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 max-w-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Sức khỏe hồ sơ
                        </span>
                        <span className="text-sm font-black text-primary-600 dark:text-primary-400">{score}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>

                    {score < 100 ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" /> Bổ sung thông tin để tăng 30% cơ hội trúng tuyển
                            </p>
                            <Link
                                href="/profile"
                                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm shrink-0"
                            >
                                Cập nhật ngay <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3">
                            Tuyệt vời! Hồ sơ của bạn đã sẵn sàng chinh phục mọi nhà tuyển dụng.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}