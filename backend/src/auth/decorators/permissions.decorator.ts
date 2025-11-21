import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for storing required permissions
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to mark routes with required permissions.
 * Users must have ALL specified permissions to access the route.
 *
 * @param permissions - Array of permission strings required to access the route
 *
 * @example
 * ```typescript
 * @Permissions('PATIENT_READ', 'PATIENT_WRITE')
 * @Get('patients')
 * getPatients() {
 *   // Only users with both permissions can access
 * }
 * ```
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Alias for backward compatibility with EnhancedPermissionsGuard
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
