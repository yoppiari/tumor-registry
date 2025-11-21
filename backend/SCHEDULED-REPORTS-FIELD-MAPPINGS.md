# Scheduled Reports Module - Field Mappings Quick Reference

## ScheduledReport Model

### Prisma Schema → Service Mapping
```typescript
// Prisma Schema (schema.prisma lines 1666-1689)
model ScheduledReport {
  id             String            @id @default(cuid())
  templateId     String
  name           String
  description    String?
  schedule       String // cron expression
  recipients     Json
  parameters     Json?
  format         ReportFormat
  deliveryMethod DeliveryMethod
  isActive       Boolean @default(true)
  lastRun        DateTime?
  nextRun        DateTime?
  successCount   Int @default(0)
  failureCount   Int @default(0)
  createdBy      String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  template       ReportTemplate @relation(...)
  executions     ReportExecution[]
}

// Service Usage (scheduled-reports.service.ts)
✅ CREATE - Line 61
  - Uses: templateId, name, description, schedule, recipients (as any),
          parameters (as any), format, deliveryMethod, isActive, nextRun, createdBy
  - Include: { template: true }

✅ UPDATE - Line 113
  - Uses: All DTO fields, recipients (as any), parameters (as any), nextRun
  - Include: { template: true }

✅ FIND ONE - Line 142
  - Include: { template: true, executions: { take: 10, orderBy: {...} } }

✅ FIND MANY - Line 172
  - Where: templateId, isActive, deliveryMethod
  - Include: { template: true, _count: { select: { executions: true } } }
  - OrderBy: [{ isActive: 'desc' }, { nextRun: 'asc' }]

✅ INCREMENT - Lines 310, 336
  - successCount: { increment: 1 }
  - failureCount: { increment: 1 }
```

## ReportExecution Model

### Prisma Schema → Service Mapping
```typescript
// Prisma Schema (schema.prisma lines 1691-1709)
model ReportExecution {
  id                String @id @default(cuid())
  scheduledReportId String
  executionTime     DateTime @default(now())
  status            ExecutionStatus
  filePath          String?
  fileSize          Int?
  duration          Int?
  recipients        Json?
  success           Boolean
  errorMessage      String?
  deliveryStatus    DeliveryStatus?
  retryCount        Int @default(0)
  scheduledReport   ScheduledReport @relation(...)
  distributions     ReportDistribution[]
}

// Service Usage (scheduled-reports.service.ts)
✅ CREATE - Line 255
  - Uses: scheduledReportId, executionTime, status ('RUNNING'),
          recipients, success (false)

✅ UPDATE SUCCESS - Line 297
  - Uses: status ('COMPLETED'), filePath, fileSize, duration,
          success (true), deliveryStatus ('SENT')

✅ DELETE MANY - Line 655
  - Where: { executionTime: { lt: cutoffDate } }
```

## ReportDistribution Model

### Prisma Schema → Service Mapping
```typescript
// Prisma Schema (schema.prisma lines 1744-1770)
model ReportDistribution {
  id                String @id @default(cuid())
  reportHistoryId   String?
  reportExecutionId String?
  recipientType     RecipientType
  recipientId       String
  recipientEmail    String?
  recipientName     String?
  deliveryMethod    DeliveryMethod
  deliveryStatus    DeliveryStatus
  sentAt            DateTime?
  deliveredAt       DateTime?
  openedAt          DateTime?
  downloadedAt      DateTime?
  failureReason     String?
  retryCount        Int @default(0)
  maxRetries        Int @default(3)
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  reportHistory     ReportHistory? @relation(...)
  reportExecution   ReportExecution? @relation(...)
}

// Service Usage (scheduled-reports.service.ts)
✅ CREATE - Line 488
  - Uses: reportExecutionId, recipientType (recipient.type),
          recipientId (recipient.value), recipientEmail (resolved),
          recipientName (resolved), deliveryMethod, deliveryStatus ('PENDING')
```

## Enums Used

### ReportFormat
```typescript
Schema: PDF | EXCEL | CSV | JSON | HTML | POWERPOINT
DTO:    PDF | EXCEL | CSV | JSON | HTML              ✅
```

### DeliveryMethod
```typescript
Schema: EMAIL | FILE_SHARE | API_WEBHOOK | SFTP | CLOUD_STORAGE | PRINT
DTO:    EMAIL | FILE_SHARE | API_WEBHOOK | SFTP | CLOUD_STORAGE        ✅
```

### ExecutionStatus
```typescript
Schema:  PENDING | RUNNING | COMPLETED | FAILED | CANCELLED | RETRYING
Service: RUNNING | COMPLETED                                            ✅
```

### DeliveryStatus
```typescript
Schema:  PENDING | SENT | DELIVERED | FAILED | BOUNCED | OPENED | CLICKED
Service: PENDING | SENT                                                  ✅
```

### RecipientType
```typescript
Schema: USER | ROLE | EMAIL | PHONE | GROUP | SYSTEM
DTO:    USER | ROLE | EMAIL | GROUP                    ✅
```

## All Fixes Applied

1. ✅ RecipientDto: Changed @IsString() → @IsEnum(['USER', 'ROLE', 'EMAIL', 'GROUP'])
2. ✅ cleanupOldExecutions(): Removed Promise<void> return type
3. ✅ Controller imports: Fixed auth guard paths (../../ → ../../../)

## Zero Field Mismatches Found

All Prisma schema fields correctly map to service usage.
All relations properly defined and used.
All enum values are valid.
All Json fields properly cast.

