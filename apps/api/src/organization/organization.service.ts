import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Role, PlanType } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrganizationDto: CreateOrganizationDto) {
    // Check if slug already exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: createOrganizationDto.slug },
    });

    if (existingOrg) {
      throw new ConflictException('Organization slug already exists');
    }

    // Create organization with the user as owner
    const organization = await this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
        timezone: createOrganizationDto.timezone || 'UTC',
        plan: createOrganizationDto.plan || PlanType.BASIC,
        users: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return {
      ...organization,
      currentUserRole: Role.OWNER,
    };
  }

  async findAllByUser(userId: string) {
    const organizations = await this.prisma.organization.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          where: { userId },
          select: {
            role: true,
          },
        },
        _count: {
          select: {
            users: true,
            workspaces: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return organizations.map((org) => ({
      ...org,
      currentUserRole: org.users[0]?.role,
      users: undefined, // Remove users array, keep only currentUserRole
      memberCount: org._count.users,
      workspaceCount: org._count.workspaces,
    }));
  }

  async findOne(id: string, userId: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const currentUserRole = organization.users.find(
      (u) => u.userId === userId,
    )?.role;

    return {
      ...organization,
      currentUserRole,
    };
  }

  async update(
    id: string,
    userId: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    // Check if user has permission to update
    await this.checkUserPermission(id, userId, ['OWNER', 'ADMIN']);

    const organization = await this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const currentUserRole = organization.users.find(
      (u) => u.userId === userId,
    )?.role;

    return {
      ...organization,
      currentUserRole,
    };
  }

  async remove(id: string, userId: string) {
    // Only owners can delete organizations
    await this.checkUserPermission(id, userId, ['OWNER']);

    await this.prisma.organization.delete({
      where: { id },
    });

    return { message: 'Organization deleted successfully' };
  }

  async addMember(
    organizationId: string,
    userId: string,
    addMemberDto: AddMemberDto,
  ) {
    // Check if user has permission to add members
    await this.checkUserPermission(organizationId, userId, ['OWNER', 'ADMIN']);

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: addMemberDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const member = await this.prisma.organizationUser.create({
      data: {
        organizationId,
        userId: user.id,
        role: addMemberDto.role || Role.VIEWER,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return member;
  }

  async updateMemberRole(
    organizationId: string,
    memberId: string,
    userId: string,
    updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    // Check if user has permission to update roles
    await this.checkUserPermission(organizationId, userId, ['OWNER', 'ADMIN']);

    // Get current user role and member info
    const [currentUser, member] = await Promise.all([
      this.prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
      }),
      this.prisma.organizationUser.findUnique({
        where: {
          id: memberId,
          organizationId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Prevent non-owners from changing owner roles
    if (currentUser?.role !== Role.OWNER && member.role === Role.OWNER) {
      throw new ForbiddenException('Only owners can modify owner roles');
    }

    // Prevent non-owners from setting owner roles
    if (
      currentUser?.role !== Role.OWNER &&
      updateMemberRoleDto.role === Role.OWNER
    ) {
      throw new ForbiddenException('Only owners can assign owner roles');
    }

    const updatedMember = await this.prisma.organizationUser.update({
      where: { id: memberId },
      data: { role: updateMemberRoleDto.role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updatedMember;
  }

  async removeMember(organizationId: string, memberId: string, userId: string) {
    // Check if user has permission to remove members
    await this.checkUserPermission(organizationId, userId, ['OWNER', 'ADMIN']);

    const member = await this.prisma.organizationUser.findUnique({
      where: {
        id: memberId,
        organizationId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Prevent removing owners (unless it's the owner removing themselves)
    if (member.role === Role.OWNER && member.userId !== userId) {
      throw new ForbiddenException('Cannot remove organization owners');
    }

    // Check if this is the last owner
    if (member.role === Role.OWNER) {
      const ownerCount = await this.prisma.organizationUser.count({
        where: {
          organizationId,
          role: Role.OWNER,
        },
      });

      if (ownerCount === 1) {
        throw new BadRequestException(
          'Cannot remove the last owner from organization',
        );
      }
    }

    await this.prisma.organizationUser.delete({
      where: { id: memberId },
    });

    return { message: 'Member removed successfully' };
  }

  async getMembers(organizationId: string, userId: string) {
    // Check if user has access to organization
    await this.checkUserPermission(organizationId, userId);

    const members = await this.prisma.organizationUser.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // Owners first
        { createdAt: 'asc' },
      ],
    });

    return members;
  }

  private async checkUserPermission(
    organizationId: string,
    userId: string,
    allowedRoles?: Role[],
  ) {
    const userOrganization = await this.prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (!userOrganization) {
      throw new NotFoundException('Organization not found or access denied');
    }

    if (allowedRoles && !allowedRoles.includes(userOrganization.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return userOrganization;
  }
}
