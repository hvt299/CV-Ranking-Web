export interface FraudAnalysis {
    detected: boolean;
    risk_score: number;
    penalty: number;
    reasons: string[];
    evidence: any[];
}

export interface CandidateInfo {
    email?: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string[];
    education_level?: string;
    years_of_experience?: number;
    skill_experience?: Record<string, number>;
    job_hops?: number;
    gap_months?: number;
    fraud_analysis?: FraudAnalysis;
}

export interface CV {
    id: string;
    filename: string;
    file_url?: string;
    display_name?: string;
    candidate_info?: CandidateInfo;
    extracted_skills?: string[];
    created_at?: string;
}

export interface CVDocument {
    id: string;
    owner_user_id: string;
    display_name: string;
    filename: string;
    file_url: string;
    candidate_info: CandidateInfo;
    extracted_skills: string[];
    created_at: string;
    updated_at?: string;
    raw_text?: string;
}