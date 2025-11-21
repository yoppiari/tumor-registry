# Sprint 2: API Quick Reference Guide

## Medical Imaging API

### Upload Image
```http
POST /medical-imaging/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: [binary]
- patientId: string
- imageType: HISTOLOGY | RADIOLOGY | CLINICAL_PHOTO | PATHOLOGY | etc.
- category: HISTOLOGY | RADIOLOGY | CLINICAL | PATHOLOGY | etc.
- description: string (optional)
- findings: string (optional)
- bodyPart: string (optional)
```

### List Images
```http
GET /medical-imaging?patientId={id}&imageType={type}&category={cat}&page=1&limit=50
Authorization: Bearer {token}
```

### Get Image Metadata
```http
GET /medical-imaging/{imageId}
Authorization: Bearer {token}
```

### Download Image File
```http
GET /medical-imaging/{imageId}/file
Authorization: Bearer {token}
```

### Get Thumbnail
```http
GET /medical-imaging/{imageId}/thumbnail
Authorization: Bearer {token}
```

### Update Image Metadata
```http
PUT /medical-imaging/{imageId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "string",
  "findings": "string",
  "tags": ["tag1", "tag2"],
  "quality": "EXCELLENT | GOOD | STANDARD | POOR | NEEDS_REVIEW"
}
```

### Delete Image
```http
DELETE /medical-imaging/{imageId}
Authorization: Bearer {token}
```

### Categorize Image
```http
PUT /medical-imaging/{imageId}/categorize
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "HISTOLOGY | RADIOLOGY | CLINICAL | etc."
}
```

### Add Annotations
```http
POST /medical-imaging/{imageId}/annotations
Authorization: Bearer {token}
Content-Type: application/json

{
  "annotations": {
    "markups": [],
    "measurements": {},
    "notes": "string"
  }
}
```

---

## Case Review API

### Create Case Review
```http
POST /case-review
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "string",
  "caseType": "UNUSUAL_PRESENTATION | RARE_DIAGNOSIS | etc.",
  "complexity": "SIMPLE | STANDARD | MODERATE | COMPLEX | HIGHLY_COMPLEX",
  "flagReason": "string",
  "description": "string",
  "clinicalData": {},
  "diagnosisIds": ["id1", "id2"],
  "specialty": "ONCOLOGY | HEMATOLOGY | etc.",
  "priority": "LOW | MEDIUM | HIGH | URGENT | CRITICAL",
  "tags": ["tag1", "tag2"]
}
```

### List Case Reviews
```http
GET /case-review?status={status}&specialty={specialty}&priority={priority}&assignedTo={userId}&page=1&limit=50
Authorization: Bearer {token}
```

### Get Queue Statistics
```http
GET /case-review/statistics?specialty={specialty}
Authorization: Bearer {token}
```

### Get Case Review Details
```http
GET /case-review/{reviewId}
Authorization: Bearer {token}
```

### Assign Case Review
```http
POST /case-review/{reviewId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "assignedTo": "userId",
  "specialty": "ONCOLOGY",
  "role": "Senior Oncologist",
  "priority": "HIGH",
  "dueDate": "2025-12-31",
  "notes": "string"
}
```

### Add Comment
```http
POST /case-review/{reviewId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "string",
  "parentId": "commentId (optional for threading)",
  "commentType": "GENERAL | QUESTION | CONCERN | SUGGESTION | etc.",
  "isInternal": false,
  "mentions": ["userId1", "userId2"],
  "attachments": {}
}
```

### Update Status
```http
PUT /case-review/{reviewId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "PENDING | IN_REVIEW | ASSIGNED | IN_PROGRESS | COMPLETED | etc."
}
```

### Complete Review
```http
POST /case-review/{reviewId}/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "reviewNotes": "string",
  "outcome": "RESOLVED | REQUIRES_ACTION | ESCALATED | DEFERRED | etc.",
  "resolution": "string"
}
```

---

## Peer Review API

### Request Peer Review
```http
POST /peer-review
Authorization: Bearer {token}
Content-Type: application/json

{
  "entityType": "PATIENT_RECORD | DIAGNOSIS | MEDICAL_RECORD | etc.",
  "entityId": "string",
  "reviewType": "QUALITY_CHECK | DATA_VALIDATION | etc.",
  "assignedTo": "userId (optional)",
  "priority": "LOW | MEDIUM | HIGH | URGENT | CRITICAL",
  "dueDate": "2025-12-31",
  "title": "string",
  "description": "string",
  "context": {},
  "checklist": {},
  "tags": ["tag1", "tag2"]
}
```

### List Peer Reviews
```http
GET /peer-review?status={status}&reviewType={type}&assignedTo={userId}&requestedBy={userId}&page=1&limit=50
Authorization: Bearer {token}
```

### Get Review Statistics
```http
GET /peer-review/statistics
Authorization: Bearer {token}
```

### Get Review Details
```http
GET /peer-review/{reviewId}
Authorization: Bearer {token}
```

### Assign Reviewer
```http
PUT /peer-review/{reviewId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "assignedTo": "userId"
}
```

### Add Comment
```http
POST /peer-review/{reviewId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "string",
  "parentId": "commentId (optional)",
  "commentType": "GENERAL | QUESTION | CONCERN | etc.",
  "severity": "INFO | LOW | MEDIUM | HIGH | CRITICAL",
  "lineReference": "field name or line number",
  "suggestion": "string",
  "isInternal": false,
  "mentions": ["userId1"],
  "attachments": {}
}
```

