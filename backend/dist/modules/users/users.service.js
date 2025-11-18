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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(userData) {
        const { passwordHash, role, centerId, ...userFields } = userData;
        let userCenterId = centerId;
        if (!centerId) {
            const center = await this.databaseService.client.$queryRaw `
        INSERT INTO system.centers (id, name, code, province, is_active, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          'Default Center',
          'DEFAULT',
          'DKI Jakarta',
          true,
          NOW(),
          NOW()
        )
        RETURNING id, name, code, province
      `;
            userCenterId = center[0]?.id;
        }
        const user = await this.databaseService.client.$queryRaw `
      INSERT INTO system.users (id, email, name, kolegium_id, password_hash, phone, nik, is_active, is_email_verified, center_id, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${userData.email},
        ${userData.name},
        ${userData.kolegiumId},
        ${passwordHash},
        ${userData.phone || null},
        ${userData.nik || null},
        true,
        false,
        ${userCenterId},
        NOW(),
        NOW()
      )
      RETURNING id, email, name, kolegium_id, is_active, is_email_verified, center_id
    `;
        const createdUser = user[0];
        await this.databaseService.client.$queryRaw `
      INSERT INTO system.user_roles (id, user_id, role_id, is_active, created_at)
      VALUES (
        gen_random_uuid(),
        ${createdUser.id},
        (SELECT id FROM system.roles WHERE code = ${role}),
        true,
        NOW()
      )
    `;
        return this.findById(createdUser.id);
    }
    async findById(id) {
        const users = await this.databaseService.client.$queryRaw `
      SELECT
        u.*,
        c.name as center_name,
        c.code as center_code,
        r.name as role_name,
        r.code as role_code
      FROM system.users u
      LEFT JOIN system.centers c ON u.center_id = c.id
      LEFT JOIN system.user_roles ur ON u.id = ur.user_id
      LEFT JOIN system.roles r ON ur.role_id = r.id
      WHERE u.id = ${id} AND ur.is_active = true
      LIMIT 1
    `;
        return users[0] || null;
    }
    async findByEmail(email) {
        const users = await this.databaseService.client.$queryRaw `
      SELECT
        u.*,
        c.name as center_name,
        r.name as role_name,
        r.code as role_code
      FROM system.users u
      LEFT JOIN system.centers c ON u.center_id = c.id
      LEFT JOIN system.user_roles ur ON u.id = ur.user_id
      LEFT JOIN system.roles r ON ur.role_id = r.id
      WHERE u.email = ${email} AND ur.is_active = true
      LIMIT 1
    `;
        return users[0] || null;
    }
    async update(id, updateData) {
        const updates = [];
        const values = [];
        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = $${updates.length + 1}`);
                values.push(value);
            }
        });
        if (updates.length === 0) {
            return this.findById(id);
        }
        updates.push('updated_at = NOW()');
        values.push(id);
        const query = `
      UPDATE system.users
      SET ${updates.join(', ')}
      WHERE id = $${updates.length + 1}
      RETURNING *
    `;
        const users = await this.databaseService.client.$queryRaw(query, ...values);
        return users[0];
    }
    async getUserRole(userId) {
        const roles = await this.databaseService.client.$queryRaw `
      SELECT r.code as role_code, r.name as role_name
      FROM system.roles r
      JOIN system.user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ${userId} AND ur.is_active = true
      LIMIT 1
    `;
        return roles[0]?.role_code || 'STAFF';
    }
    async findAll() {
        const users = await this.databaseService.client.$queryRaw `
      SELECT
        u.id,
        u.email,
        u.name,
        u.is_active,
        u.is_email_verified,
        u.created_at,
        c.name as center_name,
        r.name as role_name
      FROM system.users u
      LEFT JOIN system.centers c ON u.center_id = c.id
      LEFT JOIN system.user_roles ur ON u.id = ur.user_id
      LEFT JOIN system.roles r ON ur.role_id = r.id
      WHERE ur.is_active = true
      ORDER BY u.created_at DESC
    `;
        return users;
    }
    async updateRole(userId, roleCode) {
        await this.databaseService.client.$queryRaw `
      UPDATE system.user_roles
      SET is_active = false, updated_at = NOW()
      WHERE user_id = ${userId}
    `;
        await this.databaseService.client.$queryRaw `
      INSERT INTO system.user_roles (id, user_id, role_id, is_active, created_at)
      SELECT
        gen_random_uuid(),
        ${userId},
        r.id,
        true,
        NOW()
      FROM system.roles r
      WHERE r.code = ${roleCode}
    `;
        await this.databaseService.client.$queryRaw `
      INSERT INTO audit.audit_logs (id, user_id, action, resource, details, created_at)
      VALUES (
        gen_random_uuid(),
        ${userId},
        'ROLE_UPDATE',
        'user',
        jsonb_build_object('old_role', 'updated', 'new_role', ${roleCode}),
        NOW()
      )
    `;
        return this.findById(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map