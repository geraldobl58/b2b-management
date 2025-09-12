import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AddMemberDto {
  @ApiProperty({
    description: 'Email address of the user to add',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiPropertyOptional({
    description: 'Role to assign to the user',
    enum: Role,
    example: 'MANAGER',
    default: 'VIEWER',
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'Role must be OWNER, ADMIN, MANAGER, ANALYST, or VIEWER',
  })
  role?: Role;
}
