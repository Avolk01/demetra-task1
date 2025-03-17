import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigureModule } from './common/config/config.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { PostgresModule } from './databases/postgres.module';

@Module({
  imports: [ConfigureModule, UserModule, PostgresModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
