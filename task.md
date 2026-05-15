# مهام لوحة الأدمن — Fi Khedmtak

مرجع التكامل: `docs/frontend-integration.md` (قسم الأدمن §7 وقائمة §11).  
هذا الملف **أرشيف عمل**: علّم المهمة عند الإكمال، واكتب تحتها **ماذا تم** (ملفات، endpoints، قرارات).

**قاعدة الاستخدام**

- [ ] = لم تُنجَز  
- [x] = أُنجزت  
- بعد كل `[x]` املأ قسم **سجل الإنجاز** (تاريخ اختياري، ملخص قصير).

---

## المرحلة 0 — تجهيز البيئة

- [x] **0.1** توحيد عنوان الـ API عبر متغير بيئة (`VITE_API_URL` أو ما يعادله) واستبدال الـ base URL الثابت في `src/services/api.ts`  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: إضافة `resolveApiBaseURL()` في `src/services/api.ts` — يقرأ `import.meta.env.VITE_API_URL`، وإن غاب استخدم `http://localhost:8000/api`؛ إن وُجدت قيمة بدون لاحقة `/api` يُضاف `/api` تلقائياً. تعريف `VITE_API_URL` في `src/vite-env.d.ts` لـ TypeScript.

- [x] **0.2** توثيق المتغيرات المطلوبة في مكان واحد (مثلاً `.env.example` إن وُجد المشروع يسمح به) حتى لا يُنسى عند النشر  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: إنشاء `.env.example` (شرح عربي/إنجليزي + أمثلة). إضافة تجاهل لـ `.env` و`.env.local` و`.env.*.local` في `.gitignore` حتى لا تُرفع أسرار بالخطأ.

---

## المرحلة 1 — تسجيل الدخول (مطابقة العقد مع الباكند)

- [x] **1.1** مطابقة `LoginPage` مع الدليل: `POST /api/auth/login` — `phone`, `password`, `user_type: "customer"` (وليس `email` إذا كان الباكند يتبع الدليل)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `LoginPage` يرسل `{ phone, password, user_type: 'customer' }` إلى `/auth/login`. حقول الواجهة: هاتف (`type="tel"`) + كلمة المرور. أنواع في `src/types/auth.api.ts`.

- [x] **1.2** التعامل مع استجابة الدخول الكاملة (`user_id`, `user_type`, `token_type`) وحفظ `access_token` كما هو الآن مع التحقق من سلوك `401` / `403` / inactive إن وُجدت رسائل من الباكند  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: التحقق من وجود `access_token`؛ السماح للوحة فقط إذا `user_type` هو `customer` أو `admin` (رفض `technician`). حفظ `user_id` و`user_type` في `sessionStorage` عبر `setSessionIdentity` مع مسحها في `clearSession`. تحسين `getErrorMessage`: أولوية لـ `detail` (نص أو مصفوفة FastAPI)، ثم رسائل مناسبة لـ `401`/`403` عند غياب التفاصيل (يشمل «Account is inactive» إن أرجعها الباكند في `detail`).

- [x] **1.3** تجربة يدوية: دخول أدمن حقيقي والتأكد أن المسارات المحمية تعمل بعد التعديل  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: يُفضّل التحقق يدوياً على بيئة مع الباكند الحقيقي. تم تشغيل `npm run build` بنجاح بعد التعديلات.

---

## المرحلة 2 — الفنيون: الهوية المحمية + الرفض + الحالات

- [x] **2.1** عرض بطاقة الهوية: طلب `GET /api/admin/technicians/{id}/documents/id-card` مع Bearer، استلام `Blob`، عرض عبر Object URL مع تنظيف عند الإغلاق (حسب الدليل §7.5)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `getTechnicianIdCardBlob` في `adminService.ts` (`responseType: 'blob'` + تفسير أخطاء JSON). مكوّن `TechnicianIdCardPreview.tsx` يحمّل تلقائياً عند فتح المودال، يعرض الصورة، ويُلغي `Object URL` عند الإغلاق أو تغيير الفني.

