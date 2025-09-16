import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TaxpayerType, PhoneType } from '@prisma/client';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sede Principal' })
  label: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Invalid zipcode format' })
  @ApiProperty({ example: '01234-567' })
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Rua das Empresas' })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123' })
  number: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Sala 456' })
  complement?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Centro' })
  district?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'São Paulo' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SP' })
  state: string;
}

export class CreatePhoneDto {
  @IsEnum(PhoneType)
  @ApiProperty({ enum: PhoneType, example: 'LANDLINE' })
  type: PhoneType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '(11) 1234-5678' })
  number: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ must be in format XX.XXX.XXX/XXXX-XX',
  })
  @ApiProperty({ example: '12.345.678/0001-90' })
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Empresa Exemplo LTDA' })
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Exemplo Corp' })
  fantasyName: string;

  @IsEnum(TaxpayerType)
  @ApiProperty({ enum: TaxpayerType, example: 'SIMPLES_NACIONAL' })
  taxpayerType: TaxpayerType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '123456789' })
  stateRegistration?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Cliente Premium' })
  typeRelationship?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  @ApiProperty({ type: [CreateAddressDto] })
  addresses: CreateAddressDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhoneDto)
  @ApiProperty({ type: [CreatePhoneDto] })
  phones: CreatePhoneDto[];
}