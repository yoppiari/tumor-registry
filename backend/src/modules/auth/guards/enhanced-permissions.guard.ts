import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Injectable()
export class EnhancedPermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.get<string[]>(
      RequirePermissions,
      context.getHandler(),
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get user permissions
    const userPermissions = user.permissions || [];

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}], ` +
        `User has: [${userPermissions.join(', ') || 'none'}]`
      );
    }

    // Additional role-based checks
    await this.checkRoleBasedAccess(context, user);

    // Additional center-based access control for multi-tenant scenarios
    await this.checkCenterBasedAccess(context, user);

    return true;
  }

  private async checkRoleBasedAccess(context: ExecutionContext, user: any): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.route?.path || request.url;

    // Role-based route restrictions
    const roleRestrictions: { [key: string]: { [key: string]: string[] } } = {
      'DELETE': {
        '/research/*': ['ADMIN', 'NATIONAL_ADMIN', 'CENTER_ADMIN'],
        '/patients/*': ['ADMIN', 'NATIONAL_ADMIN', 'CENTER_ADMIN', 'DOCTOR'],
        '/users/*': ['ADMIN', 'NATIONAL_ADMIN'],
      },
      'PUT': {
        '/research/*/approve': ['ADMIN', 'NATIONAL_ADMIN', 'REVIEWER'],
        '/research/*/reject': ['ADMIN', 'NATIONAL_ADMIN', 'REVIEWER'],
        '/users/*/role': ['ADMIN', 'NATIONAL_ADMIN'],
      },
    };

    const methodRestrictions = roleRestrictions[method];
    if (methodRestrictions) {
      for (const pattern in methodRestrictions) {
        if (this.matchRoute(url, pattern)) {
          const allowedRoles = methodRestrictions[pattern];
          if (!allowedRoles.includes(user.role)) {
            throw new ForbiddenException(
              `Role '${user.role}' not authorized for ${method} ${url}. ` +
              `Allowed roles: [${allowedRoles.join(', ')}]`
            );
          }
        }
      }
    }
  }

  private async checkCenterBasedAccess(context: ExecutionContext, user: any): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.route?.path || request.url;

    // Center-based access control for non-national admins
    if (user.role !== 'NATIONAL_ADMIN' && user.role !== 'ADMIN') {
      // Extract center ID from request parameters or body
      const targetCenterId =
        request.params.centerId ||
        request.body.centerId ||
        request.query.centerId;

      // If trying to access other center's data, deny access
      if (targetCenterId && targetCenterId !== user.centerId) {
        // Allow read-only access to some endpoints
        const readOnlyAllowed = this.isReadOnlyAllowed(url, method);
        if (!readOnlyAllowed) {
          throw new ForbiddenException(
            'Access denied: You can only access data from your own center'
          );
        }
      }
    }
  }

  private matchRoute(url: string, pattern: string): boolean {
    // Simple pattern matching - can be enhanced with regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  }

  private isReadOnlyAllowed(url: string, method: string): boolean {
    // Define read-only endpoints that can access cross-center data
    const readOnlyPatterns = [
      '/analytics/statistics',
      '/research/statistics',
      '/reports',
      '/dashboard',
    ];

    return method === 'GET' &&
           readOnlyPatterns.some(pattern => url.includes(pattern));
  }
}