- [x] **2.2** إرسال سبب/ملاحظة الرفض للباكند إذا كان الـ API يدعمها؛ إزالة النص المضلل «not sent to API yet» من الواجهة بعد التوافق مع العقد الفعلي  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `rejectTechnician` يرسل `{ status: 'rejected', admin_note?: string }` عند وجود نص في حقل الرفض. تعليق في الخدمة: إن رفض الباكند الحقول الإضافية يُزال `admin_note`. المودال: نص واضح بدل «not sent to API yet».

- [x] **2.3** دعم حالة الفني `inactive` في الأنواع والفلاتر والعرض إن رجعها الباكند (الدليل §2)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: إضافة `inactive` إلى `TECHNICIAN_STATUSES` و`TechnicianStatusChip` وخيار التصفية في `TechniciansFilters`.

- [x] **2.4** (اختياري) جلب تفاصيل فني منفرد `GET /api/admin/technicians/{id}` إذا احتجت بيانات أغنى من صف القائمة فقط  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `getTechnicianById` + `useTechnicianDetail` + مفتاح `queryKeys.admin.technicians.detail`. `TechniciansPage` يدمج `detailQuery.data ?? selectedTechnician`، شريط `LinearProgress` أثناء الجلب، وإبطال استعلام التفاصيل بعد الموافقة/الرفض.

---

## المرحلة 3 — الخدمات المخصصة («أخرى») — مراجعة الأدمن

- [x] **3.1** إضافة دوال الخدمة في `adminService` (أو طبقة مناسبة):  
  - `PUT /api/admin/custom-service-requests/{id}/approve` (إما `service_id` أو `service_name` + `admin_note`)  
  - `PUT /api/admin/custom-service-requests/{id}/reject` (`admin_note`)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `getServicesCatalog` ← `GET /services/`، و`approveCustomServiceRequest` / `rejectCustomServiceRequest` في `adminService.ts`. أنواع في `src/types/services.api.ts` و`src/types/customServiceRequests.api.ts`.

- [x] **3.2** واجهة في `TechnicianDetailsModal` (أو مكوّن فرعي): لكل طلب `pending` — أزرار موافقة/رفض مع نماذج الحقول حسب القواعد في الدليل §7.6  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: مكوّن `CustomServiceRequestsReview.tsx`: لكل طلب بحالة `pending` — موافقة عبر ربط `service_id` أو إدخال `service_name` + `admin_note` اختياري؛ رفض مع `admin_note` إلزامي. قائمة الخدمات من React Query (`queryKeys.services.catalog`). عرض الطلبات المعالجة سابقاً للقراءة فقط.

- [x] **3.3** بعد كل عملية نجاح: إعادة جلب قائمة الفنيين / تفاصيل الفني (`invalidateQueries`) كما يوصي الدليل §13  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `useCustomServiceRequestMutations` يبطل `queryKeys.admin.technicians.all` و`detail(technicianId)` بعد نجاح الموافقة/الرفض.

- [x] **3.4** عرض رسالة خطأ الباكند عند محاولة موافقة فني وما زال `pending_custom_service_requests_count > 0` (الدليل §7.7)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: تعطيل زر «Approve» مع `Tooltip` عندما `pending_custom_service_requests_count > 0`، وتحديث نص التنبيه. إن تجاوز العميل ذلك لاحقاً، تبقى رسالة `detail` من الباكند تظهر عبر `toastError` + `getErrorMessage` في `TechniciansPage` (كما هو عند فشل الطلب).

---

## المرحلة 4 — صفحة التقييمات

