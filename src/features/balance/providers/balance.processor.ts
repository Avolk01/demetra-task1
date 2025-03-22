import { BullString } from '../../../common/bull/consts/bull-string.const';
import { Process, Processor } from '@nestjs/bull';
import { UserService } from '../../../features/user/providers';
import { Logger } from '@nestjs/common';

@Processor(BullString.BALANCE_QUEUE)
export class BalanceProcessor {
  private logger = new Logger(BalanceProcessor.name);

  constructor(private readonly userService: UserService) {}

  @Process(BullString.REFRESH_BALANCE_JOB)
  async refreshBalancesJob(): Promise<void> {
    this.userService.refreshBalances();

    this.logger.log({
      message: 'job обработан',
      job: BullString.REFRESH_BALANCE_JOB,
    });
  }
}
