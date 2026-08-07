'use client';

import { useEffect, useState } from 'react';
import { formatOverviewDate } from '@/utils/format';

export function useCurrentTime() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            const timeStr = now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            setCurrentTime(`${timeStr} | ${formatOverviewDate(now)}`);
        };

        updateTime();

        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return currentTime;
}