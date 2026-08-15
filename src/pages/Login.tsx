import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, switchUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = login(username, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'فشل تسجيل الدخول');
    }
  };

  const handleQuickSwitch = (userId: string) => {
    switchUser(userId);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mx-auto flex items-center justify-center shadow-xl shadow-brand-900/50 mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-slate-100 tracking-tight">منصة مسار</h2>
        <p className="text-sm text-brand-400 font-semibold mt-1">
          نظام إدارة التحويلات الطبية — التأمين الصحي الشامل فرع الأقصر
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card p-8 shadow-2xl border-slate-800 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-lg font-bold text-slate-200">تسجيل الدخول للمنظومة</h3>
            <p className="text-xs text-slate-500 mt-1">أدخل بيانات الاعتماد الخاصة بحسابك المؤسسي</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">اسم المستخدم (Username)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="اسم المستخدم"
                  className="form-input pr-10 font-mono text-sm"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="form-label">كلمة المرور (Password)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pr-10 font-mono text-sm"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base font-bold shadow-lg shadow-brand-900/40 mt-2"
            >
              <span>تسجيل الدخول</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] text-slate-500 font-semibold text-center uppercase tracking-wider">
              أو الدخول المباشر السريع لتجربة الأدوار:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSwitch('u_admin')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 font-semibold text-right transition-colors"
              >
                <span className="block text-[11px] text-rose-400">الأدمن</span>
                عبد الرحمن أشرف
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('u_gates')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 font-semibold text-right transition-colors"
              >
                <span className="block text-[11px] text-amber-400">مدير المنافذ</span>
                أحمد أمين
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('u_s2')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 font-semibold text-right transition-colors"
              >
                <span className="block text-[11px] text-brand-400">أخصائي منفذ</span>
                جمال عبد الناصر
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('u_h_cleo')}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 font-semibold text-right transition-colors"
              >
                <span className="block text-[11px] text-blue-400">مستشفى متعاقد</span>
                م. كليوباترا
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
