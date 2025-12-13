import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CaseReviewService } from './case-review.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { AssignReviewDto } from './dto/assign-review.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@ApiTags('Case Review')
@Controller('case-review')
@UseGuards(JwtAuthGuard)
export class CaseReviewController {
  constructor(private readonly caseReviewService: CaseReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case review for complex/unusual cases' })
  @ApiResponse({ status: 201, description: 'Case review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateCaseReviewDto, @Req() req: any) {
    const userId = req.user.userId;
    return await this.caseReviewService.createCaseReview(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all case reviews with filters' })
  @ApiResponse({ status: 200, description: 'Case reviews retrieved successfully' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'assignedTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: string,
    @Query('specialty') specialty?: string,
    @Query('priority') priority?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.caseReviewService.findAll(
      status,
      specialty,
      priority,
      assignedTo,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get case review queue statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiQuery({ name: 'specialty', required: false })
  async getStatistics(@Query('specialty') specialty?: string, @Req() req?: any) {
    const userId = req?.user?.userId;
    return await this.caseReviewService.getQueueStatistics(specialty, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case review details by ID' })
  @ApiParam({ name: 'id', description: 'Case Review ID' })
  @ApiResponse({ status: 200, description: 'Case review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Case review not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.caseReviewService.findById(id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign case review to a specialist' })
  @ApiParam({ name: 'id', description: 'Case Review ID' })
  @ApiResponse({ status: 200, description: 'Case review assigned successfully' })
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignDto: AssignReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.caseReviewService.assignReview(id, assignDto, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to case review (threaded)' })
  @ApiParam({ name: 'id', description: 'Case Review ID' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() commentDto: AddCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.caseReviewService.addComment(id, commentDto, userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update case review status' })
  @ApiParam({ name: 'id', description: 'Case Review ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'ESCALATED', 'CANCELLED', 'ON_HOLD'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.caseReviewService.updateStatus(id, status, userId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete case review with outcome' })
  @ApiParam({ name: 'id', description: 'Case Review ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reviewNotes: { type: 'string' },
        outcome: { type: 'string', enum: ['RESOLVED', 'REQUIRES_ACTION', 'ESCALATED', 'DEFERRED', 'NO_ACTION_NEEDED', 'TRAINING_OPPORTUNITY'] },
        resolution: { type: 'string' },
      },
      required: ['reviewNotes', 'outcome'],
    },
  })
  @ApiResponse({ status: 200, description: 'Case review completed successfully' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewNotes') reviewNotes: string,
    @Body('outcome') outcome: string,
    @Body('resolution') resolution?: string,
    @Req() req?: any,
  ) {
    const userId = req?.user?.userId;
    return await this.caseReviewService.completeReview(id, reviewNotes, outcome, resolution, userId);
  }
}
