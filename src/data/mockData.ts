import { User, Unit, Hospital, Referral } from '../types';

// ─── المستخدمون الحقيقيون ───────────────────────────────────────────────────
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'admin':         { password: '0000',     userId: 'u_admin' },
  'rahab.wahab':   { password: '1234',     userId: 'u_director' },
  'ahmed.amin':    { password: '1234',     userId: 'u_gates' },
  'hend.ali':      { password: '1234',     userId: 'u_s1' },
  'mona.saad':     { password: '1234',     userId: 'u_s2' },
  'karim.hassan':  { password: '1234',     userId: 'u_s3' },
  'noura.fathy':   { password: '1234',     userId: 'u_s4' },
  'hosp.luxor':    { password: '1234',     userId: 'u_h1' },
  'hosp.chest':    { password: '1234',     userId: 'u_h2' },
  'hosp.eye':      { password: '1234',     userId: 'u_h3' },
};

export const mockUsers: User[] = [
  {
    id: 'u_admin',
    name: 'عبد الرحمن أشرف',
    email: 'abdalrhman.ashraf@uhia-luxor.gov.eg',
    username: 'admin',
    role: 'SYSTEM_ADMIN',
    jobTitle: 'مسؤول النظام',
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
    jobTitle: 'مدير إدارة المنافذ',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_s1',
    name: 'هند علي عبد الفتاح',
    email: 'hend.ali@uhia-luxor.gov.eg',
    username: 'hend.ali',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_aqr_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة العواميه',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u_s2',
    name: 'منى سعد عبد الرحيم',
    email: 'mona.saad@uhia-luxor.gov.eg',
    username: 'mona.saad',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_aqr_02',
    jobTitle: 'أخصائي منفذ — وحدة طب أسرة الإقالته',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u_s3',
    name: 'كريم حسن السيد',
    email: 'karim.hassan@uhia-luxor.gov.eg',
    username: 'karim.hassan',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_armt_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة أرمنت الحيط',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'u_s4',
    name: 'نورا فتحي محمد',
    email: 'noura.fathy@uhia-luxor.gov.eg',
    username: 'noura.fathy',
    role: 'UNIT_SPECIALIST',
    unitId: 'unit_isn_01',
    jobTitle: 'أخصائي منفذ — مركز طب أسرة إسنا (صباحي)',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'u_h1',
    name: 'مسؤول قبول — الأقصر العام',
    email: 'reception@luxor-general.gov.eg',
    username: 'hosp.luxor',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'h1',
    jobTitle: 'مسؤول قبول التحويلات',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h2',
    name: 'مسؤول قبول — مستشفى الصدر',
    email: 'reception@chest-luxor.gov.eg',
    username: 'hosp.chest',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'h2',
    jobTitle: 'مسؤول قبول التحويلات',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u_h3',
    name: 'مسؤول قبول — مستشفى الرمد',
    email: 'reception@eye-luxor.gov.eg',
    username: 'hosp.eye',
    role: 'HOSPITAL_RECEIVER',
    hospitalId: 'h3',
    jobTitle: 'مسؤول قبول التحويلات',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ─── وحدات طب الأسرة — محافظة الأقصر (بيانات حقيقية) ─────────────────────
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

// ─── المستشفيات المتعاقدة — محافظة الأقصر ───────────────────────────────────
export const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'مستشفى الأقصر العام',
    type: 'government',
    address: 'شارع الكورنيش، الأقصر',
    specialties: ['باطنة وجهاز هضمي', 'جراحة عامة', 'جراحة عظام', 'أمراض القلب والأوعية', 'أمراض الأطفال', 'طوارئ'],
  },
  {
    id: 'h2',
    name: 'مستشفى الصدر — الأقصر',
    type: 'government',
    address: 'شارع المدينة، الأقصر',
    specialties: ['أمراض الصدر والجهاز التنفسي', 'الحساسية والمناعة'],
  },
  {
    id: 'h3',
    name: 'مستشفى الرمد — الأقصر',
    type: 'government',
    address: 'شارع المطار، الأقصر',
    specialties: ['أمراض العيون (رمد)', 'جراحة عيون وقرنية'],
  },
  {
    id: 'h4',
    name: 'مستشفى الأمومة والطفولة — الأقصر',
    type: 'government',
    address: 'الأقصر',
    specialties: ['أمراض نسا وتوليد', 'أطفال حديثي الولادة', 'أمراض الأطفال'],
  },
  {
    id: 'h5',
    name: 'مستشفى أرمنت العام',
    type: 'government',
    address: 'مدينة أرمنت، الأقصر',
    specialties: ['باطنة وجهاز هضمي', 'جراحة عامة', 'أمراض الأطفال', 'نسا وتوليد'],
  },
  {
    id: 'h6',
    name: 'مستشفى إسنا العام',
    type: 'government',
    address: 'مدينة إسنا، الأقصر',
    specialties: ['باطنة وجهاز هضمي', 'جراحة عامة', 'أمراض الأطفال'],
  },
  {
    id: 'h7',
    name: 'مستشفى الأقصر الدولي',
    type: 'private',
    address: 'شارع التلفزيون، الأقصر',
    specialties: ['جراحة عامة', 'جراحة عظام', 'باطنة', 'أشعة تشخيصية', 'أورام'],
  },
  {
    id: 'h8',
    name: 'مركز الأقصر للأورام والحروق',
    type: 'specialized',
    address: 'الأقصر',
    specialties: ['أورام وأشعة علاجية', 'علاج الحروق والجراحة التجميلية'],
  },
];

