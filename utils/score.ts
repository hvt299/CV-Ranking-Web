/**
 * Trả về class màu sắc cho các điểm thành phần (skills_score, nlp_score...)
 */
export const getSubScoreClass = (val: number): string => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    if (val >= 50) return 'bg-amber-50 text-amber-600 border border-amber-100';
    return 'bg-rose-50 text-rose-600 border border-rose-100';
};

/**
 * Trả về bộ cấu hình màu sắc và nhãn cho điểm AI tổng (dùng cho vòng tròn điểm)
 */
export const getScoreTheme = (score: number) => {
    if (score >= 80) return {
        ring: 'text-emerald-500', bg: 'text-emerald-100', border: 'border-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700', label: 'Phù hợp'
    };
    if (score >= 50) return {
        ring: 'text-amber-500', bg: 'text-amber-100', border: 'border-amber-500',
        badge: 'bg-amber-100 text-amber-700', label: 'Tạm ổn'
    };
    return {
        ring: 'text-rose-500', bg: 'text-rose-100', border: 'border-rose-500',
        badge: 'bg-rose-100 text-rose-700', label: 'Chưa đạt'
    };
};