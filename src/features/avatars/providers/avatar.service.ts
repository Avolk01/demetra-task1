import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AvatarRepository } from './avatar.repository';
import { IFileService } from '../../../files/files.adapter';
import { AvatarEntity } from '../entities';
import { UploadFileRequestDto } from '../dto';

const AVATARS_FOLDER_NAME = 'avatars';
const AVATARS_COUNT_LIMIT = 5;

@Injectable()
export class AvatarService {
  private logger = new Logger(AvatarService.name);

  constructor(
    private readonly avatarRepository: AvatarRepository,
    private readonly minioService: IFileService,
  ) {}

  async upload({
    file,
    userId,
  }: UploadFileRequestDto): Promise<{ path: string }> {
    try {
      const existingAvatars =
        await this.avatarRepository.getActiveAvatars(userId);

      if (existingAvatars.length >= AVATARS_COUNT_LIMIT) {
        throw new HttpException(
          'Достигнут лимит фотографий',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { path } = await this.minioService.uploadFile({
        file,
        folder: AVATARS_FOLDER_NAME,
        name: existingAvatars.length
          ? `${userId}_${existingAvatars[0].id + 1}`
          : `${userId}_0`,
      });

      await this.avatarRepository.createAvatar({ userId, path });

      this.logger.log({ message: 'Фото успешно загружено', path });

      return { path };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async remove(path: string, userId: string): Promise<void> {
    await this.minioService.removeFile({
      path,
    });

    await this.avatarRepository.deleteAvatar({ userId, path });

    this.logger.log({ message: 'Фото успешно удалено' });
  }

  async getAll(userId: string): Promise<AvatarEntity[]> {
    return this.avatarRepository.getAll(userId);
  }
}
