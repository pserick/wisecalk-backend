import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status indicator',
    example: 'ok',
    enum: ['ok', 'error'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2023-09-23T20:53:38.481Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Server uptime in seconds',
    example: 35.613228083,
  })
  uptime: number;

  @ApiProperty({
    description: 'Current environment',
    example: 'development',
    enum: ['development', 'staging', 'production'],
  })
  environment: string;

  @ApiProperty({
    description: 'API version',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Health status message',
    example: 'WiseCalK Backend is healthy!',
  })
  message: string;
}

export class DatabaseHealthDto {
  @ApiProperty({
    description: 'Database connection status',
    example: true,
  })
  connected: boolean;

  @ApiProperty({
    description: 'Number of users in the database',
    example: 1,
    required: false,
  })
  users?: number;

  @ApiProperty({
    description: 'Number of currencies in the database',
    example: 8,
    required: false,
  })
  currencies?: number;

  @ApiProperty({
    description: 'Error message if connection failed',
    example: 'Connection timeout',
    required: false,
  })
  error?: string;
}

export class DatabaseHealthResponseDto {
  @ApiProperty({
    description: 'Health status indicator',
    example: 'ok',
    enum: ['ok', 'error'],
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2023-09-23T20:53:42.017Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Database health information',
    type: DatabaseHealthDto,
  })
  database: DatabaseHealthDto;

  @ApiProperty({
    description: 'Database health status message',
    example: 'Database connection is healthy!',
  })
  message: string;
}