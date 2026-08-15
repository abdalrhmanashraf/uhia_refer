import { Link } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, ArrowLeft, Zap, Hospital, FolderPlus
} from 'lucide-react';
import { getStatusConfig, getUrgencyConfig, getUnit } from '../data/mockData';
import { useReferrals } from '../context/ReferralsContext';

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <div className="stat-card group cursor-default">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} transition-all duration-200 group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-100">{value}</p>
        <p className="text-sm text-slate-400 font-semibold">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { referrals } = useReferrals();

  const stats = {
    total: referrals.length,
    pendingReview: referrals.filter(r => r.status === 'PENDING_REVIEW').length,
    pendingHospital: referrals.filter(r => r.status === 'PENDING_HOSPITAL').length,
    accepted: referrals.filter(r => r.status === 'ACCEPTED').length,
    rejected: referrals.filter(r => r.status === 'REJECTED').length,
    emergency: referrals.filter(r => r.urgency === 'emergency').length,
  };

  const recentReferrals = [...referrals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-brand-900/40 via-slate-900 to-slate-900 border border-brand-800/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">منظومة التحويلات الطبية — <span className="text-brand-400">فرع الأقصر</span></h1>
            <p className="text-slate-400 mt-1 text-sm">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/new-referral" className="btn-primary self-start sm:self-auto">
            <FileText className="w-4 h-4" />
            إنشاء أول طلب تحويل
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.total} icon={FileText}
          color="bg-slate-700/60 text-slate-300" />
        <StatCard label="قيد المراجعة" value={stats.pendingReview} icon={Clock}
          color="bg-amber-900/50 text-amber-400" />
        <StatCard label="قيد المستشفى" value={stats.pendingHospital} icon={Hospital}
          color="bg-blue-900/50 text-blue-400" />
        <StatCard label="مقبولة" value={stats.accepted} icon={CheckCircle2}
          color="bg-brand-900/50 text-brand-400" />
        <StatCard label="مرفوضة" value={stats.rejected} icon={XCircle}
          color="bg-red-900/50 text-red-400" />
        <StatCard label="طارئ" value={stats.emergency} icon={Zap}
          color="bg-rose-900/50 text-rose-400" sub="أولوية قصوى" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Referrals */}
        <div className="xl:col-span-2 glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              <h3 className="font-bold text-slate-200">أحدث التحويلات المسجلة</h3>
            </div>
            {referrals.length > 0 && (
              <Link to="/referrals" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold">
                عرض الكل <ArrowLeft className="w-3 h-3" />
              </Link>
            )}
          </div>

          {referrals.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-400">
                <FolderPlus className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-300 text-base">لا توجد طلبات تحويل مسجلة حتى الآن</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  تم إخلاء القائمة الافتراضية بنجاح. يمكنك الآن البدء بإنشاء طلبات التحويل الحقيقية من واقع وحدات طب الأسرة.
                </p>
              </div>
              <Link to="/new-referral" className="btn-primary inline-flex mt-2">
                <FileText className="w-4 h-4" />
                تسجيل طلب تحويل جديد
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {recentReferrals.map((ref) => {
                const statusCfg = getStatusConfig(ref.status);
                const urgencyCfg = getUrgencyConfig(ref.urgency);
                const unit = getUnit(ref.sourceUnitId);
                return (
                  <div key={ref.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold text-xs">
                          {ref.patientName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-200 text-sm truncate">{ref.patientName}</p>
                          <p className="text-xs text-slate-500">{ref.specialty} • {unit?.name || 'غير محدد'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
                        <span className={`badge ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-mono">{ref.id}</span>
                      <span className="text-xs text-slate-600">
                        {new Date(ref.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              تنبيهات النظام
            </h3>
            <div className="space-y-3">
              {stats.emergency > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800/40 rounded-xl">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <p className="text-xs text-red-300 font-semibold">{stats.emergency} طلبات طارئة تستلزم اهتماماً فورياً</p>
                </div>
              ) : (
                <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-xs text-slate-400 text-center">
                  لا توجد طلبات طارئة معلقة
                </div>
              )}

              {stats.pendingReview > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-900/20 border border-amber-800/40 rounded-xl">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <p className="text-xs text-amber-300 font-semibold">{stats.pendingReview} طلبات بانتظار مراجعة إدارة المنافذ</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-200 mb-4">المستشفيات المتعاقدة المعتمدة</h3>
            <div className="space-y-2 text-xs">
              {['مستشفى كليوباترا', 'مستشفى الندى', 'مركز رؤية للعيون', 'مستشفى العيون الدولي', 'مستشفى الكمال'].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                  <span className="text-slate-300 font-medium">{h}</span>
                  <span className="text-[10px] text-brand-400 font-bold bg-brand-900/30 px-1.5 py-0.5 rounded">معتمد ✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
