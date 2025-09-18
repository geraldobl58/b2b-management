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
    example: '2024-01-01T00:00:00.000Z',
    description: 'Contract start date in ISO format',
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Contract end date in ISO format',
  })
  endDate: string;
}
