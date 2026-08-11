import { ApplicationStatus, ApplicationSource, NotificationType, NotificationReadStatus } from "./common";
import { CandidateInfo, FraudAnalysis } from "./candidate";

export interface CVSnapshot {
    cv_document_id: string;
    display_name: string;
    filename: string;
    file_url: string;
    candidate_info: CandidateInfo;
    extracted_skills: string[];
}

export interface SkillMatchDetail {
    skill: string;
    matched: boolean;
    confidence: number;
    years_experience?: number;
}

export interface AIScoreBreakdown {
    skills_score: number;
    experience_score: number;
    education_score: number;
    nlp_score: number;
    penalty_score: number;
    fraud_analysis?: FraudAnalysis;
}

export interface AIScore {
    total_score: number;
    score_breakdown: AIScoreBreakdown;
    skill_details: SkillMatchDetail[];
    missing_required_skills: string[];
    top_contributing_sentences: string[];
}

export interface ApplicationCreate {
    job_id: string;
    cv_document_id: string;
    applicant_user_id?: string;
    source: ApplicationSource;
    company_id: string;
    cover_letter?: string;
}

export interface InterviewSchedule {
    interview_time: string;
    location: string;
    meeting_link?: string;
    message?: string;
}

export interface NoteEntry {
    author_id: string;
    author_name: string;
    content: string;
    created_at: string;
}

export interface Application {
    id: string;
    job_id: string;
    cv_snapshot?: CVSnapshot;
    applicant_user_id?: string;
    company_id: string;
    source: ApplicationSource;
    status: ApplicationStatus;
    cover_letter?: string;
    ai_score?: AIScore;
    notes: NoteEntry[];
    applied_at: string;
    updated_at?: string;
    ai_interview_questions?: any[];
    job_title?: string;
    company_name?: string;
    filename?: string;
    candidate_email?: string;
    file_url?: string;
    is_viewed?: boolean;
}

export interface StatusChangeEntry {
    from_status: ApplicationStatus;
    to_status: ApplicationStatus;
    changed_by_user_id: string;
    changed_at: string;
}

export interface OfferDetail {
    offered_salary: number;
    currency: string;
    start_date: string;
    offer_file_url?: string;
}

export interface InterviewQuestion {
    category: string;
    question: string;
    suggested_answer_points: string[];
}

export interface ApplicationUpdatePayload {
    status?: ApplicationStatus;
    note_to_add?: string;
    send_email?: boolean;
    interview_schedule?: InterviewSchedule;
    rejection_reason?: string;
}

export interface ApplyJobRequest {
    cv_document_id: string;
    cover_letter?: string;
}

export interface SelfScoreRequest {
    cv_document_id: string;
    job_id: string;
}

export interface Notification {
    id: string;
    recipient_user_id: string;
    application_id?: string;
    
    title: string;
    message: string;
    type: NotificationType;
    status: NotificationReadStatus;
    
    job_title_snapshot?: string;
    application_status_snapshot?: ApplicationStatus;
    
    related_entity_type?: string;
    related_entity_id?: string;
    action_url?: string;
    
    created_at: string;
    read_at?: string;
}