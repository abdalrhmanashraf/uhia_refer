import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus2, ListFilter, LogOut,
  Shield, Users, Activity, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleLabels: Record<string, { label: string; color: string }> = {
  SYSTEM_ADMIN: { label: 'مسؤول النظام', color: 'text-rose-400 bg-rose-950/60 border-rose-800/50' },
  DIRECTORATE_REVIEWER: { label: 'مدير إدارة المنافذ', color: 'text-amber-400 bg-amber-950/60 border-amber-800/50' },
  UNIT_SPECIALIST: { label: 'أخصائي منفذ', color: 'text-brand-400 bg-brand-950/60 border-brand-800/50' },
  HOSPITAL_RECEIVER: { label: 'مسؤول قبول المستشفى', color: 'text-blue-400 bg-blue-950/60 border-blue-800/50' },
};

export function Sidebar() {
  const { user, logout, switchUser, allUsers, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'لوحة القيادة', icon: LayoutDashboard, path: '/' },
    { label: 'طلب تحويل جديد', icon: FilePlus2, path: '/new-referral' },
    { label: 'قائمة التحويلات', icon: ListFilter, path: '/referrals' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'إدارة المستخدمين', icon: Users, path: '/users' });
  }

  const roleInfo = user ? roleLabels[user.role] : { label: 'مستخدم', color: 'text-slate-400' };

  return (
    <aside className="glass-sidebar w-64 flex-shrink-0 flex flex-col h-screen select-none">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/50 flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              مَسار
              <span className="text-[10px] bg-brand-900/80 text-brand-300 px-1.5 py-0.5 rounded border border-brand-700/50">الأقصر</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold">التأمين الصحي الشامل</p>
          </div>
        </div>
      </div>

      {/* User Info & Switcher */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-900/80 border border-slate-800/80 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">{user?.name || 'غير مسجل'}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border mt-0.5 ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSwitcher(!showSwitcher)}
            title="تبديل المستخدم للتجربة"
            className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSwitcher ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* User Switcher Dropdown */}
        {showSwitcher && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 max-h-48 overflow-y-auto">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              التبديل السريع للحسابات:
            </p>
            {allUsers.slice(0, 6).map(u => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setShowSwitcher(false);
                }}
                className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  user?.id === u.id
                    ? 'bg-brand-900/40 text-brand-300 border border-brand-700/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="truncate max-w-[120px]">{u.name}</span>
                <span className="text-[9px] font-mono text-slate-500">{u.username}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-3 mb-2">القائمة الرئيسية</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/60 space-y-1 bg-slate-950/80">
        <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-brand-500/70" />
          <span>فرع الأقصر — UHIA</span>
        </div>
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/40"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
