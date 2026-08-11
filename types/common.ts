export enum UserRole {
    ADMIN = "admin",
    HR_OWNER = "hr_owner",
    HR_MEMBER = "hr_member",
    APPLICANT = "applicant"
}

export enum JobStatus {
    DRAFT = "draft",
    OPEN = "open",
    PAUSED = "paused",
    CLOSED = "closed",
    EXPIRED = "expired"
}

export enum ApplicationStatus {
    NEW = "new",
    REVIEWING = "reviewing",
    INTERVIEW = "interview",
    OFFERED = "offered",
    HIRED = "hired",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
    EXPIRED = "expired"
}

export enum ApplicationSource {
    HR_SOURCED = "hr_sourced",
    APPLICANT_APPLY = "applicant_apply"
}

export enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error"
}

export enum NotificationReadStatus {
    UNREAD = "unread",
    READ = "read"
}

export enum CompanyStatus {
    PENDING_VERIFICATION = "pending_verification",
    VERIFIED = "verified",
    SUSPENDED = "suspended",
    REJECTED = "rejected"
}

export enum AuditAction {
    COMPANY_VERIFIED = "company_verified",
    COMPANY_REJECTED = "company_rejected",
    COMPANY_SUSPENDED = "company_suspended",
    COMPANY_UPDATED = "company_updated",
    APPLICATION_STATUS_CHANGED = "application_status_changed",
    APPLICATION_NOTE_ADDED = "application_note_added",
    JOB_CREATED = "job_created",
    JOB_UPDATED = "job_updated",
    JOB_DELETED = "job_deleted",
    HR_MEMBER_INVITED = "hr_member_invited",
    HR_MEMBER_REMOVED = "hr_member_removed",
    USER_ROLE_UPDATED = "user_role_updated",
    USER_STATUS_UPDATED = "user_status_updated",
    USER_ANONYMIZED = "user_anonymized",
    PASSWORD_RESET = "password_reset",
    LOGIN_FAILED = "login_failed",
}

export enum SubscriptionTier {
    FREE = "free",
    PRO = "pro",
    ENTERPRISE = "enterprise"
}

export enum AdminLevel {
    PROVINCE = "province",
    DISTRICT = "district",
    WARD = "ward"
}

export enum RecommendationEnum {
    HIRE = "hire",
    NO_HIRE = "no_hire",
    MAYBE = "maybe"
}

export enum AlertFrequency {
    DAILY = "daily",
    WEEKLY = "weekly"
}

export interface ApiResponse<T> {
    status: string;
    message?: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface DashboardAnalytics {
    total_jobs: number;
    open_jobs: number;
    total_cvs_in_pool: number;
    status_breakdown: Record<ApplicationStatus | string, number>;
}