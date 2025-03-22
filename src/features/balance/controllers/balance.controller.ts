import { Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceService } from '../providers';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../features/auth/guards';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Обнуляет все балансы пользователей',
  })
  async refreshBalances(): Promise<SuccessResponseDto> {
    return this.balanceService.refreshBalances();
  }
}
