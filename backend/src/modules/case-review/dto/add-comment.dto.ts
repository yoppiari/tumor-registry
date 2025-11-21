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

export class AddCommentDto {
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
