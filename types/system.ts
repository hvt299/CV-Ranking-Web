import { AdminLevel, AuditAction, UserRole } from "./common";

export enum TargetEntityType {
    COMPANY = "company",
    APPLICATION = "application",
    JOB = "job",
    USER = "user",
    DEPARTMENT = "department"
}

export interface SubscriptionPlan {
    id: string;
    plan_code: string;
    name: string;
    price: number;
    currency: string;
    billing_cycle: string; // 'monthly' | 'yearly'
    features: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AdministrativeUnit {
    id: string;
    code: string;
    name: string;
    level: AdminLevel;
    parent_code?: string;
    valid_from?: string; // ISO DateTime
    valid_to?: string;   // ISO DateTime
    version?: 'old' | 'new'; // BỔ SUNG TRƯỜNG NÀY ĐỂ PHÂN LOẠI
}

export interface AuditLog {
    id: string;
    actor_id: string;
    actor_role: UserRole;
    action: AuditAction;
    target_type: TargetEntityType | string;
    target_id: string;
    before_state?: Record<string, any>;
    after_state?: Record<string, any>;
    note?: string;
    created_at: string;
}

// Ánh xạ từ SkillDB của Backend sang Frontend
export interface Skill {
    id: string;
    canonical_name: string;
    industry: string;
    aliases: string[];
    category?: string;
    created_at: string;
}