import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Shield } from 'lucide-react';
import { mockReferrals } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'لوحة القيادة', subtitle: 'مؤشرات أداء التحويلات الطبية — فرع الأقصر' },
  '/new-referral': { title: 'طلب تحويل طبي جديد', subtitle: 'تسجيل طلب تحويل للمنتفعين من واقع وحدات طب الأسرة' },
  '/referrals': { title: 'قائمة ومتابعة التحويلات', subtitle: 'إدارة وتتبع مسار الحالات المحولة للمستشفيات المتعاقدة' },
  '/users': { title: 'إدارة المستخدمين وتوزيع الصلاحيات', subtitle: 'لوحة تحكم مسؤول النظام (عبد الرحمن أشرف)' },
};

export function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const pageInfo = pageTitles[location.pathname] || { title: 'مسار', subtitle: 'منظومة التحويلات الطبية' };
  const pendingCount = mockReferrals.filter(r => r.status === 'PENDING_REVIEW').length;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
          <div>
            <h2 className="text-base lg:text-lg font-black text-slate-100">{pageInfo.title}</h2>
            <p className="text-[11px] text-slate-500 font-medium">{pageInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              <span>المستشفيات المعتمدة: <strong className="text-brand-300">5 مستشفيات متعاقدة</strong></span>
            </div>

            <button className="relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition-all">
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
