import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from '../providers';
import {
  GetUsersRequestDto,
  GetUsersResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UpdateUserRequestDto,
} from '../dto';
import { AuthGuard } from '../../auth/guards';
import { UserEntity } from '../entities';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@ApiTags('auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Регистрация',
  })
  @Post('auth/sign_up')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.userService.register(body);
  }

  @ApiOperation({
    summary: 'Авторизация',
  })
  @Post('auth/sign_in')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.userService.login(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Информация о профиле',
  })
  @Get('profile/my')
  async getProfile(@Request() req: { userId: string }): Promise<UserEntity> {
    return this.userService.getProfile(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Получение всех профилей',
  })
  @Get('profiles')
  async getProfiles(
    @Query() query: GetUsersRequestDto,
  ): Promise<GetUsersResponseDto> {
    return this.userService.getUsers(query);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Редактирование профиля',
  })
  @Patch('profile/my')
  async updateProfile(
    @Body() body: UpdateUserRequestDto,
    @Request() req: { userId: string },
  ): Promise<UserEntity> {
    return this.userService.updateUser({ ...body, _id: req.userId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Удаление профиля',
  })
  @Delete('profile/my')
  async deleteProfile(
    @Request() req: { userId: string },
  ): Promise<SuccessResponseDto> {
    this.userService.deleteUser(req.userId);

    return {
      success: true,
    };
  }
}
