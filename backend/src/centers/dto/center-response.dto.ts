import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesResponseDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: -6.1809,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 106.7957,
  })
  longitude: number;
}

export class CenterResponseDto {
  @ApiProperty({
    description: 'Center ID',
    example: 'center-001',
  })
  id: string;

  @ApiProperty({
    description: 'Center name',
    example: 'Rumah Sakit Kanker Dharmais',
  })
  name: string;

  @ApiProperty({
    description: 'Center code',
    example: 'RSCM-DH',
  })
  code: string;

  @ApiProperty({
    description: 'Center type',
    enum: ['hospital', 'clinic', 'laboratory', 'research_center'],
    example: 'hospital',
  })
  type: string;

  @ApiProperty({
    description: 'Center address',
    example: 'Jl. Letjen S. Parman Kav. 84-86',
  })
  address: string;

  @ApiProperty({
    description: 'City',
    example: 'Jakarta Barat',
  })
  city: string;

  @ApiProperty({
    description: 'Province',
    example: 'DKI Jakarta',
  })
  province: string;

  @ApiProperty({
    description: 'Postal code',
    example: '11420',
  })
  postalCode: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+62215680800',
  })
  phone: string;

  @ApiProperty({
    description: 'Email address',
    example: 'info@dharmaishospital.co.id',
  })
  email: string;

  @ApiProperty({
    description: 'Center capacity',
    example: 200,
  })
  capacity: number;

  @ApiProperty({
    description: 'Active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Geographic coordinates',
    type: CoordinatesResponseDto,
    required: false,
  })
  coordinates?: CoordinatesResponseDto;

  @ApiProperty({
    description: 'Medical specialties',
    example: ['Onkologi', 'Radioterapi', 'Kemoterapi'],
    isArray: true,
  })
  specialties: string[];

  @ApiProperty({
    description: 'Available services',
    example: ['Diagnosis', 'Pengobatan', 'Rehabilitasi'],
    isArray: true,
  })
  services: string[];

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}