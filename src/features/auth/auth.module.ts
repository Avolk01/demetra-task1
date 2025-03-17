import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService, RefreshTokenRepository } from './providers';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './guards';
import { AuthController } from './controllers';
import { RefreshTokenEntity } from './entities';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RefreshTokenRepository],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
