"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_minimal_module_1 = require("./app.minimal.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_minimal_module_1.AppModule);
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
    console.log(`📊 API Base URL: http://localhost:${port}/api/v1`);
    console.log(`🇮🇩 Indonesian National Cancer Registry System - Minimal Mode`);
    console.log(`✅ Backend is ready for frontend connections!`);
}
bootstrap().catch((error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
});
//# sourceMappingURL=main.minimal.js.map