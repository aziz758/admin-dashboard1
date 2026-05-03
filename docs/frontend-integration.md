# Frontend Integration Guide

هذا الدليل هو المرجع العملي لربط الواجهة مع Backend مشروع `Fi Khedmtak`.

الهدف منه أن يعرف مطور الواجهة:
- ما هي الشاشات المطلوبة.
- أي endpoints يستخدم لكل شاشة.
- ما هي صيغ الطلبات والاستجابات.
- ما الفرق بين عرض الفنيين حسب التقييم وبين التتبع الحي.
- كيف تتم دورة الفني، العميل، والأدمن.

آخر قراءة للكود تمت على نسخة المشروع الحالية بعد مهام:
- المناطق والمحافظات.
- عرض أفضل الفنيين حسب المنطقة والتقييم.
- حماية ملفات الفني.
- دورة خدمة `أخرى` للفني مع مراجعة الأدمن.
- منع اعتماد الفني قبل مراجعة الخدمات المخصصة.

---

## 1. Base Contract

### Base URL
في التطوير المحلي غالبا:

```text
http://localhost:8000
```

كل مسارات API تبدأ غالبا بـ:

```text
/api
```

### Headers
كل endpoint محمي يحتاج:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

رفع الملفات يستخدم:

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Auth Model
الـ backend يستخدم JWT.

بعد login أو registration يرجع:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 1,
  "user_type": "customer"
}
```

خزن `access_token` بشكل آمن في الواجهة.

### User Types

```text
customer
technician
admin
```

ملاحظة مهمة:
- الأدمن في الكود الحالي يتم التعرف عليه من جدول `customers` إذا كان لديه `is_admin = 1`.
- تسجيل دخول الأدمن يكون غالبا كـ `customer`، وبعد التحقق من التوكن يرجعه النظام داخليا كـ `admin`.

### Common Errors

```json
{
  "detail": "Token is required"
}
```

```json
{
  "detail": "Invalid token"
}
```

```json
{
  "detail": "Account is inactive"
}
```

```json
{
  "detail": "Invalid or expired registration token"
}
```

الواجهة يجب أن تتعامل مع:
- `400`: خطأ بيانات أو حالة غير مسموحة.
- `401`: توكن مفقود أو غير صالح.
- `403`: صلاحية غير كافية أو حساب inactive.
- `404`: مورد غير موجود.
- `409`: تعارض في حالة المستخدم أو الطلب.
- `413`: صورة أكبر من الحد المسموح.
- `422`: خطأ validation من FastAPI/Pydantic.

---

## 2. Status Values

### Technician Account Status

```text
pending_documents
pending_approval
approved
rejected
inactive
```

المعنى في الواجهة:
- `pending_documents`: الفني سجل لكن لم يرفع الصور/الوثائق.
- `pending_approval`: الفني رفع الوثائق وينتظر مراجعة الأدمن.
- `approved`: الفني مقبول ويمكنه استقبال الطلبات.
- `rejected`: تم رفض الفني.
- `inactive`: حساب معطل.

### Technician Availability

```text
offline
available
busy
on_break
```

المعنى:
- `offline`: ليس جاهزا للاستقبال أو موقعه غير حديث.
- `available`: جاهز للاستقبال وموقعه حديث.
- `busy`: لديه طلب نشط.
- `on_break`: أوقف استقبال الطلبات مؤقتا.

### Request Status

```text
pending
assigned
accepted
completed
cancelled
```

المسار الطبيعي:

```text
pending -> assigned -> accepted -> completed
```

الإلغاء ممكن من:

```text
pending -> cancelled
assigned -> cancelled
accepted -> cancelled
```

---

## 3. Public and System Endpoints

### Health

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

### Services

```http
GET /api/services/
```

Response:

```json
[
  {
    "id": 1,
    "name": "Electrician"
  }
]
```

استخدمها في:
- تسجيل الفني.
- إنشاء الطلب.
- مراجعة الأدمن لخدمة `أخرى`.

### Locations

#### Governorates

```http
GET /api/locations/governorates
GET /api/locations/governorates?include_inactive=true
```

Response:

```json
[
  {
    "id": 4,
    "name_ar": "تعز",
    "name_en": "Taiz",
    "is_active": true
  }
]
```

#### Districts

```http
GET /api/locations/districts?governorate_id=4
GET /api/locations/districts?governorate_id=4&include_inactive=true
```

Response:

```json
[
  {
    "id": 28,
    "governorate_id": 4,
    "name_ar": "القاهرة",
    "name_en": "Al Qahirah",
    "is_active": true
  }
]
```

قاعدة مهمة:
- إذا أرسلت `district_id` لازم ترسل `governorate_id`.
- `district_id` يجب أن يتبع نفس المحافظة.

---

## 4. Auth and Registration Flow

### 4.1 Send OTP

```http
POST /api/auth/send-otp
```

Body:

```json
{
  "phone": "0501234567",
  "user_type": "customer"
}
```

`user_type`:

```text
customer
technician
```

Response:

```json
{
  "message": "Verification code sent"
}
```

### 4.2 Verify OTP

```http
POST /api/auth/verify-otp
```

Body:

```json
{
  "phone": "0501234567",
  "code": "1234",
  "user_type": "customer"
}
```

إذا الرقم مسجل:

```json
{
  "verified": true,
  "registered": true,
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 1,
  "user_type": "customer"
}
```

إذا الرقم غير مسجل:

```json
{
  "verified": true,
  "registered": false,
  "phone": "0501234567",
  "registration_token": "..."
}
```

الواجهة يجب أن تحفظ `registration_token` مؤقتا وتستخدمه في التسجيل.

### 4.3 Register Customer

```http
POST /api/auth/register/customer
```

Body:

```json
{
  "name": "Customer Name",
  "phone": "0501234567",
  "password": "secret123",
  "registration_token": "...",
  "governorate_id": 4,
  "district_id": 28,
  "address_details": "Near main street"
}
```

الحقول الاختيارية:
- `governorate_id`
- `district_id`
- `address_details`

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 1,
  "user_type": "customer"
}
```

