export const getTierBadgeConfig = (tierLevel: number) => {
    switch (tierLevel) {
        case 0: // Free / Cơ bản
            return {
                bg: "bg-slate-100 dark:bg-slate-800",
                text: "text-slate-600 dark:text-slate-300",
                border: "border-slate-200 dark:border-slate-700",
                glow: "shadow-slate-500/20"
            };
        case 1: // Starter / Plus (Info)
            return {
                bg: "bg-info-50 dark:bg-info-900/30",
                text: "text-info-600 dark:text-info-400",
                border: "border-info-100 dark:border-info-700/50", // Sửa lại mã màu có sẵn trong CSS
                glow: "shadow-info-500/30"
            };
        case 2: // Pro / Premium (Primary)
            return {
                bg: "bg-primary-50 dark:bg-primary-900/30",
                text: "text-primary-600 dark:text-primary-400",
                border: "border-primary-200 dark:border-primary-800",
                glow: "shadow-primary-500/30"
            };
        case 3: // Enterprise / VIP (Warning/Gold)
            return {
                bg: "bg-gradient-to-r from-warning-500 to-warning-600",
                text: "text-white",
                border: "border-warning-100 dark:border-warning-700/50", // Sửa lại mã màu có sẵn trong CSS
                glow: "shadow-warning-500/40"
            };
        default:
            return {
                bg: "bg-success-50 dark:bg-success-900/30",
                text: "text-success-600 dark:text-success-400",
                border: "border-success-100 dark:border-success-700/50", // Sửa lại mã màu có sẵn trong CSS
                glow: "shadow-success-500/20"
            };
    }
};

export const JOB_BADGE_CONFIG = {
    active: {
        bg: "bg-emerald-100 dark:bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/20",
        dot: "bg-emerald-500 animate-pulse",
        label: "Đang mở",
    },

    closed: {
        bg: "bg-rose-100 dark:bg-rose-500/10",
        text: "text-rose-700 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-500/20",
        dot: "bg-rose-500",
        label: "Đã đóng",
    },

    expired: {
        bg: "bg-amber-100 dark:bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/20",
        dot: "bg-amber-500",
        label: "Hết hạn",
    },

    hot: {
        bg: "bg-orange-50 dark:bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-500/20",
        glow: "shadow-sm",
        label: "Hot",
    },
} as const;

export const getJobBadgeConfig = (
    isActive: boolean,
    isClosed: boolean
) => {
    if (isActive) return JOB_BADGE_CONFIG.active;
    if (isClosed) return JOB_BADGE_CONFIG.closed;
    return JOB_BADGE_CONFIG.expired;
};