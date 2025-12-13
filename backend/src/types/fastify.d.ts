import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId?: string;
      sub?: string;
      id?: string;
      email?: string;
      role?: string;
      [key: string]: any;
    };
  }
}
