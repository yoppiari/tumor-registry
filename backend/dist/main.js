"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            configService.get('FRONTEND_URL'),
        ].filter(Boolean),
        credentials: true,
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
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT') || 3001;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application running on http://localhost:${port}`);
    logger.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
}
bootstrap().catch((error) => {
    console.error('❌ Bootstrap failed:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map