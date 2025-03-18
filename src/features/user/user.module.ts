import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, UserRepository } from './providers';
import { UserController } from './controllers';
import { UserEntity } from './entities';
import { AuthModule } from 'src/features/auth/auth.module';
import { RedisModule } from 'src/databases/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, RedisModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
