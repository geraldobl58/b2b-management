import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CampaignType, BranchType } from '@prisma/client';

export class QueryCampaignDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Marketing',
    description: 'Search by campaign name',
  })
  name?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: 'client-id-123',
    description: 'Filter by client ID',
  })
  clientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: 'contract-id-123',
    description: 'Filter by contract ID',
  })
  contractId?: string;

  @IsOptional()
  @IsEnum(CampaignType)
  @ApiPropertyOptional({
    enum: CampaignType,
    example: CampaignType.MKT,
    description: 'Filter by campaign type',
  })
  type?: CampaignType;

  @IsOptional()
  @IsEnum(BranchType)
  @ApiPropertyOptional({
    enum: BranchType,
    example: BranchType.MATRIZ,
    description: 'Filter by branch type',
  })
  branchType?: BranchType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'São Paulo',
    description: 'Filter by city',
  })
  city?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter campaigns starting from this date',
  })
  startDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter campaigns starting until this date',
  })
  startDateTo?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter campaigns ending from this date',
  })
  endDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter campaigns ending until this date',
  })
  endDateTo?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'name',
    description: 'Sort by field',
  })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort order (asc or desc)',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
