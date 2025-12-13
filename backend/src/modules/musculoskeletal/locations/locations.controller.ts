import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import {
  BoneLocationDto,
  SoftTissueLocationDto,
  GetBoneLocationsQueryDto,
  GetSoftTissueLocationsQueryDto,
} from './dto/location.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Anatomical Locations')
@ApiBearerAuth()
@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  // ==================== BONE LOCATIONS ====================

  @Get('bone')
  @ApiOperation({ summary: 'Get all bone locations' })
  async getAllBoneLocations(
    @Query() query: GetBoneLocationsQueryDto,
  ): Promise<BoneLocationDto[]> {
    return this.service.findAllBoneLocations(
      query.level,
      query.region,
      query.includeChildren,
    );
  }

  @Get('bone/regions')
  @ApiOperation({ summary: 'Get bone regions (Level 1)' })
  async getBoneRegions(): Promise<BoneLocationDto[]> {
    return this.service.getBoneRegions();
  }

  @Get('bone/:id')
  @ApiOperation({ summary: 'Get bone location by ID' })
  async getBoneLocationById(@Param('id') id: string): Promise<BoneLocationDto> {
    return this.service.findBoneLocationById(id);
  }

  @Get('bone/:id/children')
  @ApiOperation({ summary: 'Get children of bone location' })
  async getBoneLocationChildren(@Param('id') id: string): Promise<BoneLocationDto[]> {
    return this.service.findBoneLocationsByParentId(id);
  }

  // ==================== SOFT TISSUE LOCATIONS ====================

  @Get('soft-tissue')
  @ApiOperation({ summary: 'Get all soft tissue locations' })
  async getAllSoftTissueLocations(
    @Query() query: GetSoftTissueLocationsQueryDto,
  ): Promise<SoftTissueLocationDto[]> {
    return this.service.findAllSoftTissueLocations(query.anatomicalRegion);
  }

  @Get('soft-tissue/regions')
  @ApiOperation({ summary: 'Get soft tissue anatomical regions' })
  async getSoftTissueRegions(): Promise<string[]> {
    return this.service.getSoftTissueRegions();
  }

  @Get('soft-tissue/:id')
  @ApiOperation({ summary: 'Get soft tissue location by ID' })
  async getSoftTissueLocationById(@Param('id') id: string): Promise<SoftTissueLocationDto> {
    return this.service.findSoftTissueLocationById(id);
  }
}
