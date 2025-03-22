import { Injectable } from '@nestjs/common';
import { IsNull, Like, Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersRequestDto, GetUsersResponseDto } from '../dto';
import { RegisterRequestDto } from '../../auth/dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userModel: Repository<UserEntity>,
  ) {}

  async findOneByLoginOrEmail(input: {
    login: string;
    email: string;
    isActive: boolean;
  }): Promise<UserEntity> {
    const deletedAt = input.isActive ? IsNull() : undefined;

    return this.userModel.findOne({
      where: [
        { login: input.login, deletedAt },
        { email: input.email, deletedAt },
      ],
    });
  }

  async findOneByLogin(login: string): Promise<UserEntity | null> {
    return this.userModel.findOne({
      where: { login, deletedAt: IsNull() },
    });
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return this.userModel.findOne({
      where: { _id: id, deletedAt: IsNull() },
    });
  }

  async findOneByUserId(id: number): Promise<UserEntity | null> {
    return this.userModel.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findAllUsers({
    page,
    perPage,
    loginFilter,
  }: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const [users, count] = await this.userModel.findAndCount({
      where: loginFilter ? { login: Like(`%${loginFilter}%`) } : {},
      skip,
      take,
    });

    return {
      totalUsersCount: count,
      page: +page,
      perPage: +perPage,
      users,
    };
  }

  async createUser(input: RegisterRequestDto): Promise<UserEntity> {
    return this.userModel.save(input);
  }

  async updateUser(input: Partial<UserEntity>): Promise<void> {
    this.userModel.update({ _id: input._id }, input);
  }
  async refreshBalances(): Promise<void> {
    this.userModel.update({}, { balance: 0 });
  }

  async deleteUserById(id: string): Promise<void> {
    const now = new Date();
    this.userModel.update({ _id: id }, { deletedAt: now });
  }
}