### 4.4 Register Technician

```http
POST /api/auth/register/technician
```

Body مع خدمات رسمية فقط:

```json
{
  "name": "Technician Name",
  "phone": "0501234567",
  "password": "secret123",
  "registration_token": "...",
  "service_ids": [1, 2]
}
```

Body مع خيار `أخرى`:

```json
{
  "name": "Technician Name",
  "phone": "0501234567",
  "password": "secret123",
  "registration_token": "...",
  "service_ids": [1],
  "custom_service_name": "تصليح ابواب زجاج"
}
```

إذا اختار الفني `أخرى` فقط بدون أي خدمة رسمية، أرسل:

```json
{
  "name": "Technician Name",
  "phone": "0501234567",
  "password": "secret123",
  "registration_token": "...",
  "service_ids": [],
  "custom_service_name": "تنظيف ألواح شمسية"
}
```

قواعد مهمة لخيار `أخرى`:
- `أخرى` خيار في الواجهة فقط.
- لا ترسل `أخرى` كـ `service_id`.
- أرسل النص في `custom_service_name`.
- `other_service_name` مقبول كـ alias، لكن استخدم `custom_service_name` في الكود الجديد.
- الخدمة المخصصة لا تظهر للعملاء إلا بعد موافقة الأدمن.

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 2,
  "user_type": "technician"
}
```

بعد تسجيل الفني:
- `status = pending_documents`
- `availability_status = offline`

### 4.5 Login

```http
POST /api/auth/login
```

Body:

```json
{
  "phone": "0501234567",
  "password": "secret123",
  "user_type": "customer"
}
```

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user_id": 1,
  "user_type": "customer"
}
```

### 4.6 Reset Password

```http
POST /api/auth/reset-password
```

Body:

```json
{
  "phone": "0501234567",
  "code": "1234",
  "new_password": "newsecret123",
  "user_type": "customer"
}
```

`user_type` اختياري. إذا لم ترسله، يحاول النظام على `customer` ثم `technician`.

### 4.7 Change Password

```http
POST /api/auth/change-password
```

Requires auth.

Body:

```json
{
  "current_password": "secret123",
  "new_password": "newsecret123"
}
```

### 4.8 Update FCM Token

```http
POST /api/auth/update-fcm-token
```

Requires auth.

Body:

```json
{
  "fcm_token": "device-fcm-token"
}
```

استخدمه بعد تسجيل الدخول أو بعد تحديث token من Firebase Messaging.

---

## 5. Customer App

### 5.1 Customer Profile

#### Get Profile

```http
GET /api/customer/profile/me
```

Requires customer token.

Response:

