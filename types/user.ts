import { UserRole, AuditAction } from "./common";

export interface User {
    id: string;
    email: string;
    full_name: string;

    avatar_url?: string;
    original_avatar_url?: string;

    role: UserRole;
    company_id?: string;
    department_id?: string;

    job_title_internal?: string;
    extension_phone?: string;
    phone?: string;
    bio?: string;

    is_verified: boolean;
    email_verified_at?: string;

    is_active: boolean;
    banned_reason?: string;
    banned_at?: string;
    banned_by_admin_id?: string;

    last_login_at?: string;
    created_at: string;
    updated_at?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}