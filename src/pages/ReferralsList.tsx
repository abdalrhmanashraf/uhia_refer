import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, FilePlus2, Eye, ChevronDown, FolderOpen, Trash2,
  CheckCircle2, XCircle,
  Hospital as HospitalIcon, User, Stethoscope, FileText,
  Shield, Edit3, Send
} from 'lucide-react';
import { getStatusConfig, getUrgencyConfig, getHospital, getUnit, mockHospitals } from '../data/mockData';
import { Referral, ReferralStatus } from '../types';
import { useReferrals } from '../context/ReferralsContext';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS: { value: ReferralStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'جميع الحالات' },
  { value: 'PENDING_REVIEW', label: 'قيد المراجعة' },
  { value: 'PENDING_HOSPITAL', label: 'قيد رد المستشفى' },
  { value: 'ACCEPTED', label: 'مقبول' },
  { value: 'RETURNED_TO_UNIT', label: 'مُعاد للوحدة' },
  { value: 'HOSPITAL_RFI', label: 'استيفاء مستشفى' },
  { value: 'REJECTED', label: 'مرفوض' },
  { value: 'DRAFT', label: 'مسودة' },
];

export function ReferralsList() {
  const { referrals, updateReferral, deleteReferral } = useReferrals();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  // Modal State
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [reviewHospitalId, setReviewHospitalId] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [rejectionReasonId, setRejectionReasonId] = useState<string>('r1');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const isReviewer = user?.role === 'DIRECTORATE_REVIEWER' || user?.role === 'SYSTEM_ADMIN';
  const isHospitalReceiver = user?.role === 'HOSPITAL_RECEIVER';

  const openDetailsModal = (ref: Referral) => {
    setSelectedReferral(ref);
    setReviewHospitalId(ref.targetHospitalId || 'HOSP_CLEO');
    setReviewNotes(ref.rejectionComment || '');
    setRejectionReasonId(ref.rejectionReasonId || 'r1');
    setActionSuccess('');
  };

  const closeModal = () => {
    setSelectedReferral(null);
    setActionSuccess('');
  };

  // إرسال الإجراء وتحديث الحالة
  const handleReviewAction = (newStatus: ReferralStatus, commentText?: string) => {
    if (!selectedReferral) return;

    updateReferral(selectedReferral.id, {
      status: newStatus,
      targetHospitalId: reviewHospitalId || selectedReferral.targetHospitalId,
      rejectionComment: commentText || reviewNotes,
      rejectionReasonId: newStatus === 'REJECTED' ? rejectionReasonId : undefined,
    });

    const targetHospName = mockHospitals.find(h => h.id === reviewHospitalId)?.name || 'المستشفى المتعاقد';

    if (newStatus === 'PENDING_HOSPITAL') {
      setActionSuccess(`تم اعتماد الطلب وتوجيهه بنجاح إلى: ${targetHospName}`);
    } else if (newStatus === 'ACCEPTED') {
      setActionSuccess(`تم قبول الحالة وتأكيد استقبالها بالمستشفى المتعاقد ✓`);
    } else if (newStatus === 'RETURNED_TO_UNIT') {
      setActionSuccess(`تم إعادة الطلب للوحدة المصدرة لاستيفاء البيانات`);
    } else if (newStatus === 'REJECTED') {
      setActionSuccess(`تم رفض طلب التحويل`);
    }

    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  const filtered = referrals.filter(r => {
    const matchSearch = !search ||
      r.patientName.includes(search) ||
      r.nationalId.includes(search) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.specialty.includes(search);
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchUrgency = urgencyFilter === 'ALL' || r.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم القومي أو رقم الطلب..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-10 pr-4 py-2.5 text-sm"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ReferralStatus | 'ALL')}
              className="form-select py-2.5 pl-8 text-sm appearance-none cursor-pointer min-w-[160px]"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute left-2 top-3 pointer-events-none" />
          </div>

          {/* Urgency Filter */}
          <div className="relative">
            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
              className="form-select py-2.5 pl-8 text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="ALL">كل الأولويات</option>
              <option value="routine">اعتيادي</option>
              <option value="urgent">عاجل</option>
              <option value="emergency">طارئ</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute left-2 top-3 pointer-events-none" />
          </div>
        </div>

        <Link to="/new-referral" className="btn-primary whitespace-nowrap flex-shrink-0">
          <FilePlus2 className="w-4 h-4" />
          طلب جديد
        </Link>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-4 font-semibold text-right">رقم الطلب</th>
                <th className="px-5 py-4 font-semibold text-right">المنتفع</th>
                <th className="px-5 py-4 font-semibold text-right hidden md:table-cell">التخصص</th>
                <th className="px-5 py-4 font-semibold text-right hidden lg:table-cell">المنفذ المحول</th>
                <th className="px-5 py-4 font-semibold text-right hidden lg:table-cell">المستشفى المتعاقد</th>
                <th className="px-5 py-4 font-semibold text-right">الأولوية</th>
                <th className="px-5 py-4 font-semibold text-right">الحالة</th>
                <th className="px-5 py-4 font-semibold text-right hidden md:table-cell">التاريخ</th>
                <th className="px-5 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500 max-w-sm mx-auto">
                      <FolderOpen className="w-12 h-12 text-slate-600" />
                      <p className="font-bold text-slate-300 text-base">لا توجد تحويلات مسجلة</p>
                      <p className="text-xs text-slate-500">
                        القائمة فارغة وجاهزة لاستقبال طلبات التحويل الجديدة للمستشفيات الـ 5 المتعاقدة.
                      </p>
                      <Link to="/new-referral" className="btn-primary mt-2">
                        <FilePlus2 className="w-4 h-4" />
                        إنشاء طلب تحويل جديد
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((ref) => {
                  const statusCfg = getStatusConfig(ref.status);
                  const urgencyCfg = getUrgencyConfig(ref.urgency);
                  const hospital = getHospital(ref.targetHospitalId);
                  const unit = getUnit(ref.sourceUnitId);

                  return (
                    <tr
                      key={ref.id}
                      onClick={() => openDetailsModal(ref)}
                      className="table-row cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-brand-400 font-bold group-hover:underline">
                          {ref.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-200">{ref.patientName}</p>
                        <p className="text-xs text-slate-500 font-mono">{ref.nationalId}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-slate-300 text-xs">{ref.specialty}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-slate-400 text-xs">{unit?.name || '—'}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-slate-200 text-xs font-semibold">
                          {hospital?.name || 'يحدده المشرف'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-500">
                          {new Date(ref.createdAt).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* زر المراجعة والاعتماد المباشر لمدير المنافذ */}
                          {isReviewer && ref.status === 'PENDING_REVIEW' && (
                            <button
                              onClick={() => openDetailsModal(ref)}
                              className="px-2.5 py-1 rounded-lg bg-brand-900/60 hover:bg-brand-800/80 border border-brand-600/60 text-brand-300 text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              مراجعة وتوجيه
                            </button>
                          )}

                          <button
                            onClick={() => openDetailsModal(ref)}
                            title="عرض التفاصيل والمراجعة"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف الطلب ${ref.id}؟`)) {
                                deleteReferral(ref.id);
                              }
                            }}
                            title="حذف الطلب"
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              عرض <span className="text-slate-300">{filtered.length}</span> من أصل <span className="text-slate-300">{referrals.length}</span> طلب
            </span>
          </div>
        )}
      </div>

      {/* ── Modal: تفاصيل ومراجعة واعتماد الطلب ──────────────────────────── */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border-slate-700 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-brand-400">{selectedReferral.id}</span>
                  <span className={`badge ${getStatusConfig(selectedReferral.status).color}`}>
                    {getStatusConfig(selectedReferral.status).label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  تفاصيل طلب التحويل — {selectedReferral.patientName}
                </h3>
              </div>

              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {actionSuccess && (
              <div className="p-4 rounded-xl bg-brand-900/40 border border-brand-700/60 text-brand-300 text-sm font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Case Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <p className="font-bold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-400" /> بيانات المنتفع
                </p>
                <div className="space-y-1">
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">الاسم:</strong> {selectedReferral.patientName}</p>
                  <p className="text-slate-200 font-mono"><strong className="text-slate-400 font-medium">الرقم القومي:</strong> {selectedReferral.nationalId}</p>
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">السن / النوع:</strong> {selectedReferral.patientAge} سنة • {selectedReferral.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">الهاتف:</strong> {selectedReferral.phone || 'غير مسجل'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <p className="font-bold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-400" /> بيانات الإحالة الطبية
                </p>
                <div className="space-y-1">
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">التخصص:</strong> {selectedReferral.specialty}</p>
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">المنفذ المحول:</strong> {getUnit(selectedReferral.sourceUnitId)?.name || 'غير محدد'}</p>
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">الطبيب:</strong> {selectedReferral.referringDoctor}</p>
                  <p className="text-slate-200"><strong className="text-slate-400 font-medium">درجة الإلحاح:</strong> {getUrgencyConfig(selectedReferral.urgency).label}</p>
                </div>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <p className="font-bold text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> الملخص السريري والتشخيص
              </p>
              <p className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 font-sans">
                {selectedReferral.clinicalSummary || 'لا يوجد ملخص سريري'}
              </p>
            </div>

            {/* ── لوحة قرارات مدير إدارة المنافذ (أحمد أمين / الأدمن) ─────── */}
            {isReviewer && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-900 border border-brand-700/50 space-y-4">
                <div className="flex items-center justify-between border-b border-brand-800/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-400" />
                    <h4 className="font-bold text-slate-100 text-sm">قرارات مراجعة إدارة المنافذ</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-300">أحمد أمين — مدير المنافذ</span>
                </div>

                {/* اختيار وتعديل المستشفى المتعاقد */}
                <div>
                  <label className="form-label text-xs">
                    توجيه الحالة إلى المستشفى المتعاقد <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={reviewHospitalId}
                    onChange={e => setReviewHospitalId(e.target.value)}
                    className="form-select font-bold text-sm bg-slate-950/80 border-brand-600/50 text-slate-100"
                  >
                    {mockHospitals.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} — ({h.specialties.slice(0, 3).join('، ')}...)
                      </option>
                    ))}
                  </select>
                </div>

                {/* ملاحظات المراجعة */}
                <div>
                  <label className="form-label text-xs">ملاحظات أو تعليمات المراجعة (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: تم التنسيق مع المستشفى لاستقبال الحالة غداً..."
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                {/* أزرار الإجراءات لمدير المنافذ */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleReviewAction('PENDING_HOSPITAL')}
                    className="btn-primary py-2.5 px-4 text-xs font-bold bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900/40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    اعتماد وتوجيه للمستشفى المتعاقد
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction('RETURNED_TO_UNIT', 'يرجى استيفاء المرفقات والتقرير الطبي')}
                    className="py-2.5 px-3.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-bold transition-all"
                  >
                    ↩️ إعادة للوحدة للاستيفاء
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const reason = prompt('سبب الرفض:', 'التحويل لا يتطابق مع شروط التعاقد');
                      if (reason !== null) {
                        handleReviewAction('REJECTED', reason);
                      }
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    رفض الطلب
                  </button>
                </div>
              </div>
            )}

            {/* ── لوحة قرارات مسؤول قبول المستشفى ─────────────────────────── */}
            {isHospitalReceiver && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-700/50 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-800/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <HospitalIcon className="w-4 h-4 text-blue-400" />
                    <h4 className="font-bold text-slate-100 text-sm">قرارات قبول المستشفى المتعاقد</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-300">{getHospital(selectedReferral.targetHospitalId)?.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleReviewAction('ACCEPTED')}
                    className="btn-primary py-2.5 px-4 text-xs font-bold bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900/40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    قبول الحالة وتأكيد الاستقبال
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction('HOSPITAL_RFI', 'مطلوب إشاعة رنين مغناطيسي حديثة')}
                    className="py-2.5 px-3.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-bold transition-all"
                  >
                    📝 طلب استيفاء إضافي (RFI)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction('REJECTED', 'عدم توفر سرير عناية / طاقة استيعابية')}
                    className="py-2.5 px-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    اعتذار / رفض الحالة
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={closeModal}
                className="btn-secondary text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