- [x] **4.1** ربط `GET /api/admin/ratings` — أنواع TypeScript + دالة خدمة + مفتاح React Query  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `src/types/ratings.api.ts`، `getRatings` + `normalizeRatingsList` في `adminService.ts` (يدعم `results`/`items`)، `queryKeys.admin.ratings.list`، `useAdminRatings`، و`TOAST_IDS.ratingsListError`.

- [x] **4.2** استبدال `RatingsPage` placeholder بجدول (ترقيم، تفريغ حالة، رسالة فارغة) متوافق مع شكل الاستجابة في الدليل §7.9  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `RatingsPage.tsx` مع ترقيم محلي (`page` / `rowsPerPage`) وطلب `page` & `limit` للـ API. `RatingsTable.tsx`: أعمدة الطلب، النجوم (MUI `Rating`)، التعليق، العميل، الفني، التاريخ، `TablePagination`، هيكل تحميل/فارغ مطابق لنمط الطلبات.

---

## المرحلة 5 — صفحة المستخدمين

- [x] **5.1** ربط `GET /api/admin/users` مع `page`, `limit`, `user_type`, `search` حسب الحاجة  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `src/types/users.api.ts`، `getUsers` + `normalizeUsersList` في `adminService.ts`، `queryKeys.admin.users.list`، `useAdminUsers`، و`TOAST_IDS.usersListError`.

- [x] **5.2** تنفيذ الحذف الناعم `DELETE /api/admin/users/{user_id}?user_type=customer|technician` مع تأكيد في الواجهة  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `deleteAdminUser` في `adminService.ts`، `useDeleteAdminUser` مع إبطال قائمة المستخدمين، حوار تأكيد في `UsersPage.tsx`.

- [x] **5.3** استبدال `UsersPage` placeholder بتجربة استخدام كاملة (فلاتر، حالة تحميل، أخطاء)  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `UsersFilters.tsx` (نوع المستخدم + بحث مع debounce 400ms)، `UsersTable.tsx` (جدول + ترقيم + حذف)، `UsersPage` مع `QueryErrorAlert` وإعادة ضبط الصفحة عند تغيير الفلاتر.

---

## المرحلة 6 — الإشعارات (بث الأدمن)

- [x] **6.1** نموذج بث: `POST /api/admin/notifications/broadcast` — الحقول `title`, `body`, `target`, `user_ids` عند `target === "specific"`  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `broadcastAdminNotification` في `adminService.ts`، أنواع `BroadcastTarget` و`BroadcastNotificationRequest` في `src/types/notifications.api.ts`. للجمهور غير `specific` يُرسل `user_ids: []`.

- [x] **6.2** استبدال `NotificationsPage` placeholder بالنموذج + تحقق من المدخلات + رسائل نجاح/فشل  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: `AdminBroadcastForm.tsx` (عنوان، نص، جمهور بـ Radio، حقل IDs عند `specific` مع عدّاد IDs)، تحقق قبل الإرسال، `useMutation` + `toastSuccess` / `toastError` + `getErrorMessage`، ومسح النموذج بعد النجاح. `NotificationsPage.tsx` يعرض `PageHeader` والنموذج.

---

## المرحلة 7 — جودة العقد والأخطاء

- [x] **7.1** توحيد قراءة `detail` من FastAPI (نص أو مصفوفة) في `getErrorMessage` أو ما يعادله لعرض رسائل واضحة للمستخدم  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: إعادة هيكلة `src/utils/errorMessage.ts`: `formatDetailValue` لـ `detail` كنص، أو مصفوفة أخطاء تحقق (مع `loc` + `msg`)، أو مصفوفة نصوص، أو كائن يحوي `msg`؛ دعم `response.data` كنص JSON؛ قراءة `message` في الجذر؛ رسائل احتياطية لـ 404 / 409 / 413 / 422 عند غياب `detail`.