```json
{
  "id": 1,
  "name": "Customer Name",
  "phone": "0501234567",
  "status": "active",
  "lat": 14.8282,
  "lng": 42.97,
  "governorate_id": 4,
  "governorate_name": "تعز",
  "district_id": 28,
  "district_name": "القاهرة",
  "address_details": "Near main street",
  "created_at": "2026-04-30T10:00:00"
}
```

#### Update Profile

```http
PUT /api/customer/profile/me
```

Body, send only fields you want to update:

```json
{
  "name": "New Name",
  "lat": 14.8282,
  "lng": 42.97,
  "governorate_id": 4,
  "district_id": 28,
  "address_details": "Near main street"
}
```

### 5.2 Browse Technicians by Rating and Area

استخدم هذا endpoint لشاشة العميل التي تعرض فنيين حسب الخدمة والمنطقة والتقييم.

```http
GET /api/technicians/top?service_id=1&governorate_id=4&district_id=28&limit=20
```

Parameters:
- `service_id`: required.
- `governorate_id`: optional.
- `district_id`: optional, requires `governorate_id`.
- `limit`: optional, default `20`, max `50`.

Response:

```json
{
  "results": [
    {
      "id": 2,
      "name": "Ahmed",
      "phone": "0500000000",
      "status": "approved",
      "availability_status": "offline",
      "profile_photo_url": "/uploads/technician_profiles/example.jpg",
      "services": [
        {
          "id": 1,
          "name": "Electrician"
        }
      ],
      "governorate_id": 4,
      "governorate_name": "تعز",
      "district_id": 28,
      "district_name": "القاهرة",
      "address_details": "Near main street",
      "avg_rating": 4.5,
      "total_ratings": 12,
      "area_avg_rating": 4.7,
      "area_total_ratings": 5,
      "positive_comment_count": 4,
      "positive_comments_scope": "area",
      "positive_comments": [
        {
          "id": 10,
          "request_id": 55,
          "score": 5.0,
          "comment": "فني ممتاز",
          "created_at": "2026-04-30T10:00:00"
        }
      ],
      "area_match": "primary_district",
      "acceptance_rate": 0.8,
      "completion_rate": 0.9,
      "ranking_score": 340.2
    }
  ],
  "total": 1,
  "limit": 20
}
```

مهم جدا:
- هذا endpoint لا يشترط أن الفني متصل.
- لا يشترط تحديث live location.
- مناسب للاستعراض والاختيار حسب السمعة.

لا تستخدم `/api/technicians/nearby` لهذه الشاشة.

### 5.3 Nearby Technicians

```http
GET /api/technicians/nearby?service_id=1&customer_lat=14.8282&customer_lng=42.9700
```

استخدمه فقط إذا تريد فنيين متاحين الآن حسب الموقع الحي.

شروطه صارمة:
- فني approved.
- availability = available.
- موقعه حديث خلال `TECHNICIAN_LOCATION_TTL_MINUTES`.
- داخل المسافة.
- داخل وقت العمل.
- لا يملك طلب accepted.

Response:

```json
[
  {
    "id": 2,
    "name": "Ahmed",
    "phone": "0500000000",
    "status": "approved",
    "availability_status": "available",
    "profile_photo_url": "/uploads/technician_profiles/example.jpg",
    "lat": 14.8282,
    "lng": 42.97,
    "avg_rating": 4.5,
    "distance_km": 2.4,
    "service_radius_km": 20,
    "work_start_time": "08:00",
    "work_end_time": "18:00",
    "work_days": [0, 1, 2, 3, 4],
    "acceptance_rate": 0.8,
    "completion_rate": 0.9,
    "priority_score": 0.84
  }
]
```

### 5.4 Upload Request Image

```http
POST /api/uploads/request-image/
```

Requires auth.

Form field:

```text
file
```

أو:

```text
image
```

Response:

```json
{
  "image_url": "/uploads/example.jpg",
  "url": "/uploads/example.jpg"
}
```

Allowed:
- JPG/JPEG.
- PNG.
- WebP.
- Max size: `5 MB`.

### 5.5 Create Request

```http
POST /api/requests/
```

Requires customer token.

Body:

```json
{
  "note": "المكيف لا يعمل",
  "image_url": "/uploads/example.jpg",
  "service_ids": [1],
  "lat": 14.8282,
  "lng": 42.97,
  "address": "Taiz, main street",
  "governorate_id": 4,
  "district_id": 28
}
```

Optional:
- `note`
- `image_url`
- `lat`
- `lng`
- `address`
- `governorate_id`
- `district_id`

Required:
- `service_ids`: non-empty array.