// ─── قوائم ثابتة ────────────────────────────────────────────────────────────
export const SPECIALTIES = [
  'باطنة وجهاز هضمي',
  'أمراض القلب والأوعية',
  'جراحة عامة',
  'جراحة عظام',
  'أمراض العيون (رمد)',
  'أمراض الجهاز البولي',
  'أمراض نسا وتوليد',
  'أمراض الأطفال',
  'أمراض الأنف والأذن والحنجرة',
  'أمراض الجلد',
  'أورام وأشعة علاجية',
  'أمراض الصدر والجهاز التنفسي',
  'أمراض المخ والأعصاب',
  'طب نفسي',
  'جراحة عيون وقرنية',
  'أطفال حديثي الولادة',
  'الغدد الصماء والسكر',
];

export const REJECTION_REASONS = [
  { id: 'r1', label: 'عدم اكتمال المستندات والمرفقات' },
  { id: 'r2', label: 'التخصص المطلوب غير متاح حالياً' },
  { id: 'r3', label: 'المنتفع غير مسجل بمنظومة التأمين الصحي الشامل' },
  { id: 'r4', label: 'عدم وجود إثبات انتفاع ساري المفعول' },
  { id: 'r5', label: 'التحويل لا يتوافق مع مستوى الرعاية (Referral Level)' },
  { id: 'r6', label: 'وجود تحويل نشط آخر لنفس المنتفع لنفس التخصص' },
  { id: 'r7', label: 'ملف التقرير الطبي غير مقروء أو ناقص' },
  { id: 'r8', label: 'المستشفى ممتلئ الطاقة — يرجى تحديد مستشفى بديل' },
];

// ─── بيانات وهمية للطلبات ───────────────────────────────────────────────────
const now = new Date();
const d = (days: number) => new Date(now.getTime() - 86400000 * days).toISOString();

