import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { SamlService } from './services/saml.service';
import { OidcService } from './services/oidc.service';
import { CreateSsoConfigDto, UpdateSsoConfigDto, SsoLoginDto } from './dto/sso.dto';

@Injectable()
export class SsoService {
  constructor(
    private prisma: PrismaService,
    private samlService: SamlService,
    private oidcService: OidcService,
  ) {}

  async createSsoConfig(centerId: string, dto: CreateSsoConfigDto, userId: string) {
    // Validate provider-specific configuration
    if (dto.provider === 'SAML2') {
      this.validateSamlConfig(dto.configuration);
    } else if (dto.provider === 'OIDC') {
      this.validateOidcConfig(dto.configuration);
    }

    const config = await this.prisma.ssoConfiguration.create({
      data: {
        centerId,
        provider: dto.provider,
        providerName: dto.providerName,
        configuration: dto.configuration,
        isActive: dto.isActive ?? true,
        autoProvision: dto.autoProvision ?? true,
        defaultRole: dto.defaultRole,
        attributeMapping: dto.attributeMapping || this.getDefaultAttributeMapping(dto.provider),
        createdById: userId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SSO_CONFIG_CREATED',
        resource: 'SSO_CONFIGURATION',
        details: { centerId, provider: dto.provider, resourceId: config.id },
        ipAddress: '',
        userAgent: '',
      },
    });

    return config;
  }

  async getSsoConfigs(centerId: string) {
    return this.prisma.ssoConfiguration.findMany({
      where: { centerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSsoConfig(id: string) {
    return this.prisma.ssoConfiguration.findUnique({
      where: { id },
    });
  }

  async updateSsoConfig(id: string, dto: UpdateSsoConfigDto, userId: string) {
    const config = await this.prisma.ssoConfiguration.update({
      where: { id },
      data: {
        providerName: dto.providerName,
        configuration: dto.configuration,
        isActive: dto.isActive,
        autoProvision: dto.autoProvision,
        defaultRole: dto.defaultRole,
        attributeMapping: dto.attributeMapping,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SSO_CONFIG_UPDATED',
        resource: 'SSO_CONFIGURATION',
        details: { ...dto, resourceId: id },
        ipAddress: '',
        userAgent: '',
      },
    });

    return config;
  }

  async deleteSsoConfig(id: string, userId: string) {
    await this.prisma.ssoConfiguration.delete({
      where: { id },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SSO_CONFIG_DELETED',
        resource: 'SSO_CONFIGURATION',
        details: { resourceId: id },
        ipAddress: '',
        userAgent: '',
      },
    });

    return { message: 'SSO configuration deleted successfully' };
  }

  async loginViaSso(dto: SsoLoginDto) {
    const config = await this.prisma.ssoConfiguration.findFirst({
      where: {
        id: dto.configId,
        isActive: true,
      },
    });

    if (!config) {
      throw new BadRequestException('SSO configuration not found or inactive');
    }

    let userInfo: any;

    if (config.provider === 'SAML2') {
      userInfo = await this.samlService.validateSamlResponse(dto.samlResponse, config);
    } else if (config.provider === 'OIDC') {
      userInfo = await this.oidcService.validateOidcToken(dto.oidcToken, config);
    } else {
      throw new BadRequestException('Unsupported SSO provider');
    }

    // Map SSO attributes to user attributes
    const mappedUser = this.mapSsoAttributesToUser(userInfo, config.attributeMapping);

    // Auto-provision user if enabled
    let user;
    if (config.autoProvision) {
      user = await this.provisionUser(mappedUser, config);
    } else {
      user = await this.prisma.user.findUnique({
        where: { email: mappedUser.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found. Auto-provisioning is disabled.');
      }
    }

    // Log SSO login
    await this.prisma.ssoLogin.create({
      data: {
        userId: user.id,
        configId: config.id,
        provider: config.provider,
        externalUserId: userInfo.id || userInfo.sub,
        attributes: userInfo,
      },
    });

    return { user, ssoProvider: config.provider };
  }

  async testSsoConfig(id: string) {
    const config = await this.getSsoConfig(id);

    if (!config) {
      throw new BadRequestException('SSO configuration not found');
    }

    let testResult: any;

    try {
      if (config.provider === 'SAML2') {
        testResult = await this.samlService.testSamlConfig(config);
      } else if (config.provider === 'OIDC') {
        testResult = await this.oidcService.testOidcConfig(config);
      }

      return {
        success: true,
        provider: config.provider,
        message: 'SSO configuration test successful',
        details: testResult,
      };
    } catch (error) {
      return {
        success: false,
        provider: config.provider,
        message: 'SSO configuration test failed',
        error: error.message,
      };
    }
  }

  async getSsoLoginHistory(userId: string, limit = 20) {
    return this.prisma.ssoLogin.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        config: {
          select: {
            providerName: true,
            provider: true,
          },
        },
      },
    });
  }

  private validateSamlConfig(config: any) {
    const required = ['entryPoint', 'issuer', 'cert'];
    for (const field of required) {
      if (!config[field]) {
        throw new BadRequestException(`Missing required SAML field: ${field}`);
      }
    }
  }

  private validateOidcConfig(config: any) {
    const required = ['issuer', 'clientId', 'clientSecret', 'authorizationURL', 'tokenURL'];
    for (const field of required) {
      if (!config[field]) {
        throw new BadRequestException(`Missing required OIDC field: ${field}`);
      }
    }
  }

  private getDefaultAttributeMapping(provider: string) {
    if (provider === 'SAML2') {
      return {
        email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
        name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
        firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
        lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      };
    } else if (provider === 'OIDC') {
      return {
        email: 'email',
        name: 'name',
        firstName: 'given_name',
        lastName: 'family_name',
      };
    }
    return {};
  }

  private mapSsoAttributesToUser(userInfo: any, attributeMapping: any) {
    return {
      email: userInfo[attributeMapping.email] || userInfo.email,
      name: userInfo[attributeMapping.name] || userInfo.name,
      firstName: userInfo[attributeMapping.firstName] || userInfo.given_name,
      lastName: userInfo[attributeMapping.lastName] || userInfo.family_name,
    };
  }

  private async provisionUser(mappedUser: any, config: any) {
    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: mappedUser.email },
    });

    if (!user) {
      // Get the role to assign to the user
      const roleCode = config.defaultRole || 'DATA_ENTRY';
      const role = await this.prisma.role.findUnique({
        where: { code: roleCode },
      });

      if (!role) {
        throw new Error(`Role ${roleCode} not found`);
      }

      // Create new user with UserRole relationship
      user = await this.prisma.user.create({
        data: {
          email: mappedUser.email,
          name: mappedUser.name || `${mappedUser.firstName} ${mappedUser.lastName}`,
          centerId: config.centerId,
          passwordHash: '', // SSO users don't have password
          isActive: true,
          isSsoUser: true,
          userRoles: {
            create: {
              roleId: role.id,
              isActive: true,
            },
          },
        },
      });
    }

    return user;
  }
}
