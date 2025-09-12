import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanType, Role } from '@prisma/client';

export class OrganizationMemberDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'clxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clxxxxx',
  })
  userId: string;

  @ApiProperty({
    description: 'Member role in organization',
    enum: Role,
    example: 'ADMIN',
  })
  role: Role;

  @ApiProperty({
    description: 'When the user joined the organization',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User information',
  })
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'ACME Corporation',
  })
  name: string;

  @ApiProperty({
    description: 'Organization slug',
    example: 'acme-corp',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Organization domain',
    example: 'acme.com',
  })
  domain?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    example: 'Technology',
  })
  industry?: string;

  @ApiPropertyOptional({
    description: 'Company size',
    example: '51-200',
  })
  companySize?: string;

  @ApiProperty({
    description: 'Organization timezone',
    example: 'UTC',
  })
  timezone: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Billing email',
    example: 'billing@acme.com',
  })
  billingEmail?: string;

  @ApiProperty({
    description: 'Subscription plan',
    enum: PlanType,
    example: 'PRO',
  })
  plan: PlanType;

  @ApiPropertyOptional({
    description: 'Organization members',
    type: [OrganizationMemberDto],
  })
  users?: OrganizationMemberDto[];

  @ApiPropertyOptional({
    description: 'Current user role in this organization',
    enum: Role,
  })
  currentUserRole?: Role;
}
