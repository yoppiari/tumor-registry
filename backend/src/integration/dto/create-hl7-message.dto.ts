import { IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHL7MessageDto {
  @ApiProperty({
    description: 'HL7 message type',
    example: 'ADT'
  })
  @IsString()
  messageType: string;

  @ApiProperty({
    description: 'HL7 trigger event',
    example: 'A01'
  })
  @IsOptional()
  @IsString()
  triggerEvent?: string;

  @ApiProperty({
    description: 'Message control ID',
    example: '12345'
  })
  @IsOptional()
  @IsString()
  messageControlId?: string;

  @ApiProperty({
    description: 'Processing ID',
    example: 'P'
  })
  @IsOptional()
  @IsString()
  processingId?: string;

  @ApiProperty({
    description: 'Version ID',
    example: '2.7'
  })
  @IsOptional()
  @IsString()
  versionId?: string;

  @ApiProperty({
    description: 'Sender system',
    example: 'HIS'
  })
  @IsString()
  sender: string;

  @ApiProperty({
    description: 'Receiver system',
    example: 'INAMSOS'
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    description: 'Raw HL7 message',
    example: 'MSH|^~\\&|HIS|INAMSOS|20240101120000||ADT^A01|12345|P|2.7|...'
  })
  @IsString()
  rawMessage: string;

  @ApiPropertyOptional({
    description: 'Sequence number',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Min(1)
  sequenceNumber?: number;

  @ApiPropertyOptional({
    description: 'Acceptance acknowledgment',
    example: 'AL'
  })
  @IsOptional()
  @IsString()
  acceptanceAcknowledgement?: string;

  @ApiPropertyOptional({
    description: 'Application acknowledgment',
    example: 'AL'
  })
  @IsOptional()
  @IsString()
  applicationAcknowledgement?: string;
}
