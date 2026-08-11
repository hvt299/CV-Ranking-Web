export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    DASHBOARD: '/dashboard',
    JOBS: '/jobs',
    JOB_CREATE: '/jobs/create',
    JOB_EDIT: (id: string) => `/jobs/edit/${id}`,
    JOB_DETAIL: (id: string) => `/jobs/${id}`,
    CANDIDATES: '/candidates',
    OVERVIEW: '/overview',
    MY_APPLICATIONS: '/my-applications',
    ADMIN_COMPANIES: '/admin/companies',
    ADMIN_USERS: '/admin/users'
};