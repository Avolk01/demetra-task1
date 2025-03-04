import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostgresModule } from './common/db/postgres.module';
import { ConfigureModule } from './common/config/config.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigureModule, UserModule, PostgresModule],
  controllers: [AppController],
})
export class AppModule {}
