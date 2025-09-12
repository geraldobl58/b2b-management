import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'ACME Corporation',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2, {
    message: 'Organization name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'Organization name must not exceed 100 characters',
  })
  name: string;

  @ApiProperty({
    description: 'Organization slug (unique identifier)',
    example: 'acme-corp',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2, { message: 'Slug must be at least 2 characters long' })
  @MaxLength(50, { message: 'Slug must not exceed 50 characters' })
  slug: string;

  @ApiPropertyOptional({
    description: 'Organization domain',
    example: 'acme.com',
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    description: 'Company size range',
    example: '51-200',
  })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiPropertyOptional({
    description: 'Organization timezone',
    example: 'America/New_York',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Billing email address',
    example: 'billing@acme.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  billingEmail?: string;

  @ApiPropertyOptional({
    description: 'Subscription plan',
    enum: PlanType,
    example: 'BASIC',
    default: 'BASIC',
  })
  @IsOptional()
  @IsEnum(PlanType, { message: 'Plan must be BASIC, PRO, or ENTERPRISE' })
  plan?: PlanType;
}
