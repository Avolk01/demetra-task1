import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserId } from '../../../common/decorators/user-id.decorator';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

import { UserService } from '../providers';
import {
  GetUsersRequestDto,
  GetUsersResponseDto,
  UpdateUserRequestDto,
} from '../dto';
import { AuthGuard } from '../../auth/guards';
import { UserEntity } from '../entities';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Информация о профиле',
  })
  @Get('profile/my')
  async getProfile(@UserId() userId: string): Promise<UserEntity> {
    return this.userService.getProfile(userId);
  }

  @ApiOperation({
    summary: 'Получение всех профилей',
  })
  @Get('profiles')
  async getProfiles(
    @Query() query: GetUsersRequestDto,
  ): Promise<GetUsersResponseDto> {
    return this.userService.getUsers(query);
  }

  @ApiOperation({
    summary: 'Редактирование профиля',
  })
  @Patch('profile/my')
  async updateProfile(
    @Body() body: UpdateUserRequestDto,
    @UserId() userId: string,
  ): Promise<void> {
    this.userService.updateUser({ ...body, _id: userId });
  }

  @ApiOperation({
    summary: 'Удаление профиля',
  })
  @Delete('profile/my')
  async deleteProfile(@UserId() userId: string): Promise<SuccessResponseDto> {
    this.userService.deleteUser(userId);

    return {
      success: true,
    };
  }
}
