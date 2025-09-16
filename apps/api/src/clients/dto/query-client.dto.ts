import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaxpayerType } from '@prisma/client';

import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryClientDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ example: 10, description: 'Items per page (max 100)' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Empresa',
    description: 'Search by company or fantasy name',
  })
  search?: string;

  @IsOptional()
  @IsEnum(TaxpayerType)
  @ApiPropertyOptional({
    enum: TaxpayerType,
    description: 'Filter by taxpayer type',
  })
  taxpayerType?: TaxpayerType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'SP', description: 'Filter by state' })
  state?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'São Paulo', description: 'Filter by city' })
  city?: string;
}
