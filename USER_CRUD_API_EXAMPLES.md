# User CRUD API - Usage Examples

## Base URL
```
http://localhost:3001/api/v1/users
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Create a New User

### Endpoint
```http
POST /users
```

### Required Permission
`USERS_CREATE`

### Request Body
```json
{
  "email": "doctor.new@hospital.com",
  "name": "Dr. Jane Doe",
  "password": "SecurePass123!",
  "kolegiumId": "KOL-12345678",
  "phone": "+6281234567890",
  "nik": "3201234567890001",
  "centerId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "MEDICAL_OFFICER",
  "isActive": true
}
```

### Response (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "doctor.new@hospital.com",
  "name": "Dr. Jane Doe",
  "kolegiumId": "KOL-12345678",
  "phone": "+6281234567890",
  "nik": "3201234567890001",
  "isActive": true,
  "isEmailVerified": false,
  "createdAt": "2025-12-14T10:30:00.000Z",
  "updatedAt": "2025-12-14T10:30:00.000Z",
  "centerId": "550e8400-e29b-41d4-a716-446655440000",
  "center": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "RSUP Dr. Sardjito",
    "code": "RS-SARDJITO"
  },
  "userRoles": [
    {
      "id": "role-assignment-id",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "roleId": "role-id",
      "isActive": true,
      "role": {
        "id": "role-id",
        "code": "MEDICAL_OFFICER",
        "name": "Medical Officer"
      }
    }
  ]
}
```

### cURL Example
```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor.new@hospital.com",
    "name": "Dr. Jane Doe",
    "password": "SecurePass123!",
    "centerId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "MEDICAL_OFFICER"
  }'
```

---

## 2. Get All Users

### Endpoint
```http
GET /users
```

### Required Permission
`USERS_READ`

### Response (200 OK)
```json
[
  {
    "id": "user-id-1",
    "email": "admin@inamsos.go.id",
    "name": "System Administrator",
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "center": {
      "name": "RSUPN Dr. Cipto Mangunkusumo"
    },
    "userRoles": [
      {
        "role": {
          "name": "System Admin"
        }
      }
    ]
  },
  {
    "id": "user-id-2",
    "email": "doctor@hospital.com",
    "name": "Dr. John Smith",
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2025-01-15T00:00:00.000Z",
    "center": {
      "name": "RSUP Dr. Sardjito"
    },
    "userRoles": [
      {
        "role": {
          "name": "Medical Officer"
        }
      }
    ]
  }
]
```

### cURL Example
```bash
curl -X GET http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. Get Single User by ID

### Endpoint
```http
GET /users/:id
```

### Required Permission
`USERS_READ`

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "doctor@hospital.com",
  "name": "Dr. Jane Doe",
  "kolegiumId": "KOL-12345678",
  "phone": "+6281234567890",
  "nik": "3201234567890001",
  "isActive": true,
  "isEmailVerified": true,
  "mfaEnabled": false,
  "lastLoginAt": "2025-12-14T09:00:00.000Z",
  "createdAt": "2025-12-01T00:00:00.000Z",
  "updatedAt": "2025-12-14T09:00:00.000Z",
  "centerId": "550e8400-e29b-41d4-a716-446655440000",
  "center": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "RSUP Dr. Sardjito",
    "code": "RS-SARDJITO"
  },
  "userRoles": [
    {
      "role": {
        "code": "MEDICAL_OFFICER",
        "name": "Medical Officer"
      }
    }
  ]
}
```

### cURL Example
```bash
curl -X GET http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 4. Get User Statistics

### Endpoint
```http
GET /users/statistics
```

### Required Permission
`USERS_READ`

### Response (200 OK)
```json
{
  "total": 45,
  "active": 42,
  "inactive": 3,
  "verified": 40,
  "byRole": {
    "System Admin": 2,
    "National Admin": 3,
    "Center Admin": 8,
    "Medical Officer": 20,
    "Data Entry": 10,
    "Researcher": 2
  },
  "byCenterCount": {
    "RSUPN Dr. Cipto Mangunkusumo": 15,
    "RSUP Dr. Sardjito": 12,
    "RSUP Dr. Hasan Sadikin": 10,
    "RSUD Dr. Soetomo": 8
  }
}
```

### cURL Example
```bash
curl -X GET http://localhost:3001/api/v1/users/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 5. Get Users by Center

### Endpoint
```http
GET /users/center/:centerId
```

### Required Permission
`USERS_READ`

### Response (200 OK)
```json
[
  {
    "id": "user-id-1",
    "email": "doctor1@hospital.com",
    "name": "Dr. User One",
    "isActive": true,
    "center": {
      "id": "center-id",
      "name": "RSUP Dr. Sardjito"
    }
  },
  {
    "id": "user-id-2",
    "email": "doctor2@hospital.com",
    "name": "Dr. User Two",
    "isActive": true,
    "center": {
      "id": "center-id",
      "name": "RSUP Dr. Sardjito"
    }
  }
]
```

