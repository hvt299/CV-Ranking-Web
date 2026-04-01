'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Briefcase, Building2, MapPin, DollarSign, BrainCircuit, Plus, X, ArrowLeft, Save, GraduationCap, Clock, Info } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditEnterpriseJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        title: '', company_name: '', job_level: 'Middle', employment_type: 'Full-time', work_mode: 'Onsite', headcount: 1,
        deadline: '', min_yoe: 0,
        education: { min_level: 'Không yêu cầu', preferred_majors: [] as string[] },
        salary: { min_salary: 10000000, max_salary: 30000000, currency: 'VND' },
        working_hours: '08:00 - 17:30, Thứ 2 - Thứ 6',
        location: { city: '', address: '', country: 'Việt Nam' },
        description: '', requirements: '', benefits: '', other_info: ''
    });

    const [requiredSkills, setRequiredSkills] = useState([{ name: '', weight: 0.5, min_years: 0 }]);
    const [preferredSkills, setPreferredSkills] = useState([{ name: '', weight: 0.2, min_years: 0 }]);
    const [majorInput, setMajorInput] = useState('');
    const [isNegotiable, setIsNegotiable] = useState(false);

    useEffect(() => {
        if (jobId) {
            fetchJobDetail();
        }
    }, [jobId]);

    const fetchJobDetail = async () => {
        setIsFetching(true);
        try {
            const res = await api.get(`/jobs/${jobId}`);
            const data = res.data;

            let formattedDeadline = '';
            if (data.deadline) {
                const d = new Date(data.deadline);
                formattedDeadline = d.getFullYear() + '-' +
                    String(d.getMonth() + 1).padStart(2, '0') + '-' +
                    String(d.getDate()).padStart(2, '0');
            }

            setFormData({
                title: data.title || '',
                company_name: data.company_name || '',
                job_level: data.job_level || 'Middle',
                employment_type: data.employment_type || 'Full-time',
                work_mode: data.work_mode || 'Onsite',
                headcount: data.headcount || 1,
                deadline: formattedDeadline,
                min_yoe: data.min_yoe || 0,
                education: data.education || { min_level: 'Không yêu cầu', preferred_majors: [] },
                salary: data.salary || { min_salary: 10000000, max_salary: 30000000, currency: 'VND' },
                working_hours: data.working_hours || '',
                location: data.location || { city: '', address: '', country: 'Việt Nam' },
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                other_info: data.other_info || ''
            });

            if (data.required_skills && data.required_skills.length > 0) {
                setRequiredSkills(data.required_skills);
            }
            if (data.preferred_skills && data.preferred_skills.length > 0) {
                setPreferredSkills(data.preferred_skills);
            } else {
                setPreferredSkills([]);
            }

            setIsNegotiable(data.salary?.min_salary === null);

        } catch (error) {
            toast.error("Không thể tải thông tin chiến dịch!");
            router.push('/jobs');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSkillChange = (type: 'required' | 'preferred', index: number, field: string, value: any) => {
        if (type === 'required') {
            const updated = [...requiredSkills];
            updated[index] = { ...updated[index], [field]: value };
            setRequiredSkills(updated);
        } else {
            const updated = [...preferredSkills];
            updated[index] = { ...updated[index], [field]: value };
            setPreferredSkills(updated);
        }
    };

    const addSkillRow = (type: 'required' | 'preferred') => {
        type === 'required' ? setRequiredSkills([...requiredSkills, { name: '', weight: 0.5, min_years: 0 }])
            : setPreferredSkills([...preferredSkills, { name: '', weight: 0.2, min_years: 0 }]);
    };

    const removeSkillRow = (type: 'required' | 'preferred', index: number) => {
        type === 'required' ? setRequiredSkills(requiredSkills.filter((_, i) => i !== index))
            : setPreferredSkills(preferredSkills.filter((_, i) => i !== index));
    };

    const handleMajorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newMajor = majorInput.trim();
            if (newMajor && !formData.education.preferred_majors.includes(newMajor)) {
                setFormData({
                    ...formData,
                    education: { ...formData.education, preferred_majors: [...formData.education.preferred_majors, newMajor] }
                });
                setMajorInput('');
            }
        }
    };

    const removeMajor = (index: number) => {
        const updatedMajors = formData.education.preferred_majors.filter((_, i) => i !== index);
        setFormData({ ...formData, education: { ...formData.education, preferred_majors: updatedMajors } });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validReqSkills = requiredSkills.filter(s => s.name.trim() !== '');
        const validPrefSkills = preferredSkills.filter(s => s.name.trim() !== '');

        if (validReqSkills.length === 0) {
            toast.error('Vui lòng nhập ít nhất 1 Kỹ năng bắt buộc để AI chấm điểm!');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                deadline: formData.deadline ? new Date(`${formData.deadline}T23:59:59`).toISOString() : null,
                salary: isNegotiable ? {
                    min_salary: null,
                    max_salary: null,
                    currency: formData.salary.currency
                } : {
                    min_salary: formData.salary.min_salary ? Number(formData.salary.min_salary) : null,
                    max_salary: formData.salary.max_salary ? Number(formData.salary.max_salary) : null,
                    currency: formData.salary.currency
                },
                required_skills: validReqSkills,
                preferred_skills: validPrefSkills
            };

            await api.put(`/jobs/${jobId}`, payload);
            toast.success('Cập nhật chiến dịch thành công!');
            router.push('/jobs');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi hệ thống khi cập nhật Job');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-350 mx-auto pb-20">
            <div className="sticky bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-md pb-4 pt-4 mb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:bg-slate-100 transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Cập nhật Chiến Dịch</h1>
                        <p className="text-xs text-slate-500 font-medium">Chỉnh sửa thông số cho AI Scoring</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50">
                        Hủy bỏ
                    </button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center gap-2">
                        <Save className="w-5 h-5" /> {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CỘT TRÁI */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                            <Briefcase className="w-5 h-5 text-blue-500" /> Thông tin cơ bản
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Tên vị trí <span className="text-red-500">*</span></label>
                                <input type="text" required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="VD: Senior React Developer" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Tên Công ty <span className="text-red-500">*</span></label>
                                <input type="text" required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="VD: TechCorp VN" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Cấp bậc</label>
                                <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" value={formData.job_level} onChange={e => setFormData({ ...formData, job_level: e.target.value })}>
                                    <option value="Intern">Thực tập sinh (Intern)</option>
                                    <option value="Fresher">Mới tốt nghiệp (Fresher)</option>
                                    <option value="Junior">Nhân viên (Junior)</option>
                                    <option value="Middle">Chuyên viên (Middle)</option>
                                    <option value="Senior">Chuyên viên cao cấp (Senior)</option>
                                    <option value="Manager">Quản lý (Manager)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Loại hình</label>
                                <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" value={formData.employment_type} onChange={e => setFormData({ ...formData, employment_type: e.target.value })}>
                                    <option value="Full-time">Toàn thời gian (Full-time)</option>
                                    <option value="Part-time">Bán thời gian (Part-time)</option>
                                    <option value="Freelance">Cộng tác viên (Freelance)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Hình thức</label>
                                <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" value={formData.work_mode} onChange={e => setFormData({ ...formData, work_mode: e.target.value })}>
                                    <option value="Onsite">Làm việc tại văn phòng (Onsite)</option>
                                    <option value="Remote">Làm việc từ xa (Remote)</option>
                                    <option value="Hybrid">Linh hoạt (Hybrid)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Số lượng tuyển</label>
                                <input type="number" min="1" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" value={formData.headcount} onChange={e => setFormData({ ...formData, headcount: Number(e.target.value) })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Hạn nộp hồ sơ</label>
                                <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                            <BrainCircuit className="w-5 h-5 text-emerald-500" /> Nội dung JD (Ngữ cảnh cho NLP)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Mô tả công việc <span className="text-red-500">*</span></label>
                                <textarea required rows={5} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none leading-relaxed"
                                    placeholder="- Phát triển và bảo trì các tính năng..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Yêu cầu ứng viên <span className="text-red-500">*</span></label>
                                <textarea required rows={5} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none leading-relaxed"
                                    placeholder="- Ít nhất 2 năm kinh nghiệm..." value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Quyền lợi (Benefits)</label>
                                <textarea rows={4} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none leading-relaxed"
                                    placeholder="- Lương tháng 13..." value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
                            <DollarSign className="w-5 h-5 text-amber-500" /> Đãi ngộ & Vận hành
                        </h2>
                        <div className="space-y-6">
                            {/* SLIDER LƯƠNG & THỎA THUẬN */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Mức lương dự kiến</label>

                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                                checked={isNegotiable}
                                                onChange={(e) => setIsNegotiable(e.target.checked)}
                                            />
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Thỏa thuận</span>
                                        </label>

                                        {!isNegotiable && (
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {formData.salary.currency}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {!isNegotiable ? (
                                    <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-500">Tối thiểu:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{formatCurrency(formData.salary.min_salary)}</span>
                                            </div>
                                            <input
                                                type="range" min="1000000" max="200000000" step="1000000"
                                                className="w-full accent-blue-600 cursor-pointer"
                                                value={formData.salary.min_salary}
                                                onChange={e => {
                                                    const val = Number(e.target.value);
                                                    setFormData({ ...formData, salary: { ...formData.salary, min_salary: Math.min(val, formData.salary.max_salary) } });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-500">Tối đa:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{formatCurrency(formData.salary.max_salary)}</span>
                                            </div>
                                            <input
                                                type="range" min="1000000" max="500000000" step="1000000"
                                                className="w-full accent-emerald-500 cursor-pointer"
                                                value={formData.salary.max_salary}
                                                onChange={e => {
                                                    const val = Number(e.target.value);
                                                    setFormData({ ...formData, salary: { ...formData.salary, max_salary: Math.max(val, formData.salary.min_salary) } });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center">
                                        <span className="text-sm font-bold text-slate-500">Mức lương sẽ được thỏa thuận khi phỏng vấn</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Thời gian làm việc</label>
                                <textarea
                                    rows={2}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm resize-none mb-2"
                                    value={formData.working_hours}
                                    onChange={e => setFormData({ ...formData, working_hours: e.target.value })}
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => setFormData({ ...formData, working_hours: '08:00 - 17:30, Thứ 2 - Thứ 6' })} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200">Giờ hành chính</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, working_hours: 'Ca xoay (Sáng/Chiều/Tối), nghỉ 1 ngày/tuần' })} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200">Ca xoay</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, working_hours: 'Linh hoạt (Flexible hours)' })} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200">Giờ linh hoạt</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tỉnh / Thành phố</label>
                                    <input type="text" placeholder="VD: Hà Nội, TP.HCM..." required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 outline-none text-sm" value={formData.location.city} onChange={e => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thôn/Bản/Ấp/Xóm/Tổ dân phố, Xã/Phường</label>
                                    <input type="text" placeholder="VD: Tổ 4, Phường Bến Nghé" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 outline-none text-sm" value={formData.location.address} onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-900 dark:text-indigo-300">
                            ⚙️ AI Scoring Metrics
                        </h2>

                        <div className="space-y-4 mb-6 pb-6 border-b border-indigo-100 dark:border-indigo-500/20">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tổng năm KN tối thiểu</label>
                                <input type="number" min="0" step="0.5" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 rounded-lg outline-none font-bold text-center" value={formData.min_yoe} onChange={e => setFormData({ ...formData, min_yoe: Number(e.target.value) })} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                    Học vấn tối thiểu
                                </label>
                                <select
                                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                    value={formData.education.min_level}
                                    onChange={e => setFormData({ ...formData, education: { ...formData.education, min_level: e.target.value } })}
                                >
                                    <option value="Không yêu cầu">Không yêu cầu</option>
                                    <option value="Chứng chỉ nghề">Chứng chỉ nghề</option>
                                    <option value="Trung cấp">Trung cấp</option>
                                    <option value="Cao đẳng">Cao đẳng</option>
                                    <option value="Cử nhân">Cử nhân / Kỹ sư (Đại học)</option>
                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                    <option value="Tiến sĩ">Tiến sĩ (PhD)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                    Chuyên ngành ưu tiên (Tùy chọn)
                                </label>
                                <div className="min-h-10 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-wrap gap-1 items-center">
                                    {formData.education.preferred_majors.map((major, idx) => (
                                        <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                                            {major}
                                            <button type="button" onClick={() => removeMajor(idx)}>
                                                <X className="w-3 h-3 hover:text-red-500" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className="flex-1 min-w-25 bg-transparent outline-none text-sm p-1"
                                        placeholder="VD: IT, Kế toán (Ấn Enter)"
                                        value={majorInput}
                                        onChange={e => setMajorInput(e.target.value)}
                                        onKeyDown={handleMajorKeyDown}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Kỹ năng Bắt buộc</label>
                                <button type="button" onClick={() => addSkillRow('required')} className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded font-bold hover:bg-indigo-300">+ Thêm</button>
                            </div>

                            <div className="flex gap-2 mb-1 px-1">
                                <div className="w-1/3 text-[10px] font-bold text-slate-500 uppercase">Tên kỹ năng</div>
                                <div className="w-1/4 text-[10px] font-bold text-slate-500 uppercase text-center" title="Điểm trọng số từ 0.1 đến 1.0">Trọng số</div>
                                <div className="w-1/4 text-[10px] font-bold text-slate-500 uppercase text-center" title="Năm kinh nghiệm tối thiểu cho kỹ năng này">Năm KN</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="space-y-2">
                                {requiredSkills.map((skill, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 flex gap-2 items-center">
                                        <input type="text" placeholder="VD: ReactJS" className="w-1/3 p-1.5 bg-slate-50 rounded outline-none text-sm" value={skill.name} onChange={e => handleSkillChange('required', index, 'name', e.target.value)} />
                                        <input type="number" step="0.1" className="w-1/4 p-1.5 bg-slate-50 rounded outline-none text-sm text-center" value={skill.weight} onChange={e => handleSkillChange('required', index, 'weight', Number(e.target.value))} />
                                        <input type="number" step="0.5" className="w-1/4 p-1.5 bg-slate-50 rounded outline-none text-sm text-center" value={skill.min_years} onChange={e => handleSkillChange('required', index, 'min_years', Number(e.target.value))} />
                                        <button type="button" onClick={() => removeSkillRow('required', index)} className="w-8 flex justify-center text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Kỹ năng Ưu tiên (Điểm cộng)</label>
                                <button type="button" onClick={() => addSkillRow('preferred')} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200">+ Thêm</button>
                            </div>

                            <div className="flex gap-2 mb-1 px-1">
                                <div className="w-1/3 text-[10px] font-bold text-slate-500 uppercase">Tên kỹ năng</div>
                                <div className="w-1/4 text-[10px] font-bold text-slate-500 uppercase text-center" title="Điểm cộng trọng số từ 0.1 đến 1.0">Trọng số</div>
                                <div className="w-1/4 text-[10px] font-bold text-slate-500 uppercase text-center" title="Năm kinh nghiệm tối thiểu cho kỹ năng này">Năm KN</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="space-y-2">
                                {preferredSkills.map((skill, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 flex gap-2 items-center">
                                        <input type="text" placeholder="VD: AWS" className="w-1/3 p-1.5 bg-slate-50 rounded outline-none text-sm" value={skill.name} onChange={e => handleSkillChange('preferred', index, 'name', e.target.value)} />
                                        <input type="number" step="0.1" className="w-1/4 p-1.5 bg-slate-50 rounded outline-none text-sm text-center" value={skill.weight} onChange={e => handleSkillChange('preferred', index, 'weight', Number(e.target.value))} />
                                        <input type="number" step="0.5" className="w-1/4 p-1.5 bg-slate-50 rounded outline-none text-sm text-center" value={skill.min_years} onChange={e => handleSkillChange('preferred', index, 'min_years', Number(e.target.value))} />
                                        <button type="button" onClick={() => removeSkillRow('preferred', index)} className="w-8 flex justify-center text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </form>
    );
}