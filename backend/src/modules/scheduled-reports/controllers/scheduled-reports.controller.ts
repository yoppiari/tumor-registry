import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ScheduledReportsService } from '../services/scheduled-reports.service';
import { CreateScheduledReportDto } from '../dto/create-scheduled-report.dto';
import { UpdateScheduledReportDto } from '../dto/update-scheduled-report.dto';

@ApiTags('scheduled-reports')
@Controller('scheduled-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScheduledReportsController {
  constructor(private readonly scheduledReportsService: ScheduledReportsService) {}

  @Post()
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Create scheduled report' })
  @ApiResponse({ status: 201, description: 'Scheduled report created successfully' })
  async create(@Body() createDto: CreateScheduledReportDto, @Request() req) {
    createDto.createdBy = req.user.id;
    return this.scheduledReportsService.create(createDto);
  }

  @Get()
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get all scheduled reports' })
  @ApiResponse({ status: 200, description: 'Scheduled reports retrieved successfully' })
  async findAll(
    @Query('templateId') templateId?: string,
    @Query('isActive') isActive?: string,
    @Query('deliveryMethod') deliveryMethod?: string,
  ) {
    const filters = {
      templateId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      deliveryMethod,
    };

    return this.scheduledReportsService.findAll(filters);
  }

  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get scheduled report by ID' })
  @ApiResponse({ status: 200, description: 'Scheduled report retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.scheduledReportsService.findOne(id);
  }

  @Put(':id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Update scheduled report' })
  @ApiResponse({ status: 200, description: 'Scheduled report updated successfully' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateScheduledReportDto) {
    return this.scheduledReportsService.update(id, updateDto);
  }

  @Put(':id/toggle')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Toggle scheduled report active status' })
  @ApiResponse({ status: 200, description: 'Scheduled report status toggled successfully' })
  async toggleActive(@Param('id') id: string) {
    return this.scheduledReportsService.toggleActive(id);
  }

  @Delete(':id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete scheduled report' })
  @ApiResponse({ status: 204, description: 'Scheduled report deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.scheduledReportsService.remove(id);
  }

  @Post(':id/execute')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Manually execute scheduled report' })
  @ApiResponse({ status: 200, description: 'Report execution started' })
  async executeNow(@Param('id') id: string, @Body() parameters?: any) {
    return this.scheduledReportsService.executeScheduledReport({
      scheduledReportId: id,
      executionTime: new Date(),
      parameters,
    });
  }
}
