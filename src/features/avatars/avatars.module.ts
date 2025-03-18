import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarController } from './controllers';
import { AvatarEntity } from './entities/avatar.entity';
import { AvatarRepository, AvatarService } from './providers';
import { Module } from '@nestjs/common';
import { FilesModule } from '../../files/files.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarEntity]), FilesModule, UserModule],
  controllers: [AvatarController],
  providers: [AvatarRepository, AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
