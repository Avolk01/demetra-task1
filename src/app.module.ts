import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigureModule } from './common/config/config.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { PostgresModule } from './databases/postgres.module';
import { JwtModule } from '@nestjs/jwt';
import { AvatarModule } from './features/avatars/avatars.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigureModule,
    UserModule,
    PostgresModule,
    AuthModule,
    AvatarModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
