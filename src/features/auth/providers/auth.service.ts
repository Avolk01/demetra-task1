import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  private async generateToken({
    userId,
    login,
  }: JWTPayloadDto): Promise<string> {
    return this.jwtService.signAsync({ userId, login });
  }

  async login({ login, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByLogin(login);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.generateToken({
      userId: user._id,
      login: user.login,
    });

    return {
      access_token: accessToken,
    };
  }

  async register(input: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userService.findOneByLoginOrEmail({
      ...input,
      isActive: false,
    });

    if (existingUser) {
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

    const accessToken = await this.generateToken({
      userId: newUser._id,
      login: newUser.login,
    });

    return {
      access_token: accessToken,
    };
  }
}
