import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, X, AlertCircle, CheckCircle2, ChevronLeft,
  User, Stethoscope, Paperclip, Loader2, BadgeCheck, BadgeX
} from 'lucide-react';
import { mockHospitals, mockUnits, SPECIALTIES } from '../data/mockData';
import { parseNationalId, formatBirthDate } from '../utils/nationalId';
import { useAuth } from '../context/AuthContext';
import { useReferrals } from '../context/ReferralsContext';

interface FormData {
  nationalId: string;
  patientName: string;
  patientAge: string;
  gender: string;
  birthDate: string;
  governorate: string;
  phone: string;
  sourceUnitId: string;
  referringDoctor: string;
  specialty: string;
  targetHospitalId: string;
  urgency: string;
  clinicalSummary: string;
}

const INITIAL_FORM: FormData = {
  nationalId: '', patientName: '', patientAge: '',
  gender: '', birthDate: '', governorate: '',
  phone: '', sourceUnitId: '',
  referringDoctor: '', specialty: '',
  targetHospitalId: '', urgency: 'routine', clinicalSummary: '',
};

type Step = 1 | 2 | 3;

export function NewReferral() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addReferral } = useReferrals();
  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    sourceUnitId: user?.unitId || '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [idStatus, setIdStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [idError, setIdError] = useState('');

  // تجميع الوحدات حسب المركز/الإدارة
  const groupedUnits = useMemo(() => {
    const groups: Record<string, typeof mockUnits> = {};
    for (const u of mockUnits) {
      if (!groups[u.directorate]) groups[u.directorate] = [];
      groups[u.directorate].push(u);
    }
    return groups;
  }, []);

  // ─── استخراج البيانات من الرقم القومي تلقائياً ───────────────────────────
  useEffect(() => {
    if (form.nationalId.length === 0) {
      setIdStatus('idle');
      setIdError('');
      setForm(prev => ({ ...prev, patientAge: '', gender: '', birthDate: '', governorate: '' }));
      return;
    }
    if (form.nationalId.length === 14) {
      const info = parseNationalId(form.nationalId);
      if (info.isValid && info.age !== undefined && info.gender && info.birthDate) {
        setIdStatus('valid');
        setIdError('');
        setForm(prev => ({
          ...prev,
          patientAge: String(info.age),
          gender: info.gender!,
          birthDate: formatBirthDate(info.birthDate!),
          governorate: info.governorateCode || '',
        }));
      } else {
        setIdStatus('invalid');
        setIdError(info.error || 'الرقم القومي غير صحيح');
        setForm(prev => ({ ...prev, patientAge: '', gender: '', birthDate: '', governorate: '' }));
      }
    } else {
      setIdStatus('idle');
      setIdError('');
    }
  }, [form.nationalId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === 'nationalId') {
      const digits = value.replace(/\D/g, '').slice(0, 14);
      setForm(prev => ({ ...prev, nationalId: digits }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addReferral({
      nationalId: form.nationalId,
      patientName: form.patientName,
      patientAge: parseInt(form.patientAge, 10) || 0,
      gender: (form.gender === 'female' ? 'female' : 'male'),
      phone: form.phone || '',
      sourceUnitId: form.sourceUnitId,
      targetHospitalId: form.targetHospitalId || 'HOSP_CLEO',
      referringDoctor: form.referringDoctor || 'طبيب الوحدة',
      specialty: form.specialty,
      urgency: (form.urgency as 'routine' | 'urgent' | 'emergency') || 'routine',
      clinicalSummary: form.clinicalSummary,
      status: 'PENDING_REVIEW',
      createdBy: user?.id || 'u_admin',
    });
    setSubmitted(true);
    setTimeout(() => navigate('/referrals'), 2000);
  }

  const step1Valid = form.nationalId.length === 14 && idStatus === 'valid' && !!form.patientName && !!form.sourceUnitId;
  const step2Valid = !!form.specialty && !!form.urgency;

  const STEPS = [
    { num: 1, label: 'بيانات المنتفع', icon: User },
    { num: 2, label: 'بيانات التحويل', icon: Stethoscope },
    { num: 3, label: 'المرفقات والإرسال', icon: Paperclip },
  ];

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-12 text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-brand-900/40 border border-brand-700/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-slate-400 text-sm mb-6">
            تم إرسال طلب التحويل لمراجعة{' '}
            <span className="text-brand-400 font-bold">أحمد أمين</span> — مدير إدارة المنافذ
          </p>
          <div className="flex items-center gap-2 justify-center text-xs text-slate-600">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            جاري التحويل لقائمة الطلبات...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => {
                  if (s.num < step ||
                    (s.num === 2 && step1Valid) ||
                    (s.num === 3 && step1Valid && step2Valid)) {
                    setStep(s.num as Step);
                  }
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                  step === s.num
                    ? 'bg-brand-600/20 border border-brand-600/40 text-brand-300'
                    : s.num < step
                      ? 'text-brand-500 cursor-pointer hover:bg-slate-800'
                      : 'text-slate-600 cursor-default'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  step === s.num ? 'bg-brand-600 text-white' :
                  s.num < step ? 'bg-brand-900/60 text-brand-400 border border-brand-700/40' :
                  'bg-slate-800 text-slate-600'
                }`}>
                  {s.num < step ? '✓' : s.num}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${s.num < step ? 'bg-brand-700/50' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── الخطوة 1: بيانات المنتفع ─────────────────────────────────── */}
        {step === 1 && (
          <div className="glass-card p-6 space-y-5 animate-fade-in">
            <h3 className="font-bold text-slate-200 text-lg border-b border-slate-800/60 pb-3">
              بيانات المنتفع
            </h3>

            {/* الرقم القومي */}
            <div>
              <label className="form-label">
                الرقم القومي <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="nationalId"
                  value={form.nationalId}
                  onChange={handleChange}
                  className={`form-input font-mono text-base tracking-widest pl-10 ${
                    idStatus === 'valid'   ? 'border-brand-600 ring-1 ring-brand-600/30' :
                    idStatus === 'invalid' ? 'border-red-600 ring-1 ring-red-600/30' : ''
                  }`}
                  placeholder="أدخل الرقم القومي — 14 رقم"
                  maxLength={14}
                  autoComplete="off"
                />
                <div className="absolute left-3 top-3.5">
                  {idStatus === 'valid'   && <BadgeCheck className="w-5 h-5 text-brand-400" />}
                  {idStatus === 'invalid' && <BadgeX className="w-5 h-5 text-red-400" />}
                  {idStatus === 'idle' && form.nationalId.length > 0 && (
                    <span className="text-xs text-slate-500 font-bold">{form.nationalId.length}/14</span>
                  )}
                </div>
              </div>
              {idStatus === 'invalid' && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {idError}
                </p>
              )}
            </div>

            {/* البيانات المستخرجة تلقائياً */}
            {idStatus === 'valid' && (
              <div className="grid grid-cols-3 gap-3 p-4 bg-brand-900/20 border border-brand-800/30 rounded-xl animate-fade-in">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">الجنس</p>
                  <p className="font-black text-slate-200 text-sm">
                    {form.gender === 'male' ? '👨 ذكر' : '👩 أنثى'}
                  </p>
                </div>
                <div className="text-center border-x border-brand-800/30">
                  <p className="text-xs text-slate-500 mb-1">السن</p>
                  <p className="font-black text-slate-200 text-sm">{form.patientAge} سنة</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">محافظة الإصدار</p>
                  <p className="font-black text-slate-200 text-sm">{form.governorate}</p>
                </div>
                {form.birthDate && (
                  <div className="col-span-3 text-center border-t border-brand-800/30 pt-3">
                    <p className="text-xs text-slate-500 mb-1">تاريخ الميلاد</p>
                    <p className="font-semibold text-brand-300 text-sm">{form.birthDate}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="form-label">
                  اسم المنتفع كاملاً <span className="text-red-400">*</span>
                </label>
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="الاسم رباعياً كما في البطاقة"
                  required
                />
              </div>
              <div>
                <label className="form-label">رقم الهاتف</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              {/* قائمة المنافذ الحقيقية مُجمَّعة */}
              <div>
                <label className="form-label">
                  المنفذ / الوحدة الصادر منها الطلب <span className="text-red-400">*</span>
                </label>
                <select
                  name="sourceUnitId"
                  value={form.sourceUnitId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">اختر المنفذ...</option>
                  {Object.entries(groupedUnits).map(([directorate, units]) => (
                    <optgroup key={directorate} label={`── ${directorate}`}>
                      {units.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!step1Valid}
                onClick={() => setStep(2)}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                التالي — بيانات التحويل
              </button>
            </div>
          </div>
        )}

        {/* ── الخطوة 2: بيانات التحويل ────────────────────────────────── */}
        {step === 2 && (
          <div className="glass-card p-6 space-y-5 animate-fade-in">
            <h3 className="font-bold text-slate-200 text-lg border-b border-slate-800/60 pb-3">
              بيانات التحويل الطبي
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  التخصص المطلوب <span className="text-red-400">*</span>
                </label>
                <select name="specialty" value={form.specialty} onChange={handleChange}
                  className="form-select" required>
                  <option value="">اختر التخصص...</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">
                  درجة الإلحاح <span className="text-red-400">*</span>
                </label>
                <select name="urgency" value={form.urgency} onChange={handleChange}
                  className="form-select" required>
                  <option value="routine">اعتيادي</option>
                  <option value="urgent">عاجل</option>
                  <option value="emergency">🚨 طارئ — أولوية قصوى</option>
                </select>
              </div>

              <div>
                <label className="form-label">الطبيب المحول</label>
                <input name="referringDoctor" value={form.referringDoctor} onChange={handleChange}
                  className="form-input" placeholder="د. اسم الطبيب" />
              </div>

              <div>
                <label className="form-label">المستشفى المقترح (اختياري)</label>
                <select name="targetHospitalId" value={form.targetHospitalId}
                  onChange={handleChange} className="form-select">
                  <option value="">يحدده أحمد أمين — مدير المنافذ</option>
                  {mockHospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} {h.type === 'private' ? '(خاص)' : h.type === 'specialized' ? '(متخصص)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="form-label">
                  الملخص السريري <span className="text-red-400">*</span>
                </label>
                <textarea name="clinicalSummary" value={form.clinicalSummary}
                  onChange={handleChange} className="form-input resize-none" rows={4}
                  placeholder="وصف موجز للحالة الطبية وسبب التحويل..." required />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                <ChevronLeft className="w-4 h-4" /> رجوع
              </button>
              <button
                type="button"
                disabled={!step2Valid}
                onClick={() => setStep(3)}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                التالي — المرفقات
              </button>
            </div>
          </div>
        )}

        {/* ── الخطوة 3: المرفقات والإرسال ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="font-bold text-slate-200 text-lg">المرفقات المطلوبة</h3>
                <p className="text-xs text-slate-500 mt-1">
                  بطاقة الرقم القومي • كارنيه / إثبات الانتفاع • تقرير طبي (O.P) • أشعة أو تحاليل داعمة
                </p>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-brand-500 bg-brand-900/20'
                    : 'border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/30'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${isDragging ? 'text-brand-400' : 'text-slate-600'}`} />
                <p className="text-sm font-semibold text-slate-400">
                  اسحب الملفات هنا أو <span className="text-brand-400">اضغط للاختيار</span>
                </p>
                <p className="text-xs text-slate-600 mt-1">PDF, JPG, PNG — حد أقصى 10MB للملف</p>
                <input id="file-upload" type="file" multiple className="hidden"
                  onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx}
                      className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-300 truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-slate-600">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(idx)}
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-amber-900/20 border border-amber-800/30 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">
                    يُفضّل رفع المرفقات الإلزامية قبل الإرسال لتجنب إعادة الطلب من إدارة المنافذ.
                  </p>
                </div>
              )}
            </div>

            {/* ملخص قبل الإرسال */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-200 mb-4">مراجعة الطلب قبل الإرسال</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'المنتفع',     value: form.patientName },
                  { label: 'الرقم القومي', value: form.nationalId },
                  { label: 'السن',         value: form.patientAge ? `${form.patientAge} سنة` : '' },
                  { label: 'الجنس',        value: form.gender === 'male' ? 'ذكر' : form.gender === 'female' ? 'أنثى' : '' },
                  { label: 'التخصص',       value: form.specialty },
                  { label: 'الإلحاح',      value: form.urgency === 'routine' ? 'اعتيادي' : form.urgency === 'urgent' ? 'عاجل' : '🚨 طارئ' },
                  { label: 'المنفذ',       value: mockUnits.find(u => u.id === form.sourceUnitId)?.name || '' },
                ].map(item => (
                  <div key={item.label} className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0">{item.label}:</span>
                    <span className="text-slate-300 font-semibold truncate">{item.value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                <ChevronLeft className="w-4 h-4" /> رجوع
              </button>
              <div className="flex items-center gap-3">
                <button type="button" className="btn-secondary">حفظ كمسودة</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  إرسال للمراجعة
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
