import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, FilePlus2, Eye, ChevronDown, FolderOpen, Trash2,
  CheckCircle2, XCircle,
  Hospital as HospitalIcon, FileText,
  Shield, Edit3, Send, Save, Printer
} from 'lucide-react';
import { getStatusConfig, getUrgencyConfig, getHospital, getUnit, mockHospitals, mockUnits, SPECIALTIES } from '../data/mockData';
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
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Form edit fields (للتعديل الكامل على الجواب بواسطة مدير المنافذ / الأدمن)
  const [editForm, setEditForm] = useState({
    patientName: '',
    nationalId: '',
    patientAge: 0,
    gender: 'male' as 'male' | 'female',
    phone: '',
    sourceUnitId: '',
    specialty: '',
    targetHospitalId: '',
    referringDoctor: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'emergency',
    clinicalSummary: '',
    reviewNotes: '',
  });

  const isReviewer = user?.role === 'DIRECTORATE_REVIEWER' || user?.role === 'SYSTEM_ADMIN';
  const isHospitalReceiver = user?.role === 'HOSPITAL_RECEIVER';

  const openDetailsModal = (ref: Referral) => {
    setSelectedReferral(ref);
    setShowPrintPreview(false);
    setEditForm({
      patientName: ref.patientName,
      nationalId: ref.nationalId,
      patientAge: ref.patientAge,
      gender: ref.gender,
      phone: ref.phone || '',
      sourceUnitId: ref.sourceUnitId,
      specialty: ref.specialty,
      targetHospitalId: ref.targetHospitalId || 'HOSP_CLEO',
      referringDoctor: ref.referringDoctor || '',
      urgency: ref.urgency,
      clinicalSummary: ref.clinicalSummary,
      reviewNotes: ref.rejectionComment || '',
    });
    setActionSuccess('');
  };

  const closeModal = () => {
    setSelectedReferral(null);
    setShowPrintPreview(false);
    setActionSuccess('');
  };

  // حفظ التعديلات وإرسال الجواب للمستشفى
  const handleSaveAndSendToHospital = (sendImmediately = true) => {
    if (!selectedReferral) return;

    const newStatus: ReferralStatus = sendImmediately ? 'PENDING_HOSPITAL' : selectedReferral.status;

    updateReferral(selectedReferral.id, {
      patientName: editForm.patientName,
      nationalId: editForm.nationalId,
      patientAge: editForm.patientAge,
      gender: editForm.gender,
      phone: editForm.phone,
      sourceUnitId: editForm.sourceUnitId,
      specialty: editForm.specialty,
      targetHospitalId: editForm.targetHospitalId,
      referringDoctor: editForm.referringDoctor,
      urgency: editForm.urgency,
      clinicalSummary: editForm.clinicalSummary,
      rejectionComment: editForm.reviewNotes,
      status: newStatus,
    });

    const targetHospName = mockHospitals.find(h => h.id === editForm.targetHospitalId)?.name || 'المستشفى المتعاقد';

    if (sendImmediately) {
      setActionSuccess(`تم حفظ التعديلات وإرسال الجواب بنجاح إلى: ${targetHospName} 🚀`);
    } else {
      setActionSuccess(`تم حفظ التعديلات على الجواب بنجاح ✓`);
    }

    setTimeout(() => {
      closeModal();
    }, 1600);
  };

  // قرارات المراجعة الإضافية
  const handleReviewAction = (newStatus: ReferralStatus, commentText?: string) => {
    if (!selectedReferral) return;

    updateReferral(selectedReferral.id, {
      status: newStatus,
      targetHospitalId: editForm.targetHospitalId || selectedReferral.targetHospitalId,
      rejectionComment: commentText || editForm.reviewNotes,
    });

    if (newStatus === 'ACCEPTED') {
      setActionSuccess(`تم قبول الحالة وتأكيد الاستقبال بالمستشفى المتعاقد ✓`);
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
                        القائمة فارغة وجاهزة لاستقبال وتعديل طلبات التحويل للمستشفيات الـ 5 المتعاقدة.
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
                          {/* زر تعديل وإرسال الجواب لمدير المنافذ أو مسؤول النظام */}
                          {isReviewer && (
                            <button
                              onClick={() => openDetailsModal(ref)}
                              title="تعديل الجواب وإرساله للمستشفى"
                              className="px-2.5 py-1 rounded-lg bg-brand-900/60 hover:bg-brand-800/80 border border-brand-600/60 text-brand-300 text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              تعديل وإرسال
                            </button>
                          )}

                          <button
                            onClick={() => openDetailsModal(ref)}
                            title="عرض الجواب والتفاصيل"
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

      {/* ── Modal: تعديل الجواب ومراجعته وإرساله للمستشفى ─────────────────── */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-7 border-slate-700 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-900/40 border border-brand-700/40 flex items-center justify-center text-brand-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-brand-400">{selectedReferral.id}</span>
                    <span className={`badge ${getStatusConfig(selectedReferral.status).color}`}>
                      {getStatusConfig(selectedReferral.status).label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                    {isReviewer ? 'تعديل جواب التحويل وتوجيهه للمستشفى المتعاقد' : 'تفاصيل جواب التحويل الطبي'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(!showPrintPreview)}
                  className="p-2 text-slate-400 hover:text-brand-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="معاينة وطباعة الجواب الرسمي"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">معاينة الجواب</span>
                </button>

                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {actionSuccess && (
              <div className="p-4 rounded-xl bg-brand-900/40 border border-brand-700/60 text-brand-300 text-sm font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* ── وضع المعاينة والطباعة للجواب الرسمي ─────────────────────── */}
            {showPrintPreview ? (
              <div className="p-6 bg-white text-slate-900 rounded-2xl space-y-6 shadow-xl print:m-0 border border-slate-300 animate-fade-in font-sans">
                {/* Header Letterhead */}
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-600">جمهورية مصر العربية</p>
                    <p className="text-xs font-bold text-slate-600">الهيئة العامة للتأمين الصحي الشامل</p>
                    <p className="text-sm font-black text-emerald-800">فرع محافظة الأقصر — إدارة المنافذ</p>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-black text-slate-900 border-2 border-slate-900 px-4 py-1 rounded-lg">
                      خطاب إحالة طبية متعاقدة
                    </h2>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-1">{selectedReferral.id}</p>
                  </div>
                  <div className="text-left text-xs font-bold text-slate-600">
                    <p>التاريخ: {new Date(selectedReferral.createdAt).toLocaleDateString('ar-EG')}</p>
                    <p>درجة الإلحاح: <strong className="text-red-700">{getUrgencyConfig(editForm.urgency).label}</strong></p>
                  </div>
                </div>

                {/* Receiver Hospital */}
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-300">
                  <p className="text-sm font-bold text-slate-800">
                    السادة إدارة / <strong className="text-emerald-900 text-base">{mockHospitals.find(h => h.id === editForm.targetHospitalId)?.name || 'المستشفى المتعاقد'}</strong> الموقرين
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    تحية طيبة وبعد،،، يرجى التكرم باستقبال ومناظرة الحالة الموضحة بياناتها أدناه وفقاً لبروتوكول التعاقد المعتمد:
                  </p>
                </div>

                {/* Patient Information Table */}
                <table className="w-full text-xs border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300 bg-slate-50">
                      <td className="p-2 font-bold w-1/4 border-l border-slate-300">اسم المنتفع:</td>
                      <td className="p-2 font-black text-sm text-slate-900 border-l border-slate-300">{editForm.patientName}</td>
                      <td className="p-2 font-bold w-1/6 border-l border-slate-300">الرقم القومي:</td>
                      <td className="p-2 font-mono font-bold text-sm text-slate-900">{editForm.nationalId}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold border-l border-slate-300">السن / النوع:</td>
                      <td className="p-2 border-l border-slate-300">{editForm.patientAge} سنة • {editForm.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                      <td className="p-2 font-bold border-l border-slate-300">رقم الهاتف:</td>
                      <td className="p-2 font-mono">{editForm.phone || 'غير مسجل'}</td>
                    </tr>
                    <tr className="border-b border-slate-300 bg-slate-50">
                      <td className="p-2 font-bold border-l border-slate-300">المنفذ المحول:</td>
                      <td className="p-2 font-semibold border-l border-slate-300">{getUnit(editForm.sourceUnitId)?.name || 'وحدة طب أسرة'}</td>
                      <td className="p-2 font-bold border-l border-slate-300">التخصص المطلوب:</td>
                      <td className="p-2 font-black text-emerald-900 text-sm">{editForm.specialty}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold border-l border-slate-300">الطبيب المحول:</td>
                      <td colSpan={3} className="p-2 font-semibold">{editForm.referringDoctor || 'طبيب الوحدة'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Clinical Summary */}
                <div className="border border-slate-300 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-800 mb-1">الملخص السريري والتشخيص الطبي (سبب الإحالة):</p>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans min-h-[50px]">
                    {editForm.clinicalSummary || 'لا يوجد ملخص'}
                  </p>
                </div>

                {/* Reviewer Instructions */}
                {editForm.reviewNotes && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3">
                    <p className="text-xs font-bold text-emerald-900 mb-1">توجيهات واعتماد إدارة المنافذ بالأقصر:</p>
                    <p className="text-xs text-emerald-800 font-sans">{editForm.reviewNotes}</p>
                  </div>
                )}

                {/* Signatures */}
                <div className="pt-6 grid grid-cols-2 text-center text-xs font-bold text-slate-700">
                  <div>
                    <p>أخصائي المنفذ المحول</p>
                    <p className="mt-8 text-slate-500">التوقيع والختم: ............................</p>
                  </div>
                  <div>
                    <p>مدير إدارة المنافذ — فرع الأقصر</p>
                    <p className="text-emerald-900 font-bold mt-1">أحمد أمين</p>
                    <p className="mt-5 text-slate-500">الاعتماد: [ معتمد إلكترونياً بموجب المنظومة ]</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── وضع التعديل الكامل للجواب (متاح لمسؤول النظام ومدير المنافذ) ── */
              <div className="space-y-5">
                {/* تنبيه بالصلاحية */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Shield className="w-4 h-4 text-brand-400" />
                    <span>
                      صلاحية تعديل الجواب الطبي متاحة لـ: <strong className="text-brand-300">مسؤول النظام (عبد الرحمن أشرف)</strong> و <strong className="text-amber-300">مدير إدارة المنافذ (أحمد أمين)</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">جاهز للتعديل والإرسال</span>
                </div>

                {/* نموذج تعديل بيانات الجواب */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">اسم المنتفع</label>
                    <input
                      type="text"
                      value={editForm.patientName}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, patientName: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">الرقم القومي (14 رقم)</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={editForm.nationalId}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, nationalId: e.target.value.replace(/\D/g, '') })}
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">رقم الهاتف</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="form-input text-xs font-mono"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">المنفذ المحول</label>
                    <select
                      value={editForm.sourceUnitId}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, sourceUnitId: e.target.value })}
                      className="form-select text-xs"
                    >
                      {mockUnits.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.directorate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-xs">التخصص الطبي المطلوب</label>
                    <select
                      value={editForm.specialty}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, specialty: e.target.value })}
                      className="form-select text-xs font-semibold"
                    >
                      {SPECIALTIES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-xs">درجة الإلحاح</label>
                    <select
                      value={editForm.urgency}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, urgency: e.target.value as any })}
                      className="form-select text-xs font-semibold"
                    >
                      <option value="routine">اعتيادي</option>
                      <option value="urgent">عاجل</option>
                      <option value="emergency">🚨 طارئ — أولوية قصوى</option>
                    </select>
                  </div>

                  {/* المستشفى المتعاقد الموجه إليه الجواب */}
                  <div className="sm:col-span-2 p-4 rounded-xl bg-brand-950/40 border border-brand-700/50 space-y-2">
                    <label className="form-label text-xs font-bold text-brand-300 flex items-center gap-1.5">
                      <HospitalIcon className="w-4 h-4 text-brand-400" />
                      المستشفى المتعاقد الموجه إليه الجواب <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={editForm.targetHospitalId}
                      disabled={!isReviewer}
                      onChange={e => setEditForm({ ...editForm, targetHospitalId: e.target.value })}
                      className="form-select font-bold text-sm bg-slate-950 text-slate-100 border-brand-600/50"
                    >
                      {mockHospitals.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} — ({h.location} • {h.specialties.slice(0, 3).join('، ')}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* الملخص السريري والتشخيص الطبي */}
                  <div className="sm:col-span-2">
                    <label className="form-label text-xs">الملخص السريري والتشخيص الطبي (نص الجواب)</label>
                    <textarea
                      rows={3}
                      disabled={!isReviewer}
                      value={editForm.clinicalSummary}
                      onChange={e => setEditForm({ ...editForm, clinicalSummary: e.target.value })}
                      className="form-input text-xs resize-none"
                      placeholder="وصف تفصيلي للتشخيص وسبب التحويل للمستشفى المتعاقد..."
                    />
                  </div>

                  {/* ملاحظات وتوجيهات إدارة المنافذ */}
                  {isReviewer && (
                    <div className="sm:col-span-2">
                      <label className="form-label text-xs font-bold text-amber-300">
                        ملاحظات أو توجيهات إدارة المنافذ للمستشفى (اختياري)
                      </label>
                      <input
                        type="text"
                        value={editForm.reviewNotes}
                        onChange={e => setEditForm({ ...editForm, reviewNotes: e.target.value })}
                        className="form-input text-xs"
                        placeholder="مثال: تم التنسيق مع العيادات الخارجية لاستقبال الحالة صباح الغد..."
                      />
                    </div>
                  )}
                </div>

                {/* أزرار الإجراءات لمدير المنافذ ومسؤول النظام */}
                {isReviewer && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveAndSendToHospital(true)}
                        className="btn-primary py-2.5 px-4 text-xs font-bold bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900/50 flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        حفظ التعديلات وإرسال الجواب للمستشفى
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveAndSendToHospital(false)}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        حفظ التعديلات كمسودة
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewAction('RETURNED_TO_UNIT', 'يرجى استيفاء المرفقات والتقرير الطبي')}
                        className="py-2.5 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-bold transition-all"
                      >
                        ↩️ إعادة للوحدة
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const reason = prompt('سبب الرفض:', 'التحويل لا يتطابق مع شروط التعاقد');
                          if (reason !== null) {
                            handleReviewAction('REJECTED', reason);
                          }
                        }}
                        className="py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        رفض
                      </button>
                    </div>
                  </div>
                )}

                {/* لوحة قرارات مسؤول المستشفى المتعاقد */}
                {isHospitalReceiver && (
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                        <HospitalIcon className="w-4 h-4 text-blue-400" />
                        قرارات قبول المستشفى المتعاقد
                      </h4>
                      <span className="text-[11px] font-semibold text-blue-300">
                        {getHospital(selectedReferral.targetHospitalId)?.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewAction('ACCEPTED')}
                        className="btn-primary py-2 px-3.5 text-xs font-bold bg-brand-600 hover:bg-brand-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        قبول الحالة وتأكيد الاستقبال
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewAction('HOSPITAL_RFI', 'مطلوب إشاعة رنين حديثة')}
                        className="py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-bold"
                      >
                        📝 طلب استيفاء إضافي
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewAction('REJECTED', 'عدم توفر طاقة استيعابية')}
                        className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        اعتذار / رفض
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={closeModal}
                className="btn-secondary text-xs"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
