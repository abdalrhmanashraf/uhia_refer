export type UserRole = 'UNIT_SPECIALIST' | 'DIRECTORATE_REVIEWER' | 'HOSPITAL_RECEIVER' | 'SYSTEM_ADMIN';

export type ReferralStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'RETURNED_TO_UNIT'
  | 'PENDING_HOSPITAL'
  | 'HOSPITAL_RFI'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unitId?: string;
  hospitalId?: string;
  avatar?: string;
}

export interface Unit {
  id: string;
  name: string;
  directorate: string;
}

export interface Hospital {
  id: string;
  name: string;
  specialties: string[];
}

export interface Referral {
  id: string;
  nationalId: string;
  patientName: string;
  patientAge: number;
  gender: 'male' | 'female';
  phone: string;
  sourceUnitId: string;
  targetHospitalId: string;
  referringDoctor: string;
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  clinicalSummary: string;
  status: ReferralStatus;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  rejectionReasonId?: string;
  rejectionComment?: string;
  attachments?: string[];
}

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
