import { Module } from '@nestjs/common';
import { PathologyTypesModule } from './pathology-types/pathology-types.module';
import { TumorSyndromesModule } from './tumor-syndromes/tumor-syndromes.module';
import { LocationsModule } from './locations/locations.module';
import { WhoClassificationsModule } from './who-classifications/who-classifications.module';
import { MstsScoresModule } from './msts-scores/msts-scores.module';
import { FollowUpsModule } from './follow-ups/follow-ups.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { CpcModule } from './cpc/cpc.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // Phase 2: Reference Data Modules
    PathologyTypesModule,
    TumorSyndromesModule,
    LocationsModule,
    WhoClassificationsModule,
    // Phase 7: Clinical Management Modules
    MstsScoresModule,
    FollowUpsModule,
    TreatmentsModule,
    CpcModule,
    // Phase 8: Analytics Module
    AnalyticsModule,
  ],
  exports: [
    PathologyTypesModule,
    TumorSyndromesModule,
    LocationsModule,
    WhoClassificationsModule,
    MstsScoresModule,
    FollowUpsModule,
    TreatmentsModule,
    CpcModule,
    AnalyticsModule,
  ],
})
export class MusculoskeletalModule {}
