import { UserRole, AuditAction } from "./common";

export interface ProfileDetails {
    phone?: string;
    address?: string;
    github?: string;
    linkedin?: string;
    bio?: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar: string;
    original_avatar?: string;
    role: UserRole;
    company_id?: string;
    department_id?: string;
    is_verified?: boolean;
    profile?: ProfileDetails;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface AuditLog {
    id: string;
    actor_id: string;
    actor_role: UserRole;
    action: AuditAction;
    target_type: string;
    target_id: string;
    note?: string;
    created_at: string;
}