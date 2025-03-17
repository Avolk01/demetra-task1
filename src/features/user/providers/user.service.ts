import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersRequestDto, GetUsersResponseDto } from '../dto';
import { UserRepository } from '.';
import { UserEntity } from '../entities';
import { RegisterRequestDto } from '../../auth/dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async getProfile(id: string): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  async getUsers(query: GetUsersRequestDto): Promise<GetUsersResponseDto> {
    return this.userRepository.findAllUsers(query);
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
