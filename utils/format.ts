import { SalaryRange } from '@/types';

/** Loại bỏ tất cả ký tự không phải số */
export const parseCurrency = (val: string): number => {
    const number = val.replace(/\D/g, '');
    return number ? Number(number) : 0;
};

/** Format tiền tệ Việt Nam */
export const formatCurrency = (val: number): string =>
    new Intl.NumberFormat('vi-VN').format(val);

/** Format dải lương */
export const formatSalaryRange = (salary?: SalaryRange): string => {
    if (salary?.min_salary == null) return 'Thỏa thuận';

    const symbols: Record<string, string> = {
        VND: '₫',
        USD: '$',
    };

    const formatShort = (value: number) => {
        if (value >= 1_000_000_000)
            return `${Number((value / 1_000_000_000).toFixed(1))}Tỷ`;

        if (value >= 1_000_000)
            return `${Number((value / 1_000_000).toFixed(1))}Tr`;

        return formatCurrency(value);
    };

    let min = salary.min_salary;
    let max = salary.max_salary;

    if (max != null && max < min) {
        [min, max] = [max, min];
    }

    const curr = symbols[salary.currency] ?? salary.currency;

    if (max == null) {
        return `Từ ${formatShort(min)}${curr}`;
    }

    if (min === max) {
        return `${formatShort(min)}${curr}`;
    }

    return `${formatShort(min)} - ${formatShort(max)}${curr}`;
};

/** Format ngày chuẩn Việt Nam */
export const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'Chưa cập nhật';

    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
        ? 'Ngày không hợp lệ'
        : date.toLocaleDateString('vi-VN');
};

/** Format ngày Dashboard */
export const formatOverviewDate = (date: Date): string =>
    date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

/** Độ mạnh mật khẩu */
export const getPasswordStrength = (pass: string) => {
    let score = 0;

    if (!pass)
        return { score, color: 'bg-border dark:bg-slate-700', label: '' };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1)
        return { score, color: 'bg-error-500', label: 'Yếu' };

    if (score === 2)
        return { score, color: 'bg-warning-500', label: 'Trung bình' };

    return { score, color: 'bg-success-500', label: 'Mạnh' };
};

/** Countdown chi tiết */
export const getCountdownParts = (deadline?: string | Date) => {
    if (!deadline) return null;

    const diff = new Date(deadline).getTime() - Date.now();

    if (diff <= 0)
        return { d: 0, h: 0, m: 0, s: 0, isExpired: true };

    return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
    };
};

/** Countdown hạn nộp hồ sơ */
export const getDeadlineCountdown = (deadline?: string | Date): string => {
    if (!deadline) return 'Không thời hạn';

    const diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0) return 'Đã hết hạn';

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Hết hạn hôm nay' : `Còn ${days} ngày`;
};