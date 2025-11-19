import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  getRoot() {
    return {
      message: 'INAMSOS Backend API is running',
      status: 'OK',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'INAMSOS Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}