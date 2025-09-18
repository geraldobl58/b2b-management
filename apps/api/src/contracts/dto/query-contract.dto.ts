import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryContractDto {
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
    example: 'Nome do contrato',
    description: 'Filter by contract name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Empresa Corp',
    description: 'Filter by partner name',
  })
  partner?: string;
}
