// ==========================================
// 1. ENUMS (Nguồn sự thật duy nhất)
// ==========================================
export enum UserRole {
  ADMIN = "admin",
  HR_OWNER = "hr_owner",
  HR_MEMBER = "hr_member",
  APPLICANT = "applicant"
}

export enum JobStatus {
  DRAFT = "draft",
  OPEN = "open",
  PAUSED = "paused",
  CLOSED = "closed",
  EXPIRED = "expired"
}

export enum ApplicationStatus {
  NEW = "new",
  REVIEWING = "reviewing",
  INTERVIEW = "interview",
  OFFERED = "offered",
  HIRED = "hired",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  EXPIRED = "expired"
}

export enum ApplicationSource {
  HR_SOURCED = "hr_sourced",
  APPLICANT_APPLY = "applicant_apply"
}

export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
}

export enum NotificationReadStatus {
  UNREAD = "unread",
  READ = "read"
}

export enum CompanyStatus {
  PENDING_VERIFICATION = "pending_verification",
  VERIFIED = "verified",
  SUSPENDED = "suspended",
  REJECTED = "rejected"
}

export enum AuditAction {
  COMPANY_VERIFIED = "company_verified",
  COMPANY_REJECTED = "company_rejected",
  COMPANY_SUSPENDED = "company_suspended",
  APPLICATION_STATUS_CHANGED = "application_status_changed",
  APPLICATION_NOTE_ADDED = "application_note_added",
  JOB_WEIGHTS_CHANGED = "job_weights_changed",
  HR_MEMBER_INVITED = "hr_member_invited",
  HR_MEMBER_REMOVED = "hr_member_removed",
  USER_SUSPENDED = "user_suspended"
}

// ==========================================
// 2. INTERFACES CHO CÔNG TY & PHÒNG BAN
// ==========================================
export interface Company {
  id: string;
  name: string;
  tax_code: string;
  owner_user_id: string;
  status: CompanyStatus;
  rejection_reason?: string;
  industry?: string;
  size?: string;
  website?: string;
  address?: string;
  license_file_url?: string;
  verified_at?: string;
  verified_by_admin_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  created_at: string;
}

// ==========================================
// 3. INTERFACES CHO USER & AUTH
// ==========================================
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar: string;
  role: UserRole;
  company_id?: string;
  department_id?: string;
  is_verified?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ==========================================
// 4. INTERFACES CHO CÔNG VIỆC (JOB)
// ==========================================
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
  job_level: string;
  employment_type: string;
  work_mode: string;
  headcount?: number;
  deadline?: string;

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

export interface FraudAnalysis {
  detected: boolean;
  risk_score: number;
  penalty: number;
  reasons: string[];
  evidence: any[];
}

// ==========================================
// 5. INTERFACES CHO CV LIBRARY
// CVDocument thuộc về Applicant (không còn company_id) — ứng viên upload
// 1 lần, dùng lại cho nhiều lượt apply. CVSnapshot là bản đóng băng gắn
// vào từng Application, không đổi dù CVDocument gốc bị sửa/xóa sau.
// ==========================================
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

export interface CVSnapshot {
  cv_document_id: string;
  display_name: string;
  filename: string;
  file_url: string;
  candidate_info: CandidateInfo;
  extracted_skills: string[];
}

// ==========================================
// 6. INTERFACES CHO LƯỢT ỨNG TUYỂN (APPLICATION)
// ==========================================
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
  ai_score?: AIScore;
  notes: NoteEntry[];
  applied_at: string;
  updated_at?: string;
  job_title?: string;
  company_name?: string;
  filename?: string;
  candidate_email?: string;
  file_url?: string;
}

// ==========================================
// 7. INTERFACES CHO THÔNG BÁO (NOTIFICATION)
// ==========================================
export interface Notification {
  id: string;
  recipient_user_id: string;
  application_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationReadStatus;
  job_title_snapshot?: string;
  application_status_snapshot?: ApplicationStatus;
  created_at: string;
  read_at?: string;
}

// ==========================================
// 8. INTERFACES CHO AUDIT LOG
// ==========================================
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

// ==========================================
// 9. INTERFACES CHO DASHBOARD ANALYTICS
// ==========================================
export interface DashboardAnalytics {
  total_jobs: number;
  open_jobs: number;
  total_cvs_in_pool: number;
  status_breakdown: Record<ApplicationStatus | string, number>;
}