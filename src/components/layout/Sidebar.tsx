import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus2, ListFilter, LogOut,
  Shield, ChevronDown, Activity
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';

const roleLabels: Record<string, string> = {
  UNIT_SPECIALIST: 'أخصائي وحدة',
  DIRECTORATE_REVIEWER: 'مشرف إدارة',
  HOSPITAL_RECEIVER: 'مسؤول قبول المستشفى',
  SYSTEM_ADMIN: 'مسؤول النظام',
};

const navItems = [
  { label: 'لوحة القيادة', icon: LayoutDashboard, path: '/' },
  { label: 'طلب تحويل جديد', icon: FilePlus2, path: '/new-referral' },
  { label: 'قائمة التحويلات', icon: ListFilter, path: '/referrals' },
];

export function Sidebar() {
  const user = CURRENT_USER;

  return (
    <aside className="glass-sidebar w-64 flex-shrink-0 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/50">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">مَسار</h1>
            <p className="text-xs text-slate-500 font-medium">نظام التحويلات الطبية</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-brand-400 font-semibold">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest px-4 mb-3">القائمة الرئيسية</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-800/60 space-y-1">
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600">
          <Shield className="w-3.5 h-3.5" />
          <span>UHIA © 2024 — جميع الحقوق محفوظة</span>
        </div>
        <button className="nav-link w-full text-red-500 hover:text-red-400 hover:bg-red-900/20">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