export const mockReferrals: Referral[] = [
  {
    id: 'REF-2608-001', nationalId: '27901011234567', patientName: 'محمود السيد عبد الله',
    patientAge: 52, gender: 'male', phone: '01012345678',
    sourceUnitId: 'unit1', targetHospitalId: 'h1', referringDoctor: 'د. عمرو سليمان',
    specialty: 'جراحة عظام', urgency: 'urgent',
    clinicalSummary: 'ألم شديد في الركبة اليمنى مع صعوبة في المشي — يحتاج تدخل جراحي',
    status: 'PENDING_HOSPITAL', createdAt: d(2), createdBy: 'u_s1', lastModifiedAt: d(1),
  },
  {
    id: 'REF-2608-002', nationalId: '29005051234567', patientName: 'فاطمة حسن علي',
    patientAge: 38, gender: 'female', phone: '01198765432',
    sourceUnitId: 'unit2', targetHospitalId: 'h8', referringDoctor: 'د. نهى أحمد سعيد',
    specialty: 'أورام وأشعة علاجية', urgency: 'emergency',
    clinicalSummary: 'كتلة في الثدي الأيسر — مشتبه ورم خبيث — يستلزم استئصال عاجل',
    status: 'PENDING_REVIEW', createdAt: d(0.5), createdBy: 'u_s2', lastModifiedAt: d(0.5),
  },
  {
    id: 'REF-2608-003', nationalId: '30201071234567', patientName: 'ياسين أحمد محمود',
    patientAge: 24, gender: 'male', phone: '01555123456',
    sourceUnitId: 'unit1', targetHospitalId: 'h3', referringDoctor: 'د. خالد رمضان',
    specialty: 'أمراض العيون (رمد)', urgency: 'routine',
    clinicalSummary: 'ضعف حدة الإبصار في العينين مع ماء أبيض في مرحلة متقدمة',
    status: 'ACCEPTED', createdAt: d(5), createdBy: 'u_s1', lastModifiedAt: d(3),
  },
  {
    id: 'REF-2608-004', nationalId: '27803041234567', patientName: 'سميرة محمد عبد الرحمن',
    patientAge: 65, gender: 'female', phone: '01023456789',
    sourceUnitId: 'unit3', targetHospitalId: 'h1', referringDoctor: 'د. أمل حسام الدين',
    specialty: 'أمراض القلب والأوعية', urgency: 'urgent',
    clinicalSummary: 'ألم صدري متكرر مع ضيق تنفس وانتفاخ في القدمين',
    status: 'REJECTED', createdAt: d(7), createdBy: 'u_s3', lastModifiedAt: d(6),
    rejectionReasonId: 'r4', rejectionComment: 'انتهت صلاحية إثبات الانتفاع — يرجى التجديد ثم إعادة الطلب',
  },
  {
    id: 'REF-2608-005', nationalId: '29804121234567', patientName: 'حسام إبراهيم الديب',
    patientAge: 44, gender: 'male', phone: '01234567890',
    sourceUnitId: 'unit1', targetHospitalId: 'h1', referringDoctor: 'د. عمرو سليمان',
    specialty: 'باطنة وجهاز هضمي', urgency: 'routine',
    clinicalSummary: 'قولون عصبي مزمن مع صداع متكرر — لم يتحسن مع العلاج الأولي',
    status: 'DRAFT', createdAt: d(0.1), createdBy: 'u_s1', lastModifiedAt: d(0.1),
  },
  {
    id: 'REF-2608-006', nationalId: '29101071234567', patientName: 'نادية سعيد عوض',
    patientAge: 31, gender: 'female', phone: '01012312312',
    sourceUnitId: 'unit2', targetHospitalId: 'h4', referringDoctor: 'د. منى صالح خليل',
    specialty: 'أمراض نسا وتوليد', urgency: 'urgent',
    clinicalSummary: 'حمل عالي الخطورة — ضغط مرتفع وسكر حمل — أسبوع 32',
    status: 'HOSPITAL_RFI', createdAt: d(3), createdBy: 'u_s2', lastModifiedAt: d(1),
  },
  {
    id: 'REF-2608-007', nationalId: '28706031234567', patientName: 'عصام محمد فرج',
    patientAge: 57, gender: 'male', phone: '01001234567',
    sourceUnitId: 'unit4', targetHospitalId: 'h2', referringDoctor: 'د. وائل منصور',
    specialty: 'أمراض الصدر والجهاز التنفسي', urgency: 'urgent',
    clinicalSummary: 'إصابة بالسل الرئوي المقاوم للأدوية — يحتاج علاج متخصص',
    status: 'PENDING_HOSPITAL', createdAt: d(4), createdBy: 'u_s4', lastModifiedAt: d(2),
  },
];

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
