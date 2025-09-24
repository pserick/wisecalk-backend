import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './infrastructure/auth/decorators/public.decorator';
import {
  HealthResponseDto,
  DatabaseHealthResponseDto,
} from './common/dtos/health-response.dto';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the overall health status of the API server',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    type: HealthResponseDto,
  })
  async getHealth(): Promise<HealthResponseDto> {
    return this.appService.getHealth();
  }

  @Get('health/db')
  @Public()
  @ApiOperation({
    summary: 'Database Health Check',
    description: 'Returns the health status of the database connection and basic statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Database is healthy',
    type: DatabaseHealthResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Database connection failed',
    type: DatabaseHealthResponseDto,
  })
  async getDbHealth(): Promise<DatabaseHealthResponseDto> {
    return this.appService.getDbHealth();
  }
}
