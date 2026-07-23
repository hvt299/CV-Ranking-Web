import { ApplicationStatus } from "@/types";

export const INDUSTRIES = [
    { label: 'Kinh doanh/Bán hàng', value: 'sales' },
    { label: 'Marketing/PR/Quảng cáo', value: 'marketing' },
    { label: 'Chăm sóc khách hàng/Vận hành', value: 'customer_service' },
    { label: 'Nhân sự/Hành chính/Pháp chế', value: 'hr_admin_legal' },
    { label: 'Công nghệ Thông tin', value: 'it' },
    { label: 'Lao động phổ thông', value: 'labor' },
    { label: 'Tài chính/Ngân hàng/Bảo hiểm', value: 'finance' },
    { label: 'Bất động sản', value: 'realestate' },
    { label: 'Xây dựng', value: 'construction' },
    { label: 'Kế toán/Kiểm toán/Thuế', value: 'accounting' },
    { label: 'Sản xuất', value: 'manufacturing' },
    { label: 'Giáo dục/Đào tạo', value: 'education' },
    { label: 'Bán lẻ/Dịch vụ đời sống', value: 'retail_lifestyle' },
    { label: 'Phim/Truyền hình/Báo chí/Xuất bản', value: 'media_publishing' },
    { label: 'Điện/Điện tử/Viễn thông', value: 'electronics_telecom' },
    { label: 'Logistics/Thu mua/Kho/Vận tải', value: 'logistics' },
    { label: 'Tư vấn chuyên môn', value: 'consulting' },
    { label: 'Dược/Y tế/Sức khoẻ/Công nghệ sinh học', value: 'healthcare' },
    { label: 'Thiết kế', value: 'design' },
    { label: 'Nhà hàng/Khách sạn/Du lịch', value: 'hospitality' },
    { label: 'Năng lượng/Môi trường/Nông nghiệp', value: 'energy_agriculture' },
    { label: 'Tài xế', value: 'driver' },
    { label: 'Biên phiên dịch', value: 'translation' },
    { label: 'Luật', value: 'law' },
    { label: 'Nhóm nghề khác', value: 'other' }
];

export const JOB_LEVELS = [
    { value: 'Intern', label: 'Thực tập sinh (Intern)' },
    { value: 'Fresher', label: 'Mới tốt nghiệp (Fresher)' },
    { value: 'Junior', label: 'Nhân viên (Junior)' },
    { value: 'Middle', label: 'Chuyên viên (Middle)' },
    { value: 'Senior', label: 'Chuyên viên cao cấp (Senior)' },
    { value: 'Manager', label: 'Quản lý (Manager)' },
];

export const EMPLOYMENT_TYPES = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Freelance', label: 'Freelance' }
];

export const WORK_MODES = [
    { value: 'Onsite', label: 'Onsite' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' }
];

export const CV_STATUSES = [
    { value: ApplicationStatus.NEW, label: 'Mới nộp', color: 'bg-blue-100 text-blue-700' },
    { value: ApplicationStatus.REVIEWING, label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: ApplicationStatus.HIRED, label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: ApplicationStatus.REJECTED, label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Đã rút hồ sơ', color: 'bg-slate-100 text-slate-500' },
];