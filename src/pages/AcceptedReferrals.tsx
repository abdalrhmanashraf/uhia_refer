import { useState } from 'react';
import {
  CheckCircle2, Search, Printer, Eye,
  Hospital as HospitalIcon, FileText, Download,
  FolderCheck
} from 'lucide-react';
import { getUrgencyConfig, getHospital, getUnit } from '../data/mockData';
import { Referral } from '../types';
import { useReferrals } from '../context/ReferralsContext';
import { useAuth } from '../context/AuthContext';

export function AcceptedReferrals() {
  const { referrals } = useReferrals();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('ALL');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  // إذا كان المستخدم مسؤول مستشفى، يرى فقط المقبول الخاص بمستشفاه
  const isHospital = user?.role === 'HOSPITAL_RECEIVER';
  const myHospitalId = user?.hospitalId;

  const acceptedList = referrals.filter(r => {
    if (r.status !== 'ACCEPTED') return false;
    if (isHospital && myHospitalId && r.targetHospitalId !== myHospitalId) return false;
    return true;
  });

  const filtered = acceptedList.filter(r => {
    const matchSearch = !search ||
      r.patientName.includes(search) ||
      r.nationalId.includes(search) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.specialty.includes(search);
    const matchHosp = hospitalFilter === 'ALL' || r.targetHospitalId === hospitalFilter;
    return matchSearch && matchHosp;
  });

  const emergencyCount = acceptedList.filter(r => r.urgency === 'emergency').length;
  const urgentCount = acceptedList.filter(r => r.urgency === 'urgent').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-800/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">سجل الحالات المعتمدة</span>
            </div>
            <h1 className="text-2xl font-black text-white">التحويلات الطبية المقبولة</h1>
            <p className="text-slate-400 text-sm mt-1">
              قائمة الحالات التي تمت موافقة المستشفيات المتعاقدة على استقبالها وتقديم الخدمة العلاجية لها
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900/30 border border-emerald-700/40 rounded-xl text-center min-w-[100px]">
              <p className="text-xl font-black text-emerald-400">{acceptedList.length}</p>
              <p className="text-[11px] text-slate-400 font-semibold">إجمالي المقبول</p>
            </div>
            <div className="p-3 bg-red-900/20 border border-red-800/40 rounded-xl text-center min-w-[90px]">
              <p className="text-xl font-black text-red-400">{emergencyCount + urgentCount}</p>
              <p className="text-[11px] text-slate-400 font-semibold">عاجل وطارئ</p>
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
          إجمالي: <strong className="text-emerald-400">{filtered.length}</strong> حالة مقبولة
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
                <th className="px-5 py-4 font-semibold text-right">المستشفى المستقبل</th>
                <th className="px-5 py-4 font-semibold text-right">المنفذ المصدر</th>
                <th className="px-5 py-4 font-semibold text-right">الأولوية</th>
                <th className="px-5 py-4 font-semibold text-right">تاريخ القبول</th>
                <th className="px-5 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500 max-w-sm mx-auto">
                      <FolderCheck className="w-12 h-12 text-slate-600" />
                      <p className="font-bold text-slate-300 text-base">لا توجد حالات مقبولة حالياً</p>
                      <p className="text-xs text-slate-500">
                        تظهر هنا الحالات التي وافقت المستشفيات المتعاقدة على استقبالها.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((ref) => {
                  const urgencyCfg = getUrgencyConfig(ref.urgency);
                  const hospital = getHospital(ref.targetHospitalId);
                  const unit = getUnit(ref.sourceUnitId);

                  return (
                    <tr
                      key={ref.id}
                      onClick={() => setSelectedReferral(ref)}
                      className="table-row cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-emerald-400 font-bold group-hover:underline">
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
                        <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                          <HospitalIcon className="w-3.5 h-3.5 text-emerald-400" />
                          {hospital?.name || 'المستشفى المتعاقد'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400">{unit?.name || '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-500">
                          {new Date(ref.lastModifiedAt).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedReferral(ref)}
                            title="عرض إشعار القبول والمرفقات"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40 rounded-lg transition-all"
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

      {/* Details & Admission Voucher Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-emerald-400">{selectedReferral.id}</span>
                    <span className="badge bg-emerald-900/40 text-emerald-300 border-emerald-700/40 font-bold">
                      تم القبول من المستشفى المتعاقد ✓
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                    إشعار وموافقة استقبال مريض — {selectedReferral.patientName}
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

            {/* Voucher Box */}
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-800/30 pb-3">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">المستشفى المعتمد للاستقبال:</p>
                  <p className="text-base font-black text-emerald-300 mt-0.5">
                    {getHospital(selectedReferral.targetHospitalId)?.name}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-400 font-medium">حالة الاستقبال:</p>
                  <p className="text-sm font-bold text-emerald-400">جاهز للمناظرة والدخول</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 font-medium">الرقم القومي:</p>
                  <p className="text-slate-100 font-mono font-bold text-sm">{selectedReferral.nationalId}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">التخصص المطلوب:</p>
                  <p className="text-slate-100 font-bold">{selectedReferral.specialty}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">المنفذ المحول:</p>
                  <p className="text-slate-200">{getUnit(selectedReferral.sourceUnitId)?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">درجة الإلحاح:</p>
                  <p className="text-slate-200 font-bold">{getUrgencyConfig(selectedReferral.urgency).label}</p>
                </div>
              </div>

              {selectedReferral.rejectionComment && (
                <div className="pt-2 border-t border-emerald-800/30">
                  <p className="text-slate-400 font-medium">ملاحظات وتعليمات الاستقبال:</p>
                  <p className="text-emerald-200 mt-1">{selectedReferral.rejectionComment}</p>
                </div>
              )}
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
                <Download className="w-3.5 h-3.5 text-blue-400" /> المرفقات والتقارير الطبية المعتمدة:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">التقرير_الطبي_المختوم.pdf</span>
                  <span className="text-[10px] text-brand-400 font-bold bg-brand-900/40 px-2 py-0.5 rounded">مرفق ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">بطاقة_الرقم_القومي.jpg</span>
                  <span className="text-[10px] text-brand-400 font-bold bg-brand-900/40 px-2 py-0.5 rounded">مرفق ✓</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                طباعة إشعار القبول
              </button>

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
