import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the organization member',
    enum: Role,
    example: 'ADMIN',
  })
  @IsEnum(Role, {
    message: 'Role must be OWNER, ADMIN, MANAGER, ANALYST, or VIEWER',
  })
  role: Role;
}
