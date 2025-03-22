import { Injectable } from '@nestjs/common';
import { BullString } from '../../../common/bull/consts/bull-string.const';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectQueue(BullString.BALANCE_QUEUE) private readonly balanceQueue: Queue,
  ) {}

  async refreshBalances(): Promise<SuccessResponseDto> {
    await this.balanceQueue.add(BullString.REFRESH_BALANCE_JOB, {});

    return {
      success: true,
    };
  }
}
