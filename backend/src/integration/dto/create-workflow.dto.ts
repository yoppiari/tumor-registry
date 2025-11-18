import { IsString, IsEnum, IsArray, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkflowDto {
  @ApiProperty({
    description: 'Workflow name',
    example: 'ADT to FHIR Patient Conversion'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Workflow description',
    example: 'Converts HL7 ADT messages to FHIR Patient resources'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Workflow type',
    enum: ['inbound', 'outbound', 'bi_directional'],
    example: 'inbound'
  })
  @IsEnum(['inbound', 'outbound', 'bi_directional'])
  type: 'inbound' | 'outbound' | 'bi_directional';

  @ApiProperty({
    description: 'Workflow trigger configuration',
    example: {
      type: 'event',
      condition: 'message.type == "ADT"'
    }
  })
  @IsObject()
  trigger: any;

  @ApiProperty({
    description: 'Workflow steps',
    type: Array,
    example: [
      {
        id: 'step-1',
        name: 'Receive HL7 Message',
        type: 'receive',
        order: 1,
        configuration: { protocol: 'tcp', port: 2575 }
      }
    ]
  })
  @IsArray()
  steps: any[];

  @ApiPropertyOptional({
    description: 'Workflow configuration',
    example: {
      parallel: false,
      transactional: true,
      rollbackOnFailure: true,
      logging: { enabled: true, level: 'info', detailed: true },
      monitoring: { enabled: true, alerts: true, metrics: true }
    }
  })
  @IsOptional()
  @IsObject()
  configuration?: any;
}