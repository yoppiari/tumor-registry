import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { speakeasy } from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, kolegiumId, password, phone, nik } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate kolegium ID if provided
    if (kolegiumId) {
      const isValidKolegium = await this.validateKolegiumId(kolegiumId);
      if (!isValidKolegium) {
        throw new BadRequestException('Invalid kolegium ID');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Determine initial role based on kolegium status
    const initialRole = this.determineInitialRole(kolegiumId);

    // Create user
    const user = await this.usersService.create({
      email,
      name,
      kolegiumId,
      passwordHash,
      phone,
      nik,
      role: initialRole,
    });

    // Generate email verification token
    const verificationToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '24h' },
    );

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    // Generate MFA secret for new user
    const mfaSecret = speakeasy.generateSecret({
      name: `INAMSOS (${user.email})`,
      issuer: 'INAMSOS',
    });

    // Store MFA secret
    await this.usersService.update(user.id, { mfaSecret: mfaSecret.base32 });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        role: initialRole,
      },
      message: 'User registered successfully. Please check your email for verification.',
      verificationToken,
      mfaSecret: mfaSecret.base32,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Check if MFA is required
    if (user.mfaEnabled) {
      // Return temporary token requiring MFA
      const tempToken = this.jwtService.sign(
        { userId: user.id, requireMFA: true },
        { expiresIn: '5m' },
      );

      return {
        requireMFA: true,
        tempToken,
        message: 'MFA code required',
      };
    }

    // Generate access and refresh tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: await this.usersService.getUserRole(user.id),
        centerId: user.centerId,
      },
      ...tokens,
      requireMFA: false,
    };
  }

  async verifyMFA(tempToken: string, mfaCode: string) {
    try {
      const payload = this.jwtService.verify(tempToken);

      if (!payload.requireMFA) {
        throw new BadRequestException('Invalid MFA request');
      }

      const user = await this.usersService.findById(payload.userId);
      if (!user || !user.mfaSecret) {
        throw new UnauthorizedException('User not found or MFA not configured');
      }

      // Verify MFA code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaCode,
        window: 2,
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid MFA code');
      }

      // Generate final tokens
      const tokens = await this.generateTokens(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: await this.usersService.getUserRole(user.id),
          centerId: user.centerId,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired MFA request');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.usersService.findById(payload.userId);
      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      if (user.email === payload.email) {
        await this.usersService.update(user.id, { isEmailVerified: true });

        // Send welcome email
        await this.emailService.sendWelcomeEmail(user.email, user.name, await this.usersService.getUserRole(user.id));

        return { message: 'Email verified successfully' };
      } else {
        throw new BadRequestException('Email mismatch');
      }
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      const user = await this.usersService.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: await this.usersService.getUserRole(user.id),
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login
    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    return user;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: await this.usersService.getUserRole(user.id),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateKolegiumId(kolegiumId: string): Promise<boolean> {
    // In real implementation, this would validate against kolegium database
    // For now, basic validation
    return kolegiumId && kolegiumId.length >= 10;
  }

  private determineInitialRole(kolegiumId?: string): string {
    if (!kolegiumId) {
      return 'STAFF'; // Default role for non-kolegium users
    }

    // For demo purposes, assign roles based on kolegium ID patterns
    if (kolegiumId.startsWith('ADMIN')) {
      return 'NATIONAL_ADMIN';
    } else if (kolegiumId.startsWith('CENTER')) {
      return 'CENTER_ADMIN';
    } else if (kolegiumId.startsWith('RESEARCH')) {
      return 'RESEARCHER';
    } else {
      return 'DATA_ENTRY';
    }
  }
}