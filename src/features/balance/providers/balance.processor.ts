import { BullString } from '../../../common/bull/consts/bull-string.const';
import { Process, Processor } from '@nestjs/bull';
import { UserService } from '../../../features/user/providers';

@Processor(BullString.BALANCE_QUEUE)
export class BalanceProcessor {
  constructor(private readonly userService: UserService) {}

  @Process(BullString.REFRESH_BALANCE_JOB)
  async refreshBalancesJob(): Promise<void> {
    this.userService.refreshBalances();
  }
}
