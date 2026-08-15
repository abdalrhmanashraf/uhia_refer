import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FilePlus2, Eye, ChevronDown } from 'lucide-react';
import { mockReferrals, getStatusConfig, getUrgencyConfig, getUnit, getHospital } from '../data/mockData';
import { ReferralStatus } from '../types';

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  const filtered = mockReferrals.filter(r => {
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
    <div className="space-y-6">
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
              className="form-input pl-10 pr-4 py-2.5"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ReferralStatus | 'ALL')}
              className="form-select py-2.5 pl-8 appearance-none cursor-pointer min-w-[160px]"
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
              className="form-select py-2.5 pl-8 appearance-none cursor-pointer min-w-[140px]"
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
                <th className="px-5 py-4 font-semibold text-right hidden lg:table-cell">الجهة المحول إليها</th>
                <th className="px-5 py-4 font-semibold text-right">الأولوية</th>
                <th className="px-5 py-4 font-semibold text-right">الحالة</th>
                <th className="px-5 py-4 font-semibold text-right hidden md:table-cell">التاريخ</th>
                <th className="px-5 py-4 font-semibold text-right">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                      <Search className="w-10 h-10" />
                      <p className="font-semibold">لا توجد نتائج مطابقة</p>
                      <p className="text-xs">جرّب تعديل معايير البحث أو الفلتر</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((ref) => {
                const statusCfg = getStatusConfig(ref.status);
                const urgencyCfg = getUrgencyConfig(ref.urgency);
                const hospital = getHospital(ref.targetHospitalId);
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
                      <span className="text-slate-400 text-xs">{hospital?.name || '—'}</span>
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
                    <td className="px-5 py-4">
                      <button className="p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-900/20 rounded-lg transition-all duration-150">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            عرض <span className="text-slate-300">{filtered.length}</span> من أصل <span className="text-slate-300">{mockReferrals.length}</span> طلب
          </span>
          <div className="flex items-center gap-1">
            {[1].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/40 text-brand-400 text-xs font-bold">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
