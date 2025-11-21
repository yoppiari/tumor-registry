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
import { PeerReviewService } from './peer-review.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreatePeerReviewDto } from './dto/create-peer-review.dto';
import { AddPeerCommentDto } from './dto/add-peer-comment.dto';
import { CompleteReviewDto } from './dto/complete-review.dto';

@ApiTags('Peer Review')
@Controller('peer-review')
@UseGuards(JwtAuthGuard)
export class PeerReviewController {
  constructor(private readonly peerReviewService: PeerReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Request a peer review for data validation' })
  @ApiResponse({ status: 201, description: 'Peer review requested successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async requestReview(@Body() createDto: CreatePeerReviewDto, @Req() req: any) {
    const userId = req.user.userId;
    return await this.peerReviewService.requestReview(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all peer reviews with filters' })
  @ApiResponse({ status: 200, description: 'Peer reviews retrieved successfully' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'reviewType', required: false })
  @ApiQuery({ name: 'assignedTo', required: false })
  @ApiQuery({ name: 'requestedBy', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: string,
    @Query('reviewType') reviewType?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('requestedBy') requestedBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.peerReviewService.findAll(
      status,
      reviewType,
      assignedTo,
      requestedBy,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get peer review statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@Req() req: any) {
    const userId = req.user.userId;
    return await this.peerReviewService.getReviewStatistics(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get peer review details by ID' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiResponse({ status: 200, description: 'Peer review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Peer review not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.peerReviewService.findById(id);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign peer review to a reviewer' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        assignedTo: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Peer review assigned successfully' })
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('assignedTo') assignedTo: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.assignReview(id, assignedTo, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add threaded comment to peer review' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() commentDto: AddPeerCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.addComment(id, commentDto, userId);
  }

  @Put('comments/:commentId/resolve')
  @ApiOperation({ summary: 'Mark comment as resolved' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment resolved successfully' })
  async resolveComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.resolveComment(commentId, userId);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve peer review' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiResponse({ status: 200, description: 'Peer review approved successfully' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeDto: CompleteReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.approveReview(id, completeDto, userId);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject peer review with reasons' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiResponse({ status: 200, description: 'Peer review rejected successfully' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeDto: CompleteReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.rejectReview(id, completeDto, userId);
  }

  @Post(':id/recognition')
  @ApiOperation({ summary: 'Award recognition for quality review' })
  @ApiParam({ name: 'id', description: 'Peer Review ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reviewerId: { type: 'string' },
        recognitionType: { type: 'string', enum: ['EXCELLENT_REVIEW', 'THOROUGH_ANALYSIS', 'QUICK_TURNAROUND', 'HELPFUL_FEEDBACK', 'QUALITY_IMPROVEMENT', 'EXCEPTIONAL_INSIGHT', 'COLLABORATIVE_APPROACH', 'MENTORSHIP'] },
        title: { type: 'string' },
        description: { type: 'string', required: false },
        points: { type: 'number', default: 10 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Recognition awarded successfully' })
  async awardRecognition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewerId') reviewerId: string,
    @Body('recognitionType') recognitionType: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('points') points: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.peerReviewService.awardRecognition(
      id,
      reviewerId,
      recognitionType,
      title,
      description || '',
      points || 10,
      userId,
    );
  }
}