### cURL Example
```bash
curl -X GET http://localhost:3001/api/v1/users/center/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 6. Update User

### Endpoint
```http
PATCH /users/:id
```

### Required Permission
`USERS_UPDATE`

### Request Body (All fields optional)
```json
{
  "name": "Dr. Jane Smith-Updated",
  "email": "doctor.updated@hospital.com",
  "phone": "+6281987654321",
  "kolegiumId": "KOL-87654321",
  "nik": "3201234567890002",
  "centerId": "new-center-id",
  "role": "RESEARCHER",
  "isActive": true,
  "password": "NewSecurePass123!"
}
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "doctor.updated@hospital.com",
  "name": "Dr. Jane Smith-Updated",
  "phone": "+6281987654321",
  "isActive": true,
  "updatedAt": "2025-12-14T11:00:00.000Z",
  "center": {
    "name": "New Center Name"
  },
  "userRoles": [
    {
      "role": {
        "code": "RESEARCHER",
        "name": "Researcher"
      }
    }
  ]
}
```

### cURL Example (Update name only)
```bash
curl -X PATCH http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith-Updated"
  }'
```

---

## 7. Toggle User Status

### Endpoint
```http
PATCH /users/:id/status
```

### Required Permission
`USERS_UPDATE`

### Request Body
```json
{
  "isActive": false
}
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "doctor@hospital.com",
  "name": "Dr. Jane Doe",
  "isActive": false,
  "updatedAt": "2025-12-14T11:30:00.000Z",
  "center": {
    "name": "RSUP Dr. Sardjito"
  },
  "userRoles": [
    {
      "role": {
        "code": "MEDICAL_OFFICER",
        "name": "Medical Officer"
      }
    }
  ]
}
```

### cURL Example (Deactivate user)
```bash
curl -X PATCH http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

### cURL Example (Activate user)
```bash
curl -X PATCH http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true
  }'
```

---

## 8. Update User Role

### Endpoint
```http
PATCH /users/:id/role
```

### Required Permission
`USERS_UPDATE`

### Request Body
```json
{
  "roleCode": "CENTER_ADMIN"
}
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "doctor@hospital.com",
  "name": "Dr. Jane Doe",
  "isActive": true,
  "updatedAt": "2025-12-14T12:00:00.000Z",
  "userRoles": [
    {
      "role": {
        "code": "CENTER_ADMIN",
        "name": "Center Admin"
      }
    }
  ]
}
```

### cURL Example
```bash
curl -X PATCH http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleCode": "CENTER_ADMIN"
  }'
```

---

## 9. Delete User (Soft Delete)

### Endpoint
```http
DELETE /users/:id
```

### Required Permission
`USERS_DELETE`

### Response (200 OK)
```json
{
  "message": "User deleted successfully"
}
```

### cURL Example
```bash
curl -X DELETE http://localhost:3001/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Available Role Codes

| Code | Name | Description |
|------|------|-------------|
| SYSTEM_ADMIN | System Admin | Full system access |
| NATIONAL_ADMIN | National Admin | National-level administration |
| CENTER_ADMIN | Center Admin | Center-level administration |
| RESEARCHER | Researcher | Research data access |
| MEDICAL_OFFICER | Medical Officer | Clinical data entry and review |
| DATA_ENTRY | Data Entry | Data entry operations |

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters long"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email is already in use by another user",
  "error": "Conflict"
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions. Required: [USERS_CREATE], User has: [USERS_READ]",
  "error": "Forbidden"
}
```

### 401 Unauthorized (No JWT Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Validation Rules

### Email
- Must be a valid email format
- Must be unique in the system

### Name
- Minimum 2 characters
- Maximum 100 characters

### Password
- Minimum 8 characters
- Should contain uppercase, lowercase, number, and special character (recommended)

### NIK (National Identity Number)
- Must be exactly 16 digits
- Optional field

### Phone
- Free format
- Optional field

### Kolegium ID
- Free format
- Optional field

### Center ID
- Must be a valid UUID v4
- Must reference an existing center

### Role
- Must be one of the valid role codes
- Must reference an existing role in the system

---

## Notes

1. **Password Security**: Passwords are never returned in any response. The `passwordHash` field is always excluded.

2. **Soft Delete**: Deleting a user sets `isActive` to `false` but doesn't remove the record from the database.

3. **Self-Protection**:
   - Users cannot delete themselves (DELETE /users/:id)
   - Users cannot deactivate themselves (PATCH /users/:id/status with isActive: false)

4. **Audit Trail**: All user management operations are logged in the audit trail.

5. **Role Changes**: When updating a user's role, the old role is deactivated and the new role is assigned.

6. **Center Association**: Each user must be associated with one of the 21 designated centers.

---

## Postman Collection

You can import the following Postman collection to test these endpoints:

```json
{
  "info": {
    "name": "INAMSOS User CRUD API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api/v1"
    },
    {
      "key": "token",
      "value": "YOUR_JWT_TOKEN"
    }
  ],
  "item": [
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/users",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"name\": \"Test User\",\n  \"password\": \"TestPass123!\",\n  \"centerId\": \"center-uuid\",\n  \"role\": \"MEDICAL_OFFICER\"\n}"
        }
      }
    }
  ]
}
```

---

## Testing with Demo Credentials

Use these credentials to get a JWT token:

### System Admin
```
Email: admin@inamsos.go.id
Password: admin123
```

### Medical Officer
```
Email: medical.officer@inamsos.go.id
Password: medical123
```

### Researcher
```
Email: researcher@inamsos.go.id
Password: research123
```

---

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3001/api/docs
```

All User CRUD endpoints are documented under the "Users" tag in the Swagger UI.
