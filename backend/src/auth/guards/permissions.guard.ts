import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Guard to enforce permission-based access control
 *
 * This guard checks if the authenticated user has the required permissions
 * to access a route. Permissions are extracted from the JWT token and
 * compared against the permissions specified in the @Permissions decorator.
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Permissions('PATIENT_READ')
 * @Get('patients')
 * getPatients() {
 *   // Route protected by permission check
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user can activate the route
   *
   * @param context - Execution context containing request information
   * @returns true if user has all required permissions, false otherwise
   * @throws ForbiddenException if user lacks required permissions
   */
  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from the route decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get the user from the request (should be set by JWT strategy)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User should be authenticated at this point (via JwtAuthGuard)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user permissions from JWT payload
    // Permissions can be stored in the JWT token or fetched from database
    const userPermissions: string[] = user.permissions || [];

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}], ` +
        `User has: [${userPermissions.join(', ') || 'none'}]`,
      );
    }

    return true;
  }
}
