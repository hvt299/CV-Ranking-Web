'use client';

import { useEffect, useState } from 'react';
import { useHRViewStore } from '@/store/useHRViewStore';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import OwnerDashboard from '@/components/hr/dashboard/OwnerDashboard';
import MemberWorkspace from '@/components/hr/dashboard/MemberWorkspace';
import { formatOverviewDate } from '@/utils/format';

export default function HRDashboardController() {
  const { hrViewMode } = useHRViewStore();
  const { user } = useAuthStore();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setCurrentTime(`${timeStr} | ${formatOverviewDate(now)}`);
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // HR_MEMBER luôn chỉ được xem Member Workspace
  const isOwner =
    user?.role === UserRole.HR_OWNER &&
    hrViewMode === 'OWNER';

  return (
    <main className="w-full min-w-0">
      {isOwner ? (
        <OwnerDashboard currentTime={currentTime} />
      ) : (
        <MemberWorkspace currentTime={currentTime} />
      )}
    </main>
  );
}