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