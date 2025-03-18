import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AvatarEntity } from '../entities/avatar.entity';

@Injectable()
export class AvatarRepository {
  constructor(
    @InjectRepository(AvatarEntity)
    private avatarModel: Repository<AvatarEntity>,
  ) {}

  async deleteAvatar(data: { userId: string; path: string }): Promise<void> {
    const now = new Date();

    this.avatarModel.update(
      {
        userId: data.userId,
        path: data.path,
      },
      { deletedAt: now },
    );
  }

  async createAvatar(data: {
    userId: string;
    path: string;
  }): Promise<AvatarEntity> {
    return this.avatarModel.save({ userId: data.userId, path: data.path });
  }

  async save(data: Partial<AvatarEntity>): Promise<AvatarEntity> {
    return this.avatarModel.save(data);
  }

  async getAll(userId: string): Promise<AvatarEntity[]> {
    return this.avatarModel.find({ where: { userId } });
  }

  async getActiveAvatars(userId: string): Promise<AvatarEntity[]> {
    return this.avatarModel.find({
      order: { id: 'DESC' },
      where: { deletedAt: IsNull(), userId },
    });
  }
}
