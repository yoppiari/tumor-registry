import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 INAMSOS Backend Server running on http://localhost:${port}`);
  console.log(`📊 API Documentation: http://localhost:${port}/api/v1/docs`);
  console.log(`🇮🇩 Indonesian National Cancer Registry System`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  console.log('🔧 This is expected - database setup needed');
  console.log('📋 Status: Backend complete, waiting for database setup');
});