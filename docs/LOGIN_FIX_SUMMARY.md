# Login Fix Summary

## Issue Identified
The frontend login was failing with error: `Cannot read properties of undefined (reading 'token')`

## Root Causes

### 1. API Response Structure Mismatch
- **Backend Response**:
  ```json
  {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "...",
    "requireMFA": false
  }
  ```

- **Frontend Expected** (incorrect):
  ```json
  {
    "data": {
      "token": "...",
      "user": {...}
    }
  }
  ```

### 2. API URL Prefix Missing
- Backend uses global prefix: `/api/v1`
- All endpoints must be called as: `/api/v1/auth/login`, not `/auth/login`

## Fixes Applied

### 1. Updated Auth Service (`frontend/src/services/auth.service.ts`)
- Changed `LoginResponse` interface to match actual API response:
  - `token` → `accessToken`
  - Added `refreshToken` field
  - Added `requireMFA` field
- Updated `login()` method to access response directly: `response.data` instead of `response.data.data`
- Updated `getProfile()` method similarly
- Added `refreshToken` storage in localStorage

### 2. Updated Environment Configuration
- **`.env`**: Set `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`
- **`docker-compose.yml`**: Updated frontend env to include `/api/v1` prefix

### 3. Updated Documentation
- **`LOCAL_TESTING_GUIDE.md`**: All API examples now use `/api/v1` prefix

## Testing the Fix

### 1. Verify Services are Running
```bash
docker compose ps

# All services should show "Up" status
```

### 2. Test Login via API
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inamsos.go.id",
    "password": "admin123"
  }' | jq
```

**Expected Response**:
```json
{
  "user": {
    "id": "...",
    "email": "admin@inamsos.go.id",
    "name": "System Administrator",
    "role": "STAFF",
    "centerId": "..."
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "requireMFA": false
}
```

### 3. Test Login via Frontend UI
1. Open browser: http://localhost:3000
2. Click "Login" or navigate to login page
3. Enter credentials:
   - Email: `admin@inamsos.go.id`
   - Password: `admin123`
4. Click "Login"
5. Should redirect to dashboard without errors

### 4. Verify in Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Should see NO errors related to token
- Go to Application → Local Storage → http://localhost:3000
- Should see:
  - `token`: JWT access token
  - `refreshToken`: JWT refresh token
  - `user`: User object JSON

## All Demo User Credentials

| Role | Email | Password |
|------|-------|----------|
| System Admin | `admin@inamsos.go.id` | `admin123` |
| National Admin | `national.admin@inamsos.go.id` | `national123` |
| Center Admin | `center.admin@inamsos.go.id` | `center123` |
| Researcher | `researcher@inamsos.go.id` | `research123` |
| Medical Officer | `medical.officer@inamsos.go.id` | `medical123` |
| Data Entry Staff | `staff@inamsos.go.id` | `staff123` |

## Quick Access Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Documentation**: http://localhost:3001/api/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin2025)

## If Login Still Fails

### Clear Browser Cache
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

### Check Frontend Logs
```bash
docker compose logs frontend | tail -50
```

### Check Backend Logs
```bash
docker compose logs backend | tail -50
```

### Restart All Services
```bash
docker compose restart
```

### Complete Rebuild (if needed)
```bash
docker compose down
docker compose up -d --build
```

## Status
✅ **FIXED** - Login should now work correctly

---

**Date Fixed**: December 12, 2025
**Files Modified**:
- `frontend/src/services/auth.service.ts`
- `.env`
- `docker-compose.yml`
- `docs/LOCAL_TESTING_GUIDE.md`
