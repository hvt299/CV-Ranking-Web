/**
 * Trả về class màu cho điểm thành phần
 */
export const getSubScoreClass = (score: number): string => {
    if (score >= 80)
        return 'bg-success-50 text-success-700 border border-success-100';

    if (score >= 50)
        return 'bg-warning-50 text-warning-700 border border-warning-100';

    return 'bg-error-50 text-error-700 border border-error-100';
};

/**
 * Trả về theme cho điểm AI tổng
 */
export const getScoreTheme = (score: number) => {
    if (score >= 80) {
        return {
            ring: 'text-success-500',
            bg: 'text-success-100',
            border: 'border-success-500',
            badge: 'bg-success-100 text-success-700',
            label: 'Phù hợp',
        };
    }

    if (score >= 50) {
        return {
            ring: 'text-warning-500',
            bg: 'text-warning-100',
            border: 'border-warning-500',
            badge: 'bg-warning-100 text-warning-700',
            label: 'Tạm ổn',
        };
    }

    return {
        ring: 'text-error-500',
        bg: 'text-error-100',
        border: 'border-error-500',
        badge: 'bg-error-100 text-error-700',
        label: 'Chưa đạt',
    };
};

/**
 * Danh sách lý do bị trừ điểm AI
 */
export const getPenaltyReasons = (cvInfo: any, breakdown: any): string => {
    const reasons: string[] = [];

    const fraudReasons = breakdown?.fraud_analysis?.reasons ?? [];

    const fraudMap: Record<string, string> = {
        'Keyword stuffing': 'Nhồi nhét từ khóa',
        'White text': 'Chèn chữ tàng hình (màu trắng)',
        'Hidden flag': 'Cố tình ẩn chữ (Hidden text)',
        'Outside page': 'Chèn chữ ngoài lề trang',
    };

    if (fraudReasons.length) {
        reasons.push(
            ...fraudReasons.map((reason: string) => {
                if (
                    reason.includes('Tiny font') ||
                    reason.includes('Very small font')
                ) {
                    return 'Dùng font chữ siêu nhỏ';
                }

                return fraudMap[reason] ?? reason;
            })
        );
    } else if (breakdown?.fraud_analysis?.detected) {
        reasons.push('Có dấu hiệu gian lận CV');
    }

    const years = cvInfo?.years_of_experience ?? 0;
    const hops = Math.max(cvInfo?.job_hops ?? 1, 1);
    const gaps = cvInfo?.gap_months ?? 0;

    if (years > 0 && years / hops < 0.8) {
        reasons.push('Nhảy việc quá nhiều');
    }

    if (gaps > 12) {
        reasons.push(`Khoảng trống sự nghiệp dài (${gaps} tháng)`);
    }

    return reasons.length
        ? reasons.join(' + ')
        : 'Vi phạm tiêu chí hệ thống';
};