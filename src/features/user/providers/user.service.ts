import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersRequestDto, GetUsersResponseDto } from '../dto';
import { UserRepository } from '.';
import { UserEntity } from '../entities';
import { RegisterRequestDto } from '../../auth/dto';
import { RedisService } from '../../../databases/redis/redis.service';

const GET_USERS_REDIS_KEY = 'get_users';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async getProfile(id: string): Promise<UserEntity> {
    const cashedUserString = await this.redisService.get(id);

    if (cashedUserString) {
      return JSON.parse(cashedUserString);
    }

    const user = await this.userRepository.findOneById(id);

    await this.redisService.set(id, JSON.stringify(user));

    return user;
  }

  async getUsers(query: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    const cashedUsersString = await this.redisService.get(GET_USERS_REDIS_KEY);

    if (cashedUsersString) {
      return JSON.parse(cashedUsersString);
    }

    const users = await this.userRepository.findAllUsers(query);

    await this.redisService.set(GET_USERS_REDIS_KEY, JSON.stringify(users));
    return users;
  }

  async deleteUser(id: string): Promise<void> {
    this.userRepository.deleteUserById(id);
  }

  async updateUser(data: Partial<UserEntity>): Promise<void> {
    this.userRepository.updateUser(data);
  }

  async createUser(input: RegisterRequestDto): Promise<UserEntity> {
    return this.userRepository.createUser(input);
  }

  async findOneByLoginOrEmail(input: {
    login: string;
    email: string;
    isActive: boolean;
  }): Promise<UserEntity> {
    return this.userRepository.findOneByLoginOrEmail(input);
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneById(id);
  }

  async findOneByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByLogin(login);
  }
}
