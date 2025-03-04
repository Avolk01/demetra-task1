import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./src/common/config/.env', '.env'],
      isGlobal: true,
    }),
  ],
})
export class ConfigureModule {}
