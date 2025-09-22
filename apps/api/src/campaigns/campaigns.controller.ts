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
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetCurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new campaign',
    description: 'Only ADMIN and BUSINESS users can create campaigns',
  })
  @ApiResponse({
    status: 201,
    description: 'Campaign successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'campaign-id-123' },
        name: { type: 'string', example: 'Campaign Marketing 2024' },
        startDate: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        endDate: { type: 'string', example: '2024-12-31T00:00:00.000Z' },
        type: { type: 'string', example: 'MKT' },
        client: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyName: { type: 'string' },
            fantasyName: { type: 'string' },
            cnpj: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Campaign name already exists for this client',
  })
  create(
    @Body() createCampaignDto: CreateCampaignDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.campaignsService.create(createCampaignDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all campaigns with optional filtering',
    description: 'Retrieve campaigns with pagination and filtering options',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by campaign name',
    example: 'Marketing',
  })
  @ApiQuery({
    name: 'clientId',
    required: false,
    description: 'Filter by client ID',
    example: 'client-id-123',
  })
  @ApiQuery({
    name: 'contractId',
    required: false,
    description: 'Filter by contract ID',
    example: 'contract-id-123',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by campaign type',
    enum: ['INCENTIVO', 'TRADE', 'MKT', 'ONLINE', 'OFFLINE'],
  })
  @ApiQuery({
    name: 'branchType',
    required: false,
    description: 'Filter by branch type',
    enum: ['MATRIZ', 'FILIAL'],
  })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter by city',
    example: 'São Paulo',
  })
  @ApiQuery({
    name: 'startDateFrom',
    required: false,
    description: 'Filter campaigns starting from this date',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'startDateTo',
    required: false,
    description: 'Filter campaigns starting until this date',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'endDateFrom',
    required: false,
    description: 'Filter campaigns ending from this date',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDateTo',
    required: false,
    description: 'Filter campaigns ending until this date',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    example: 'name',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              type: { type: 'string' },
              client: { type: 'object' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  findAll(@Query() query: QueryCampaignDto) {
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a campaign by ID',
    description: 'Retrieve a specific campaign with all related data',
  })
  @ApiParam({
    name: 'id',
    description: 'Campaign ID',
    example: 'campaign-id-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        type: { type: 'string' },
        client: { type: 'object' },
        contract: { type: 'object' },
        contacts: { type: 'array' },
        business: { type: 'object' },
        config: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign not found',
  })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @ApiOperation({
    summary: 'Update a campaign',
    description: 'Only ADMIN and BUSINESS users can update campaigns',
  })
  @ApiParam({
    name: 'id',
    description: 'Campaign ID',
    example: 'campaign-id-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Campaign name already exists for this client',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.campaignsService.update(id, updateCampaignDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'BUSINESS')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a campaign',
    description: 'Only ADMIN and BUSINESS users can delete campaigns',
  })
  @ApiParam({
    name: 'id',
    description: 'Campaign ID',
    example: 'campaign-id-123',
  })
  @ApiResponse({
    status: 204,
    description: 'Campaign deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign not found',
  })
  remove(@Param('id') id: string, @GetCurrentUser() user: CurrentUser) {
    return this.campaignsService.remove(id, user);
  }
}
