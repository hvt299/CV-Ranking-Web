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
        <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-3 w-full">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'candidates' | 'job_info' | 'ai_config')}
                            className={`relative flex items-center justify-center gap-2 px-3 sm:px-4 py-4 text-sm font-bold whitespace-nowrap transition-all duration-200 border-b-2 ${isActive ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400'}`}
                        >
                            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />

                            <span>{tab.label}</span>

                            {tab.count !== undefined && (
                                <span className={`min-w-6 h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-black ${isActive ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
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