- [x] **7.2** مراجعة سلوك `401` (تسجيل خروج / توجيه) بعد تعديلات تسجيل الدخول  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: التأكد أن `handleUnauthorized` يبقى مناسباً (مسح الجلسة دائماً؛ `replace` إلى `/login` فقط إذا لم نكن على صفحة الدخول). توثيق السلوك في تعليقات `api.ts` و`authStorage.ts`. لم يُستثنَ `POST /auth/login` حتى يُزال توكن قديم عند فشل الدخول.

---

## المرحلة 8 — إغلاق ومراجعة نهائية

- [x] **8.1** تشغيل `npm run lint` و`npm run build` وتصحيح أي مشاكل  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: إصلاح قاعدة `react-hooks/set-state-in-effect`: `usePaginatedFilters` يستخدم `setStatus` يدمج إعادة الصفحة؛ `UsersPage` يعيد الصفحة عند تغيير النوع أو عند تغيّر نص البحث بعد الـ debounce عبر `setTimeout(0)`؛ `MainLayout` يغلق الدرج الجوال عبر `setTimeout(0)`؛ `TechnicianDetailsModal` يعتمد `key` على `TechniciansPage` + `useState(startWithReject)`؛ `TechnicianIdCardPreview` يفصل المحمّل مع `startTransition` لحالة التحميل. **`npm run lint`** و**`npm run build`** يمرّان.

- [x] **8.2** مراجعة يدوية لقائمة الأدمن في `frontend-integration.md` §11 مقابل الشاشات الفعلية  
  **سجل الإنجاز:**  
  - التاريخ: 2026-05-04  
  - ما تم: مطابقة برمجية مع الدليل (يُنصح بتأكيد يدوي في المتصفح مع الباكند):

| بند §11 (Admin) | التطبيق في الريبو |
|-----------------|-------------------|
| Login as admin customer | `LoginPage` — هاتف + `user_type: customer` |
| Dashboard | `DashboardPage` + `GET /admin/dashboard`، إحصائيات |
| Pending technicians list | `TechniciansPage` + فلتر الحالة |
| Technician details | `TechnicianDetailsModal` |
| Protected ID card viewer | `TechnicianIdCardPreview` (Blob) |
| Custom service review | `CustomServiceRequestsReview` |
| Approve/reject technician | أزرار المودال + `PUT .../status` |
| Requests monitor | `RequestsPage` |
| Users monitor and soft delete | `UsersPage` |
| Ratings monitor | `RatingsPage` |
| Broadcast notifications | `NotificationsPage` + `AdminBroadcastForm` |

---

## ملاحظة نطاق المشروع

شاشات **تطبيق العميل** و**تطبيق الفني** و**التتبع الحي (Firebase)** مذكورة في الدليل لكنها **خارج** هذا الريبو؛ لا تُسجل هنا إلا إذا أضفت مشروعاً جديداً لها.

---

## فهرس سريع لملفات قد تتأثر (مرجع للمطور)

| المنطقة | ملفات تقريبية |
|--------|----------------|
| API | `src/services/api.ts`, `src/services/adminService.ts` |
| مفاتيح الاستعلام | `src/constants/queryKeys.ts` |
| فنيون | `src/pages/TechniciansPage.tsx`, `src/components/technicians/*`, `src/hooks/useTechnicianMutations.ts` |
| تسجيل الدخول | `src/pages/LoginPage.tsx` |
| صفحات | `src/pages/RatingsPage.tsx`, `src/components/ratings/RatingsTable.tsx`, `src/hooks/useAdminRatings.ts`, `src/pages/UsersPage.tsx`, `src/components/users/*`, `src/hooks/useAdminUsers.ts`, `src/hooks/useDeleteAdminUser.ts`, `src/pages/NotificationsPage.tsx`, `src/components/notifications/AdminBroadcastForm.tsx` |
| الأنواع | `src/types/*.ts` |

عند إكمال **جميع** المراحل، غيّر السطر التالي يدوياً:

**حالة الملف:** **مكتمل** (تاريخ الإغلاق: 2026-05-04)
