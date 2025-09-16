import {
  IsEmail,
  IsString,
  MinLength,
  IsStrongPassword,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AdminRegisterDto {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john@example.com' })
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

  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
    example: 'BUSINESS',
    description: 'User role - ADMIN, BUSINESS, TEAM_MEMBER, or VIEWER',
  })
  role: Role;
}
