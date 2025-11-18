export interface EmailVerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface EmailOptions {
  to: string;
  subject: string;
  template: 'verification' | 'reset_password';
  data?: any;
}