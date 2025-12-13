import { Module } from '@nestjs/common';
import { SecurityMonitoringController } from './security-monitoring.controller';
import { SecurityMonitoringService } from './security-monitoring.service';
import { ThreatDetectionService } from './services/threat-detection.service';
import { BehavioralAnalyticsService } from './services/behavioral-analytics.service';

@Module({
  controllers: [SecurityMonitoringController],
  providers: [SecurityMonitoringService, ThreatDetectionService, BehavioralAnalyticsService],
  exports: [SecurityMonitoringService, ThreatDetectionService, BehavioralAnalyticsService],
})
export class SecurityMonitoringModule {}
