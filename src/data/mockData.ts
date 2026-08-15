import { User, Unit, Hospital, Referral, AuditLog } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'أحمد محمود الأنصاري',
  email: 'ahmed.ansari@uhia.gov.eg',
  role: 'UNIT_SPECIALIST',
  unitId: 'unit1',
};

export const mockUsers: User[] = [
  { id: 'u1', name: 'أحمد محمود الأنصاري', email: 'ahmed.ansari@uhia.gov.eg', role: 'UNIT_SPECIALIST', unitId: 'unit1' },
  { id: 'u2', name: 'سارة خالد الشريف', email: 'sara.sharif@uhia.gov.eg', role: 'DIRECTORATE_REVIEWER' },
  { id: 'u3', name: 'د. محمد علي حسن', email: 'dr.hassan@nasr-hosp.gov.eg', role: 'HOSPITAL_RECEIVER', hospitalId: 'hosp1' },
  { id: 'u4', name: 'م. إبراهيم السيد', email: 'admin@uhia.gov.eg', role: 'SYSTEM_ADMIN' },
];

export const mockUnits: Unit[] = [
  { id: 'unit1', name: 'وحدة طب أسرة الشهيد', directorate: 'فرع بورسعيد' },
  { id: 'unit2', name: 'مركز طبي الزهور', directorate: 'فرع بورسعيد' },
  { id: 'unit3', name: 'وحدة طب أسرة العرب', directorate: 'فرع بورسعيد' },
];

export const mockHospitals: Hospital[] = [
  { id: 'hosp1', name: 'مستشفى النصر التخصصي', specialties: ['جراحة أطفال', 'أورام', 'قلب وأوعية', 'باطنة'] },
  { id: 'hosp2', name: 'مستشفى الرمد التخصصي', specialties: ['رمد', 'جراحة عيون', 'قرنية'] },
  { id: 'hosp3', name: 'مستشفى التضامن العام', specialties: ['باطنة', 'عظام', 'جراحة عامة', 'أطفال'] },
  { id: 'hosp4', name: 'مستشفى الزهراء للنساء', specialties: ['نسا وتوليد', 'أطفال حديثي الولادة'] },
];

export const SPECIALTIES = [
  'باطنة وجهاز هضمي', 'أمراض القلب والأوعية', 'جراحة عامة', 'جراحة عظام',
  'أمراض العيون (رمد)', 'أمراض الجهاز البولي', 'أمراض نسا وتوليد',
  'أمراض الأطفال', 'أمراض الأنف والأذن', 'أمراض الجلد', 'أورام وأشعة علاجية',
  'أمراض الصدر والجهاز التنفسي', 'أمراض المخ والأعصاب', 'طب نفسي',
];

export const REJECTION_REASONS = [
  { id: 'r1', label: 'عدم اكتمال المستندات والمرفقات' },
  { id: 'r2', label: 'التخصص المطلوب غير متاح حالياً' },
  { id: 'r3', label: 'المنتفع غير مسجل بالمنظومة' },
  { id: 'r4', label: 'عدم وجود إثبات انتفاع ساري' },
  { id: 'r5', label: 'التحويل لا يتوافق مع مستوى الرعاية (Referral Level)' },
  { id: 'r6', label: 'وجود تحويل آخر نشط لنفس المنتفع' },
  { id: 'r7', label: 'ملف التقرير الطبي غير مقروء' },
];

const now = new Date();
const d = (days: number) => new Date(now.getTime() - 86400000 * days).toISOString();

