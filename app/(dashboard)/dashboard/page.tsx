import { FileText, Users, Briefcase, Sparkles, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Tổng quan Hệ thống</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Hôm nay, 18 Tháng 2, 2026</p>
        </div>
      </div>

      {/* Responsive: 1 cột mobile, 2 cột tablet, 4 cột PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Chiến dịch (Jobs)" value="12" icon={Briefcase} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard title="CV Đã Phân Tích" value="1,284" icon={FileText} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-500/10" />
        <StatCard title="AI Đề Xuất (>80)" value="86" icon={Sparkles} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-500/10" />
        <StatCard title="Đang Phỏng Vấn" value="24" icon={Users} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-500/10" />
      </div>

      {/* Responsive: 1 cột bự trên tablet, tách 3 cột trên PC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Bảng CV */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">CV Mới Phân Tích</h2>
            </div>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors">
              Xem tất cả
            </button>
          </div>

          {/* Vùng Bảng cuộn ngang được */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-150">
              <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-100 dark:border-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Ứng viên & Vị trí</div>
                <div className="col-span-3 text-center">AI Score</div>
                <div className="col-span-2 text-left">Ngày nộp</div>
                <div className="col-span-2 text-right">Trạng thái</div>
              </div>

              <div className="space-y-2 mt-4 flex-1">
                <ApplicantRow name="Nguyễn Văn A" role="Thực tập sinh React Native" score={95.5} date="18/02/2026" status="interviewing" />
                <ApplicantRow name="Trần Thị B" role="Backend Python Engineer" score={82.0} date="17/02/2026" status="reviewed" />
                <ApplicantRow name="Lê Hoàng C" role="Thực tập sinh React Native" score={63.5} date="16/02/2026" status="new" />
                <ApplicantRow name="Phạm D" role="Data Scientist" score={34.0} date="15/02/2026" status="rejected" />
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions Card */}
        <div className="col-span-1 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chiến dịch đang mở</h2>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <PositionCard title="Thực tập sinh React Native" reqSkills={['React Native', 'TypeScript', 'Firebase']} count="45" />
            <PositionCard title="Backend Python Engineer" reqSkills={['Python', 'FastAPI', 'MongoDB']} count="128" />
            <PositionCard title="DevOps Engineer" reqSkills={['Docker', 'CI/CD', 'AWS']} count="32" />
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

function ApplicantRow({ name, role, score, date, status }: any) {
  const statusConfig: any = {
    new: { label: "Mới nộp", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
    reviewed: { label: "Đã xem", color: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
    interviewing: { label: "Phỏng vấn", color: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
    hired: { label: "Trúng tuyển", color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
    rejected: { label: "Đã loại", color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" }
  };
  const currentStatus = statusConfig[status] || statusConfig.new;
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="grid grid-cols-12 items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
      <div className="col-span-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300">
          {name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium truncate">{role}</p>
        </div>
      </div>

      <div className="col-span-3 px-2 flex flex-col items-center">
        <div className="flex items-center gap-2 w-full max-w-35">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-12.5 text-right">{score}%</span>
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getScoreColor(score)}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="col-span-2 text-slate-500 dark:text-slate-400 text-[13px] font-medium text-left">{date}</div>

      <div className="col-span-2 text-right">
        <span className={`inline-flex items-center justify-center w-28 py-1.5 rounded-lg text-xs font-bold border ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>
    </div>
  );
}

function PositionCard({ title, reqSkills, count }: any) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-[#0f172a]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20">
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
    </div>
  );
}