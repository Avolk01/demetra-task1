import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AvatarService } from '../providers';
import { AuthGuard } from '../../../features/auth/guards';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { IUploadedMulterFile } from 'src/files/s3/interfaces/upload-file.interface';
import { RemovePhotoRequestDto } from '../dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiOperation({
    summary: 'Загрузить новое фото',
  })
  @Post('upload')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile('file') file: IUploadedMulterFile,
    @UserId() userId: string,
  ): Promise<{ path: string }> {
    return this.avatarService.upload({ file, userId });
  }

  @ApiOperation({
    summary: 'Удалить фото',
  })
  @Delete('remove')
  async removePhoto(
    @Body() body: RemovePhotoRequestDto,
    @UserId() userId: string,
  ): Promise<any> {
    return this.avatarService.remove(body.path, userId);
  }

  @ApiOperation({
    summary: 'Получение всех фотографий пользователя',
  })
  @Get('all')
  async getAllAvatars(@UserId() userId: string): Promise<any> {
    return this.avatarService.getAll(userId);
  }
}
