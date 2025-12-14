# Centers Management - Testing Guide

## Quick Test Instructions

### 1. Prerequisites
Ensure all services are running:
```bash
docker compose ps
```

Expected services:
- ✅ `tumor-registry-backend-1` (Up)
- ✅ `tumor-registry-frontend-1` (Up)
- ✅ `inamsos-postgres` (Up, healthy)
- ✅ `inamsos-redis` (Up, healthy)
- ✅ `inamsos-minio` (Up, healthy)

### 2. Access the Page
**URL**: http://localhost:3000/admin/centers

**Login Credentials**:
```
Email: admin@inamsos.go.id
Password: admin123
```

### 3. Test Scenarios

#### ✅ Test 1: View Centers List
**Expected**:
- Page loads with real data from database
- Statistics cards show correct counts
- Table displays centers with:
  - Name
  - Code (e.g., DEFAULT, JATIM002)
  - City/Regency
  - Province
  - Active Users count
  - Total Patients (currently 0)
  - Status badge (Aktif/Tidak Aktif)

#### ✅ Test 2: Search & Filter
**Steps**:
1. Type in search box (e.g., "RSUD", "Jakarta", "DEFAULT")
2. Select province from dropdown
3. Select status filter (Aktif/Tidak Aktif)

**Expected**:
- Results update in real-time
- Search works across name, city, and code
- Filters combine correctly

#### ✅ Test 3: Create New Center
**Steps**:
1. Click "Tambah Pusat" button
2. Fill in form:
   - Nama Pusat: "RS Test Baru" (required)
   - Kode Pusat: "TEST001" (required, auto-uppercase)
   - Alamat: "Jl. Test No. 1" (optional)
   - Kota/Kabupaten: "Jakarta Utara" (optional)
   - Provinsi: Select from dropdown (required)
3. Click "Tambah Pusat"

**Expected**:
- ✅ Success alert: "Pusat berhasil ditambahkan"
- ✅ Modal closes
- ✅ Table refreshes with new center
- ✅ Statistics update
- ❌ Error if code already exists: "Center with code TEST001 already exists"

#### ✅ Test 4: Edit Existing Center
**Steps**:
1. Click "Edit" on any center row
2. Note: Code field is disabled (gray, uneditable)
3. Modify name, address, city, or province
4. Click "Simpan Perubahan"

**Expected**:
- ✅ Success alert: "Pusat berhasil diperbarui"
- ✅ Modal closes
- ✅ Table refreshes with updated data
- ✅ Code remains unchanged

#### ✅ Test 5: View Center Details
**Steps**:
1. Click "Detail" on any center row
2. Review information displayed

**Expected**:
- Modal shows:
  - Kode Pusat (with monospace font)
  - Nama Pusat
  - Alamat
  - Kota/Kabupaten
  - Provinsi
  - Pengguna Aktif
  - Total Pasien
  - Status badge

#### ✅ Test 6: Toggle Center Status
**Steps**:
1. Click on status badge (Aktif/Tidak Aktif)
2. Wait for response

**Expected**:
- ✅ Active → Inactive: "Pusat berhasil dinonaktifkan"
- ✅ Inactive → Active: "Pusat berhasil diaktifkan"
- ✅ Status badge updates
- ✅ Statistics update
- ❌ Error for DEFAULT center: "Cannot deactivate default center"

#### ✅ Test 7: Error Handling
**Test API Failure**:
1. Stop backend: `docker compose stop backend`
2. Try to create/edit/toggle center

**Expected**:
- ❌ Error alert with message
- ❌ Red error banner at top
- No page crash

3. Restart backend: `docker compose start backend`
4. Refresh page - should work again

### 4. API Testing (Optional)

#### Test Centers Endpoint
```bash
# Get all centers
curl http://localhost:3001/api/v1/centers | jq

# Get statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/v1/centers/statistics | jq

# Get single center
curl http://localhost:3001/api/v1/centers/cmi8zfrsn0000v65ge9ipyllv | jq
```

