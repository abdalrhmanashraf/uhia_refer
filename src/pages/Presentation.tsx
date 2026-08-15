import {
  Sparkles, UserCheck, ShieldAlert,
  Building2, GitCompare, XCircle, CheckCircle2,
  Scan, UserPlus, Stethoscope, BarChart3, Users,
  Timer, Receipt, Hospital, Printer, ExternalLink
} from 'lucide-react';

export function Presentation() {
  return (
    <div className="space-y-12 animate-fade-in pb-16 text-slate-100">
      {/* ── Top Header Action ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border-brand-700/40 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-900/80 text-brand-300 border border-brand-700/50 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              وثيقة الرؤية والاستراتيجية والجدوى
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">مشروع مَسار — التحويل الطبي الذكي المباشر</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            الهيئة العامة للتأمين الصحي الشامل — فرع محافظة الأقصر (إدارة المنافذ)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/presentation.html"
            target="_blank"
            rel="noreferrer"
            className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            فتح في صفحة مستقلة كاملة
          </a>
          <button
            onClick={() => window.print()}
            className="btn-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            طباعة العرض
          </button>
        </div>
      </div>

      {/* ── القيادات والجهات الراعية ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
        <div className="glass-card p-4 flex items-center gap-3 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">المدير العام — فرع الأقصر</p>
            <p className="text-sm font-black text-slate-100">د. رحاب عبد الوهاب</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">مدير إدارة المنافذ</p>
            <p className="text-sm font-black text-slate-100">أ. أحمد أمين</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">نطاق التغطية</p>
            <p className="text-sm font-black text-slate-100">69 وحدة + 5 مستشفيات خاصة</p>
          </div>
        </div>
      </div>

      {/* ── 1. رحلة المريض: المقارنة الحتمية (قبل وبعد المنظومة) ───────── */}
      <div className="space-y-4">
        <div className="text-right space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-brand-400" />
            رحلة المنتفع للحصول على كشف أو إجراء طبي استشاري
          </h2>
          <p className="text-xs text-slate-400">الفارق الجوهري بين المسار البيروقراطي المرهق ومسار الرقمنة الذكي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* المسار القديم */}
          <div className="glass-card rounded-3xl p-6 border-rose-900/40 bg-gradient-to-br from-rose-950/20 to-slate-900/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
              <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
                <XCircle className="w-5 h-5" />
                <h3>المسار القديم (إرهاق، تكدس، وتشتت)</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">3 محطات + إهدار وقت</span>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-900/60 border border-rose-700 text-rose-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-100 block">وحدة الرعاية الأولية:</strong>
                  الكشف الأولي مع طبيب الأسرة، وكتابة ورقة إحالة يدوية تتطلب اعتماداً خارجياً.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-900/60 border border-rose-700 text-rose-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-rose-300 block">السفر الشاق لمقر الفرع ومنافذ خدمة العملاء:</strong>
                  اضطرار المريض (خصوصاً كبار السن والمرضى من القرى البعيدة كإسنا وأرمنت) للذهاب لمقر الفرع للحصول على الجواب الورقي، مما يُحدث تكدساً وزحاماً رهيباً.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-900/60 border border-rose-700 text-rose-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-100 block">التوجه للمستشفى المتعاقد دون تنسيق:</strong>
                  الذهاب بدون موعد محدد، مع احتمالية الرفض لعدم توفر طاقة استيعابية، وغياب توثيق ما تم للمريض في ملفه الطبي الإلكتروني بهيئة الرعاية الصحية!
                </div>
              </div>
            </div>
          </div>

          {/* المسار الجديد */}
          <div className="glass-card rounded-3xl p-6 border-brand-700/50 bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-900 space-y-4 shadow-xl shadow-brand-950/50">
            <div className="flex items-center justify-between pb-3 border-b border-brand-800/40">
              <div className="flex items-center gap-2 text-brand-400 font-black text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <h3>مسار منظومة "مَسار" الذكية (صفر تكدس)</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-900 text-brand-300 border border-brand-700">محطة واحدة فورية</span>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-900 border border-brand-500 text-brand-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white block">من وحدة الرعاية الأولية مباشرة:</strong>
                  يسجل أخصائي الوحدة طلب التحويل بالرقم القومي مع رفع التقرير الطبي والتشخيص السريري إلكترونياً.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-900 border border-brand-500 text-brand-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-brand-300 block">مراجعة وتوجيه لحظي بإدارة المنافذ:</strong>
                  يقوم مدير إدارة المنافذ بمراجعة الجواب وتوجيهه لأفضل مستشفى متعاقد (كليوباترا، الندى، رؤية، العيون الدولي، الكمال) بضغطة زر واحدة.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-900 border border-brand-500 text-brand-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white block">توجه مباشر للمستشفى في موعد محدد:</strong>
                  يذهب المنتفع للمستشفى المتعاقد مباشرة التي تستقبله بناءً على قبول إلكتروني مسبق، مع توثيق كافة الإجراءات والعمليات بالكامل!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. سد الفجوة الرقمية مع هيئة الرعاية الصحية ────────────────── */}
      <div className="glass-card rounded-3xl p-7 border-amber-600/40 bg-gradient-to-l from-amber-950/30 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
          <ShieldAlert className="w-5 h-5" />
          <span>سد الفجوة الرقمية الحرجة (Closing The Medical Record Gap)</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white">
          أين تكمن المشكلة الكبرى حالياً في العمليات والإجراءات الطبية بالقطاع الخاص؟
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          عندما يقوم المريض بإجراء طبي أو جراحي داخل مستشفى متعاقد خاص (مثل: <span className="text-amber-300 font-bold">استئصال الزائدة الدودية، جراحات العيون المتقدمة، القساطر التداخلية، مناظير الجهاز الهضمي</span>)، فإن <strong className="text-red-400 underline decoration-red-500">سيستم هيئة الرعاية الصحية لا يُسجل عليه أي بيانات عن هذا الإجراء</strong>!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-700/30 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-amber-400" />
              النتيجة السابقة الخطيرة
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              فقدان التاريخ المرضي للمريض داخل ملفه الطبي بوحدة الرعاية الأولية، وصعوبة المتابعة بعد الخروج، وتكرار التحاليل والأشعات دون داعٍ، وغياب الرقابة على مطالبات المستشفيات.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-950/70 border border-brand-700/40 space-y-1.5">
            <h4 className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              الحل الجذري عبر منظومة "مَسار"
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              تتبع خط سير المريض لحظياً، والحصول على بيان دقيق وتوثيق رسمي للإجراء الطبي المنفذ بالمستشفى، لإدراجه فوراً في ملف المنتفع الإلكتروني بالوحدة الصحية التابع لها.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. ما الذي تحدده المنظومة بدقة بالغة؟ ──────────────────────── */}
      <div className="space-y-4">
        <div className="text-right space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-brand-400" />
            المؤشرات والمحددات الدقيقة التي توفرها المنظومة لصانع القرار
          </h2>
          <p className="text-xs text-slate-400">بيانات وتحليلات استقصائية وتشغيلية تدعم اتخاذ القرار</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">من يبدأ الخدمة في المستشفى مباشرة؟</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              كشف وتحديد المرضى الذين يتوجهون للمستشفيات المتعاقدة دون المرور بالمسار الطبي الإلزامي بوحدات الرعاية الأولية، لضبط حوكمة الإحالة.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">من يُجري تدخلاً دون كشف استشاري؟</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              حصر دقيق لكافة الإجراءات والعمليات الجراحية التي تتم دون استشارة طبية مسبقة، لمنع التدخلات غير المبررة طبياً وحماية المنتفع وهيئة التأمين.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">معدلات التردد على المستشفيات الـ 5</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              قياس معدل التردد وتوزيع الحالات بعدالة بين المستشفيات المتعاقدة (كليوباترا، الندى، رؤية، العيون الدولي، الكمال) لتفادي تكدس جهة دون أخرى.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">التركيبة الديموغرافية والفئات العمرية</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحليل دقيق لأعمار ونوع المنتفعين الأكثر طلباً للتحويلات المتعاقدة، مما يساعد في التخطيط الصحي الاستراتيجي وتوسيع التخصصات المطلوبة.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400">
              <Timer className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">متوسط سرعة إنجاز الكشف الطبي</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              حساب الوقت المستغرق بالساعات والدقائق من لحظة إنشاء الطلب بالوحدة ➔ مروره بالمراجعة ➔ قبول المستشفى ➔ تقديم الخدمة الطبية للمنتفع.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-teal-400">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">مطابقة ومطالبات مالية منضبطة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              توفير سجل إلكتروني مشفر لكل حالة، بحيث لا يمكن للمستشفى تقديم مطالبة مالية دون وجود أمر إحالة وقبول معتمد إلكترونياً بالمنظومة.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. شبكة المستشفيات الـ 5 المعتمدة ────────────────────────────── */}
      <div className="space-y-4">
        <div className="text-right space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Hospital className="w-6 h-6 text-brand-400" />
            شبكة مقدمي الخدمة المتعاقدين المعتمدة بالأقصر
          </h2>
          <p className="text-xs text-slate-400">المستشفيات الـ 5 الحصرية المعتمدة للتوجيه والإحالة داخل المنظومة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-700/40 flex items-center justify-center text-brand-400 font-black text-sm">
              01
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">مستشفى كليوباترا</h4>
              <p className="text-[11px] text-slate-400">الأقصر • جراحة، قسطرة، أورام، باطنة</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-700/40 flex items-center justify-center text-brand-400 font-black text-sm">
              02
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">مستشفى الندى</h4>
              <p className="text-[11px] text-slate-400">الأقصر • نساء وتوليد، حضانات، جراحة عامة</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-700/40 flex items-center justify-center text-brand-400 font-black text-sm">
              03
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">مركز رؤية للعيون</h4>
              <p className="text-[11px] text-slate-400">الأقصر • جراحات الشبكية، الفاكو، الليزك</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-700/40 flex items-center justify-center text-brand-400 font-black text-sm">
              04
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">مستشفى العيون الدولي</h4>
              <p className="text-[11px] text-slate-400">الأقصر • جراحات العيون المتقدمة والمياه البيضاء</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-slate-800 flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-700/40 flex items-center justify-center text-brand-400 font-black text-sm">
              05
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">مستشفى الكمال</h4>
              <p className="text-[11px] text-slate-400">الأقصر • عظام، جراحة مسالك، باطنة متخصصة</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. بطاقات العائد الاستراتيجي ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-1">
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</p>
          <h4 className="text-xs font-bold text-slate-200">إلغاء التكدس بمقر الفرع</h4>
          <p className="text-[10px] text-slate-500">لا حاجة لانتقال المواطن لطلب خطاب إحالة</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-1">
          <p className="text-2xl sm:text-3xl font-black text-brand-400 font-mono">69 وحدة</p>
          <h4 className="text-xs font-bold text-slate-200">تغطية شاملة لمحافظة الأقصر</h4>
          <p className="text-[10px] text-slate-500">ربط مراكز الأقصر، إسنا، أرمنت، البياضية والقرنة</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-1">
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">&lt; 15 دقيقة</p>
          <h4 className="text-xs font-bold text-slate-200">زمن الاعتماد والتوجيه</h4>
          <p className="text-[10px] text-slate-500">مراجعة رقمية لحظية دون تأخير ورقي</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-1">
          <p className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">Real-time</p>
          <h4 className="text-xs font-bold text-slate-200">مزامنة سحابية متعددة الأجهزة</h4>
          <p className="text-[10px] text-slate-500">تحديث حي لحظي للجميع</p>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-3">
        <p className="font-bold text-slate-300 text-sm">منظومة مَسار — الهيئة العامة للتأمين الصحي الشامل (فرع محافظة الأقصر)</p>
        <p className="text-xs text-slate-400">إدارة المنافذ • منظومة التحويل الطبي الذكي</p>
        
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/90 border border-brand-500/40 shadow-lg shadow-brand-950/50">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          <span className="font-mono text-xs font-bold text-slate-300">
            Designed &amp; Developed by <strong className="text-brand-400 font-extrabold">Abdalrhman Ashraf</strong> • 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
