import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
} from '../dto';
import { AuthService } from '../providers';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация',
  })
  @Post('auth/sign_up')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(body);
  }

  @ApiOperation({
    summary: 'Авторизация',
  })
  @Post('auth/sign_in')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Public()
  @ApiOperation({
    summary: 'Обновление рефреш токена',
  })
  @Post('auth/refresh')
  async refresh(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.refresh(body.refreshToken);
  }
}
