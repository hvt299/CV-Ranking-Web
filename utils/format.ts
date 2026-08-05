import { SalaryRange } from '@/types';

/**
 * Loại bỏ tất cả ký tự không phải là số (dùng khi người dùng gõ vào input tiền)
 */
export const parseCurrency = (val: string): number => {
    return Number(val.replace(/[^0-9]/g, ''));
};

/**
 * Format số thành chuỗi tiền tệ chuẩn Việt Nam (VD: 1000000 -> 1.000.000)
 */
export const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('vi-VN').format(val);
};

/**
 * Format dải lương thành chuỗi hiển thị gọn gàng (Dùng cho UI Card, Detail)
 */
export const formatSalaryRange = (salary?: SalaryRange): string => {
    if (!salary?.min_salary) return 'Thỏa thuận';

    // Rút gọn lương (VD: 15.000.000 -> 15Tr)
    const formatShort = (val: number) => {
        if (val >= 1000000) return `${val / 1000000}Tr`;
        return formatCurrency(val);
    };

    const minStr = formatShort(salary.min_salary);
    const maxStr = salary.max_salary ? formatShort(salary.max_salary) : '';
    const curr = salary.currency === 'USD' ? '$' : '₫'; // Đổi VND thành ký hiệu ₫ cho ngắn

    if (maxStr) {
        return `${minStr} - ${maxStr}${curr}`;
    }
    return `Từ ${minStr}${curr}`;
};

/**
 * Format ngày tháng theo chuẩn Việt Nam (DD/MM/YYYY)
 */
export const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'Chưa cập nhật';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
        return 'Ngày không hợp lệ';
    }
};

export const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, color: 'bg-slate-200 dark:bg-slate-700', label: '' };
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, color: 'bg-rose-500', label: 'Yếu' };
    if (score === 2) return { score, color: 'bg-amber-500', label: 'Trung bình' };
    if (score >= 3) return { score, color: 'bg-emerald-500', label: 'Mạnh' };
    return { score, color: 'bg-slate-200 dark:bg-slate-700', label: '' };
};

/**
 * Tính toán thời gian đếm ngược trả về Object (Dành cho UI Đồng hồ số)
 */
export const getCountdownParts = (deadline?: string | Date) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - Date.now();

    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, isExpired: true };

    return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false
    };
};

/**
 * Tính toán thời gian đếm ngược đến hạn nộp hồ sơ
 */
export const getDeadlineCountdown = (deadline?: string | Date): string => {
    if (!deadline) return 'Không thời hạn';
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0) return 'Đã hết hạn';

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hết hạn hôm nay';
    return `Còn ${days} ngày`;
};