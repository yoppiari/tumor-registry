"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedPermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../../../auth/decorators/permissions.decorator");
let EnhancedPermissionsGuard = class EnhancedPermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const requiredPermissions = this.reflector.get(permissions_decorator_1.PERMISSIONS_KEY, context.getHandler());
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const userPermissions = user.permissions || [];
        const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException(`Insufficient permissions. Required: [${requiredPermissions.join(', ')}], ` +
                `User has: [${userPermissions.join(', ') || 'none'}]`);
        }
        await this.checkRoleBasedAccess(context, user);
        await this.checkCenterBasedAccess(context, user);
        return true;
    }
    async checkRoleBasedAccess(context, user) {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.route?.path || request.url;
        const roleRestrictions = {
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
                        throw new common_1.ForbiddenException(`Role '${user.role}' not authorized for ${method} ${url}. ` +
                            `Allowed roles: [${allowedRoles.join(', ')}]`);
                    }
                }
            }
        }
    }
    async checkCenterBasedAccess(context, user) {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.route?.path || request.url;
        if (user.role !== 'NATIONAL_ADMIN' && user.role !== 'ADMIN') {
            const targetCenterId = request.params.centerId ||
                request.body.centerId ||
                request.query.centerId;
            if (targetCenterId && targetCenterId !== user.centerId) {
                const readOnlyAllowed = this.isReadOnlyAllowed(url, method);
                if (!readOnlyAllowed) {
                    throw new common_1.ForbiddenException('Access denied: You can only access data from your own center');
                }
            }
        }
    }
    matchRoute(url, pattern) {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\//g, '\\/');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(url);
    }
    isReadOnlyAllowed(url, method) {
        const readOnlyPatterns = [
            '/analytics/statistics',
            '/research/statistics',
            '/reports',
            '/dashboard',
        ];
        return method === 'GET' &&
            readOnlyPatterns.some(pattern => url.includes(pattern));
    }
};
exports.EnhancedPermissionsGuard = EnhancedPermissionsGuard;
exports.EnhancedPermissionsGuard = EnhancedPermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], EnhancedPermissionsGuard);
//# sourceMappingURL=enhanced-permissions.guard.js.map