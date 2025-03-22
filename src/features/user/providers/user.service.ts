import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GetUsersRequestDto, GetUsersResponseDto } from '../dto';
import { UserRepository } from '.';
import { UserEntity } from '../entities';
import { RegisterRequestDto } from '../../auth/dto';
import { RedisService } from '../../../databases/redis/redis.service';
import { Transactional } from 'typeorm-transactional';

const GET_USERS_REDIS_KEY = 'get_users';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

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

  async refreshBalances(): Promise<void> {
    this.userRepository.refreshBalances();
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

  async findOneByUserId(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneByUserId(id);
  }

  async findOneByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepository.findOneByLogin(login);
  }

  @Transactional()
  async gift(input: {
    fromId: string;
    toId: number;
    amount: number;
  }): Promise<{ balance: number }> {
    try {
      const fromUser = await this.userRepository.findOneById(input.fromId);

      if (!fromUser) {
        throw new HttpException(
          'Отправитель не найден',
          HttpStatus.BAD_REQUEST,
        );
      }

      const toUser = await this.userRepository.findOneByUserId(input.toId);
      if (!toUser) {
        throw new HttpException('Получатель не найден', HttpStatus.BAD_REQUEST);
      }

      if (fromUser.balance - input.amount < 0) {
        throw new HttpException('Не хватает средств', HttpStatus.BAD_REQUEST);
      }

      fromUser.balance -= input.amount;
      toUser.balance = +toUser.balance + input.amount;

      await this.updateUser(fromUser);
      await this.updateUser(toUser);

      this.logger.log('Транзакция выполнена');

      return { balance: +fromUser.balance.toFixed(2) };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
