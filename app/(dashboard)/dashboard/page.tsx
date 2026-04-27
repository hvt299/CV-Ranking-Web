'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Users, Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          api.get('/jobs/dashboard/analytics'),
          api.get('/cv/applications/recent'),
          api.get('/jobs')
        ]);

        setStats(statsRes.data);
        setRecentApps(appsRes.data);
        setOpenJobs(jobsRes.data.filter((j: any) => j.status !== 'closed'));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const highScoringApps = recentApps.filter(app => (app.ai_score?.total_score || 0) >= 80).length;

  const todayString = new Date().toLocaleDateString('vi-VN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 transition-colors duration-300 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Tổng quan Hệ thống</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Hôm nay, {todayString}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Chiến dịch (Jobs)" value={stats?.total_jobs || 0} icon={Briefcase} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard title="CV Đã Phân Tích" value={stats?.total_cvs_in_pool || 0} icon={FileText} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-500/10" />
        <StatCard title="AI Đề Xuất (>80đ)" value={highScoringApps} icon={Sparkles} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" />
        <StatCard title="Đang Phỏng Vấn" value={stats?.status_breakdown?.['Phỏng vấn'] || 0} icon={Users} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng Lượt Ứng Tuyển Mới */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Lượt Ứng Tuyển Mới</h2>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-150">
              <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-100 dark:border-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Ứng viên & Vị trí</div>
                <div className="col-span-3 text-center">AI Score</div>
                <div className="col-span-2 text-left">Ngày nộp</div>
                <div className="col-span-2 text-right">Trạng thái</div>
              </div>

              <div className="space-y-2 mt-4 flex-1">
                {recentApps.slice(0, 5).map((app) => {
                  const displayName = app.filename
                    ? app.filename.replace(/-TopCV\.vn.*/i, '').replace(/-/g, ' ')
                    : app.candidate_email?.split('@')[0] || "Ứng viên ẩn";
                  return (
                    <ApplicantRow
                      key={app.id}
                      name={displayName}
                      role={app.job_title}
                      score={app.ai_score?.total_score || 0}
                      date={new Date(app.applied_at || new Date()).toLocaleDateString('vi-VN')}
                      status={app.status || 'Mới'}
                      jobId={app.job_id}
                    />
                  )
                })}
                {recentApps.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">Chưa có CV nào được đưa vào chiến dịch.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions Card */}
        <div className="col-span-1 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chiến dịch đang mở</h2>
            <Link href="/jobs" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {openJobs.slice(0, 4).map((job) => {
              const cvCount = recentApps.filter(app => app.job_id === job.id).length;
              const reqSkills = job.required_skills?.slice(0, 3).map((s: any) => s.name) || [];

              return (
                <PositionCard
                  key={job.id}
                  jobId={job.id}
                  title={job.title}
                  reqSkills={reqSkills}
                  count={cvCount}
                />
              );
            })}
            {openJobs.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">Không có chiến dịch mở.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{title}</p>
      <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">{value}</p>
    </div>
  );
}

function ApplicantRow({ name, role, score, date, status, jobId }: any) {
  const statusConfig: Record<string, any> = {
    'Mới': { label: "Mới nộp", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
    'Đang xem xét': { label: "Đang xem", color: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
    'Phỏng vấn': { label: "Phỏng vấn", color: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
    'Đề nghị (Offer)': { label: "Gửi Offer", color: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20" },
    'Trúng tuyển': { label: "Trúng tuyển", color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
    'Từ chối': { label: "Đã loại", color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" }
  };

  const currentStatus = statusConfig[status] || statusConfig['Mới'];
  const formattedScore = Number(score).toFixed(1);

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Link href={`/jobs/${jobId}`} className="grid grid-cols-12 items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
      <div className="col-span-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 uppercase shrink-0">
          {name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium truncate">{role}</p>
        </div>
      </div>

      <div className="col-span-3 px-2 flex flex-col items-center">
        <div className="flex items-center gap-2 w-full max-w-35">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-12.5 text-right">{formattedScore}%</span>
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getScoreColor(score)}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="col-span-2 text-slate-500 dark:text-slate-400 text-[13px] font-medium text-left">{date}</div>

      <div className="col-span-2 text-right">
        <span className={`inline-flex items-center justify-center w-24 py-1.5 rounded-lg text-xs font-bold border ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>
    </Link>
  );
}

function PositionCard({ title, reqSkills, count, jobId }: any) {
  return (
    <Link href={`/jobs/${jobId}`} className="block p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-[#0f172a]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-2">{title}</h3>
        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20 shrink-0">
          {count} CVs
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {reqSkills.map((skill: string, idx: number) => (
          <span key={idx} className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}