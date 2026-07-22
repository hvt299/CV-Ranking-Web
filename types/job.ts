import { JobStatus } from "./common";

export interface SkillDetail {
    name: string;
    weight?: number;
    min_years?: number;
}

export interface EducationRequirement {
    min_level: string;
    preferred_majors?: string[];
}

export interface SalaryRange {
    min_salary?: number;
    max_salary?: number;
    currency: string;
}

export interface LocationDetail {
    city: string;
    address?: string;
    country: string;
}

export interface ScoreWeights {
    skills_weight: number;
    nlp_weight: number;
    experience_weight: number;
    education_weight: number;
}

export interface Job {
    id: string;
    title: string;
    company_id: string;
    company_name?: string;
    status: JobStatus;

    is_hot?: boolean;
    industry?: string;

    job_level: string;
    employment_type: string;
    work_mode: string;
    headcount?: number;
    deadline?: string;
    probation_period?: string;
    gender_requirement?: string;
    languages?: string[];
    required_certifications?: string[];

    required_skills: SkillDetail[];
    preferred_skills?: SkillDetail[];
    min_yoe?: number;
    education?: EducationRequirement;
    score_weights?: ScoreWeights;

    salary?: SalaryRange;
    working_hours?: string;
    location?: LocationDetail;

    description: string;
    requirements: string;
    benefits?: string;
    other_info?: string;

    created_by_user_id?: string;
    created_at: string;
    updated_at?: string;
}