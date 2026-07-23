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

export const getPenaltyReasons = (cvInfo: any, breakdown: any) => {
        const reasons = [];

        const fraudReasons = breakdown?.fraud_analysis?.reasons || [];
        if (fraudReasons.length > 0) {
            const translated = fraudReasons.map((r: string) => {
                if (r === 'Keyword stuffing') return 'Nhồi nhét từ khóa';
                if (r === 'White text') return 'Chèn chữ tàng hình (màu trắng)';
                if (r.includes('Tiny font') || r.includes('Very small font')) return 'Dùng font chữ siêu nhỏ';
                if (r === 'Hidden flag') return 'Cố tình ẩn chữ (Hidden text)';
                if (r === 'Outside page') return 'Chèn chữ ngoài lề trang';
                return r;
            });
            reasons.push(...translated);
        } else if (breakdown?.fraud_analysis?.detected) {
            reasons.push('Có dấu hiệu gian lận CV');
        }

        const yoe = cvInfo?.years_of_experience || 0;
        const hops = cvInfo?.job_hops || 1;
        const gaps = cvInfo?.gap_months || 0;

        if (yoe > 0 && (yoe / Math.max(hops, 1)) < 0.8) {
            reasons.push("Nhảy việc quá nhiều");
        }
        if (gaps > 12) {
            reasons.push(`Khoảng trống sự nghiệp dài (${gaps} tháng)`);
        }

        return reasons.length > 0 ? reasons.join(' + ') : 'Vi phạm tiêu chí hệ thống';
    };