import { AuditAction } from '@/types';

export const AUDIT_ACTION_CONFIG: Record<string, { label: string; colorClass: string }> = {
    [AuditAction.COMPANY_VERIFIED]: { label: 'Duyệt Doanh nghiệp', colorClass: 'text-success-600 bg-success-50 dark:bg-success-500/10' },
    [AuditAction.COMPANY_REJECTED]: { label: 'Từ chối Doanh nghiệp', colorClass: 'text-error-600 bg-error-50 dark:bg-error-500/10' },
    [AuditAction.COMPANY_SUSPENDED]: { label: 'Đình chỉ Doanh nghiệp', colorClass: 'text-warning-600 bg-warning-50 dark:bg-warning-500/10' },
    [AuditAction.COMPANY_UPDATED]: { label: 'Cập nhật Doanh nghiệp', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },

    [AuditAction.APPLICATION_STATUS_CHANGED]: { label: 'Cập nhật Ứng viên', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
    [AuditAction.APPLICATION_NOTE_ADDED]: { label: 'Thêm Ghi chú Ứng viên', colorClass: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10' },

    [AuditAction.JOB_CREATED]: { label: 'Tạo Job mới', colorClass: 'text-success-600 bg-success-50 dark:bg-success-500/10' },
    [AuditAction.JOB_UPDATED]: { label: 'Cập nhật Job/AI', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
    [AuditAction.JOB_DELETED]: { label: 'Xóa Job', colorClass: 'text-error-600 bg-error-50 dark:bg-error-500/10' },

    [AuditAction.HR_MEMBER_INVITED]: { label: 'Mời HR Member', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
    [AuditAction.HR_MEMBER_REMOVED]: { label: 'Xóa HR Member', colorClass: 'text-error-600 bg-error-50 dark:bg-error-500/10' },

    [AuditAction.USER_ROLE_UPDATED]: { label: 'Cập nhật Quyền User', colorClass: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10' },
    [AuditAction.USER_STATUS_UPDATED]: { label: 'Khóa/Mở khóa User', colorClass: 'text-warning-600 bg-warning-50 dark:bg-warning-500/10' },
    [AuditAction.USER_ANONYMIZED]: { label: 'Ẩn danh User', colorClass: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10' },

    [AuditAction.PASSWORD_RESET]: { label: 'Reset Mật khẩu', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
    [AuditAction.LOGIN_FAILED]: { label: 'Đăng nhập Thất bại', colorClass: 'text-error-600 bg-error-50 dark:bg-error-500/10' },
};