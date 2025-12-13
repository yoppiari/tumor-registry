import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhoClassificationsService } from './who-classifications.service';
import {
  WhoBoneTumorDto,
  WhoSoftTissueTumorDto,
  GetBoneTumorsQueryDto,
  GetSoftTissueTumorsQueryDto,
} from './dto/who-classification.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('WHO Tumor Classifications')
@ApiBearerAuth()
@Controller('who-classifications')
@UseGuards(JwtAuthGuard)
export class WhoClassificationsController {
  constructor(private readonly service: WhoClassificationsService) {}

  // ==================== BONE TUMORS ====================

  @Get('bone')
  @ApiOperation({ summary: 'Get all WHO bone tumor classifications' })
  async getAllBoneTumors(@Query() query: GetBoneTumorsQueryDto): Promise<WhoBoneTumorDto[]> {
    return this.service.findAllBoneTumors(
      query.category,
      query.subcategory,
      query.isMalignant,
      query.search,
    );
  }

  @Get('bone/categories')
  @ApiOperation({ summary: 'Get bone tumor categories' })
  async getBoneTumorCategories(): Promise<string[]> {
    return this.service.getBoneTumorCategories();
  }

  @Get('bone/subcategories')
  @ApiOperation({ summary: 'Get bone tumor subcategories' })
  async getBoneTumorSubcategories(@Query('category') category?: string) {
    return this.service.getBoneTumorSubcategories(category);
  }

  @Get('bone/:id')
  @ApiOperation({ summary: 'Get bone tumor classification by ID' })
  async getBoneTumorById(@Param('id') id: string): Promise<WhoBoneTumorDto> {
    return this.service.findBoneTumorById(id);
  }

  // ==================== SOFT TISSUE TUMORS ====================

  @Get('soft-tissue')
  @ApiOperation({ summary: 'Get all WHO soft tissue tumor classifications' })
  async getAllSoftTissueTumors(
    @Query() query: GetSoftTissueTumorsQueryDto,
  ): Promise<WhoSoftTissueTumorDto[]> {
    return this.service.findAllSoftTissueTumors(
      query.category,
      query.subcategory,
      query.isMalignant,
      query.search,
    );
  }

  @Get('soft-tissue/categories')
  @ApiOperation({ summary: 'Get soft tissue tumor categories' })
  async getSoftTissueTumorCategories(): Promise<string[]> {
    return this.service.getSoftTissueTumorCategories();
  }

  @Get('soft-tissue/subcategories')
  @ApiOperation({ summary: 'Get soft tissue tumor subcategories' })
  async getSoftTissueTumorSubcategories(@Query('category') category?: string) {
    return this.service.getSoftTissueTumorSubcategories(category);
  }

  @Get('soft-tissue/:id')
  @ApiOperation({ summary: 'Get soft tissue tumor classification by ID' })
  async getSoftTissueTumorById(@Param('id') id: string): Promise<WhoSoftTissueTumorDto> {
    return this.service.findSoftTissueTumorById(id);
  }
}
