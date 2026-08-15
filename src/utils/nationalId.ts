/**
 * مكتبة تحليل الرقم القومي المصري (14 رقم)
 *
 * الهيكل:
 *  [0]       كود القرن: 2 = 1900s | 3 = 2000s
 *  [1-2]     السنة (آخر رقمين)
 *  [3-4]     الشهر
 *  [5-6]     اليوم
 *  [7-9]     كود المحافظة
 *  [10-12]   رقم تسلسلي (فردي = ذكر، زوجي = أنثى)
 *  [13]      رقم تحقق
 */

export interface NationalIdInfo {
  isValid: boolean;
  gender?: 'male' | 'female';
  birthDate?: Date;
  age?: number;
  governorateCode?: string;
  error?: string;
}

const GOVERNORATES: Record<string, string> = {
  '01': 'القاهرة',        '02': 'الإسكندرية',   '03': 'بورسعيد',
  '04': 'السويس',         '11': 'دمياط',         '12': 'الدقهلية',
  '13': 'الشرقية',        '14': 'القليوبية',     '15': 'كفر الشيخ',
  '16': 'الغربية',        '17': 'المنوفية',      '18': 'البحيرة',
  '19': 'الإسماعيلية',   '21': 'الجيزة',        '22': 'بني سويف',
  '23': 'الفيوم',         '24': 'المنيا',        '25': 'أسيوط',
  '26': 'سوهاج',          '27': 'قنا',           '28': 'أسوان',
  '29': 'الأقصر',         '31': 'البحر الأحمر',  '32': 'الوادي الجديد',
  '33': 'مطروح',          '34': 'شمال سيناء',    '35': 'جنوب سيناء',
  '88': 'خارج الجمهورية',
};

export function parseNationalId(nationalId: string): NationalIdInfo {
  const id = nationalId.trim();

  if (!id) return { isValid: false };

  if (id.length !== 14) {
    return { isValid: false, error: 'الرقم القومي يجب أن يتكون من 14 رقم' };
  }

  if (!/^\d{14}$/.test(id)) {
    return { isValid: false, error: 'الرقم القومي يجب أن يحتوي على أرقام فقط' };
  }

  const centuryCode = id[0];
  if (centuryCode !== '2' && centuryCode !== '3') {
    return { isValid: false, error: 'كود القرن غير صحيح (يجب أن يبدأ بـ 2 أو 3)' };
  }

  const yearSuffix = id.substring(1, 3);
  const month      = parseInt(id.substring(3, 5), 10);
  const day        = parseInt(id.substring(5, 7), 10);
  const govCode    = id.substring(7, 9);
  const sequential = parseInt(id.substring(10, 13), 10);

  const century = centuryCode === '2' ? 1900 : 2000;
  const fullYear = century + parseInt(yearSuffix, 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'شهر الميلاد غير صحيح في الرقم القومي' };
  }
  if (day < 1 || day > 31) {
    return { isValid: false, error: 'يوم الميلاد غير صحيح في الرقم القومي' };
  }

  const birthDate = new Date(fullYear, month - 1, day);

  // التحقق من صحة التاريخ
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return { isValid: false, error: 'تاريخ الميلاد في الرقم القومي غير صحيح' };
  }

  const today = new Date();
  if (birthDate > today) {
    return { isValid: false, error: 'تاريخ الميلاد في المستقبل — الرقم القومي غير صحيح' };
  }

  // حساب العمر بدقة
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // الجنس: الرقم التسلسلي (الرقم 11-13) — فردي = ذكر، زوجي = أنثى
  const gender: 'male' | 'female' = sequential % 2 !== 0 ? 'male' : 'female';

  return {
    isValid: true,
    gender,
    birthDate,
    age,
    governorateCode: GOVERNORATES[govCode] || `كود ${govCode}`,
  };
}

export function formatBirthDate(date: Date): string {
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
