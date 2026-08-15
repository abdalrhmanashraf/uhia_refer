import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { mockReferrals } from '../../data/mockData';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'لوحة القيادة', subtitle: 'نظرة شاملة على أداء التحويلات' },
  '/new-referral': { title: 'طلب تحويل جديد', subtitle: 'تسجيل طلب تحويل طبي للمنتفعين' },
  '/referrals': { title: 'قائمة التحويلات', subtitle: 'متابعة وإدارة جميع طلبات التحويل' },
};

export function Layout() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'مسار', subtitle: '' };
  const pendingCount = mockReferrals.filter(r => r.status === 'PENDING_REVIEW').length;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-8 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-black text-slate-100">{pageInfo.title}</h2>
            <p className="text-xs text-slate-500">{pageInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="بحث سريع..."
                className="bg-slate-800/60 border border-slate-700/40 text-slate-300 placeholder-slate-600 rounded-xl pr-4 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-52 transition-all duration-200"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>

            <button className="relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition-all">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
