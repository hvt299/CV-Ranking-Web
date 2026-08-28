'use client';

import { useEffect, useState } from 'react';
import { useHRViewStore } from '@/store/useHRViewStore';
import OwnerDashboard from '@/components/hr/dashboard/OwnerDashboard';
import MemberWorkspace from '@/components/hr/dashboard/MemberWorkspace';
import { formatOverviewDate } from '@/utils/format';

export default function HRDashboardController() {
  const { hrViewMode } = useHRViewStore();
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

  return (
    <div className="w-full">
      {hrViewMode === 'OWNER' ? (
        <OwnerDashboard currentTime={currentTime} />
      ) : (
        <MemberWorkspace currentTime={currentTime} />
      )}
    </div>
  );
}