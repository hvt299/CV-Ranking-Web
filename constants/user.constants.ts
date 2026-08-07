import { UserRole } from '@/types';

export const ROLES = [
    {
        value: UserRole.APPLICANT,
        label: 'Ứng viên',
        color: 'bg-slate-100 text-slate-700',
    },
    {
        value: UserRole.HR_OWNER,
        label: 'HR Owner',
        color: 'bg-primary-100 text-primary-700',
    },
    {
        value: UserRole.HR_MEMBER,
        label: 'HR Member',
        color: 'bg-primary-50 text-primary-600',
    },
    {
        value: UserRole.ADMIN,
        label: 'Admin',
        color: 'bg-hot-100 text-hot-700',
    },
];