import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetUsersRequestDto,
  GetUsersResponseDto,
  RegisterRequestDto,
} from '../dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userModel: Repository<UserEntity>,
  ) {}

  async findOneByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserEntity> {
    return this.userModel.findOne({
      where: [{ login }, { email }],
    });
  }

  async findOneByLogin(login: string): Promise<UserEntity | null> {
    return this.userModel.findOne({
      where: { login },
    });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return this.userModel.findOne({
      where: { _id: id },
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
      where: { login: Like(`%${loginFilter ?? ''}%`) },
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

  async updateUser(input: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userModel.findOne({
      where: { _id: input._id },
    });

    return this.userModel.save({ ...user, ...input });
  }

  async deleteUserById(id: string): Promise<void> {
    this.userModel.delete({ _id: id });
  }
}
