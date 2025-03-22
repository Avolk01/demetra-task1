import { Module } from '@nestjs/common';
import { BalanceController } from './controllers';
import { BalanceService } from './providers';
import { UserModule } from '../user/user.module';
import { BalanceProcessor } from './providers/balance.processor';
import { BullModule } from '@nestjs/bull';
import { BullString } from '../../common/bull/consts/bull-string.const';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: BullString.BALANCE_QUEUE,
    }),
  ],

  controllers: [BalanceController],
  providers: [BalanceService, BalanceProcessor],
  exports: [BalanceService],
})
export class BalanceModule {}
