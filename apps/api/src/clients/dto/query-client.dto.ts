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
    example: 'Empresa LTDA',
    description: 'Filter by company name',
  })
  companyName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Empresa Corp',
    description: 'Filter by fantasy name',
  })
  fantasyName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '12.345.678/0001-90',
    description: 'Filter by CNPJ',
  })
  cnpj?: string;

  @IsOptional()
  @IsEnum(TaxpayerType)
  @ApiPropertyOptional({
    enum: TaxpayerType,
    description: 'Filter by taxpayer type',
  })
  taxpayerType?: TaxpayerType;
}
