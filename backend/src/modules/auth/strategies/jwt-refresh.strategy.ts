import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    const refreshToken = req.headers['authorization']?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new Error('Refresh token not provided');
    }

    // Verify refresh token exists and is valid
    const user = await this.authService.validateRefreshToken(payload.sub, refreshToken);

    if (!user) {
      throw new Error('Invalid or expired refresh token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      centerId: payload.centerId,
    };
  }
}