export const mockReferrals: Referral[] = [
  {
    id: 'REF-2608-001', nationalId: '29001011234567', patientName: 'محمود السيد عبدالله',
    patientAge: 52, gender: 'male', phone: '01012345678',
    sourceUnitId: 'unit1', targetHospitalId: 'hosp3', referringDoctor: 'د. عمرو سليمان',
    specialty: 'جراحة عظام', urgency: 'urgent', clinicalSummary: 'كسر في الفخذ الأيمن يحتاج تدخل جراحي',
    status: 'PENDING_HOSPITAL', createdAt: d(2), createdBy: 'u1', lastModifiedAt: d(1),
  },
  {
    id: 'REF-2608-002', nationalId: '28505051234567', patientName: 'فاطمة حسن علي',
    patientAge: 38, gender: 'female', phone: '01198765432',
    sourceUnitId: 'unit2', targetHospitalId: 'hosp1', referringDoctor: 'د. نهى أحمد',
    specialty: 'أورام وأشعة علاجية', urgency: 'emergency', clinicalSummary: 'كتلة في الثدي تحتاج استئصال عاجل',
    status: 'PENDING_REVIEW', createdAt: d(0.5), createdBy: 'u1', lastModifiedAt: d(0.5),
  },
  {
    id: 'REF-2608-003', nationalId: '30101011234567', patientName: 'ياسين أحمد محمود',
    patientAge: 24, gender: 'male', phone: '01555123456',
    sourceUnitId: 'unit1', targetHospitalId: 'hosp2', referringDoctor: 'د. خالد رمضان',
    specialty: 'أمراض العيون (رمد)', urgency: 'routine', clinicalSummary: 'ضعف حدة الإبصار وحاجة لعملية إزالة الماء الأبيض',
    status: 'ACCEPTED', createdAt: d(5), createdBy: 'u1', lastModifiedAt: d(3),
  },
  {
    id: 'REF-2608-004', nationalId: '27803041234567', patientName: 'سميرة محمد عبدالرحمن',
    patientAge: 65, gender: 'female', phone: '01023456789',
    sourceUnitId: 'unit3', targetHospitalId: 'hosp1', referringDoctor: 'د. أمل حسام',
    specialty: 'أمراض القلب والأوعية', urgency: 'urgent', clinicalSummary: 'ألم صدري متكرر وضيق تنفس',
    status: 'REJECTED', createdAt: d(7), createdBy: 'u2', lastModifiedAt: d(6),
    rejectionReasonId: 'r4', rejectionComment: 'انتهى إثبات الانتفاع - يرجى التجديد',
  },
  {
    id: 'REF-2608-005', nationalId: '29804121234567', patientName: 'حسام إبراهيم الديب',
    patientAge: 44, gender: 'male', phone: '01234567890',
    sourceUnitId: 'unit1', targetHospitalId: 'hosp3', referringDoctor: 'د. عمرو سليمان',
    specialty: 'باطنة وجهاز هضمي', urgency: 'routine', clinicalSummary: 'قولون عصبي مزمن ومتكرر',
    status: 'DRAFT', createdAt: d(0.1), createdBy: 'u1', lastModifiedAt: d(0.1),
  },
  {
    id: 'REF-2608-006', nationalId: '29101071234567', patientName: 'نادية سعيد عوض',
    patientAge: 31, gender: 'female', phone: '01012312312',
    sourceUnitId: 'unit2', targetHospitalId: 'hosp4', referringDoctor: 'د. منى صالح',
    specialty: 'أمراض نسا وتوليد', urgency: 'urgent', clinicalSummary: 'حمل عالي الخطورة - ضغط مرتفع',
    status: 'HOSPITAL_RFI', createdAt: d(3), createdBy: 'u1', lastModifiedAt: d(1),
  },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'log1', referralId: 'REF-2608-001', action: 'إنشاء الطلب', performedBy: 'u1', timestamp: d(2), toStatus: 'DRAFT' },
  { id: 'log2', referralId: 'REF-2608-001', action: 'إرسال للمراجعة', performedBy: 'u1', timestamp: d(2), fromStatus: 'DRAFT', toStatus: 'PENDING_REVIEW' },
  { id: 'log3', referralId: 'REF-2608-001', action: 'اعتماد المشرف وإرسال للمستشفى', performedBy: 'u2', timestamp: d(1), fromStatus: 'PENDING_REVIEW', toStatus: 'PENDING_HOSPITAL' },
];

export function getStatusConfig(status: Referral['status']) {
  const configs = {
    DRAFT: { label: 'مسودة', color: 'bg-slate-700/60 text-slate-300 border border-slate-600/40', dot: 'bg-slate-400' },
    PENDING_REVIEW: { label: 'قيد المراجعة', color: 'bg-amber-900/40 text-amber-300 border border-amber-700/40', dot: 'bg-amber-400' },
    RETURNED_TO_UNIT: { label: 'مُعاد للوحدة', color: 'bg-orange-900/40 text-orange-300 border border-orange-700/40', dot: 'bg-orange-400' },
    PENDING_HOSPITAL: { label: 'قيد رد المستشفى', color: 'bg-blue-900/40 text-blue-300 border border-blue-700/40', dot: 'bg-blue-400' },
    HOSPITAL_RFI: { label: 'استيفاء مستشفى', color: 'bg-purple-900/40 text-purple-300 border border-purple-700/40', dot: 'bg-purple-400' },
    ACCEPTED: { label: 'مقبول', color: 'bg-brand-900/40 text-brand-300 border border-brand-700/40', dot: 'bg-brand-400' },
    REJECTED: { label: 'مرفوض', color: 'bg-red-900/40 text-red-300 border border-red-700/40', dot: 'bg-red-400' },
    CANCELED: { label: 'ملغي', color: 'bg-slate-800/60 text-slate-500 border border-slate-700/40', dot: 'bg-slate-600' },
  };
  return configs[status] || configs.DRAFT;
}

export function getUrgencyConfig(urgency: Referral['urgency']) {
  const configs = {
    routine: { label: 'اعتيادي', color: 'text-slate-400' },
    urgent: { label: 'عاجل', color: 'text-amber-400' },
    emergency: { label: '🚨 طارئ', color: 'text-red-400' },
  };
  return configs[urgency];
}

export function getUser(id: string) {
  return mockUsers.find(u => u.id === id);
}

export function getUnit(id: string) {
  return mockUnits.find(u => u.id === id);
}

export function getHospital(id: string) {
  return mockHospitals.find(h => h.id === id);
}
