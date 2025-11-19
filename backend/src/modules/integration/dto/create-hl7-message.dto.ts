import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHL7MessageDto {
  @ApiProperty({ description: 'HL7 message type', enum: ['ADT', 'ORU', 'ORM'] })
  @IsString()
  @IsNotEmpty()
  messageType: 'ADT' | 'ORU' | 'ORM';

  @ApiProperty({ description: 'HL7 message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Message timestamp', required: false })
  @IsString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({ description: 'Sending facility', required: false })
  @IsString()
  @IsOptional()
  sendingFacility?: string;

  @ApiProperty({ description: 'Receiving facility', required: false })
  @IsString()
  @IsOptional()
  receivingFacility?: string;
}