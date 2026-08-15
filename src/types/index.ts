// ─── الأدوار الوظيفية ────────────────────────────────────────────────────────
export type UserRole =
  | 'UNIT_SPECIALIST'      // أخصائي منفذ
  | 'DIRECTORATE_REVIEWER' // مدير إدارة المنافذ / المشرف
  | 'HOSPITAL_RECEIVER'    // مسؤول قبول المستشفى
  | 'SYSTEM_ADMIN';        // مسؤول النظام

// ─── حالات طلب التحويل ───────────────────────────────────────────────────────
export type ReferralStatus =
  | 'DRAFT'            // مسودة — لم تُرسل بعد
  | 'PENDING_REVIEW'   // قيد المراجعة من إدارة المنافذ
  | 'RETURNED_TO_UNIT' // مُعاد للوحدة للاستيفاء
  | 'PENDING_HOSPITAL' // أُرسلت للمستشفى وبانتظار الرد
  | 'HOSPITAL_RFI'     // المستشفى طلبت استيفاء إضافياً
  | 'ACCEPTED'         // قبلها المستشفى
  | 'REJECTED'         // مرفوضة
  | 'CANCELED';        // ملغاة

// ─── المستخدم ────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  jobTitle: string;
  unitId?: string;
  hospitalId?: string;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

// ─── وحدة / مركز طب أسرة ─────────────────────────────────────────────────────
export interface Unit {
  id: string;
  name: string;
  directorate: string;
}

// ─── المستشفى المتعاقد ───────────────────────────────────────────────────────
export interface Hospital {
  id: string;             // كود المنشأة من نظام UHIA (CARE001, etc.)
  name: string;
  type: 'private' | 'government' | 'specialized';
  address?: string;
  location: string;       // المنطقة (الأقصر، أرمنت، إسنا، ...)
  specialties: string[];
}

// ─── طلب التحويل ─────────────────────────────────────────────────────────────
export interface Referral {
  id: string;             // رقم الطلب (REF-YYMM-XXX)
  nationalId: string;     // الرقم القومي للمنتفع
  patientName: string;
  patientAge: number;
  gender: 'male' | 'female';
  phone: string;
  sourceUnitId: string;   // id الوحدة المُحوِّلة
  targetHospitalId: string; // كود المستشفى (CARE001 ...)
  referringDoctor: string;
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  clinicalSummary: string;
  status: ReferralStatus;
  createdAt: string;
  createdBy: string;      // id المستخدم المُنشئ
  lastModifiedAt: string;
  rejectionReasonId?: string;
  rejectionComment?: string;
  attachments?: string[];
}

// ─── سجل التدقيق ─────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  referralId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  comments?: string;
  fromStatus?: ReferralStatus;
  toStatus?: ReferralStatus;
}
