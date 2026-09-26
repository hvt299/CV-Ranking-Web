import Link from 'next/link';
import { ShieldCheck, ChevronRight, AlertCircle, UserRound, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

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

    const firstName = user?.full_name?.split(' ').pop() || 'Bạn';
    const isComplete = score >= 100;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card-bg shadow-sm hover:shadow-md dark:shadow-black/20 dark:hover:shadow-black/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent group-hover:via-primary-400 dark:group-hover:via-primary-500 transition-colors duration-500" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-500/6 dark:bg-primary-500/8 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-info-500/[0.035] dark:bg-info-500/4.5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/[0.035] via-transparent to-info-500/2.5 pointer-events-none" />

            <div className="relative p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                    <div className="relative shrink-0">
                        <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary-400/30 to-info-400/20 blur-sm" />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 border-primary-100 dark:border-primary-500/20 bg-card-bg shadow-lg shadow-primary-500/10">
                            <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`} alt="Avatar" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-success-500 border-4 border-card-bg shadow-sm" />
                    </div>

                    <div className="flex-1 relative min-w-0 text-center lg:text-left w-full">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight">{getGreeting()}, <span className="text-primary-600 dark:text-primary-400">{firstName}</span>!</h2>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 text-success-600 dark:text-success-400 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                <span className="relative flex w-1.5 h-1.5">
                                    <span className="absolute inline-flex w-full h-full rounded-full bg-success-400 opacity-75 animate-ping" />
                                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success-500" />
                                </span>
                                Hồ sơ đang hoạt động
                            </span>
                        </div>

                        <p className="text-sm text-text-muted font-medium mb-6 line-clamp-2 max-w-3xl mx-auto lg:mx-0">{profile?.headline || 'Hãy cập nhật tiêu đề hồ sơ để AI dễ dàng nhận diện và đề xuất những việc làm phù hợp với bạn.'}</p>

                        <div className="relative max-w-3xl bg-background/70 dark:bg-black/10 rounded-2xl p-5 border border-border shadow-sm">
                            <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary-500/30 to-transparent" />

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle">Sức khỏe hồ sơ</p>
                                        <p className="text-xs font-medium text-text-muted mt-0.5">Mức độ hoàn thiện thông tin</p>
                                    </div>
                                </div>

                                <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1.5 rounded-lg text-xs font-black border shadow-sm ${isComplete ? 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10 border-success-100 dark:border-success-500/20' : 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20'}`}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {score}%
                                </span>
                            </div>

                            <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-linear-to-r from-success-500 to-emerald-400' : 'bg-linear-to-r from-primary-500 to-info-500'}`} style={{ width: `${score}%` }} />
                            </div>

                            {score < 100 ? (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                                    <p className="text-xs font-medium text-warning-600 dark:text-warning-400 flex items-center gap-1.5 text-left">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        Bổ sung thông tin để tăng cơ hội được nhà tuyển dụng chú ý.
                                    </p>

                                    <Link href={ROUTES.APPLICANT_PROFILE} className="group/action inline-flex items-center justify-center gap-1.5 text-xs font-bold text-text bg-card-bg hover:bg-surface-hover border border-border hover:border-primary-300 dark:hover:border-primary-700 px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md shrink-0">
                                        Cập nhật ngay
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/action:translate-x-0.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs font-bold text-success-600 dark:text-success-400 mt-4 text-left">
                                    <Sparkles className="w-4 h-4 shrink-0" />
                                    Tuyệt vời! Hồ sơ của bạn đã sẵn sàng chinh phục nhà tuyển dụng.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}