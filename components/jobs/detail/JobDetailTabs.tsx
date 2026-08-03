'use client';

import { Users, Info, BrainCircuit } from 'lucide-react';

interface JobDetailTabsProps {
    activeTab: 'candidates' | 'job_info' | 'ai_config';
    setActiveTab: (tab: 'candidates' | 'job_info' | 'ai_config') => void;
    candidateCount: number;
}

export default function JobDetailTabs({ activeTab, setActiveTab, candidateCount }: JobDetailTabsProps) {
    const tabs = [
        { id: 'candidates', label: 'Ứng viên', icon: Users, count: candidateCount },
        { id: 'job_info', label: 'Thông tin Job', icon: Info },
        { id: 'ai_config', label: 'Tiêu chí & AI', icon: BrainCircuit }
    ];

    return (
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-2 px-2 sm:px-6">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${isActive
                                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${isActive
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}