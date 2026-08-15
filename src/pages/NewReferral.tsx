import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { mockHospitals, mockUnits, SPECIALTIES, CURRENT_USER } from '../data/mockData';

interface FormData {
  nationalId: string;
  patientName: string;
  patientAge: string;
  gender: string;
  phone: string;
  referringDoctor: string;
  specialty: string;
  targetHospitalId: string;
  urgency: string;
  clinicalSummary: string;
}

const INITIAL_FORM: FormData = {
  nationalId: '', patientName: '', patientAge: '', gender: '',
  phone: '', referringDoctor: '', specialty: '',
  targetHospitalId: '', urgency: 'routine', clinicalSummary: '',
};

export function NewReferral() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const unit = mockUnits.find(u => u.id === CURRENT_USER.unitId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
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

  function handleSubmit(e: React.FormEvent, asDraft = false) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/referrals'), 2000);
  }

  const requiredFilled = form.nationalId && form.patientName && form.specialty && form.urgency;

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-12 text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-brand-900/40 border border-brand-700/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 mb-2">تم إرسال الطلب!</h2>
          <p className="text-slate-400 mb-6">تم إرسال طلب التحويل للمراجعة بنجاح. ستتم إعادة توجيهك لقائمة الطلبات...</p>
          <div className="w-full bg-slate-800 rounded-full h-1">
            <div className="bg-brand-500 h-1 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Patient Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center">
              <span className="text-blue-400 font-black text-sm">١</span>
            </div>
            <h3 className="font-bold text-slate-200 text-lg">بيانات المنتفع</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">الرقم القومي <span className="text-red-400">*</span></label>
              <input name="nationalId" value={form.nationalId} onChange={handleChange}
                className="form-input" placeholder="أدخل 14 رقم" maxLength={14} required />
            </div>
            <div>
              <label className="form-label">اسم المنتفع <span className="text-red-400">*</span></label>
              <input name="patientName" value={form.patientName} onChange={handleChange}
                className="form-input" placeholder="الاسم رباعي كامل" required />
            </div>
            <div>
              <label className="form-label">السن</label>
              <input name="patientAge" value={form.patientAge} onChange={handleChange}
                type="number" className="form-input" placeholder="بالسنوات" min={0} max={150} />
            </div>
            <div>
              <label className="form-label">الجنس</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
                <option value="">اختر...</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div>
              <label className="form-label">رقم الهاتف</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="form-input" placeholder="01xxxxxxxxx" />
            </div>
            <div>
              <label className="form-label">الوحدة المحولة</label>
              <input value={unit?.name || ''} disabled className="form-input opacity-60 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Referral Details */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-brand-900/40 border border-brand-700/40 flex items-center justify-center">
              <span className="text-brand-400 font-black text-sm">٢</span>
            </div>
            <h3 className="font-bold text-slate-200 text-lg">بيانات التحويل الطبي</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">التخصص المطلوب <span className="text-red-400">*</span></label>
              <select name="specialty" value={form.specialty} onChange={handleChange} className="form-select" required>
                <option value="">اختر التخصص...</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">الطبيب المحول</label>
              <input name="referringDoctor" value={form.referringDoctor} onChange={handleChange}
                className="form-input" placeholder="د. اسم الطبيب" />
            </div>
            <div>
              <label className="form-label">الجهة المقترحة (اختياري)</label>
              <select name="targetHospitalId" value={form.targetHospitalId} onChange={handleChange} className="form-select">
                <option value="">يحدده المشرف</option>
                {mockHospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">درجة الإلحاح <span className="text-red-400">*</span></label>
              <select name="urgency" value={form.urgency} onChange={handleChange} className="form-select" required>
                <option value="routine">اعتيادي</option>
                <option value="urgent">عاجل</option>
                <option value="emergency">🚨 طارئ — أولوية قصوى</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">الملخص السريري <span className="text-red-400">*</span></label>
              <textarea name="clinicalSummary" value={form.clinicalSummary} onChange={handleChange}
                className="form-input resize-none" rows={3}
                placeholder="وصف موجز للحالة وسبب التحويل..." required />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center">
              <span className="text-purple-400 font-black text-sm">٣</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-lg">المرفقات</h3>
              <p className="text-xs text-slate-500">بطاقة الرقم القومي، كارنيه الانتفاع، التقرير الطبي (O.P)، صور الأشعة</p>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragging ? 'border-brand-500 bg-brand-900/20' : 'border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/30'
            }`}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${isDragging ? 'text-brand-400' : 'text-slate-600'}`} />
            <p className="text-sm font-semibold text-slate-400">اسحب الملفات هنا أو <span className="text-brand-400">اضغط للاختيار</span></p>
            <p className="text-xs text-slate-600 mt-1">PDF, JPG, PNG — حد أقصى 10MB للملف</p>
            <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png" />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300 truncate max-w-xs">{file.name}</p>
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
          )}

          {files.length === 0 && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-amber-900/20 border border-amber-800/30 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">يُفضّل رفع المرفقات الإلزامية (بطاقة + كارنيه + التقرير الطبي) قبل الإرسال لتجنب إعادة الطلب.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            <ChevronLeft className="w-4 h-4" />
            رجوع
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={(e) => handleSubmit(e, true)} className="btn-secondary">
              حفظ كمسودة
            </button>
            <button type="submit" disabled={!requiredFilled} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              إرسال للمراجعة
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
