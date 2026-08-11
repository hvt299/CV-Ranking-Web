import { LocationDetail } from "./job";

export enum ParsingStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}

export interface SkillMatch {
    skill_id?: string;
    name: string;
}

export interface FraudAnalysis {
    detected: boolean;
    risk_score: number;
    penalty: number;
    reasons: string[];
    evidence: any[];
}

export interface CandidateInfo {
    full_name?: string;
    email?: string;
    phone?: string;
    current_location?: LocationDetail; // Tự động sử dụng cấu trúc chuẩn
    github?: string;
    linkedin?: string;
    portfolio: string[];
    education_level: string;
    years_of_experience: number;
    skill_experience: Record<string, number>;
    job_hops: number;
    gap_months: number;
    fraud_analysis?: FraudAnalysis;
}

export interface CV {
    id: string;
    owner_user_id: string;
    filename: string;
    file_url: string;
    display_name: string;

    candidate_info: CandidateInfo;
    extracted_skills: SkillMatch[];

    is_primary: boolean;
    parsing_status: ParsingStatus;
    parsing_error?: string;

    created_at: string;
    updated_at?: string;
}

// Bổ sung interface cho trang Profile của Ứng viên (dựa theo ApplicantProfileDB)
export interface ApplicantProfile {
    id: string;
    user_id: string;

    headline?: string;
    desired_job_titles: string[];

    expected_salary_min?: number;
    expected_salary_max?: number;
    currency: string;

    current_location?: LocationDetail;
    preferred_locations: LocationDetail[];
    willing_to_relocate: boolean;
    availability_date?: string; // Date ISO string

    github?: string;
    linkedin?: string;
    portfolio: string[];

    primary_cv_document_id?: string;

    created_at: string;
    updated_at?: string;
}