إذا لم ترسل منطقة، يحاول backend استخدام منطقة العميل المحفوظة.

Response:

```json
{
  "id": 44,
  "customer_id": 1,
  "note": "المكيف لا يعمل",
  "image_url": "/uploads/example.jpg",
  "status": "assigned",
  "service_ids": [1],
  "service_type_names": ["Electrician"],
  "service_id": 1,
  "lat": 14.8282,
  "lng": 42.97,
  "address": "Taiz, main street",
  "governorate_id": 4,
  "governorate_name": "تعز",
  "district_id": 28,
  "district_name": "القاهرة",
  "assigned_technician_id": 2,
  "assigned_technician_name": "Ahmed",
  "assigned_technician_rating": 4.5,
  "assigned_technician_avatar": "/uploads/technician_profiles/example.jpg",
  "assigned_at": "2026-04-30 10:00:00",
  "accepted_at": null,
  "completed_at": null,
  "google_maps_directions_url": "https://www.google.com/maps/dir/?api=1&destination=14.828200,42.970000",
  "apple_maps_directions_url": "http://maps.apple.com/?daddr=14.828200,42.970000&dirflg=d",
  "google_navigation_uri": "google.navigation:q=14.828200,42.970000",
  "geo_navigation_uri": "geo:14.828200,42.970000?q=14.828200,42.970000"
}
```

ملاحظات:
- لا ترسل `wrapped`.
- `RequestCreate` يمنع الحقول الزائدة.
- النظام يحاول إسناد الطلب مباشرة لفني مناسب.
- إذا لا يوجد فني مناسب قد يبقى `pending` أو يتم التعامل معه حسب منطق الإسناد.

### 5.6 List My Requests

```http
GET /api/requests/?page=1&limit=20
GET /api/requests/?status=accepted&page=1&limit=20
```

Requires customer or technician token.

Response:

```json
{
  "results": [],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

Valid status filters:

```text
pending
assigned
accepted
completed
cancelled
```

### 5.7 Request Details

```http
GET /api/requests/{request_id}
```

Access:
- Customer owner.
- Assigned technician or technician with assignment history for that request.
- Admin.

### 5.8 Cancel Request

```http
POST /api/requests/{request_id}/cancel
```

Body:

```json
{
  "reason": "Customer no longer needs service"
}
```

### 5.9 Rate Request

```http
POST /api/requests/{request_id}/rate
```

Requires customer token.

Body:

```json
{
  "rating": 5,
  "comment": "فني ممتاز وسريع"
}
```

Rules:
- Only completed requests can be rated.
- Rating range: `1` to `5`.
- If already rated, backend returns existing request response.
- Rating is linked to the request, so `/api/technicians/top` can calculate area reputation.

---

## 6. Technician App

### 6.1 Profile Status

```http
GET /api/technician/profile/status
```

Response:

```json
{
  "status": "pending_documents"
}
```

Use this after login to route technician:
- `pending_documents`: document upload screen.
- `pending_approval`: waiting review screen.
- `approved`: dashboard.
- `rejected`: rejected screen.

### 6.2 Get Profile

```http
GET /api/technician/profile/me
```

Response:

```json
{
  "id": 2,
  "name": "Technician Name",
  "phone": "0501234567",
  "status": "approved",
  "availability_status": "offline",
  "lat": 14.8282,
  "lng": 42.97,
  "governorate_id": 4,
  "governorate_name": "تعز",
  "district_id": 28,
  "district_name": "القاهرة",
  "address_details": "Near main street",
  "location_updated_at": "2026-04-30T10:00:00",
  "service_radius_km": 20,
  "work_start_time": "08:00",
  "work_end_time": "18:00",
  "work_days": [0, 1, 2, 3, 4],
  "avg_rating": 4.5,
  "total_ratings": 12,
  "acceptance_rate": 0.8,
  "completion_rate": 0.9,
  "profile_photo_url": "/uploads/technician_profiles/example.jpg",
  "id_card_photo_url": "/api/technician/profile/documents/id-card"
}
```

### 6.3 Upload Documents

```http
POST /api/technician/profile/documents
```

Requires technician token.

Multipart fields:

```text
profile_photo
id_card_photo
```

Response:

```json
{
  "success": true,
  "status": "pending_approval"
}
```

Important:
- `profile_photo` is public.
- `id_card_photo` is protected.
- After upload, technician status becomes `pending_approval`.

### 6.4 View Own ID Document

```http
GET /api/technician/profile/documents/id-card
```

Hidden from OpenAPI but available.

Frontend should fetch it with bearer token as Blob, then render object URL.

### 6.5 Update Primary Area

```http
PUT /api/technician/profile/area
```

Body:

```json
{
  "governorate_id": 4,
  "district_id": 28,
  "address_details": "Near main street"
}
```

Response: technician profile.

### 6.6 Service Areas

الفني يمكنه تحديد مناطق يخدمها.

#### List

```http
GET /api/technician/profile/service-areas
```

Response:

```json
[
  {
    "id": 1,
    "governorate_id": 4,
    "governorate_name": "تعز",
    "district_id": null,
    "district_name": null,
    "scope": "governorate"
  }
]
```

#### Replace

```http
PUT /api/technician/profile/service-areas
```

Body:

```json
{
  "service_areas": [
    {
      "governorate_id": 4,
      "district_id": null
    },
    {
      "governorate_id": 2,
      "district_id": 15
    }
  ]
}
```

Rules:
- Max `50` areas.
- Duplicates are rejected.
- Governorate-level area cannot overlap with district-level areas in same governorate.

### 6.7 Work Settings

```http
PUT /api/technician/profile/work-settings
```

Body:

```json
{
  "service_radius_km": 20,
  "work_start_time": "08:00",
  "work_end_time": "18:00",
  "work_days": [0, 1, 2, 3, 4]
}
```

Rules:
- Technician must be `approved`.
- `service_radius_km`: `> 0` and `<= 200`.
- `work_days`: `0 = Monday` through `6 = Sunday`.
- Time format: `HH:MM`.

### 6.8 Update Live Location

```http
PUT /api/technician/profile/location
```

Body:

```json
{
  "lat": 14.8282,
  "lng": 42.97
}
```

Response:

```json
{
  "success": true,
  "lat": 14.8282,
  "lng": 42.97,
  "location_updated_at": "2026-04-30T10:00:00",
  "availability_status": "available"
}
```

Frontend recommendation:
- Send location periodically while technician is available.
- During an accepted job, send every `15-30` seconds for live tracking.
- The backend uses TTL default `5 minutes`.

### 6.9 Update Availability

```http
PUT /api/technician/profile/availability
```

Body:

```json
{
  "availability_status": "available"
}
```

Or:

```json
{
  "availability_status": "on_break"
}
```

Rules:
- Only approved technicians can update availability.
- Cannot change availability while `busy`.
- To switch to `available`, technician must have fresh live location.
- If not fresh, backend returns:

```json
{
  "detail": "Live location is required before switching to available"
}
```

### 6.10 Technician Requests

Use:

```http
GET /api/requests/?status=assigned
GET /api/requests/?status=accepted
GET /api/requests/?status=completed
```

Technician visibility rules:
- If on break, new offers are hidden.
- If live location is stale, new assignments are hidden; active jobs remain visible.

### 6.11 Accept Request

```http
POST /api/requests/{request_id}/accept
```

Rules:
- Technician must have fresh live location.
- Request must be assigned to this technician.
- Technician cannot have another active accepted request.
- On success, technician becomes `busy`.

Possible error:

```json
{
  "detail": "Live location is required before accepting requests. Please update your location."
}
```

### 6.12 Reject Request

```http
POST /api/requests/{request_id}/reject
```

Body:

```json
{
  "reason": "Too far"
}
```

Rules:
- `reason` required.
- Backend tries to reassign request to another technician.

### 6.13 Complete Request

```http
POST /api/requests/{request_id}/complete
```

Body:

```json
{
  "report": "تم إصلاح المشكلة"
}
```

Rules:
- Request must be assigned to technician.
- Request transitions to completed.
- Technician availability becomes `available` if location fresh, otherwise `offline`.

---

## 7. Admin App

All admin endpoints require admin token.

### 7.1 Dashboard

```http
GET /api/admin/dashboard
```

Response includes:

```json
{
  "statistics": {},
  "recent_requests": [],
  "pending_technicians": [],
  "recent_ratings": []
}
```

Use `pending_technicians` for review list.

### 7.2 Statistics

```http
GET /api/admin/statistics
```

Response:

```json
{
  "total_customers": 10,
  "total_technicians": 5,
  "pending_approval_count": 2,
  "total_requests": 30,
  "completed_requests": 20,
  "cancelled_requests": 3,
  "pending_requests": 4,
  "assigned_requests": 3,
  "avg_rating_platform": 4.4
}
```

### 7.3 Technicians List

```http
GET /api/admin/technicians?page=1&limit=20
GET /api/admin/technicians?status=pending_approval&page=1&limit=20
```

Response:

```json
{
  "results": [
    {
      "id": 2,
      "name": "Technician Name",
      "phone": "0501234567",
      "status": "pending_approval",
      "availability_status": "offline",
      "avg_rating": 0,
      "total_ratings": 0,
      "acceptance_rate": 0,
      "completion_rate": 0,
      "profile_photo_url": "/uploads/technician_profiles/example.jpg",
      "id_card_photo_url": "/api/admin/technicians/2/documents/id-card",
      "service_radius_km": 0,
      "work_start_time": "",
      "work_end_time": "",
      "work_days": [],
      "services": ["Electrician"],
      "pending_custom_service_requests_count": 1,
      "custom_service_requests": [
        {
          "id": 7,
          "requested_name": "تصليح ابواب زجاج",
          "status": "pending",
          "approved_service_id": null,
          "approved_service_name": "",
          "admin_note": "",
          "created_at": "2026-04-30 10:00:00",
          "reviewed_at": ""
        }
      ],
      "created_at": "2026-04-30 10:00:00"
    }
  ],
  "total": 1,
  "page": 1
}
```

### 7.4 Technician Detail

```http
GET /api/admin/technicians/{technician_id}
```

Same serialized technician shape as admin list item.

### 7.5 View Technician ID Document

```http
GET /api/admin/technicians/{technician_id}/documents/id-card
```

Hidden from OpenAPI but available.

Frontend:
- fetch with bearer token.
- render as Blob/object URL.
- handle `404`.

### 7.6 Review Custom Service Requests

Custom service request statuses:

```text
pending
approved
rejected
```

#### Approve with Existing Service

```http
PUT /api/admin/custom-service-requests/{service_request_id}/approve
```

Body:

```json
{
  "service_id": 1,
  "admin_note": "Linked to existing service"
}
```

#### Approve with New Official Service Name

```http
PUT /api/admin/custom-service-requests/{service_request_id}/approve
```

Body:

```json
{
  "service_name": "تركيب وصيانة أبواب زجاج",
  "admin_note": "Normalized technician wording"
}
```

Rules:
- Send exactly one of `service_id` or `service_name`.
- If service name already exists, backend reuses it.
- On approval, backend links technician through `technician_services`.

Response:

```json
{
  "id": 7,
  "requested_name": "تصليح ابواب زجاج",
  "status": "approved",
  "approved_service_id": 12,
  "approved_service_name": "تركيب وصيانة أبواب زجاج",
  "admin_note": "Normalized technician wording",
  "created_at": "2026-04-30 10:00:00",
  "reviewed_at": "2026-04-30 10:05:00"
}
```

#### Reject

```http
PUT /api/admin/custom-service-requests/{service_request_id}/reject
```

Body:

```json
{
  "admin_note": "Service is not supported right now"
}
```

Rules:
- Rejection does not create a service link.
- Reviewed request cannot be reviewed again.

### 7.7 Update Technician Account Status

```http
PUT /api/admin/technicians/{technician_id}/status
```

Body:

```json
{
  "status": "approved"
}
```

Allowed values:

```text
approved
rejected
pending_approval
pending_documents
```

Important:
- If technician has pending custom service requests, approving is blocked.

Error:

```json
{
  "detail": "Review pending custom service requests before approving technician"
}
```

Recommended admin sequence:
1. Open technician details.
2. Review ID card image.
3. Review every `custom_service_requests` item with `status = pending`.
4. Approve/reject custom service requests.
5. Refresh technician details.
6. Approve account only when `pending_custom_service_requests_count = 0`.

### 7.8 Admin Requests

```http
GET /api/admin/requests?page=1&limit=20
GET /api/admin/requests?status=accepted&page=1&limit=20
```

Response:

```json
{
  "results": [
    {
      "id": 44,
      "status": "accepted",
      "note": "المكيف لا يعمل",
      "image_url": "/uploads/example.jpg",
      "address": "Taiz",
      "lat": 14.8282,
      "lng": 42.97,
      "created_at": "2026-04-30 10:00:00",
      "customer_id": 1,
      "customer_name": "Customer Name",
      "customer_phone": "0501111111",
      "technician_id": 2,
      "technician_name": "Technician Name",
      "technician_phone": "0502222222",
      "services": ["Electrician"],
      "customer_rating": 0,
      "technician_report": "",
      "latest_reject_reason": "",
      "latest_rejected_at": ""
    }
  ],
  "total": 1,
  "page": 1
}
```

### 7.9 Ratings

```http
GET /api/admin/ratings
```

Response:

```json
{
  "results": [
    {
      "request_id": 44,
      "rating": 5,
      "comment": "",
      "customer_name": "Customer Name",
      "customer_phone": "0501111111",
      "technician_name": "Technician Name",
      "technician_phone": "0502222222",
      "created_at": "2026-04-30 10:00:00"
    }
  ],
  "total": 1
}
```

### 7.10 Notifications Broadcast

```http
POST /api/admin/notifications/broadcast
```

Body:

```json
{
  "title": "Update",
  "body": "New platform update",
  "target": "all",
  "user_ids": []
}
```

Target values:

```text
all
customers
technicians
specific
```

If `target = specific`, `user_ids` is required.

### 7.11 Users

```http
GET /api/admin/users?page=1&limit=20
GET /api/admin/users?user_type=customer&search=ali&page=1&limit=20
```

Response:

```json
{
  "results": [
    {
      "id": 1,
      "name": "User Name",
      "phone": "0501234567",
      "user_type": "customer",
      "status": "active",
      "created_at": "2026-04-30 10:00:00"
    }
  ],
  "total": 1,
  "page": 1
}
```

Soft delete:

```http
DELETE /api/admin/users/{user_id}?user_type=customer
```

For technicians, soft delete also sets availability to `offline`.

---

## 8. Notifications

All notification endpoints require auth.

### List

```http
GET /api/notifications/?page=1&limit=20
GET /api/notifications/?unread_only=1&page=1&limit=20
```

Response:

```json
{
  "results": [
    {
      "id": 1,
      "title": "New service request",
      "body": "You have a new service request. Please respond within 5 minutes.",
      "type": "new_request",
      "is_read": false,
      "created_at": "2026-04-30 10:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Unread Count

```http
GET /api/notifications/unread-count
```

Response:

```json
{
  "unread_count": 3
}
```

### Mark Read

```http
POST /api/notifications/{notification_id}/read
```

### Mark All Read

```http
POST /api/notifications/read-all
```

Response:

```json
{
  "success": true,
  "updated": 3
}
```

### Delete

```http
DELETE /api/notifications/{notification_id}
```

---

## 9. Upload Rules

Allowed content types:

```text
image/jpeg
image/png
image/webp
```

Allowed extensions:

```text
.jpg
.jpeg
.png
.webp
```

Max size:

```text
5 MB
```

Errors:

```json
{
  "detail": "Unsupported image type. Allowed types: JPEG, PNG, WebP."
}
```

```json
{
  "detail": "Image extension does not match content type."
}
```

```json
{
  "detail": "Image is too large. Maximum size is 5 MB."
}
```

Security:
- Public profile/request images can be opened from `/uploads/...`.
- Technician ID cards are protected.
- Public `/uploads/documents/*` is blocked and returns `404`.

---

## 10. Realtime and Tracking

Realtime is optional and depends on:

```text
FIREBASE_DATABASE_URL
```

If configured, backend writes to Firebase Realtime Database.

### Paths

Technician live state:

```text
live/technicians/{technician_id}
```

Payload:

```json
{
  "technician_id": 2,
  "status": "approved",
  "availability_status": "available",
  "lat": 14.8282,
  "lng": 42.97,
  "location_updated_at": "2026-04-30T10:00:00Z",
  "service_radius_km": 20,
  "work_start_time": "08:00",
  "work_end_time": "18:00",
  "work_days": "0,1,2,3,4",
  "updated_at": "2026-04-30T10:00:00Z"
}
```

Request state:

```text
live/requests/{request_id}
```

Request tracking:

```text
live/request_tracking/{request_id}
```

Payload:

```json
{
  "request_id": 44,
  "status": "accepted",
  "customer_id": 1,
  "technician_id": 2,
  "lat": 14.8282,
  "lng": 42.97,
  "location_updated_at": "2026-04-30T10:00:00Z",
  "updated_at": "2026-04-30T10:00:00Z",
  "active": true
}
```

When request is completed/cancelled:

```json
{
  "active": false,
  "status": "completed",
  "ended_at": "2026-04-30T10:30:00Z",
  "updated_at": "2026-04-30T10:30:00Z"
}
```

### Frontend Tracking Recommendation

Technician app:
- Send `PUT /api/technician/profile/location` every `15-30` seconds while handling accepted request.
- Send location before switching to `available`.

Customer app:
- Show map tracking after request becomes `accepted`.
- Listen to `live/request_tracking/{request_id}`.
- Stop live tracking when `active = false`.

Privacy recommendation:
- Do not show technician live location before the technician accepts the request.
- For browsing technicians, use `/api/technicians/top` instead of live location.

---

## 11. Main Frontend Screens Checklist

### Customer
- OTP/login/register.
- Governorate/district selector.
- Customer profile edit.
- Service list.
- Top technicians by service and area.
- Create request with image upload.
- My requests list.
- Request details.
- Live tracking after acceptance.
- Complete request rating.
- Notifications.

### Technician
- OTP/login/register.
- Service selection with `أخرى`.
- Upload profile photo and ID card.
- Waiting approval screen.
- Profile and area setup.
- Service areas setup.
- Work settings.
- Location permission and live update.
- Availability toggle.
- Incoming requests.
- Accept/reject request.
- Complete request with report.
- Notifications.

### Admin
- Login as admin customer.
- Dashboard.
- Pending technicians list.
- Technician details.
- Protected ID card viewer.
- Custom service review.
- Approve/reject technician.
- Requests monitor.
- Users monitor and soft delete.
- Ratings monitor.
- Broadcast notifications.

---

## 12. Endpoint Inventory

### System

```text
GET /api/health
GET /
```

### Auth

```text
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register/customer
POST /api/auth/register/technician
POST /api/auth/login
POST /api/auth/reset-password
POST /api/auth/change-password
POST /api/auth/update-fcm-token
```

### Services and Locations

```text
GET /api/services/
GET /api/locations/governorates
GET /api/locations/districts
```

### Customer

```text
GET /api/customer/profile/me
PUT /api/customer/profile/me
```

### Technician Browsing

```text
GET /api/technicians/top
GET /api/technicians/nearby
```

### Technician Profile

```text
GET /api/technician/profile/me
GET /api/technician/profile/status
POST /api/technician/profile/documents
GET /api/technician/profile/documents/id-card
PUT /api/technician/profile/location
PUT /api/technician/profile/area
GET /api/technician/profile/service-areas
PUT /api/technician/profile/service-areas
PUT /api/technician/profile/availability
PUT /api/technician/profile/work-settings
```

### Uploads

```text
POST /api/uploads/request-image/
POST /api/uploads/profile-image/
```

### Requests

```text
GET /api/requests/
POST /api/requests/
GET /api/requests/{request_id}
POST /api/requests/{request_id}/accept
POST /api/requests/{request_id}/reject
POST /api/requests/{request_id}/cancel
POST /api/requests/{request_id}/complete
POST /api/requests/{request_id}/rate
```

### Notifications

```text
GET /api/notifications/
GET /api/notifications/unread-count
POST /api/notifications/{notification_id}/read
POST /api/notifications/read-all
DELETE /api/notifications/{notification_id}
```

### Admin

```text
GET /api/admin/statistics
GET /api/admin/dashboard
GET /api/admin/technicians
GET /api/admin/technicians/{technician_id}
GET /api/admin/technicians/{technician_id}/documents/id-card
PUT /api/admin/technicians/{technician_id}/status
PUT /api/admin/custom-service-requests/{service_request_id}/approve
PUT /api/admin/custom-service-requests/{service_request_id}/reject
GET /api/admin/requests
GET /api/admin/ratings
POST /api/admin/notifications/broadcast
GET /api/admin/users
DELETE /api/admin/users/{user_id}
```

---

## 13. Implementation Notes for Frontend

- Always send Bearer token for protected endpoints.
- Do not send legacy `wrapped` query/body to request endpoints.
- Use `/api/technicians/top` for customer browsing by rating and area.
- Use `/api/technicians/nearby` only for live available technicians.
- Treat `pending_custom_service_requests_count > 0` as a blocker for admin account approval.
- Fetch protected ID cards as Blob, not as normal public image URL.
- If request tracking is needed, wire Firebase Realtime Database listener to `live/request_tracking/{request_id}`.
- Upload images before creating request, then send returned `image_url`.
- Refresh technician/admin detail after approve/reject custom service request.
- For all area forms, load governorates first, then districts for selected governorate.
- On technician app, ask for location permission before setting availability to `available`.