### Resolve Comment
```http
PUT /peer-review/comments/{commentId}/resolve
Authorization: Bearer {token}
```

### Approve Review
```http
POST /peer-review/{reviewId}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 95,
  "recommendation": "APPROVE | APPROVE_WITH_CHANGES | MINOR_REVISION | etc.",
  "requiresChanges": false,
  "findings": {},
  "timeSpent": 45
}
```

### Reject Review
```http
POST /peer-review/{reviewId}/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 60,
  "recommendation": "MAJOR_REVISION | REJECT",
  "requiresChanges": true,
  "findings": {},
  "rejectionReason": "string",
  "timeSpent": 30
}
```

### Award Recognition
```http
POST /peer-review/{reviewId}/recognition
Authorization: Bearer {token}
Content-Type: application/json

{
  "reviewerId": "userId",
  "recognitionType": "EXCELLENT_REVIEW | THOROUGH_ANALYSIS | etc.",
  "title": "string",
  "description": "string",
  "points": 10
}
```

---

## Offline Queue API

### Queue Offline Data
```http
POST /offline-queue/sync
Authorization: Bearer {token}
Content-Type: application/json

{
  "entityType": "patient | diagnosis | medication",
  "entityId": "string (null for creates)",
  "operation": "CREATE | UPDATE | DELETE | SYNC",
  "data": {},
  "priority": 0,
  "localTimestamp": "2025-11-21T10:30:00Z",
  "deviceId": "device-123",
  "sessionId": "session-456",
  "metadata": {}
}
```

### Get Pending Queue
```http
GET /offline-queue/pending?limit=100
Authorization: Bearer {token}
```

### Get Queue Statistics
```http
GET /offline-queue/statistics
Authorization: Bearer {token}
```

### Sync All Pending
```http
POST /offline-queue/sync-all
Authorization: Bearer {token}
```

### Retry Failed Item
```http
PUT /offline-queue/{queueId}/retry
Authorization: Bearer {token}
```

### Resolve Conflict
```http
PUT /offline-queue/{queueId}/resolve-conflict
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolution": "USE_LOCAL | USE_REMOTE | MERGE | MANUAL",
  "mergedData": {} // required for MERGE or MANUAL
}
```

---

## Common Response Formats

### Success Response (Single Item)
```json
{
  "id": "clx123...",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2025-11-21T10:30:00Z",
  "updatedAt": "2025-11-21T10:30:00Z"
}
```

### Success Response (List)
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Conflict Response (Offline Queue)
```json
{
  "status": "CONFLICT",
  "conflictData": {
    "errorMessage": "Data has been modified",
    "localData": {},
    "remoteData": {}
  },
  "queueItem": {...}
}
```

---

## Authentication

All endpoints require JWT authentication:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from login endpoint:
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Rate Limiting

- 100 requests per minute per user
- File uploads limited to 100MB
- Image processing may take several seconds

---

## Pagination

Default pagination for list endpoints:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

---

## Filtering

Supported filter parameters vary by endpoint. Common filters:
- `status`: Filter by status
- `priority`: Filter by priority
- `assignedTo`: Filter by assigned user
- `createdBy`: Filter by creator
- `date`: Filter by date range

---

## Sorting

Default sorting:
- Case Reviews: Priority DESC, Created Date DESC
- Peer Reviews: Priority DESC, Requested Date DESC
- Offline Queue: Priority DESC, Local Timestamp ASC
- Images: Upload Date DESC

---

## WebSocket Events (Future)

Planned real-time events:
- `case.assigned` - Case assigned to user
- `review.commented` - New comment on review
- `queue.synced` - Offline item synced
- `recognition.awarded` - Recognition received

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 429  | Rate Limit Exceeded |
| 500  | Internal Server Error |

---

## Testing with cURL

### Upload Image
```bash
curl -X POST http://localhost:3000/medical-imaging/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "patientId=patient123" \
  -F "imageType=RADIOLOGY" \
  -F "category=DIAGNOSTIC"
```

### Create Case Review
```bash
curl -X POST http://localhost:3000/case-review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient123",
    "caseType": "UNUSUAL_PRESENTATION",
    "flagReason": "Atypical symptoms",
    "description": "Patient presents with...",
    "clinicalData": {}
  }'
```

### Sync Offline Data
```bash
curl -X POST http://localhost:3000/offline-queue/sync \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "patient",
    "operation": "CREATE",
    "data": {...},
    "localTimestamp": "2025-11-21T10:30:00Z"
  }'
```

---

## Postman Collection

Import this URL to get started:
```
http://localhost:3000/api-json
```

Save as Postman Collection v2.1 format.

---

## Development Tips

1. **Check Swagger UI**: http://localhost:3000/api
2. **Use TypeScript types**: Generated by Prisma
3. **Enable logging**: Set `LOG_LEVEL=debug` in .env
4. **Test file uploads**: Use tools like Postman or Insomnia
5. **Monitor queue**: Check `/offline-queue/statistics` regularly

---

## Support

For issues or questions:
- Backend logs: `backend/logs/`
- Prisma Studio: `npx prisma studio`
- Database inspection: `psql -d tumor_registry`
