import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create Fastify adapter with Bun-compatible options
  const adapter = new FastifyAdapter({
    logger: false,
    trustProxy: true,
    bodyLimit: 10485760, // 10MB
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter as any,
  );

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Register Fastify plugins
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  await app.register(cors, {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      configService.get<string>('FRONTEND_URL'),
    ].filter(Boolean),
    credentials: true,
  });

  // Register multipart only for multipart/form-data content type
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    attachFieldsToBody: false, // Don't interfere with JSON parsing
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('INAMSOS API')
    .setDescription('Indonesian National Cancer Database API')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('patients')
    .addTag('centers')
    .addTag('analytics')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application running on http://localhost:${port}`);
  logger.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
  logger.log(`⚡ Powered by Fastify + Bun`);
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});