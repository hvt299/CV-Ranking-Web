'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { INDUSTRIES } from '@/constants/job.constants';
import toast from 'react-hot-toast';

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };
    
    const [editingSkill, setEditingSkill] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSkills = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getSkills({ limit: 10000 });
            setSkills(data.data || data || []);
        } catch (e) {
            toast.error('Không thể tải danh sách kỹ năng');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await adminService.deleteSkill(id);
            toast.success('Đã xóa kỹ năng');
            fetchSkills();
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    const filtered = skills.filter(s => {
        const matchSearch = s.canonical_name?.toLowerCase().includes(searchTerm.toLowerCase()) || (s.aliases && s.aliases.join(',').toLowerCase().includes(searchTerm.toLowerCase()));
        const matchIndustry = industryFilter === 'All' || s.industry === industryFilter;
        const matchCategory = categoryFilter === 'All' || s.category === categoryFilter;
        return matchSearch && matchIndustry && matchCategory;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, industryFilter, categoryFilter]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                canonical_name: editingSkill.canonical_name,
                industry: editingSkill.industry,
                category: editingSkill.category,
                aliases: Array.isArray(editingSkill.aliases) ? editingSkill.aliases : editingSkill.aliases.split(',').map((s: string) => s.trim()).filter(Boolean)
            };
            await adminService.updateSkill(editingSkill.id || editingSkill._id, payload);
            toast.success('Cập nhật thành công');
            setEditingSkill(null);
            fetchSkills();
        } catch (error) {
            toast.error('Lỗi khi cập nhật kỹ năng');
        } finally {
            setIsSaving(false);
        }
    };

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedSkills = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        Quản lý Kỹ năng (Skills)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Danh mục kỹ năng chuẩn hóa của hệ thống.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm kỹ năng..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm focus:border-primary-500 shadow-sm transition-colors text-slate-700 dark:text-slate-200 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={industryFilter}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                        >
                            <option value="All">Tất cả ngành</option>
                            {INDUSTRIES.map(i => (
                                <option key={i.value} value={i.value}>{i.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative min-w-40 flex-1">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">Tất cả danh mục</option>
                            <option value="hard_skill">Hard Skill</option>
                            <option value="soft_skill">Soft Skill</option>
                            <option value="certification">Chứng chỉ</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-4 px-2">
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filtered.length}</span> kỹ năng
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 pl-6">Tên chuẩn</th>
                                <th className="p-5">Biến thể (Aliases)</th>
                                <th className="p-5">Ngành nghề</th>
                                <th className="p-5">Danh mục</th>
                                <th className="p-5 pr-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" />
                                        <p className="text-slate-500 text-sm mt-3 font-medium">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">Không tìm thấy kỹ năng nào phù hợp.</td>
                                </tr>
                            ) : (
                                paginatedSkills.map((skill, index) => (
                                    <tr key={skill.id || skill._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-5 pl-6">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{skill.canonical_name}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <p className="text-xs text-slate-500 max-w-[200px] truncate" title={skill.aliases?.join(', ')}>{skill.aliases?.length ? skill.aliases.join(', ') : '-'}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <span className="font-medium text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">{INDUSTRIES.find(i => i.value === skill.industry)?.label || skill.industry || 'Chung'}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                {skill.category === 'hard_skill' ? <span className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-bold">Hard Skill</span> : 
                                                 skill.category === 'soft_skill' ? <span className="px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold">Soft Skill</span> : 
                                                 skill.category === 'certification' ? <span className="px-2 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg text-xs font-bold">Chứng chỉ</span> : 
                                                 <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-lg text-xs font-bold">Chưa phân loại</span>}
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                                <button onClick={() => setEditingSkill({...skill, aliases: skill.aliases?.join(', ') || ''})} className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors" title="Sửa">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(skill.id || skill._id)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-colors" title="Xóa">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                        <p className="text-sm font-medium text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</span> kết quả
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)} 
                                        disabled={page === '...'}
                                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page !== '...' ? 'shadow-sm' : ''} ${currentPage === page ? 'bg-primary-600 text-white' : page === '...' ? 'text-slate-400 bg-transparent cursor-default' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        
            {editingSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chỉnh sửa Kỹ năng</h2>
                            <button onClick={() => setEditingSkill(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="edit-skill-form" onSubmit={handleSave} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tên chuẩn hóa (Canonical Name)</label>
                                    <input type="text" value={editingSkill.canonical_name} onChange={e => setEditingSkill({...editingSkill, canonical_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white" required />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ngành nghề</label>
                                    <select value={editingSkill.industry} onChange={e => setEditingSkill({...editingSkill, industry: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white">
                                        <option value="">Chung (Không phân ngành)</option>
                                        {INDUSTRIES.map(i => (
                                            <option key={i.value} value={i.value}>{i.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Danh mục (Category)</label>
                                    <select value={editingSkill.category || ''} onChange={e => setEditingSkill({...editingSkill, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white">
                                        <option value="">Chưa phân loại</option>
                                        <option value="hard_skill">Hard Skill</option>
                                        <option value="soft_skill">Soft Skill</option>
                                        <option value="certification">Chứng chỉ</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Các biến thể (Aliases) - Cách nhau bằng dấu phẩy</label>
                                    <textarea value={editingSkill.aliases} onChange={e => setEditingSkill({...editingSkill, aliases: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white min-h-[100px]" placeholder="VD: JS, Javascript, ECMAScript" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <button type="button" onClick={() => setEditingSkill(null)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" form="edit-skill-form" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
