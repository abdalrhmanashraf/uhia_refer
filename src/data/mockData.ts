import { User, Unit, Hospital, Referral } from '../types';

// ─── بيانات تسجيل الدخول الافتراضية ──────────────────────────────────────────
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'admin':           { password: '0000', userId: 'u_admin' },
  'rahab.wahab':     { password: '1234', userId: 'u_director' },
  'ahmed.amin':      { password: '1234', userId: 'u_gates' },
  'sh.abdelhamed':   { password: '1234', userId: 'u_s1' },
  'sh.khaled':       { password: '1234', userId: 'u_s2' },
  'm.gamal':         { password: '1234', userId: 'u_s3' },
  'z.harby':         { password: '1234', userId: 'u_s4' },
  'hosp.cleo':       { password: '1234', userId: 'u_h_cleo' },
  'hosp.nada':       { password: '1234', userId: 'u_h_nada' },
  'hosp.roaa':       { password: '1234', userId: 'u_h_roaa' },
  'hosp.eye_int':    { password: '1234', userId: 'u_h_eye' },
  'hosp.kamal':      { password: '1234', userId: 'u_h_kamal' },
};

// ─── المستخدمون ─────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'u_admin',
    name: 'عبد الرحمن أشرف',
    email: 'abdalrhman.ashraf@uhia-luxor.gov.eg',
    username: 'admin',
    role: 'SYSTEM_ADMIN',
    jobTitle: 'مسؤول النظام الرئيسي — هيئة التأمين الصحي الشامل فرع الأقصر',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_director',
    name: 'د. رحاب عبد الوهاب',
    email: 'rahab.wahab@uhia-luxor.gov.eg',
    username: 'rahab.wahab',
    role: 'SYSTEM_ADMIN',
    jobTitle: 'المدير العام — هيئة التأمين الصحي الشامل فرع الأقصر',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_gates',
    name: 'أحمد أمين',
    email: 'ahmed.amin@uhia-luxor.gov.eg',
    username: 'ahmed.amin',
    role: 'DIRECTORATE_REVIEWER',
    jobTitle: 'مدير إدارة المنافذ — هيئة التأمين الصحي الشامل فرع الأقصر',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  // ─── أخصائيو المنافذ (بيانات حقيقية من بيان المنافذ) ─────────────────────
  {
    id: 'u_s1',
    name: 'شيماء عبد الحميد حسين',
    email: 'sh.abdelhamed@uhia-luxor.gov.eg',
    username: 'sh.abdelhamed',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_aqr_03',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة الأقصر (الرعاية)',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u_s2',
    name: 'شيماء خالد بسطاوي عراقي',
    email: 'sh.khaled@uhia-luxor.gov.eg',
    username: 'sh.khaled',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_aqr_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة العواميه',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u_s3',
    name: 'محمود جمال علي',
    email: 'm.gamal@uhia-luxor.gov.eg',
    username: 'm.gamal',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_armt_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة أرمنت الحيط',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'u_s4',
    name: 'زينب حربي متولى',
    email: 'z.harby@uhia-luxor.gov.eg',
    username: 'z.harby',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_isn_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة إسنا',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  // ─── مسؤولو قبول المستشفيات المتعاقدة ─────────────────────────────────────
  {
    id: 'u_h_cleo',
    name: 'مسؤول قبول — مستشفى كليوباترا',
    email: 'referral@cleopatra-hospitals.com',
    username: 'hosp.cleo',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'HOSP_CLEO',
    jobTitle: 'مسؤول استقبال وتحويلات التأمين الصحي الشامل',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h_nada',
    name: 'مسؤول قبول — مستشفى الندى',
    email: 'referral@elnadahospital.com',
    username: 'hosp.nada',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'HOSP_NADA',
    jobTitle: 'مسؤول قبول حالات النساء والتوليد',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h_roaa',
    name: 'مسؤول قبول — مركز رؤية للعيون',
    email: 'referral@roaa-eye.com',
    username: 'hosp.roaa',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'HOSP_ROAA',
    jobTitle: 'مسؤول قبول حالات جراحة وتصحيح العيون',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h_eye',
    name: 'مسؤول قبول — مستشفى العيون الدولي',
    email: 'referral@international-eye.com',
    username: 'hosp.eye_int',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'HOSP_EYE_INT',
    jobTitle: 'مسؤول قبول التحويلات التخصصية للعيون',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h_kamal',
    name: 'مسؤول قبول — مستشفى الكمال',
    email: 'referral@elkamal-hospital.com',
    username: 'hosp.kamal',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'HOSP_KAMAL',
    jobTitle: 'مسؤول استقبال الحالات العامة والجراحية',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ─── المستشفيات المتعاقدة المعتمدة للتحويل (5 جهات فقط) ─────────────────────
export const mockHospitals: Hospital[] = [
  {
    id: 'HOSP_CLEO',
    name: 'مستشفى كليوباترا',
    type: 'private',
    location: 'متعاقد — قطاع خاص',
    address: 'القاهرة / فروع التعاقد المعتمدة',
    specialties: [
      'جراحة عامة',
      'جراحة عظام',
      'باطنة وجهاز هضمي',
      'أمراض القلب والأوعية',
      'أورام وأشعة علاجية',
      'أمراض المخ والأعصاب',
      'أمراض الأطفال',
      'أمراض الصدر والجهاز التنفسي',
    ],
  },
  {
    id: 'HOSP_NADA',
    name: 'مستشفى الندى',
    type: 'private',
    location: 'متعاقد — تخصصي نساء وأطفال',
    address: 'التعاقد المعتمد لمنظومة التأمين الشامل',
    specialties: [
      'أمراض نسا وتوليد',
      'أطفال حديثي الولادة',
      'جراحة أورام النساء',
      'عقم وتخصيب مجهري',
      'أمراض الأطفال',
    ],
  },
  {
    id: 'HOSP_ROAA',
    name: 'مركز رؤية للعيون',
    type: 'specialized',
    location: 'متعاقد — مراكز عيون متخصصة',
    address: 'مركز رؤية المعتمد لجراحة العيون والليزك',
    specialties: [
      'أمراض العيون (رمد)',
      'جراحة عيون وقرنية',
      'جراحة المياه البيضاء والزرقاء',
      'شبكية وجسم زجاجي',
      'ليزك وتصحيح الإبصار',
    ],
  },
  {
    id: 'HOSP_EYE_INT',
    name: 'مستشفى العيون الدولي',
    type: 'specialized',
    location: 'متعاقد — مستشفيات العيون التخصصية',
    address: 'مستشفى العيون الدولي — التعاقد الشامل',
    specialties: [
      'أمراض العيون (رمد)',
      'جراحة عيون وقرنية',
      'زراعة القرنية',
      'جراحة شبكية متقدمة',
      'أمراض عيون الأطفال والحول',
    ],
  },
  {
    id: 'HOSP_KAMAL',
    name: 'مستشفى الكمال',
    type: 'private',
    location: 'متعاقد — قطاع خاص متكامل',
    address: 'مستشفى الكمال — التعاقد المعتمد',
    specialties: [
      'جراحة عامة',
      'جراحة عظام',
      'باطنة وجهاز هضمي',
      'أمراض الجهاز البولي',
      'أمراض الأنف والأذن والحنجرة',
      'أمراض الجلد',
      'طب نفسي',
    ],
  },
];

// ─── وحدات ومنافذ طب الأسرة — محافظة الأقصر (بيانات حقيقية) ─────────────
export const mockUnits: Unit[] = [
  // ── مركز الأقصر ──────────────────────────────────────────────────────────
  { id: 'unit_aqr_01', name: 'مركز طب أسرة العواميه',            directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_02', name: 'وحدة طب أسرة الإقالته',            directorate: 'الأقصر - غرب' },
  { id: 'unit_aqr_03', name: 'مركز طب أسرة الأقصر (الرعاية)',    directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_04', name: 'وحدة طب أسرة الشيخ موسى',          directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_05', name: 'مركز طب أسرة الكرنك الجديد',       directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_06', name: 'وحدة طب أسرة الحبيل',              directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_07', name: 'وحدة طب أسرة البغدادي',            directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_08', name: 'مركز طب أسرة الزناقطه',            directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_09', name: 'وحدة طب أسرة طيبه',                directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_10', name: 'مركز طب منشأة العماري',             directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_11', name: 'وحدة طب أسرة القباحي الغربي',      directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_12', name: 'وحدة طب أسرة نجع الخطباء',         directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_13', name: 'وحدة طب أسرة الدولي',              directorate: 'مركز الأقصر' },
  { id: 'unit_aqr_14', name: 'وحدة طب أسرة أبو طربوش',           directorate: 'مركز الأقصر' },
  // ── الأقصر الغرب ─────────────────────────────────────────────────────────
  { id: 'unit_ghrb_01', name: 'وحدة طب أسرة آل عثمان',           directorate: 'الأقصر - غرب' },
  { id: 'unit_ghrb_02', name: 'وحدة طب أسرة البعيرات',           directorate: 'الأقصر - غرب' },
  { id: 'unit_ghrb_03', name: 'وحدة طب أسرة القبلي قمولا',       directorate: 'الأقصر - غرب' },
  { id: 'unit_ghrb_04', name: 'وحدة طب أسرة نجع البركه',         directorate: 'الأقصر - غرب' },
  { id: 'unit_ghrb_05', name: 'وحدة طب أسرة الزماميه',           directorate: 'الأقصر - غرب' },
  { id: 'unit_ghrb_06', name: 'مركز طب أسرة الشهيد محمود ناصر',  directorate: 'الأقصر - غرب' },
  // ── مركز أرمنت ───────────────────────────────────────────────────────────
  { id: 'unit_armt_01', name: 'مركز طب أسرة أرمنت الحيط',        directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_02', name: 'ارمنت الرئيسي (صباحي)',            directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_03', name: 'وحدة طب أسرة الرزيقات قبلي',      directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_04', name: 'وحدة طب أسرة الرزيقات بحري',      directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_05', name: 'وحدة طب أسرة الرياينه',            directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_06', name: 'مركز طب أسرة الشهيد د. محمد بغدادي', directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_07', name: 'وحدة طب أسرة ارمنت الوابورات',    directorate: 'مركز - أرمنت' },
  { id: 'unit_armt_08', name: 'وحدة طب أسرة المريس',              directorate: 'مركز - أرمنت' },
  // ── أرمنت شرق ────────────────────────────────────────────────────────────
  { id: 'unit_armt_sh_01', name: 'مركز طب أسرة الطود',           directorate: 'أرمنت - شرق' },
  { id: 'unit_armt_sh_02', name: 'وحدة طب أسرة منشية النوبه',    directorate: 'أرمنت - شرق' },
  { id: 'unit_armt_sh_03', name: 'وحدة طب أسرة الضمان',          directorate: 'أرمنت - شرق' },
  { id: 'unit_armt_sh_04', name: 'وحدة طب أسرة العديسات قبلي',   directorate: 'أرمنت - شرق' },
  // ── مركز إسنا ────────────────────────────────────────────────────────────
  { id: 'unit_isn_01', name: 'مركز طب أسرة إسنا (صباحي)',         directorate: 'مركز - إسنا' },
  { id: 'unit_isn_02', name: 'مركز طب أسرة إسنا (مسائي)',         directorate: 'مركز - إسنا' },
  { id: 'unit_isn_03', name: 'مركز طب أسرة أصفون',                directorate: 'مركز - إسنا' },
  { id: 'unit_isn_04', name: 'مركز طب أسرة الدير',                directorate: 'مركز - إسنا' },
  { id: 'unit_isn_05', name: 'وحدة طب أسرة الشغب',               directorate: 'مركز - إسنا' },
  { id: 'unit_isn_06', name: 'وحدة طب أسرة الحليله',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_07', name: 'وحدة طب أسرة الغريره',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_08', name: 'وحدة طب أسرة الزنيقه',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_09', name: 'وحدة طب أسرة الحله',                directorate: 'مركز - إسنا' },
  { id: 'unit_isn_10', name: 'وحدة طب أسرة أحمد سعيد',           directorate: 'مركز - إسنا' },
  { id: 'unit_isn_11', name: 'وحدة طب أسرة الدبابيه',             directorate: 'مركز - إسنا' },
  { id: 'unit_isn_12', name: 'وحدة طب أسرة الهنادي',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_13', name: 'وحدة طب أسرة النمسا',               directorate: 'مركز - إسنا' },
  { id: 'unit_isn_14', name: 'وحدة طب أسرة القرايا',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_15', name: 'وحدة طب أسرة زرنيخ',               directorate: 'مركز - إسنا' },
  { id: 'unit_isn_16', name: 'وحدة طب أسرة الدقيره',              directorate: 'مركز - إسنا' },
  { id: 'unit_isn_17', name: 'وحدة طب أسرة النجوع بحري',          directorate: 'مركز - إسنا' },
  { id: 'unit_isn_18', name: 'وحدة طب أسرة العضايمه',             directorate: 'مركز - إسنا' },
  // ── الفرع الرئيسي ────────────────────────────────────────────────────────
  { id: 'unit_fraa_01', name: 'الفرع الرئيسي — أبانوب عادل',      directorate: 'الفرع الرئيسي' },
  { id: 'unit_fraa_02', name: 'الفرع الرئيسي — محمود إدريس',      directorate: 'الفرع الرئيسي' },
  { id: 'unit_fraa_03', name: 'الفرع الرئيسي — جيهان محمود',      directorate: 'الفرع الرئيسي' },
  { id: 'unit_fraa_04', name: 'الفرع الرئيسي — نجلاء',             directorate: 'الفرع الرئيسي' },
  { id: 'unit_fraa_05', name: 'الفرع الرئيسي — محمد حجاج',        directorate: 'الفرع الرئيسي' },
  { id: 'unit_fraa_06', name: 'الفرع الرئيسي — ناهد عبد الغني',   directorate: 'الفرع الرئيسي' },
];

// ─── التخصصات الطبية ───────────────────────────────────────────────────────
export const SPECIALTIES = [
  'باطنة وجهاز هضمي',
  'أمراض القلب والأوعية',
  'جراحة عامة',
  'جراحة عظام',
  'أمراض العيون (رمد)',
  'جراحة عيون وقرنية',
  'أمراض نسا وتوليد',
  'أطفال حديثي الولادة',
  'أمراض الأطفال',
  'أورام وأشعة علاجية',
  'أمراض الصدر والجهاز التنفسي',
  'أمراض الجهاز البولي',
  'أمراض الأنف والأذن والحنجرة',
  'أمراض الجلد',
  'أمراض المخ والأعصاب',
  'طب نفسي',
];

// ─── أسباب الرفض المؤسسية ──────────────────────────────────────────────────
export const REJECTION_REASONS = [
  { id: 'r1', label: 'عدم اكتمال المستندات والمرفقات الإلزامية' },
  { id: 'r2', label: 'التخصص المطلوب غير مشمول بتعاقد المستشفى' },
  { id: 'r3', label: 'المنتفع غير مسجل بمنظومة التأمين الصحي الشامل' },
  { id: 'r4', label: 'عدم وجود إثبات انتفاع ساري المفعول' },
  { id: 'r5', label: 'التحويل لا يتوافق مع مستوى الرعاية المتاح' },
  { id: 'r6', label: 'وجود تحويل نشط آخر لنفس المنتفع لذات التخصص' },
  { id: 'r7', label: 'ملف التقرير الطبي غير مقروء أو ناقص الختم' },
  { id: 'r8', label: 'اكتمال الطاقة الاستيعابية للمستشفى المتعاقد' },
];

// ─── قائمة الطلبات (تبدأ فارغة بناءً على طلبك) ───────────────────────────
export const mockReferrals: Referral[] = [];

// ─── دوال مساعدة ────────────────────────────────────────────────────────────
export function getUser(id: string) {
  return mockUsers.find(u => u.id === id);
}

export function getUnit(id: string) {
  return mockUnits.find(u => u.id === id);
}

export function getHospital(id: string) {
  return mockHospitals.find(h => h.id === id);
}

export function getRejectionReason(id: string) {
  return REJECTION_REASONS.find(r => r.id === id);
}

export function getStatusConfig(status: Referral['status']) {
  const configs: Record<string, { label: string; color: string; dot: string }> = {
    DRAFT:            { label: 'مسودة',            color: 'bg-slate-700/60 text-slate-300 border border-slate-600/40', dot: 'bg-slate-400' },
    PENDING_REVIEW:   { label: 'قيد المراجعة',     color: 'bg-amber-900/40 text-amber-300 border border-amber-700/40', dot: 'bg-amber-400' },
    RETURNED_TO_UNIT: { label: 'مُعاد للوحدة',     color: 'bg-orange-900/40 text-orange-300 border border-orange-700/40', dot: 'bg-orange-400' },
    PENDING_HOSPITAL: { label: 'قيد رد المستشفى',  color: 'bg-blue-900/40 text-blue-300 border border-blue-700/40', dot: 'bg-blue-400' },
    HOSPITAL_RFI:     { label: 'استيفاء مستشفى',  color: 'bg-purple-900/40 text-purple-300 border border-purple-700/40', dot: 'bg-purple-400' },
    ACCEPTED:         { label: 'مقبول ✓',          color: 'bg-brand-900/40 text-brand-300 border border-brand-700/40', dot: 'bg-brand-400' },
    REJECTED:         { label: 'مرفوض',            color: 'bg-red-900/40 text-red-300 border border-red-700/40', dot: 'bg-red-400' },
    CANCELED:         { label: 'ملغي',             color: 'bg-slate-800/60 text-slate-500 border border-slate-700/40', dot: 'bg-slate-600' },
  };
  return configs[status] || configs.DRAFT;
}

export function getUrgencyConfig(urgency: Referral['urgency']) {
  const configs = {
    routine:   { label: 'اعتيادي', color: 'text-slate-400', bg: 'bg-slate-800/40' },
    urgent:    { label: 'عاجل',    color: 'text-amber-400', bg: 'bg-amber-900/20' },
    emergency: { label: '🚨 طارئ', color: 'text-red-400',   bg: 'bg-red-900/20' },
  };
  return configs[urgency] || configs.routine;
}
