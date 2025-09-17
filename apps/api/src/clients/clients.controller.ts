import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  GetCurrentUser,
  type CurrentUser,
} from '../common/decorators/current-user.decorator';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new client',
    description: 'Only ADMIN and BUSINESS users can create clients',
  })
  @ApiResponse({
    status: 201,
    description: 'Client successfully created',
    schema: {
      example: {
        id: 'uuid',
        cnpj: '12.345.678/0001-90',
        companyName: 'Empresa Exemplo LTDA',
        fantasyName: 'Exemplo Corp',
        taxpayerType: 'SIMPLES_NACIONAL',
        stateRegistration: '123456789',
        typeRelationship: 'Cliente Premium',
        addresses: [
          {
            id: 'uuid',
            zipcode: '01234-567',
            street: 'Rua das Empresas',
            number: '123',
            complement: 'Sala 456',
            district: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            isDefault: true,
          },
        ],
        phones: [
          {
            id: 'uuid',
            type: 'LANDLINE',
            number: '(11) 1234-5678',
          },
        ],
        createdBy: {
          id: 'uuid',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN and BUSINESS users can create clients',
  })
  @ApiResponse({
    status: 409,
    description: 'CNPJ already exists',
  })
  create(
    @Body() createClientDto: CreateClientDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.clientsService.create(createClientDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all clients',
    description: 'Retrieve a paginated list of clients with optional filters',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'taxpayerType',
    required: false,
    enum: [
      'INSENTO',
      'MEI',
      'SIMPLES_NACIONAL',
      'LUCRO_PRESUMIDO',
      'LUCRO_REAL',
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            cnpj: '12.345.678/0001-90',
            companyName: 'Empresa Exemplo LTDA',
            fantasyName: 'Exemplo Corp',
            taxpayerType: 'SIMPLES_NACIONAL',
            addresses: [
              {
                id: 'uuid',
                city: 'São Paulo',
                state: 'SP',
                isDefault: true,
              },
            ],
            phones: [
              {
                id: 'uuid',
                type: 'LANDLINE',
                number: '(11) 1234-5678',
              },
            ],
            _count: {
              campaigns: 2,
              contracts: 1,
            },
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
          hasNext: true,
          hasPrev: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get client by ID',
    description: 'Retrieve a specific client with full details',
  })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully',
    schema: {
      example: {
        id: 'uuid',
        cnpj: '12.345.678/0001-90',
        companyName: 'Empresa Exemplo LTDA',
        fantasyName: 'Exemplo Corp',
        taxpayerType: 'SIMPLES_NACIONAL',
        stateRegistration: '123456789',
        typeRelationship: 'Cliente Premium',
        addresses: [
          {
            id: 'uuid',
            zipcode: '01234-567',
            street: 'Rua das Empresas',
            number: '123',
            complement: 'Sala 456',
            district: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            isDefault: true,
          },
        ],
        phones: [
          {
            id: 'uuid',
            type: 'LANDLINE',
            number: '(11) 1234-5678',
          },
        ],
        campaigns: [
          {
            id: 'uuid',
            name: 'Campaign Example',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-12-31T23:59:59.000Z',
            type: 'INCENTIVO',
          },
        ],
        contracts: [
          {
            id: 'uuid',
            code: 'CONTRACT-001',
            brand: 'Brand Name',
            partner: 'Partner Name',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-12-31T23:59:59.000Z',
          },
        ],
        createdBy: {
          id: 'uuid',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @ApiOperation({
    summary: 'Update client',
    description: 'Only ADMIN and BUSINESS users can update clients',
  })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN and BUSINESS users can update clients',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.clientsService.update(id, updateClientDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete client',
    description:
      'Only ADMIN and BUSINESS users can delete clients. Cannot delete clients with existing campaigns or contracts.',
  })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 204,
    description: 'Client deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN and BUSINESS users can delete clients',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete client with existing campaigns or contracts',
  })
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.clientsService.remove(id, user);
  }
}
