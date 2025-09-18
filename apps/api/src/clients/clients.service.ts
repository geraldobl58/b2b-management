import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import type { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  private canModifyClients(userRole: Role): boolean {
    return userRole === Role.ADMIN || userRole === Role.BUSINESS;
  }

  async create(dto: CreateClientDto, user: CurrentUser) {
    if (!this.canModifyClients(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can create clients',
      );
    }

    const existingClient = await this.prisma.client.findUnique({
      where: { cnpj: dto.cnpj },
    });

    if (existingClient) {
      throw new ConflictException('CNPJ already exists');
    }

    const { addresses, phones, ...clientData } = dto;

    return await this.prisma.client.create({
      data: {
        ...clientData,
        createdById: user.sub,
        addresses: {
          create: addresses.map((address, index) => ({
            ...address,
            isDefault: index === 0,
          })),
        },
        phones: {
          create: phones,
        },
      },
      include: {
        addresses: true,
        phones: true,
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

  async findAll(query: QueryClientDto) {
    const {
      page = 1,
      limit = 10,
      companyName,
      fantasyName,
      cnpj,
      taxpayerType,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (companyName) {
      where.companyName = { contains: companyName, mode: 'insensitive' };
    }

    if (fantasyName) {
      where.fantasyName = { contains: fantasyName, mode: 'insensitive' };
    }

    if (cnpj) {
      where.cnpj = { contains: cnpj };
    }

    if (taxpayerType) {
      where.taxpayerType = taxpayerType;
    }

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          addresses: {
            where: { isDefault: true },
          },
          phones: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              campaigns: true,
              contracts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: clients,
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
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        },
        phones: {
          orderBy: { createdAt: 'asc' },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        campaigns: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            type: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        contracts: {
          select: {
            id: true,
            name: true,
            partner: true,
            startDate: true,
            endDate: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, dto: UpdateClientDto, user: CurrentUser) {
    if (!this.canModifyClients(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can update clients',
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const { addresses, phones, ...clientData } = dto;

    return await this.prisma.client.update({
      where: { id },
      data: {
        ...clientData,
        ...(addresses && {
          addresses: {
            deleteMany: {},
            create: addresses.map((address, index) => ({
              ...address,
              isDefault: index === 0,
            })),
          },
        }),
        ...(phones && {
          phones: {
            deleteMany: {},
            create: phones,
          },
        }),
      },
      include: {
        addresses: true,
        phones: true,
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
    if (!this.canModifyClients(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can delete clients',
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            campaigns: true,
            contracts: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client._count.campaigns > 0 || client._count.contracts > 0) {
      throw new ConflictException(
        'Cannot delete client with existing campaigns or contracts',
      );
    }

    await this.prisma.client.delete({
      where: { id },
    });

    return { message: 'Client deleted successfully' };
  }
}
