'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Select from 'react-select';

interface JobSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: {
        location: string;
        workMode: string;
        jobLevel: string;
        employmentType: string;
        salaryMin: string;
        salaryMax: string;
        skills: string[];
        company: string;
        industry: string;
        education: string;
    };
    onFiltersChange: (filters: any) => void;
    filterOptions: {
        locations: string[];
        workModes: string[];
        jobLevels: string[];
        employmentTypes: string[];
        skills: string[];
        companies: string[];
        industries: string[];
        educations: string[];
    };
    onClearFilters: () => void;
    activeFiltersCount: number;
    onSavePreset?: (name: string) => void;
    onLoadPreset?: (preset: any) => void;
    savedPresets?: any[];
}

export default function JobSearchBar({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
    filterOptions,
    onClearFilters,
    activeFiltersCount,
    onSavePreset,
    onLoadPreset,
    savedPresets = []
}: JobSearchBarProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [presetName, setPresetName] = useState('');

    useEffect(() => {
    }, [searchQuery, filters, activeFiltersCount]);

    const toggleSkillFilter = (skill: string) => {
        const newSkills = filters.skills.includes(skill)
            ? filters.skills.filter(s => s !== skill)
            : [...filters.skills, skill];

        onFiltersChange({ ...filters, skills: newSkills });
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium"
                />
            </div>

            {/* Filter Toggle and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors border ${showFilters ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Bộ lọc
                        {activeFiltersCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {onSavePreset && activeFiltersCount > 0 && (
                        <button
                            onClick={() => setShowPresets(!showPresets)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                            Lưu bộ lọc
                        </button>
                    )}

                    {savedPresets.length > 0 && (
                        <button
                            onClick={() => setShowPresets(!showPresets)}
                            className="px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 dark:border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                        >
                            Bộ lọc đã lưu ({savedPresets.length})
                        </button>
                    )}
                </div>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Save/Load Presets */}
            {showPresets && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                    {onSavePreset && activeFiltersCount > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Lưu bộ lọc hiện tại
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tên bộ lọc..."
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => {
                                        if (presetName.trim()) {
                                            onSavePreset(presetName.trim());
                                            setPresetName('');
                                        }
                                    }}
                                    disabled={!presetName.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    )}

                    {savedPresets.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Bộ lọc đã lưu
                            </label>
                            <div className="space-y-2">
                                {savedPresets.map((preset, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <div>
                                            <span className="font-medium text-slate-800 dark:text-white">{preset.name}</span>
                                            <span className="text-xs text-slate-500 ml-2">
                                                {new Date(preset.savedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onLoadPreset?.(preset)}
                                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        >
                                            Tải
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Advanced Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <style jsx global>{`
                        .dark-select__control { background-color: transparent !important; border-color: inherit !important; border-radius: 0.5rem !important; padding: 2px !important; }
                        .dark .dark-select__control { border-color: #475569 !important; }
                        .dark .dark-select__menu { background-color: #1e293b !important; border: 1px solid #475569 !important; }
                        .dark .dark-select__option:hover { background-color: #334155 !important; }
                        .dark .dark-select__single-value { color: white !important; }
                    `}</style>

                    {/* Industry Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ngành nghề</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả ngành nghề' }, ...(filterOptions.industries || []).map(i => ({ value: i, label: i }))]}
                            value={{ value: filters.industry, label: filters.industry || 'Tất cả ngành nghề' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, industry: selected?.value || '' })}
                        />
                    </div>

                    {/* Location Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Địa điểm</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả địa điểm' }, ...filterOptions.locations.map(l => ({ value: l, label: l }))]}
                            value={{ value: filters.location, label: filters.location || 'Tất cả địa điểm' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, location: selected?.value || '' })}
                            placeholder="Tìm địa điểm..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loại hình</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả' }, ...filterOptions.employmentTypes?.map(m => ({ value: m, label: m }))]}
                            value={{ value: filters.employmentType, label: filters.employmentType || 'Tất cả' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, employmentType: selected?.value || '' })}
                        />
                    </div>

                    {/* Work Mode Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hình thức làm việc</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả' }, ...filterOptions.workModes.map(m => ({ value: m, label: m }))]}
                            value={{ value: filters.workMode, label: filters.workMode || 'Tất cả' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, workMode: selected?.value || '' })}
                        />
                    </div>

                    {/* Job Level Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cấp bậc</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả' }, ...filterOptions.jobLevels.map(l => ({ value: l, label: l }))]}
                            value={{ value: filters.jobLevel, label: filters.jobLevel || 'Tất cả' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, jobLevel: selected?.value || '' })}
                        />
                    </div>

                    {/* Education Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Học vấn tối thiểu</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả' }, ...(filterOptions.educations || []).map(e => ({ value: e, label: e }))]}
                            value={{ value: filters.education, label: filters.education || 'Tất cả' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, education: selected?.value || '' })}
                        />
                    </div>

                    {/* Company Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Công ty</label>
                        <Select
                            classNamePrefix="dark-select"
                            options={[{ value: '', label: 'Tất cả công ty' }, ...filterOptions.companies.map(c => ({ value: c, label: c }))]}
                            value={{ value: filters.company, label: filters.company || 'Tất cả công ty' }}
                            onChange={(selected: any) => onFiltersChange({ ...filters, company: selected?.value || '' })}
                        />
                    </div>

                    {/* Salary Range */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mức lương tối thiểu</label>
                        <input
                            type="number"
                            placeholder="VD: 10000000"
                            value={filters.salaryMin}
                            onChange={(e) => onFiltersChange({ ...filters, salaryMin: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mức lương tối đa</label>
                        <input
                            type="number"
                            placeholder="VD: 50000000"
                            value={filters.salaryMax}
                            onChange={(e) => onFiltersChange({ ...filters, salaryMax: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Skills Filter */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kỹ năng yêu cầu</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {filterOptions.skills.slice(0, 20).map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkillFilter(skill)}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filters.skills.includes(skill)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}