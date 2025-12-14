import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Research')
@Controller('research/requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  @ApiOperation({ summary: 'Get all research requests for current user' })
  @ApiResponse({ status: 200, description: 'Research requests retrieved successfully' })
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.researchService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get research request by ID' })
  @ApiResponse({ status: 200, description: 'Research request retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  async findById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return await this.researchService.findById(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new research request' })
  @ApiResponse({ status: 201, description: 'Research request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createDto: any, @Req() req: any) {
    const userId = req.user.userId;
    return await this.researchService.create(createDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update research request' })
  @ApiResponse({ status: 200, description: 'Research request updated successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.researchService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete research request' })
  @ApiResponse({ status: 200, description: 'Research request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return await this.researchService.delete(id, userId);
  }
}
