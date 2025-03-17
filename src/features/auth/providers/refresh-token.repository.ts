import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private tokenModel: Repository<RefreshTokenEntity>,
  ) {}

  async findOneByUserId(userId: string): Promise<RefreshTokenEntity | null> {
    return this.tokenModel.findOne({
      where: { userId },
    });
  }

  async findOneByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.tokenModel.findOne({
      where: { token },
    });
  }

  async updateToken(userId: string, token: string): Promise<void> {
    this.tokenModel.update(
      {
        userId,
      },
      { token },
    );
  }

  async createToken(
    data: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    return this.tokenModel.save(data);
  }

  async deleteToken(token: string): Promise<void> {
    this.tokenModel.delete({
      token,
    });
  }

  async deleteTokenByUserId(userId: string): Promise<void> {
    this.tokenModel.delete({
      userId,
    });
  }
}
