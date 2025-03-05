import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  GetUsersRequestDto,
  GetUsersResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto';
import { UserRepository } from '.';
import { AuthService } from '../../auth/providers';
import { UserEntity } from '../entities';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findOneByLoginOrEmail(
      input.login,
      input.email,
    );

    if (existingUser) {
      throw new HttpException(
        'Такой пользователь уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(
      input.password,
      +this.configService.get('PASSWORD_BCRYPT_ROUND'),
    );

    const newUser = await this.userRepository.createUser({
      ...input,
      password: hashedPassword,
    });

    const accessToken = await this.authService.generateToken({
      userId: newUser._id,
      login: newUser.login,
    });

    return {
      access_token: accessToken,
    };
  }

  async login({ login, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOneByLogin(login);

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.authService.generateToken({
      userId: user._id,
      login: user.login,
    });

    return {
      access_token: accessToken,
    };
  }

  async getProfile(id: string): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  async getUsers(query: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    return this.userRepository.findAllUsers(query);
  }

  async deleteUser(id: string): Promise<void> {
    this.userRepository.deleteUserById(id);
  }

  async updateUser(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.updateUser(data);
  }
}
