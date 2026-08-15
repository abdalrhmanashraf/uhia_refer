import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FilePlus2, Eye, ChevronDown, FolderOpen, Trash2 } from 'lucide-react';
import { getStatusConfig, getUrgencyConfig, getHospital, getUnit } from '../data/mockData';
import { ReferralStatus } from '../types';
import { useReferrals } from '../context/ReferralsContext';

const STATUS_OPTIONS: { value: ReferralStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'جميع الحالات' },
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'PENDING_REVIEW', label: 'قيد المراجعة' },
  { value: 'PENDING_HOSPITAL', label: 'قيد المستشفى' },
  { value: 'HOSPITAL_RFI', label: 'استيفاء مستشفى' },
  { value: 'ACCEPTED', label: 'مقبول' },
  { value: 'REJECTED', label: 'مرفوض' },
];

export function ReferralsList() {
  const { referrals, deleteReferral } = useReferrals();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

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
                    <tr key={ref.id} className="table-row">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-brand-400 font-bold">{ref.id}</span>
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
                        <span className="text-slate-300 text-xs font-semibold">{hospital?.name || 'يحدده المشرف'}</span>
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
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            title="عرض التفاصيل"
                            className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-brand-900/20 rounded-lg transition-all"
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
    </div>
  );
}
