import {
  IsEmail,
  IsString,
  MinLength,
  IsStrongPassword,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'janedoe@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    example: 'MyPass123!',
    description:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol. Length: 6-20 chars.',
    minLength: 6,
    maxLength: 20,
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({
    enum: Role,
    example: 'SALES',
    description: 'User role',
  })
  role?: Role;
}
