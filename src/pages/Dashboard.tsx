import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, ArrowLeft, Zap, Hospital
} from 'lucide-react';
import { mockReferrals, getStatusConfig, getUrgencyConfig, getUnit, getHospital } from '../data/mockData';

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
  const stats = {
    total: mockReferrals.length,
    pendingReview: mockReferrals.filter(r => r.status === 'PENDING_REVIEW').length,
    pendingHospital: mockReferrals.filter(r => r.status === 'PENDING_HOSPITAL').length,
    accepted: mockReferrals.filter(r => r.status === 'ACCEPTED').length,
    rejected: mockReferrals.filter(r => r.status === 'REJECTED').length,
    emergency: mockReferrals.filter(r => r.urgency === 'emergency').length,
  };

  const recentReferrals = [...mockReferrals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-brand-900/40 via-slate-900 to-slate-900 border border-brand-800/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">مرحباً بك في منصة <span className="text-brand-400">مسار</span></h1>
            <p className="text-slate-400 mt-1 text-sm">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/new-referral" className="btn-primary">
            <FileText className="w-4 h-4" />
            طلب تحويل جديد
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
          color="bg-rose-900/50 text-rose-400" sub="يستلزم أولوية فورية" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Referrals */}
        <div className="xl:col-span-2 glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              <h3 className="font-bold text-slate-200">أحدث الطلبات</h3>
            </div>
            <Link to="/referrals" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
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
                        <p className="text-xs text-slate-500">{ref.specialty} • {unit?.name}</p>
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
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              تنبيهات النظام
            </h3>
            <div className="space-y-3">
              {stats.emergency > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800/40 rounded-xl">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <p className="text-xs text-red-300 font-semibold">{stats.emergency} طلبات طارئة تستلزم اهتماماً فورياً</p>
                </div>
              )}
              {stats.pendingReview > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-900/20 border border-amber-800/40 rounded-xl">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <p className="text-xs text-amber-300 font-semibold">{stats.pendingReview} طلبات بانتظار مراجعة المشرف</p>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-800/40 rounded-xl">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                <p className="text-xs text-blue-300 font-semibold">{stats.pendingHospital} طلبات قيد رد المستشفيات</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-200 mb-4">معدل القبول</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">نسبة الطلبات المقبولة</span>
              <span className="text-sm font-black text-brand-400">
                {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-l from-brand-500 to-brand-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">نسبة الرفض</span>
              <span className="text-xs font-bold text-red-400">
                {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
