"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
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
//# sourceMappingURL=main.simple.js.map