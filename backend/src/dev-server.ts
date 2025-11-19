import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Starting INAMSOS Development Server...');

    // Create NestJS application
    const app = await NestFactory.create(AppModule);

    // Enable CORS for local development
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );

    // Set global prefix
    app.setGlobalPrefix('api/v1');

    // Get port from environment or default to 3001
    const port = process.env.PORT || 3001;

    // Start server
    await app.listen(port, '0.0.0.0');

    logger.log(`✅ INAMSOS Backend Server started successfully!`);
    logger.log(`🌐 Server URL: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api/v1/docs`);
    logger.log(`🇮🇩 Indonesian National Cancer Registry - Development Mode`);
    logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.log('SIGTERM received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.log('SIGINT received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);

    // Provide helpful error messages
    if (error.message.includes('EACCES')) {
      logger.error('💡 Permission denied. Try running with: sudo npm run start:dev');
      logger.error('💡 Or use development mode: npm run start:dev');
    }

    if (error.message.includes('EADDRINUSE')) {
      logger.error('💡 Port 3001 is already in use. Try killing the process:');
      logger.error('💡 sudo lsof -ti:3001 | xargs kill -9');
      logger.error('💡 Or use a different port: PORT=3002 npm run start:dev');
    }

    logger.log('📋 This is normal for first-time setup. The system is ready for database connection.');
    logger.log('🔧 Next step: Setup database and try again.');

    process.exit(1);
  }
}

bootstrap();