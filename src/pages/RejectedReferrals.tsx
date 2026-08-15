import { useState } from 'react';
import {
  XCircle, Search, Eye,
  Hospital as HospitalIcon, FileText, Download,
  FolderX, RefreshCw
} from 'lucide-react';
import { getUrgencyConfig, getHospital, getUnit, mockHospitals, REJECTION_REASONS } from '../data/mockData';
import { Referral } from '../types';
import { useReferrals } from '../context/ReferralsContext';
import { useAuth } from '../context/AuthContext';

export function RejectedReferrals() {
  const { referrals, updateReferral } = useReferrals();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('ALL');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [redirectHospitalId, setRedirectHospitalId] = useState('HOSP_CLEO');
  const [redirectNotes, setRedirectNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const isReviewer = user?.role === 'DIRECTORATE_REVIEWER' || user?.role === 'SYSTEM_ADMIN';
  const isHospital = user?.role === 'HOSPITAL_RECEIVER';
  const myHospitalId = user?.hospitalId;

  const rejectedList = referrals.filter(r => {
    if (r.status !== 'REJECTED') return false;
    if (isHospital && myHospitalId && r.targetHospitalId !== myHospitalId) return false;
    return true;
  });

  const filtered = rejectedList.filter(r => {
    const matchSearch = !search ||
      r.patientName.includes(search) ||
      r.nationalId.includes(search) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.specialty.includes(search);
    const matchHosp = hospitalFilter === 'ALL' || r.targetHospitalId === hospitalFilter;
    return matchSearch && matchHosp;
  });

  const handleReDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    updateReferral(selectedReferral.id, {
      status: 'PENDING_HOSPITAL',
      targetHospitalId: redirectHospitalId,
      rejectionComment: redirectNotes ? `إعادة توجيه: ${redirectNotes}` : undefined,
    });

    const targetHospName = mockHospitals.find(h => h.id === redirectHospitalId)?.name || 'المستشفى البديل';
    setActionSuccess(`تمت إعادة توجيه الحالة بنجاح إلى: ${targetHospName} 🚀`);

    setTimeout(() => {
      setSelectedReferral(null);
      setActionSuccess('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-rose-950/50 via-slate-900 to-slate-900 border border-rose-800/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">سجل حالات الاعتذار والرفض</span>
            </div>
            <h1 className="text-2xl font-black text-white">التحويلات الطبية المرفوضة</h1>
            <p className="text-slate-400 text-sm mt-1">
              متابعة أسباب اعتذار المستشفيات وإعادة توجيه الحالات لمستشفيات بديلة معتمدة
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-900/30 border border-rose-700/40 rounded-xl text-center min-w-[100px]">
              <p className="text-xl font-black text-rose-400">{rejectedList.length}</p>
              <p className="text-[11px] text-slate-400 font-semibold">إجمالي المرفوض</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم القومي أو رقم الطلب..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-10 pr-4 py-2 text-sm"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>

          {!isHospital && (
            <select
              value={hospitalFilter}
              onChange={e => setHospitalFilter(e.target.value)}
              className="form-select py-2 text-sm max-w-[220px]"
            >
              <option value="ALL">جميع المستشفيات المتعاقدة</option>
              <option value="HOSP_CLEO">مستشفى كليوباترا</option>
              <option value="HOSP_NADA">مستشفى الندى</option>
              <option value="HOSP_ROAA">مركز رؤية للعيون</option>
              <option value="HOSP_EYE_INT">مستشفى العيون الدولي</option>
              <option value="HOSP_KAMAL">مستشفى الكمال</option>
            </select>
          )}
        </div>

        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
          إجمالي: <strong className="text-rose-400">{filtered.length}</strong> حالة مرفوضة
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-4 font-semibold text-right">رقم الطلب</th>
                <th className="px-5 py-4 font-semibold text-right">المنتفع</th>
                <th className="px-5 py-4 font-semibold text-right">التخصص الطبي</th>
                <th className="px-5 py-4 font-semibold text-right">المستشفى المعتذر</th>
                <th className="px-5 py-4 font-semibold text-right">سبب الرفض</th>
                <th className="px-5 py-4 font-semibold text-right">المنفذ المحول</th>
                <th className="px-5 py-4 font-semibold text-right">الأولوية</th>
                <th className="px-5 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500 max-w-sm mx-auto">
                      <FolderX className="w-12 h-12 text-slate-600" />
                      <p className="font-bold text-slate-300 text-base">لا توجد حالات مرفوضة</p>
                      <p className="text-xs text-slate-500">
                        كافة التحويلات تسير بشكل منتظم دون اعتذارات.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((ref) => {
                  const urgencyCfg = getUrgencyConfig(ref.urgency);
                  const hospital = getHospital(ref.targetHospitalId);
                  const unit = getUnit(ref.sourceUnitId);
                  const reasonLabel = REJECTION_REASONS.find(r => r.id === ref.rejectionReasonId)?.label || ref.rejectionComment || 'عدم توفر السعة';

                  return (
                    <tr
                      key={ref.id}
                      onClick={() => {
                        setSelectedReferral(ref);
                        setRedirectHospitalId(ref.targetHospitalId === 'HOSP_CLEO' ? 'HOSP_KAMAL' : 'HOSP_CLEO');
                        setRedirectNotes('');
                        setActionSuccess('');
                      }}
                      className="table-row cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-rose-400 font-bold group-hover:underline">
                          {ref.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-100">{ref.patientName}</p>
                        <p className="text-xs text-slate-500 font-mono">{ref.nationalId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-300 font-medium">{ref.specialty}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-300 flex items-center gap-1.5">
                          <HospitalIcon className="w-3.5 h-3.5 text-rose-400" />
                          {hospital?.name || 'المستشفى المتعاقد'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-rose-300 font-semibold bg-rose-950/50 px-2 py-1 rounded border border-rose-800/40">
                          {reasonLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400">{unit?.name || '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
                      </td>
                      <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {isReviewer && (
                            <button
                              onClick={() => {
                                setSelectedReferral(ref);
                                setRedirectHospitalId(ref.targetHospitalId === 'HOSP_CLEO' ? 'HOSP_KAMAL' : 'HOSP_CLEO');
                                setRedirectNotes('');
                                setActionSuccess('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-brand-900/60 hover:bg-brand-800/80 border border-brand-600/60 text-brand-300 text-xs font-bold flex items-center gap-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              إعادة توجيه
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedReferral(ref);
                              setActionSuccess('');
                            }}
                            title="عرض التفاصيل والمرفقات"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
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
      </div>

      {/* Details & Re-dispatch Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-700/40 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-rose-400">{selectedReferral.id}</span>
                    <span className="badge bg-rose-900/40 text-rose-300 border-rose-700/40 font-bold">
                      طلب مرفوض من المستشفى
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                    تفاصيل اعتذار المستشفى — {selectedReferral.patientName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedReferral(null)}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {actionSuccess && (
              <div className="p-4 rounded-xl bg-brand-900/40 border border-brand-700/60 text-brand-300 text-sm font-bold flex items-center gap-2 animate-fade-in">
                <RefreshCw className="w-5 h-5 text-brand-400 flex-shrink-0 animate-spin" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Rejection Details Box */}
            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-rose-800/30 pb-3">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">المستشفى المعتذر:</p>
                  <p className="text-base font-black text-rose-300 mt-0.5">
                    {getHospital(selectedReferral.targetHospitalId)?.name}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-400 font-medium">السبب المسجل:</p>
                  <p className="text-sm font-bold text-rose-400">
                    {selectedReferral.rejectionComment || 'عدم توفر السعة الاستيعابية'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 font-medium">الرقم القومي:</p>
                  <p className="text-slate-100 font-mono font-bold">{selectedReferral.nationalId}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">التخصص المطلوب:</p>
                  <p className="text-slate-100 font-bold">{selectedReferral.specialty}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">المنفذ المصدر:</p>
                  <p className="text-slate-200">{getUnit(selectedReferral.sourceUnitId)?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">درجة الإلحاح:</p>
                  <p className="text-slate-200 font-bold">{getUrgencyConfig(selectedReferral.urgency).label}</p>
                </div>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> التشخيص والملخص السريري:
              </p>
              <p className="text-slate-200 leading-relaxed pt-1">
                {selectedReferral.clinicalSummary || 'لا يوجد ملخص مسجل'}
              </p>
            </div>

            {/* Attachments Section */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <p className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-blue-400" /> المرفقات والتقارير الطبية:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">التقرير_الطبي.pdf</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">مرفق</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">الرقم_القومي.jpg</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">مرفق</span>
                </div>
              </div>
            </div>

            {/* Re-dispatch form for Admin / Reviewer */}
            {isReviewer && (
              <form onSubmit={handleReDispatch} className="p-4 rounded-2xl bg-brand-950/40 border border-brand-700/50 space-y-3">
                <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-brand-400" />
                  إعادة توجيه الحالة إلى مستشفى متعاقد بديل
                </h4>

                <div className="space-y-2">
                  <label className="form-label text-xs">اختر المستشفى البديل المعتمد</label>
                  <select
                    value={redirectHospitalId}
                    onChange={e => setRedirectHospitalId(e.target.value)}
                    className="form-select text-xs font-bold"
                  >
                    {mockHospitals
                      .filter(h => h.id !== selectedReferral.targetHospitalId)
                      .map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} — ({h.location})
                        </option>
                      ))}
                  </select>

                  <input
                    type="text"
                    value={redirectNotes}
                    onChange={e => setRedirectNotes(e.target.value)}
                    placeholder="ملاحظات إعادة التوجيه..."
                    className="form-input text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primary text-xs font-bold py-2 px-4">
                    <RefreshCw className="w-3.5 h-3.5" />
                    إعادة توجيه وإرسال للمستشفى البديل
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
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
