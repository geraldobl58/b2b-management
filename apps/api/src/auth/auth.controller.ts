import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  GetCurrentUser,
  type CurrentUser,
} from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        id: 'uuid',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already in use',
        error: 'Conflict',
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns JWT access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'jwt_token_string',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.email, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile information of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: 'uuid',
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getProfile(@GetCurrentUser() user: CurrentUser): CurrentUser {
    return user;
  }
}
