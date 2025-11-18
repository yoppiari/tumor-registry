import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TokenService } from './token.service';
import { EmailService } from './services/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailVerificationToken } from './interfaces/email.interface';

// Mock database untuk sekarang, nanti akan diganti dengan Prisma
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  centerId?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  // Mock database - akan diganti dengan actual database connection
  private users: User[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@inamsos.id',
      passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', // admin123
      name: 'System Administrator',
      role: 'national_stakeholder',
      centerId: '00000000-0000-0000-0000-000000000001',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'dataentry@rscm.co.id',
      passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK', // admin123
      name: 'Dr. Ahmad Wijaya',
      role: 'data_entry',
      centerId: '00000000-0000-0000-0000-000000000001',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Mock email verification tokens storage
  private emailVerificationTokens: EmailVerificationToken[] = [];

  // Helper method untuk generate verification token
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);

    if (!user || !user.is_active) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new UnauthorizedException('Silakan verifikasi email Anda terlebih dahulu');
    }

    const tokens = await this.tokenService.generateTokenPair(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        centerId: user.centerId,
        email_verified: user.email_verified,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Create new user (mock)
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: registerDto.email,
      passwordHash,
      name: registerDto.name,
      role: registerDto.role,
      centerId: registerDto.centerId,
      is_active: true,
      email_verified: false, // Perlu verifikasi email
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save to mock database
    this.users.push(newUser);

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    const emailToken: EmailVerificationToken = {
      token: verificationToken,
      userId: newUser.id,
      email: newUser.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isUsed: false,
      createdAt: new Date(),
    };

    // Save verification token
    this.emailVerificationTokens.push(emailToken);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(newUser.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Tetap lanjutkan meski email gagal dikirim
    }

    // Generate tokens tapi user tidak bisa login sampai email diverifikasi
    const tokens = await this.tokenService.generateTokenPair(newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        centerId: newUser.centerId,
        email_verified: newUser.email_verified,
      },
      ...tokens,
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshTokenDto.refreshToken);

      // Find user
      const user = this.users.find(u => u.id === payload.sub);

      if (!user || !user.is_active) {
        throw new UnauthorizedException('User tidak ditemukan atau tidak aktif');
      }

      // Generate new token pair
      const tokens = await this.tokenService.generateTokenPair(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          centerId: user.centerId,
          email_verified: user.email_verified,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalid atau expired');
    }
  }

  async logout(userId: string) {
    // Implementasi logout logic - invalidate refresh token
    // Untuk sekarang, kita akan implementasi simple logic
    return { message: 'Logout successful' };
  }

  async verifyEmail(token: string) {
    // Find verification token
    const verificationToken = this.emailVerificationTokens.find(
      vt => vt.token === token && !vt.isUsed && vt.expiresAt > new Date()
    );

    if (!verificationToken) {
      throw new BadRequestException('Token verifikasi invalid atau sudah kadaluarsa');
    }

    // Find user
    const user = this.users.find(u => u.id === verificationToken.userId);

    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    // Mark token as used
    verificationToken.isUsed = true;

    // Verify user email
    user.email_verified = true;
    user.updated_at = new Date();

    return {
      message: 'Email berhasil diverifikasi. Sekarang Anda dapat login.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
      }
    };
  }

  async resendVerificationEmail(email: string) {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      throw new BadRequestException('Email tidak terdaftar');
    }

    if (user.email_verified) {
      throw new BadRequestException('Email sudah terverifikasi');
    }

    // Invalidate existing tokens
    this.emailVerificationTokens
      .filter(vt => vt.email === email && !vt.isUsed)
      .forEach(vt => {
        vt.isUsed = true;
      });

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    const emailToken: EmailVerificationToken = {
      token: verificationToken,
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isUsed: false,
      createdAt: new Date(),
    };

    // Save verification token
    this.emailVerificationTokens.push(emailToken);

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Email verifikasi telah dikirim ulang. Silakan cek inbox Anda.'
    };
  }

  async getCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      centerId: user.centerId,
      email_verified: user.email_verified,
      is_active: user.is_active,
    };
  }
}