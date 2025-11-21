"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const mfa_service_1 = require("./mfa.service");
const email_service_1 = require("./email.service");
const encryption_service_1 = require("./services/encryption.service");
const users_module_1 = require("../users/users.module");
const database_module_1 = require("../../database/database.module");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            database_module_1.DatabaseModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            mfa_service_1.MfaService,
            email_service_1.EmailService,
            encryption_service_1.EncryptionService,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
        ],
        exports: [auth_service_1.AuthService, email_service_1.EmailService, encryption_service_1.EncryptionService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map