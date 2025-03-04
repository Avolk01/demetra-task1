import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, AuthService, UserRepository } from './providers';
import { UserController } from './controllers';
import { UserEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserRepository, AuthService, UserService],
  exports: [UserService],
})
export class UserModule {}
