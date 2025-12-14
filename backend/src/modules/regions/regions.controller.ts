import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegionsService } from './regions.service';

@ApiTags('Regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all Indonesian provinces (Public - no auth required)' })
  @ApiResponse({ status: 200, description: 'Returns all 34 provinces' })
  async findAllProvinces() {
    return await this.regionsService.findAllProvinces();
  }

  @Get('provinces/:provinceId')
  @ApiOperation({ summary: 'Get province by ID (Public - no auth required)' })
  @ApiParam({ name: 'provinceId', description: 'Province ID' })
  @ApiResponse({ status: 200, description: 'Returns province details' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  async findProvinceById(@Param('provinceId') provinceId: string) {
    const province = await this.regionsService.findProvinceById(provinceId);
    if (!province) {
      return { success: false, message: 'Province not found' };
    }
    return province;
  }

  @Get('provinces/:provinceId/regencies')
  @ApiOperation({ summary: 'Get regencies by province ID (Public - no auth required)' })
  @ApiParam({ name: 'provinceId', description: 'Province ID' })
  @ApiResponse({ status: 200, description: 'Returns regencies (kabupaten/kota) in the province' })
  async findRegenciesByProvinceId(@Param('provinceId') provinceId: string) {
    return await this.regionsService.findRegenciesByProvinceId(provinceId);
  }

  @Get('regencies/:regencyId/districts')
  @ApiOperation({ summary: 'Get districts by regency ID (Public - no auth required)' })
  @ApiParam({ name: 'regencyId', description: 'Regency ID' })
  @ApiResponse({ status: 200, description: 'Returns districts (kecamatan) in the regency' })
  async findDistrictsByRegencyId(@Param('regencyId') regencyId: string) {
    return await this.regionsService.findDistrictsByRegencyId(regencyId);
  }

  @Get('districts/:districtId/villages')
  @ApiOperation({ summary: 'Get villages by district ID (Public - no auth required)' })
  @ApiParam({ name: 'districtId', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'Returns villages (kelurahan/desa) in the district' })
  async findVillagesByDistrictId(@Param('districtId') districtId: string) {
    return await this.regionsService.findVillagesByDistrictId(districtId);
  }
}