#### Test with Authentication
```bash
# Login to get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inamsos.go.id","password":"admin123"}' \
  | jq -r '.accessToken')

# Create center
curl -X POST http://localhost:3001/api/v1/centers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RS API Test",
    "code": "APITEST",
    "province": "DKI Jakarta",
    "regency": "Jakarta Selatan",
    "address": "Jl. API Test No. 1"
  }' | jq

# Activate center
curl -X PUT http://localhost:3001/api/v1/centers/CENTER_ID/activate \
  -H "Authorization: Bearer $TOKEN" | jq

# Deactivate center
curl -X PUT http://localhost:3001/api/v1/centers/CENTER_ID/deactivate \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 5. Browser Console Testing

Open browser DevTools (F12) and check:

#### Network Tab
- ✅ `/api/v1/centers` - Status 200
- ✅ `/api/v1/centers/statistics` - Status 200
- ✅ `POST /api/v1/centers` - Status 201 (on create)
- ✅ `PUT /api/v1/centers/:id` - Status 200 (on update)
- ✅ `PUT /api/v1/centers/:id/activate` - Status 200
- ✅ `PUT /api/v1/centers/:id/deactivate` - Status 200

#### Console Tab
- ✅ No errors (except pre-existing unrelated warnings)
- ✅ See API responses logged on operations

### 6. Database Verification

```bash
# Connect to PostgreSQL
docker exec -it inamsos-postgres psql -U inamsos -d inamsos_dev

# Query centers
SELECT id, name, code, province, regency, "isActive"
FROM system.centers
ORDER BY name;

# Count active centers
SELECT COUNT(*) FROM system.centers WHERE "isActive" = true;

# Check user counts per center
SELECT c.name, c.code, COUNT(u.id) as user_count
FROM system.centers c
LEFT JOIN system.users u ON c.id = u."centerId" AND u."isActive" = true
GROUP BY c.id, c.name, c.code
ORDER BY c.name;
```

### 7. Known Limitations

✅ **Working**:
- Full CRUD operations
- Search and filtering
- Status toggling
- Real-time statistics
- Error handling
- Success notifications

⚠️ **Limitations**:
- Phone & Email: Not in schema yet (shows "N/A")
- Total Patients: Always 0 (not calculated from patients table)
- Notifications: Uses `alert()` instead of toast (future enhancement)
- No pagination (fine for 21 centers)
- No sorting controls (ordered by name)

### 8. Success Criteria

The integration is successful if:

- [x] Page loads without errors
- [x] Real data from database displays correctly
- [x] All CRUD operations work
- [x] Search and filters work
- [x] Status toggle works
- [x] Statistics update after mutations
- [x] Error messages display correctly
- [x] No TypeScript compilation errors
- [x] No console errors during normal operation
- [x] Data persists to database
- [x] Authentication required for mutations

### 9. Troubleshooting

#### Page shows "Memuat..." forever
**Cause**: Backend not responding
**Fix**:
```bash
docker compose logs backend --tail 50
docker compose restart backend
```

#### "Gagal memuat data pusat" error
**Cause**: Database connection issue or authentication
**Fix**:
1. Check if logged in
2. Verify token in localStorage
3. Check backend logs for errors

#### Create/Update fails silently
**Cause**: Validation error or duplicate code
**Fix**:
- Check browser console for error details
- Verify code is unique
- Check required fields are filled

#### Statistics show 0 for everything
**Cause**: API statistics endpoint failing
**Fix**:
- Will fallback to local calculation
- Check backend logs
- Verify CENTERS_READ permission

---

## Quick Smoke Test (30 seconds)

1. ✅ Navigate to http://localhost:3000/admin/centers
2. ✅ Login with admin credentials
3. ✅ See list of centers loaded
4. ✅ Click "Tambah Pusat"
5. ✅ Fill form and submit
6. ✅ See new center in list
7. ✅ Click status badge to toggle
8. ✅ See status change
9. ✅ Click "Edit" and update name
10. ✅ See updated name in list

**If all 10 steps pass: ✅ Integration is working correctly!**

---

**Last Updated**: December 14, 2025
**Tested By**: Automated verification + Manual testing recommended
