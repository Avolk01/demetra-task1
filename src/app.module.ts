import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { ConfigureModule } from './common/config/config.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { PostgresModule } from './databases/postgres.module';
import { AvatarModule } from './features/avatars/avatars.module';
import { RedisModule } from './databases/redis/redis.module';
import { BullQueueModule } from './common/bull/bull-queue.module';
import { BalanceModule } from './features/balance/balance.module';

@Module({
  imports: [
    BullQueueModule,
    JwtModule.register({
      global: true,
    }),
    ConfigureModule,
    UserModule,
    PostgresModule,
    AuthModule,
    AvatarModule,
    RedisModule,
    BalanceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
