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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { QueryContractDto } from './dto/query-contract.dto';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetCurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new contract',
    description: 'Only ADMIN and BUSINESS users can create contracts',
  })
  @ApiResponse({
    status: 201,
    description: 'Contract successfully created',
    schema: {
      example: {
        id: 'uuid',
        name: 'Contract Name',
        partner: 'Partner Name',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        client: {
          id: 'uuid',
          companyName: 'Company Name',
          fantasyName: 'Fantasy Name',
        },
        campaigns: [],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Only ADMIN and BUSINESS users can create contracts',
  })
  @ApiResponse({
    status: 409,
    description: 'Contract name already exists',
  })
  create(
    @Body() createContractDto: CreateContractDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.contractsService.create(createContractDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all contracts',
    description: 'Retrieve a paginated list of contracts with optional filters',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by contract name',
  })
  @ApiQuery({
    name: 'partner',
    required: false,
    description: 'Filter by partner name',
  })
  @ApiResponse({
    status: 200,
    description: 'Contracts retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            name: 'Contract Name',
            partner: 'Partner Name',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            client: {
              id: 'uuid',
              companyName: 'Company Name',
              fantasyName: 'Fantasy Name',
            },
            campaigns: [],
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
  findAll(@Query() query: QueryContractDto) {
    return this.contractsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get contract by ID',
    description: 'Retrieve a specific contract with full details',
  })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract retrieved successfully',
    schema: {
      example: {
        id: 'uuid',
        name: 'Contract Name',
        partner: 'Partner Name',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        client: {
          id: 'uuid',
          companyName: 'Company Name',
          fantasyName: 'Fantasy Name',
        },
        campaigns: [
          {
            id: 'uuid',
            name: 'Campaign Name',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            type: 'INCENTIVO',
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
    description: 'Contract not found',
  })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @ApiOperation({
    summary: 'Update contract',
    description: 'Only ADMIN and BUSINESS users can update contracts',
  })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Only ADMIN and BUSINESS users can update contracts',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.contractsService.update(id, updateContractDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete contract',
    description:
      'Only ADMIN and BUSINESS users can delete contracts. Cannot delete contracts with existing campaigns.',
  })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 204,
    description: 'Contract deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Only ADMIN and BUSINESS users can delete contracts',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete contract with existing campaigns',
  })
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.contractsService.remove(id, user);
  }
}
