import { UserRole } from "@/types";

export const ROLES = [
    { value: UserRole.APPLICANT, label: 'Ứng viên', color: 'bg-slate-100 text-slate-700' },
    { value: UserRole.HR_OWNER, label: 'HR Owner', color: 'bg-blue-100 text-blue-700' },
    { value: UserRole.HR_MEMBER, label: 'HR Member', color: 'bg-indigo-100 text-indigo-700' },
    { value: UserRole.ADMIN, label: 'Admin', color: 'bg-purple-100 text-purple-700' },
];