import { IsString, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CommentType {
  GENERAL = 'GENERAL',
  QUESTION = 'QUESTION',
  CONCERN = 'CONCERN',
  SUGGESTION = 'SUGGESTION',
  APPROVAL = 'APPROVAL',
  REJECTION = 'REJECTION',
  CLARIFICATION = 'CLARIFICATION',
  FOLLOW_UP = 'FOLLOW_UP',
}

export enum CommentSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class AddPeerCommentDto {
  @ApiProperty({ description: 'Comment text' })
  @IsString()
  comment: string;

  @ApiPropertyOptional({ description: 'Parent comment ID for threaded comments' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ enum: CommentType, default: 'GENERAL' })
  @IsOptional()
  @IsEnum(CommentType)
  commentType?: CommentType;

  @ApiPropertyOptional({ enum: CommentSeverity, default: 'INFO' })
  @IsOptional()
  @IsEnum(CommentSeverity)
  severity?: CommentSeverity;

  @ApiPropertyOptional({ description: 'Reference to specific data field/line' })
  @IsOptional()
  @IsString()
  lineReference?: string;

  @ApiPropertyOptional({ description: 'Suggested correction or improvement' })
  @IsOptional()
  @IsString()
  suggestion?: string;

  @ApiPropertyOptional({ description: 'Is this an internal comment', default: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;

  @ApiPropertyOptional({ description: 'User IDs mentioned in the comment', type: [String] })
  @IsOptional()
  @IsArray()
  mentions?: string[];

  @ApiPropertyOptional({ description: 'Attachments', type: Object })
  @IsOptional()
  attachments?: any;
}
