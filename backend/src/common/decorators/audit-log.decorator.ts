import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for audit log configuration
 */
export const AUDIT_LOG_KEY = 'audit_log';

/**
 * Interface for audit log metadata
 */
export interface AuditLogMetadata {
  action: string;
  resource: string;
  description?: string;
  includeBody?: boolean;
  includeResponse?: boolean;
}

/**
 * Decorator to mark routes for automatic audit logging.
 * Should be used with an AuditLogInterceptor to perform actual logging.
 *
 * @param action - The action being performed (e.g., 'CREATE', 'UPDATE', 'DELETE', 'VIEW')
 * @param resource - The resource being accessed (e.g., 'patient', 'user', 'report')
 * @param options - Optional configuration for audit logging
 *
 * @example
 * ```typescript
 * @AuditLog('CREATE', 'patient', { includeBody: true })
 * @Post('patients')
 * createPatient(@Body() dto: CreatePatientDto) {
 *   // Action logged to audit trail
 * }
 * ```
 */
export const AuditLog = (
  action: string,
  resource: string,
  options?: Partial<Omit<AuditLogMetadata, 'action' | 'resource'>>,
) => {
  const metadata: AuditLogMetadata = {
    action,
    resource,
    description: options?.description,
    includeBody: options?.includeBody ?? false,
    includeResponse: options?.includeResponse ?? false,
  };
  return SetMetadata(AUDIT_LOG_KEY, metadata);
};

/**
 * Convenience decorators for common audit actions
 */
export const AuditCreate = (
  resource: string,
  options?: Partial<Omit<AuditLogMetadata, 'action' | 'resource'>>,
) => AuditLog('CREATE', resource, options);

export const AuditUpdate = (
  resource: string,
  options?: Partial<Omit<AuditLogMetadata, 'action' | 'resource'>>,
) => AuditLog('UPDATE', resource, options);

export const AuditDelete = (
  resource: string,
  options?: Partial<Omit<AuditLogMetadata, 'action' | 'resource'>>,
) => AuditLog('DELETE', resource, options);

export const AuditView = (
  resource: string,
  options?: Partial<Omit<AuditLogMetadata, 'action' | 'resource'>>,
) => AuditLog('VIEW', resource, options);
