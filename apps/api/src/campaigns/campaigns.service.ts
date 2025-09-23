import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import type { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  private canModifyCampaigns(userRole: Role): boolean {
    return userRole === Role.ADMIN || userRole === Role.BUSINESS;
  }

  async create(dto: CreateCampaignDto, user: CurrentUser) {
    if (!this.canModifyCampaigns(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can create campaigns',
      );
    }

    const existingCampaign = await this.prisma.campaign.findFirst({
      where: {
        name: dto.name,
        clientId: dto.clientId,
      },
    });

    if (existingCampaign) {
      throw new ConflictException(
        'Campaign name already exists for this client',
      );
    }

    // Verify client exists
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Verify contract exists if provided
    if (dto.contractId) {
      const contract = await this.prisma.contract.findFirst({
        where: {
          id: dto.contractId,
          clientId: dto.clientId,
        },
      });

      if (!contract) {
        throw new NotFoundException(
          'Contract not found or does not belong to the specified client',
        );
      }
    }

    const {
      name,
      startDate,
      endDate,
      city,
      type,
      branchType,
      observations,
      clientId,
      contractId,
      contacts,
      business,
      config,
    } = dto;

    return await this.prisma.campaign.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        city,
        type,
        branchType,
        observations,
        clientId,
        contractId,
        createdById: user.sub,
        contacts: contacts?.length
          ? {
              create: contacts.map((contact) => ({
                personId: contact.personId,
                role: contact.role,
              })),
            }
          : undefined,
        business: business
          ? {
              create: {
                paymentMethod: business.paymentMethod as any,
                upfront: business.upfront,
                daysToInvoice: business.daysToInvoice,
                notes: business.notes,
                billingModel: business.billingModel,
                estimateMonthly: business.estimateMonthly,
                estimateAnnual: business.estimateAnnual,
                autoInvoicing: business.autoInvoicing,
                priceCycle: business.priceCycle,
                deliveryType: business.deliveryType as any,
                additional: business.additional,
                daysToDeliver: business.daysToDeliver,
                chargeFreight: business.chargeFreight,
                b2b: business.b2b,
              },
            }
          : undefined,
        config: config
          ? {
              create: {
                contractPending: config.contractPending,
                orderConfirmationEnabled: config.orderConfirmationEnabled,
                confirmationTimeMinutes: config.confirmationTimeMinutes,
                differentialFlow: config.differentialFlow,
                blockOrdersDuringCampaign: config.blockOrdersDuringCampaign,
                delinquencyPolicy: config.delinquencyPolicy,
              },
            }
          : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
            addresses: {
              select: {
                state: true,
                city: true,
                district: true,
                zipcode: true,
                street: true,
              }
            }
          },
        },
        contract: {
          select: {
            id: true,
            name: true,
            partner: true,
          },
        },
        contacts: {
          include: {
            person: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        business: true,
        config: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryCampaignDto) {
    const {
      name,
      clientId,
      contractId,
      type,
      branchType,
      city,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (contractId) {
      where.contractId = contractId;
    }

    if (type) {
      where.type = type;
    }

    if (branchType) {
      where.branchType = branchType;
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      };
    }

    if (startDateFrom || startDateTo) {
      where.startDate = {};
      if (startDateFrom) {
        where.startDate.gte = new Date(startDateFrom);
      }
      if (startDateTo) {
        where.startDate.lte = new Date(startDateTo);
      }
    }

    if (endDateFrom || endDateTo) {
      where.endDate = {};
      if (endDateFrom) {
        where.endDate.gte = new Date(endDateFrom);
      }
      if (endDateTo) {
        where.endDate.lte = new Date(endDateTo);
      }
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          client: {
            select: {
              id: true,
              companyName: true,
              fantasyName: true,
              cnpj: true,
              addresses: {
                select: {
                  state: true,
                  city: true,
                  district: true,
                  zipcode: true,
                  street: true,
                }
              }
            },
          },
          contract: {
            select: {
              id: true,
              name: true,
              partner: true,
            },
          },
          contacts: {
            include: {
              person: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          business: true,
          config: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return {
      data: campaigns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
            addresses: {
              select: {
                state: true,
                city: true,
                district: true,
                zipcode: true,
                street: true,
              }
            }
          },
        },
        contract: {
          select: {
            id: true,
            name: true,
            partner: true,
          },
        },
        contacts: {
          include: {
            person: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        business: true,
        config: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto, user: CurrentUser) {
    if (!this.canModifyCampaigns(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can update campaigns',
      );
    }

    const existingCampaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check for name conflict if name is being changed
    if (dto.name && dto.name !== existingCampaign.name) {
      const nameConflict = await this.prisma.campaign.findFirst({
        where: {
          name: dto.name,
          clientId: dto.clientId || existingCampaign.clientId,
          id: { not: id },
        },
      });

      if (nameConflict) {
        throw new ConflictException(
          'Campaign name already exists for this client',
        );
      }
    }

    // Verify contract exists if provided
    if (dto.contractId) {
      const contract = await this.prisma.contract.findFirst({
        where: {
          id: dto.contractId,
          clientId: dto.clientId || existingCampaign.clientId,
        },
      });

      if (!contract) {
        throw new NotFoundException(
          'Contract not found or does not belong to the specified client',
        );
      }
    }

    const {
      name,
      startDate,
      endDate,
      city,
      type,
      branchType,
      observations,
      clientId,
      contractId,
      contacts,
      business,
      config,
    } = dto;

    return await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(city !== undefined && { city }),
        ...(type && { type }),
        ...(branchType && { branchType }),
        ...(observations !== undefined && { observations }),
        ...(clientId && { clientId }),
        ...(contractId !== undefined && { contractId }),
        ...(contacts && {
          contacts: {
            deleteMany: {},
            create: contacts.map((contact) => ({
              personId: contact.personId,
              role: contact.role,
            })),
          },
        }),
        ...(business && {
          business: {
            upsert: {
              create: {
                paymentMethod: business.paymentMethod as any,
                upfront: business.upfront,
                daysToInvoice: business.daysToInvoice,
                notes: business.notes,
                billingModel: business.billingModel,
                estimateMonthly: business.estimateMonthly,
                estimateAnnual: business.estimateAnnual,
                autoInvoicing: business.autoInvoicing,
                priceCycle: business.priceCycle,
                deliveryType: business.deliveryType as any,
                additional: business.additional,
                daysToDeliver: business.daysToDeliver,
                chargeFreight: business.chargeFreight,
                b2b: business.b2b,
              },
              update: {
                paymentMethod: business.paymentMethod as any,
                upfront: business.upfront,
                daysToInvoice: business.daysToInvoice,
                notes: business.notes,
                billingModel: business.billingModel,
                estimateMonthly: business.estimateMonthly,
                estimateAnnual: business.estimateAnnual,
                autoInvoicing: business.autoInvoicing,
                priceCycle: business.priceCycle,
                deliveryType: business.deliveryType as any,
                additional: business.additional,
                daysToDeliver: business.daysToDeliver,
                chargeFreight: business.chargeFreight,
                b2b: business.b2b,
              },
            },
          },
        }),
        ...(config && {
          config: {
            upsert: {
              create: {
                contractPending: config.contractPending,
                orderConfirmationEnabled: config.orderConfirmationEnabled,
                confirmationTimeMinutes: config.confirmationTimeMinutes,
                differentialFlow: config.differentialFlow,
                blockOrdersDuringCampaign: config.blockOrdersDuringCampaign,
                delinquencyPolicy: config.delinquencyPolicy,
              },
              update: {
                contractPending: config.contractPending,
                orderConfirmationEnabled: config.orderConfirmationEnabled,
                confirmationTimeMinutes: config.confirmationTimeMinutes,
                differentialFlow: config.differentialFlow,
                blockOrdersDuringCampaign: config.blockOrdersDuringCampaign,
                delinquencyPolicy: config.delinquencyPolicy,
              },
            },
          },
        }),
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            fantasyName: true,
            cnpj: true,
            addresses: {
              select: {
                state: true,
                city: true,
                district: true,
                zipcode: true,
                street: true,
              }
            }
          },
        },
        contract: {
          select: {
            id: true,
            name: true,
            partner: true,
          },
        },
        contacts: {
          include: {
            person: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        business: true,
        config: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, user: CurrentUser) {
    if (!this.canModifyCampaigns(user.role)) {
      throw new ForbiddenException(
        'Only ADMIN and BUSINESS users can delete campaigns',
      );
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.prisma.campaign.delete({
      where: { id },
    });

    return { message: 'Campaign deleted successfully' };
  }
}
