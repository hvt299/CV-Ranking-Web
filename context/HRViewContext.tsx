'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export const HRViewContext = createContext<{
    hrViewMode: 'OWNER' | 'MEMBER';
    setHrViewMode: (mode: 'OWNER' | 'MEMBER') => void;
}>({
    hrViewMode: 'OWNER',
    setHrViewMode: () => { },
});

export const useHRView = () => useContext(HRViewContext);

export function HRViewProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const defaultMode = user?.role === UserRole.HR_MEMBER ? 'MEMBER' : 'OWNER';
    const [hrViewMode, setHrViewMode] = useState<'OWNER' | 'MEMBER'>(defaultMode);

    useEffect(() => {
        if (user?.role === UserRole.HR_OWNER) {
            const savedMode = localStorage.getItem('cv_ranking_hr_view');
            if (savedMode === 'OWNER' || savedMode === 'MEMBER') {
                setHrViewMode(savedMode);
            }
        } else {
            setHrViewMode('MEMBER');
        }
    }, [user?.role]);

    const handleSetMode = (mode: 'OWNER' | 'MEMBER') => {
        if (user?.role === UserRole.HR_MEMBER) return;
        setHrViewMode(mode);
        localStorage.setItem('cv_ranking_hr_view', mode);
    };

    return (
        <HRViewContext.Provider value={{ hrViewMode, setHrViewMode: handleSetMode }}>
            {children}
        </HRViewContext.Provider>
    );
}