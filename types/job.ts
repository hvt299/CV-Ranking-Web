import { JobStatus } from "./common";

export enum JobLevel {
    INTERN = "Intern",
    FRESHER = "Fresher",
    JUNIOR = "Junior",
    MIDDLE = "Middle",
    SENIOR = "Senior",
    LEAD = "LEAD",
    MANAGER = "Manager",
    DIRECTOR = "Director",
    EXECUTIVE = "Executive",
}

export enum EmploymentType {
    FULL_TIME = "Full-time",
    PART_TIME = "Part-time",
    CONTRACT = "Contract",
    FREELANCE = "Freelance",
    INTERNSHIP = "Internship",
    TEMPORARY = "Temporary",
}

export enum WorkMode {
    OFFICE = "Office",
    HYBRID = "Hybrid",
    REMOTE = "Remote"
}

export interface SkillDetail {
    skill_id?: string | null;
    name: string;
    weight?: number;
    min_years?: number;
    is_knockout?: boolean;
}

export interface JobSkillForm {
    skill_id: string | null;
    name: string;
    weight: number;
    min_years: number;
    is_knockout: boolean;
}

export interface FilterRequirement {
    name: string;
    is_knockout: boolean;
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
    country?: string;
    version?: 'old' | 'new';
    province_code?: string;
    province_name?: string;
    district_code?: string;
    district_name?: string;
    ward_code?: string;
    ward_name?: string;
    street_address?: string;
    full_address_snapshot?: string;
}

export interface ScoreWeights {
    skills_weight: number;
    nlp_weight: number;
    experience_weight: number;
    education_weight: number;
}

export interface AiWeights {
    skills: number;
    nlp: number;
    experience: number;
    education: number;
}

export interface Job {
    id: string;
    slug?: string;
    title: string;
    company_id: string;
    company_name?: string;
    status: JobStatus;

    is_hot?: boolean;
    is_hot_until?: string;
    industry?: string;

    job_level: JobLevel | string;
    employment_type: EmploymentType | string;
    work_mode: WorkMode | string;

    headcount?: number;
    deadline?: string;
    probation_period?: string;
    gender_requirement?: string;
    
    languages?: FilterRequirement[];
    required_certifications?: FilterRequirement[];

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

    jd_file_url?: string;

    view_count?: number;
    save_count?: number;
    num_applications?: number;

    created_by_user_id?: string;
    created_at: string;
    updated_at?: string;

    edit_count?: number;
    rescore_count?: number;
}

export interface JobPayload {
    title: string;
    company_id?: string;

    is_hot?: boolean;
    is_hot_until?: string;
    industry?: string;

    job_level?: JobLevel | string;
    employment_type?: EmploymentType | string;
    work_mode?: WorkMode | string;

    headcount?: number;
    deadline?: string;
    probation_period?: string;
    gender_requirement?: string;

    languages?: FilterRequirement[];
    required_certifications?: FilterRequirement[];

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

    jd_file_url?: string;
}

export interface JobFormData {
    title: string;
    industry: string;
    job_level: string;
    employment_type: string;
    work_mode: string;
    headcount: number;
    deadline: string;
    probation_period: string;
    gender_requirement: string;

    languages: FilterRequirement[];
    required_certifications: FilterRequirement[];

    required_skills: JobSkillForm[];
    preferred_skills: JobSkillForm[];

    min_yoe: number;
    education: EducationRequirement;

    aiWeights: AiWeights;

    salary: SalaryRange;
    working_hours: string;
    location: LocationDetail;

    description: string;
    requirements: string;
    benefits: string;
    other_info: string;

    jd_file_url: string;
    
    is_hot?: boolean;
    is_hot_until?: string;
}
