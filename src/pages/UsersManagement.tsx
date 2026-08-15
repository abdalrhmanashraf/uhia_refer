import React, { useState } from 'react';
import {
  UserPlus, Shield, ShieldCheck, CheckCircle2, XCircle,
  Edit2, Trash2, Building2, Hospital as HospitalIcon, Search,
  Lock, AlertTriangle, Check, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { mockUnits, mockHospitals } from '../data/mockData';

const ROLE_CONFIGS: Record<UserRole, {
  label: string;
  badgeColor: string;
  desc: string;
  permissions: string[];
}> = {
  SYSTEM_ADMIN: {
    label: 'مسؤول النظام',
    badgeColor: 'bg-rose-900/40 text-rose-300 border-rose-700/40',
    desc: 'صلاحيات كاملة لإدارة النظام، المستخدمين، وتحديد الصلاحيات والمستشفيات',
    permissions: ['إدارة المستخدمين والصلاحيات', 'الاطلاع على جميع التحويلات', 'مراقبة أداء المستشفيات', 'تعديل إعدادات النظام'],
  },
  DIRECTORATE_REVIEWER: {
    label: 'مدير إدارة المنافذ / مراجع',
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
    desc: 'مراجعة طلبات التحويل الصادرة من الوحدات، اعتمادها، وتوجيهها للمستشفيات المتعاقدة',
    permissions: ['مراجعة واعتماد طلبات التحويل', 'إعادة الطلب للوحدة للاستيفاء', 'توجيه الطلب للمستشفى المتعاقد', 'رفض الطلب مع إبداء السبب'],
  },
  UNIT_SPECIALIST: {
    label: 'أخصائي منفذ / وحدة',
    badgeColor: 'bg-brand-900/40 text-brand-300 border-brand-700/40',
    desc: 'تسجيل وإنشاء طلبات التحويل الطبي للمنتفعين من واقع وحدات ومراكز طب الأسرة',
    permissions: ['إنشاء طلب تحويل جديد', 'الاستخراج التلقائي من الرقم القومي', 'رفع المستندات والتقارير الطبية', 'متابعة حالة طلبات الوحدة'],
  },
  HOSPITAL_RECEIVER: {
    label: 'مسؤول قبول المستشفى المتعاقد',
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
    desc: 'استقبال طلبات التحويل الواردة للمستشفى المتعاقد والبت فيها (قبول / رفض / طلب استيفاء)',
    permissions: ['الاطلاع على التحويلات الواردة للمستشفى', 'قبول الحالة وتأكيد الاستقبال', 'طلب استيفاء إضافي (RFI)', 'رفض الحالة لعدم توفر السعة'],
  },
};

export function UsersManagement() {
  const { user: currentUser, allUsers, addUser, updateUser, deleteUser, isAdmin, switchUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // فورم إضافة / تعديل مستخدم
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'UNIT_SPECIALIST' as UserRole,
    jobTitle: '',
    unitId: '',
    hospitalId: '',
    isActive: true,
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // لو المستخدم مش أدمن
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-10 text-center border-red-800/40">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">صلاحية مقيدة لمسؤول النظام فقط</h2>
          <p className="text-slate-400 text-sm mb-6">
            هذه الشاشة مخصصة حصرياً للأدمن <span className="text-brand-400 font-bold">عبد الرحمن أشرف</span> (يوزر: <span className="font-mono text-amber-300">admin</span>) لإدارة المستخدمين وتوزيع الصلاحيات.
          </p>
          <button
            onClick={() => switchUser('u_admin')}
            className="btn-primary mx-auto"
          >
            <ShieldCheck className="w-4 h-4" />
            التبديل إلى حساب مسؤول النظام (admin)
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u => {
    const matchSearch =
      u.name.includes(searchTerm) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.jobTitle && u.jobTitle.includes(searchTerm));
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAddModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      role: 'UNIT_SPECIALIST',
      jobTitle: '',
      unitId: mockUnits[0]?.id || '',
      hospitalId: mockHospitals[0]?.id || '',
      isActive: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (targetUser: User) => {
    setEditingUserId(targetUser.id);
    setFormData({
      name: targetUser.name,
      username: targetUser.username,
      password: '',
      email: targetUser.email,
      role: targetUser.role,
      jobTitle: targetUser.jobTitle || '',
      unitId: targetUser.unitId || '',
      hospitalId: targetUser.hospitalId || '',
      isActive: targetUser.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      setFormError('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    if (editingUserId) {
      updateUser(editingUserId, {
        name: formData.name,
        username: formData.username.trim().toLowerCase(),
        email: formData.email,
        role: formData.role,
        jobTitle: formData.jobTitle,
        unitId: formData.role === 'UNIT_SPECIALIST' ? formData.unitId : undefined,
        hospitalId: formData.role === 'HOSPITAL_RECEIVER' ? formData.hospitalId : undefined,
        isActive: formData.isActive,
      });
      setSuccessMsg('تم تحديث بيانات المستخدم بنجاح');
    } else {
      const usernameExists = allUsers.some(
        u => u.username.toLowerCase() === formData.username.trim().toLowerCase()
      );
      if (usernameExists) {
        setFormError('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم مستخدم آخر');
        return;
      }

      addUser(
        {
          name: formData.name,
          username: formData.username.trim().toLowerCase(),
          email: formData.email,
          role: formData.role,
          jobTitle: formData.jobTitle || ROLE_CONFIGS[formData.role].label,
          unitId: formData.role === 'UNIT_SPECIALIST' ? formData.unitId : undefined,
          hospitalId: formData.role === 'HOSPITAL_RECEIVER' ? formData.hospitalId : undefined,
          isActive: formData.isActive,
        },
        formData.password || '1234'
      );
      setSuccessMsg('تم إنشاء المستخدم الجديد بنجاح');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-brand-900/40 via-slate-900 to-slate-900 border border-brand-800/30 p-6">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">لوحة تحكم مسؤول النظام</span>
            </div>
            <h1 className="text-2xl font-black text-white">إدارة المستخدمين وتحديد الصلاحيات</h1>
            <p className="text-slate-400 text-sm mt-1">
              إنشاء حسابات الموظفين، ربطهم بالمنافذ أو المستشفيات المتعاقدة، والتحكم بالصلاحيات
            </p>
          </div>

          <button onClick={openAddModal} className="btn-primary self-start md:self-auto">
            <UserPlus className="w-4 h-4" />
            إضافة مستخدم جديد
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-brand-900/30 border border-brand-700/50 flex items-center gap-3 text-brand-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Permissions Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map(roleKey => {
          const cfg = ROLE_CONFIGS[roleKey];
          const count = allUsers.filter(u => u.role === roleKey).length;
          return (
            <div key={roleKey} className="glass-card p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`badge ${cfg.badgeColor}`}>{cfg.label}</span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {count} مستخدم
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{cfg.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">الصلاحيات الممنوحة:</p>
                <ul className="space-y-1">
                  {cfg.permissions.map((p, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-brand-400 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users List & Search */}
      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="بحث بالاسم أو اسم المستخدم أو المسمى..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4 py-2 text-sm"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="form-select py-2 text-sm max-w-[200px]"
            >
              <option value="ALL">جميع الأدوار</option>
              <option value="SYSTEM_ADMIN">مسؤول النظام</option>
              <option value="DIRECTORATE_REVIEWER">مدير إدارة المنافذ</option>
              <option value="UNIT_SPECIALIST">أخصائي منفذ</option>
              <option value="HOSPITAL_RECEIVER">مسؤول قبول مستشفى</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-semibold">
            إجمالي: <span className="text-brand-400 font-bold">{filteredUsers.length}</span> مستخدم
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3.5">المستخدم</th>
                <th className="px-5 py-3.5">اسم الدخول (Username)</th>
                <th className="px-5 py-3.5">الدور والصلاحية</th>
                <th className="px-5 py-3.5">الجهة المرتبطة</th>
                <th className="px-5 py-3.5 text-center">الحالة</th>
                <th className="px-5 py-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    لا يوجد مستخدمون مطابقون لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const roleCfg = ROLE_CONFIGS[u.role];
                  const linkedUnit = mockUnits.find(unit => unit.id === u.unitId);
                  const linkedHosp = mockHospitals.find(h => h.id === u.hospitalId);
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="table-row">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 flex items-center gap-1.5">
                              {u.name}
                              {isCurrent && (
                                <span className="text-[10px] bg-brand-900/60 text-brand-300 border border-brand-700/50 px-1.5 py-0.2 rounded">
                                  أنت
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400">{u.jobTitle}</p>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-amber-300/90 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/40">
                          {u.username}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`badge ${roleCfg.badgeColor}`}>
                          {roleCfg.label}
                        </span>
                      </td>

                      {/* Linked Unit / Hosp */}
                      <td className="px-5 py-4">
                        {u.role === 'UNIT_SPECIALIST' && linkedUnit && (
                          <span className="text-xs text-slate-300 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-brand-400" />
                            {linkedUnit.name}
                          </span>
                        )}
                        {u.role === 'HOSPITAL_RECEIVER' && linkedHosp && (
                          <span className="text-xs text-slate-300 flex items-center gap-1">
                            <HospitalIcon className="w-3.5 h-3.5 text-blue-400" />
                            {linkedHosp.name}
                          </span>
                        )}
                        {(u.role === 'SYSTEM_ADMIN' || u.role === 'DIRECTORATE_REVIEWER') && (
                          <span className="text-xs text-slate-500">فرع الأقصر الرئيسي</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                          title={u.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                          className={`badge cursor-pointer transition-all ${
                            u.isActive
                              ? 'bg-brand-900/30 text-brand-300 border-brand-700/40 hover:bg-brand-900/50'
                              : 'bg-red-900/30 text-red-400 border-red-700/40 hover:bg-red-900/50'
                          }`}
                        >
                          {u.isActive ? 'نشط ✓' : 'معطل ✗'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => switchUser(u.id)}
                            title="تجربة الدخول بهذا المستخدم"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(u)}
                            title="تعديل المستخدم"
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {u.username !== 'admin' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف المستخدم ${u.name}؟`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              title="حذف المستخدم"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-900/40 border border-brand-700/40 flex items-center justify-center text-brand-400">
                  {editingUserId ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">
                    {editingUserId ? 'تعديل بيانات وصلاحيات المستخدم' : 'إضافة مستخدم جديد للنظام'}
                  </h3>
                  <p className="text-xs text-slate-500">تحديد الدور الوظيفي والموقع والمنفذ المرتبط</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">الاسم الكامل <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. محمد أحمد عبد العال"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">اسم المستخدم للولوج (Username) <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={editingUserId !== null && formData.username === 'admin'}
                    placeholder="مثال: mohamed.ahmed"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div>
                  <label className="form-label">
                    {editingUserId ? 'كلمة المرور (اتركها فارغة للإبقاء)' : 'كلمة المرور'}
                  </label>
                  <input
                    type="password"
                    placeholder={editingUserId ? '••••••' : 'افتراضي 1234 أو 0000'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">البريد الإلكتروني <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="user@uhia-luxor.gov.eg"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">المسمى الوظيفي</label>
                  <input
                    type="text"
                    placeholder="مثال: أخصائي منفذ وحدة البغدادي"
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* تحديد الدور والصلاحية */}
              <div>
                <label className="form-label">الدور الوظيفي والصلاحيات <span className="text-red-400">*</span></label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="form-select font-semibold"
                >
                  <option value="UNIT_SPECIALIST">أخصائي منفذ / وحدة طب أسرة (إنشاء ومتابعة التحويلات)</option>
                  <option value="DIRECTORATE_REVIEWER">مدير إدارة المنافذ (المراجعة والاعتماد والتوجيه)</option>
                  <option value="HOSPITAL_RECEIVER">مسؤول قبول مستشفى متعاقد (البت في القبول والاستيفاء)</option>
                  <option value="SYSTEM_ADMIN">مسؤول النظام (صلاحيات كاملة + إدارة المستخدمين)</option>
                </select>
              </div>

              {/* إذا كان أخصائي وحدة، اختيار المنفذ */}
              {formData.role === 'UNIT_SPECIALIST' && (
                <div>
                  <label className="form-label">المنفذ أو الوحدة المرتبطة بالمستخدم <span className="text-red-400">*</span></label>
                  <select
                    value={formData.unitId}
                    onChange={e => setFormData({ ...formData, unitId: e.target.value })}
                    className="form-select"
                  >
                    {mockUnits.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.directorate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* إذا كان مسؤول مستشفى، اختيار المستشفى من المستشفيات المتعاقدة الـ 5 */}
              {formData.role === 'HOSPITAL_RECEIVER' && (
                <div>
                  <label className="form-label">المستشفى المتعاقد التابع له <span className="text-red-400">*</span></label>
                  <select
                    value={formData.hospitalId}
                    onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}
                    className="form-select"
                  >
                    {mockHospitals.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} — {h.location}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* حالة الحساب */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-200 cursor-pointer">
                  حساب نشط ومفعل لتسجيل الدخول
                </label>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  إلغاء
                </button>
                <button type="submit" className="btn-primary">
                  {editingUserId ? 'حفظ التعديلات' : 'إضافة المستخدم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
