import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { QueryContractDto } from './dto/query-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import type { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  private canModifyContracts(userRole: Role): boolean {
    return userRole === Role.ADMIN || userRole === Role.BUSINESS;
  }

  async create(dto: CreateContractDto, user: CurrentUser) {
    if (!this.canModifyContracts(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can create contracts',
      );
    }

    const existeContracts = await this.prisma.contract.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existeContracts) {
      throw new ConflictException('Contract name already exists');
    }

    const { clientId, name, partner, startDate, endDate } = dto;

    return await this.prisma.contract.create({
      data: {
        clientId,
        name,
        partner,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdById: user.sub,
      },
      include: {
        campaigns: true,
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryContractDto) {
    const {
      page = 1,
      limit = 10,
      name,
      partner,
      clientName,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (partner) {
      where.partner = { contains: partner, mode: 'insensitive' };
    }

    if (clientName) {
      where.client = {
        OR: [
          {
            companyName: {
              contains: clientName,
              mode: 'insensitive',
            },
          },
          {
            fantasyName: {
              contains: clientName,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    // Date range filtering: find contracts that overlap with the search range
    // A contract overlaps with the search range if:
    // - The contract starts before or on the search end date, AND
    // - The contract ends after or on the search start date
    if (startDate && endDate) {
      // Convert search dates to proper Date objects
      const searchStartDate = new Date(startDate);
      const searchEndDate = new Date(endDate);

      // Set search start to beginning of day
      searchStartDate.setUTCHours(0, 0, 0, 0);
      // Set search end to end of day
      searchEndDate.setUTCHours(23, 59, 59, 999);

      // Both dates provided - find contracts that overlap with the range
      where.AND = [
        {
          startDate: {
            lte: searchEndDate, // Contract starts before or on search end date
          },
        },
        {
          endDate: {
            gte: searchStartDate, // Contract ends after or on search start date
          },
        },
      ];
    } else if (startDate) {
      const searchStartDate = new Date(startDate);
      searchStartDate.setUTCHours(0, 0, 0, 0);

      // Only start date provided - find contracts that are active on or after this date
      where.endDate = {
        gte: searchStartDate,
      };
    } else if (endDate) {
      const searchEndDate = new Date(endDate);
      searchEndDate.setUTCHours(23, 59, 59, 999);

      // Only end date provided - find contracts that are active on or before this date
      where.startDate = {
        lte: searchEndDate,
      };
    }

    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        include: {
          campaigns: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
              type: true,
            },
          },
          client: {
            select: {
              id: true,
              companyName: true,
              fantasyName: true,
              cnpj: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.contract.count({ where }),
    ]);

    // Transform data to include computed clientName field
    const transformedContracts = contracts.map((contract) => ({
      ...contract,
      clientName:
        contract.client?.fantasyName || contract.client?.companyName || 'N/A',
    }));

    return {
      data: transformedContracts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: {
        id,
      },
      include: {
        campaigns: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            type: true,
          },
        },
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  async update(id: string, dto: UpdateContractDto, user: CurrentUser) {
    if (!this.canModifyContracts(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can update contracts',
      );
    }

    const contract = await this.prisma.contract.findUnique({
      where: {
        id,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const { clientId, name, partner, startDate, endDate } = dto;

    return await this.prisma.contract.update({
      where: {
        id,
      },
      data: {
        ...(clientId && { clientId }),
        ...(name && { name }),
        ...(partner && { partner }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        campaigns: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            type: true,
          },
        },
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, user: CurrentUser) {
    if (!this.canModifyContracts(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can delete contracts',
      );
    }

    const contract = await this.prisma.contract.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            campaigns: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract._count.campaigns > 0) {
      throw new ConflictException(
        'Cannot delete contract with existing campaigns',
      );
    }

    await this.prisma.contract.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Contract deleted successfully',
    };
  }
}
