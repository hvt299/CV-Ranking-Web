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
    const minStr = formatCurrency(salary.min_salary);
    const maxStr = salary.max_salary ? formatCurrency(salary.max_salary) : '';

    if (maxStr) {
        return `${minStr} - ${maxStr} ${salary.currency || 'VND'}`;
    }
    return `Từ ${minStr} ${salary.currency || 'VND'}`;
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

export const parseVietnameseAddress = (rawAddress: string | null) => {
    if (!rawAddress) return { province_name: '', street_address: '', full_address_snapshot: '', country: 'Việt Nam' };

    const parts = rawAddress.split(',').map(p => p.trim());
    if (parts.length === 0) return { province_name: '', street_address: '', full_address_snapshot: rawAddress, country: 'Việt Nam' };

    // Tỉnh/Thành luôn nằm ở cuối cùng
    const province_name = parts[parts.length - 1];

    // Tách phần còn lại làm số nhà/đường/quận
    let streetParts = parts.length >= 3 ? parts.slice(0, parts.length - 2) : parts.slice(0, parts.length - 1);

    return {
        province_name,
        street_address: streetParts.join(', '),
        full_address_snapshot: rawAddress,
        country: 'Việt Nam'
    };
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