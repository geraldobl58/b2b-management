import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'ACME Corporation Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Organization domain',
    example: 'acme-new.com',
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    example: 'SaaS',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    description: 'Company size range',
    example: '201-500',
  })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiPropertyOptional({
    description: 'Organization timezone',
    example: 'America/Los_Angeles',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
