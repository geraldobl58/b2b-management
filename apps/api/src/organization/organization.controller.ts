import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import {
  OrganizationResponseDto,
  OrganizationMemberDto,
} from './dto/organization-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  GetCurrentUser,
  type CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new organization',
    description: 'Creates a new organization with the current user as owner',
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Organization slug already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Organization slug already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.organizationService.create(user.id, createOrganizationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user organizations',
    description: 'Returns all organizations where the current user is a member',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: [OrganizationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  findAll(@GetCurrentUser() user: CurrentUser) {
    return this.organizationService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization details',
    description: 'Returns detailed information about a specific organization',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Organization not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  findOne(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.organizationService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates organization details (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
    schema: {
      example: {
        statusCode: 403,
        message: 'Insufficient permissions',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.organizationService.update(id, user.id, updateOrganizationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Deletes an organization (requires OWNER role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only owners can delete organizations',
    schema: {
      example: {
        statusCode: 403,
        message: 'Insufficient permissions',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.organizationService.remove(id, user.id);
  }

  @Get(':id/members')
  @ApiOperation({
    summary: 'Get organization members',
    description: 'Returns all members of the organization',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Members retrieved successfully',
    type: [OrganizationMemberDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found or access denied',
  })
  getMembers(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.organizationService.getMembers(id, user.id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add organization member',
    description:
      'Adds a new member to the organization (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiBody({ type: AddMemberDto })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
    type: OrganizationMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with this email',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found with this email',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User is already a member',
    schema: {
      example: {
        statusCode: 409,
        message: 'User is already a member of this organization',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.organizationService.addMember(id, user.id, addMemberDto);
  }

  @Patch(':id/members/:memberId/role')
  @ApiOperation({
    summary: 'Update member role',
    description:
      'Updates the role of an organization member (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiParam({
    name: 'memberId',
    description: 'Member ID',
    example: 'clxxxxx',
  })
  @ApiBody({ type: UpdateMemberRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully',
    type: OrganizationMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions or invalid role change',
    schema: {
      example: {
        statusCode: 403,
        message: 'Only owners can assign owner roles',
        error: 'Forbidden',
      },
    },
  })
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.organizationService.updateMemberRole(
      id,
      memberId,
      user.id,
      updateMemberRoleDto,
    );
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove organization member',
    description:
      'Removes a member from the organization (requires OWNER or ADMIN role)',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 'clxxxxx',
  })
  @ApiParam({
    name: 'memberId',
    description: 'Member ID',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 204,
    description: 'Member removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Cannot remove owners or insufficient permissions',
    schema: {
      example: {
        statusCode: 403,
        message: 'Cannot remove organization owners',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot remove the last owner',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot remove the last owner from organization',
        error: 'Bad Request',
      },
    },
  })
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.organizationService.removeMember(id, memberId, user.id);
  }
}
