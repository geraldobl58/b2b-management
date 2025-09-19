import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateContractDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'client-id-123',
    description: 'Client ID that this contract belongs to',
  })
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Contract Marketing 2024',
    description: 'Contract name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Partner Company Ltd',
    description: 'Partner company name',
  })
  partner: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-01',
    description: 'Contract start date in YYYY-MM-DD format',
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-12-31',
    description: 'Contract end date in YYYY-MM-DD format',
  })
  endDate: string;
}
