import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  JWTPayloadDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/providers';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login({ login, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByLogin(login);

    if (!user) {
      this.logger.error({ message: 'Пользователь не найден' });
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      this.logger.error({ message: 'Неверный логин или пароль' });
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { accessToken, refreshToken } = await this.getTokens({
      login: user.login,
      userId: user._id,
    });

    await this.refreshTokenRepository.deleteTokenByUserId(user._id);

    await this.refreshTokenRepository.createToken({
      token: refreshToken,
      userId: user._id,
    });

    this.logger.log({
      message: 'Пользователь успешно авторизирован',
      userId: user.id,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(input: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userService.findOneByLoginOrEmail({
      ...input,
      isActive: false,
    });

    if (existingUser) {
      this.logger.error({
        message: 'Такой пользователь уже зарегистрирован или был удален',
      });
      throw new HttpException(
        'Такой пользователь уже зарегистрирован или был удален',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(
      input.password,
      +this.configService.get('PASSWORD_BCRYPT_ROUND'),
    );

    const newUser = await this.userService.createUser({
      ...input,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.getTokens({
      login: newUser.login,
      userId: newUser._id,
    });

    await this.refreshTokenRepository.createToken({
      token: refreshToken,
      userId: newUser._id,
    });

    this.logger.log({
      message: 'Пользователь успешно создан',
      userId: newUser.id,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(token: string): Promise<LoginResponseDto> {
    try {
      const payload: JWTPayloadDto = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const refreshTokenEntity =
        await this.refreshTokenRepository.findOneByToken(token);

      if (!refreshTokenEntity) {
        throw new UnauthorizedException();
      }

      const { accessToken, refreshToken } = await this.getTokens(payload);

      await this.refreshTokenRepository.deleteToken(token);

      await this.refreshTokenRepository.createToken({
        token: refreshToken,
        userId: payload.userId,
      });

      this.logger.log({
        message: 'Рефреш токен обновлен',
        userId: payload.userId,
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
    }
  }

  private async getTokens(input: {
    login: string;
    userId: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(
      {
        login: input.login,
        userId: input.userId,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        login: input.login,
        userId: input.userId,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
