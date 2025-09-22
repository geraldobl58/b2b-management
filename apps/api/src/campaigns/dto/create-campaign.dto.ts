import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignType, BranchType, ContactRole } from '@prisma/client';

export class CreateCampaignContactDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'person-id-123',
    description: 'Person ID for the contact',
  })
  personId: string;

  @IsEnum(ContactRole)
  @IsNotEmpty()
  @ApiProperty({
    enum: ContactRole,
    example: ContactRole.CAMPAIGN_MANAGER,
    description: 'Contact role in the campaign',
  })
  role: ContactRole;
}

export class CreateBusinessModelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'CREDIT_CARD',
    description: 'Payment method',
  })
  paymentMethod: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Whether payment is upfront',
  })
  upfront?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: 30,
    description: 'Days to invoice',
  })
  daysToInvoice?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Payment terms and conditions',
    description: 'Additional payment notes',
  })
  notes?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Monthly billing',
    description: 'Billing model',
  })
  billingModel?: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: 1000.5,
    description: 'Monthly estimate amount',
  })
  estimateMonthly?: number;

  @IsOptional()
  @ApiPropertyOptional({
    example: 12000.0,
    description: 'Annual estimate amount',
  })
  estimateAnnual?: number;

  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'Auto invoicing enabled',
  })
  autoInvoicing?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'MONTHLY',
    description: 'Price cycle',
  })
  priceCycle?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'DIGITAL',
    description: 'Delivery type',
  })
  deliveryType: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Additional services',
  })
  additional?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: 5,
    description: 'Days to deliver',
  })
  daysToDeliver?: number;

  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Charge freight',
  })
  chargeFreight?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'B2B campaign',
  })
  b2b?: boolean;
}

export class CreateCampaignConfigDto {
  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Contract pending status',
  })
  contractPending?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'Order confirmation enabled',
  })
  orderConfirmationEnabled?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: 10,
    description: 'Confirmation time in minutes',
  })
  confirmationTimeMinutes?: number;

  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Differential flow enabled',
  })
  differentialFlow?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Block orders during campaign',
  })
  blockOrdersDuringCampaign?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Standard delinquency policy',
    description: 'Delinquency policy',
  })
  delinquencyPolicy?: string;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Campaign Marketing 2024',
    description: 'Campaign name',
  })
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-01',
    description: 'Campaign start date in YYYY-MM-DD format',
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-12-31',
    description: 'Campaign end date in YYYY-MM-DD format',
  })
  endDate: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'São Paulo',
    description: 'Campaign city',
  })
  city?: string;

  @IsEnum(CampaignType)
  @IsNotEmpty()
  @ApiProperty({
    enum: CampaignType,
    example: CampaignType.MKT,
    description: 'Campaign type',
  })
  type: CampaignType;

  @IsEnum(BranchType)
  @IsOptional()
  @ApiPropertyOptional({
    enum: BranchType,
    example: BranchType.MATRIZ,
    description: 'Branch type',
  })
  branchType?: BranchType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Campaign observations and notes',
    description: 'Campaign observations',
  })
  observations?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'client-id-123',
    description: 'Client ID that this campaign belongs to',
  })
  clientId: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: 'contract-id-123',
    description: 'Contract ID that this campaign belongs to',
  })
  contractId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCampaignContactDto)
  @ApiPropertyOptional({
    type: [CreateCampaignContactDto],
    description: 'Campaign contacts',
  })
  contacts?: CreateCampaignContactDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessModelDto)
  @ApiPropertyOptional({
    type: CreateBusinessModelDto,
    description: 'Business model configuration',
  })
  business?: CreateBusinessModelDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCampaignConfigDto)
  @ApiPropertyOptional({
    type: CreateCampaignConfigDto,
    description: 'Campaign configuration',
  })
  config?: CreateCampaignConfigDto;
}
