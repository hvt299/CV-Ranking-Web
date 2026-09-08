export const ROUTES = {
    // PUBLIC
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PUBLIC_JOBS: '/jobs',
    PUBLIC_JOB_DETAIL: (id: string) => `/jobs/${id}`,
    PUBLIC_COMPANIES: '/companies',
    PUBLIC_COMPANY_DETAIL: (id: string) => `/companies/${id}`,
    PRICING: '/pricing',
    ABOUT: '/about',
    BLOG: '/blog',
    SUPPORT: '/support',

    // APPLICANT
    APPLICANT_DASHBOARD: '/applicant/dashboard',
    APPLICANT_CV_LIBRARY: '/applicant/cv-library',
    APPLICANT_APPLICATIONS: '/applicant/my-applications',
    APPLICANT_SELF_SCORE: '/applicant/self-score',
    APPLICANT_PROFILE: '/applicant/profile',
    APPLICANT_SETTINGS: '/applicant/settings',
    APPLICANT_BILLING: '/applicant/billing',
    APPLICANT_NOTIFICATIONS: '/applicant/notifications',

    // HR
    HR_DASHBOARD: '/hr/dashboard',
    HR_JOBS: '/hr/jobs',
    HR_JOB_CREATE: '/hr/jobs/create',
    HR_JOB_EDIT: (id: string) => `/hr/jobs/edit/${id}`,
    HR_JOB_DETAIL: (id: string) => `/hr/jobs/${id}`,
    HR_CANDIDATES: '/hr/candidates',
    HR_ANALYTICS: '/hr/analytics',
    HR_SETTINGS: '/hr/settings',
    HR_BILLING: '/hr/billing',

    // ADMIN
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_COMPANIES: '/admin/companies',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_AUDIT_LOGS: '/admin/audit-logs',
    ADMIN_SUPPORT_TICKETS: '/admin/support-tickets',
    ADMIN_SETTINGS: '/admin/settings',
};