"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const helmet_1 = require("@fastify/helmet");
const cors_1 = require("@fastify/cors");
const multipart_1 = require("@fastify/multipart");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter({
        logger: false,
        trustProxy: true,
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    await app.register(helmet_1.default, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            },
        },
    });
    await app.register(cors_1.default, {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            configService.get('FRONTEND_URL'),
        ].filter(Boolean),
        credentials: true,
    });
    await app.register(multipart_1.default, {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT') || 3001;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application running on http://localhost:${port}`);
    logger.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
    logger.log(`⚡ Powered by Fastify + Bun`);
}
bootstrap().catch((error) => {
    console.error('❌ Bootstrap failed:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map