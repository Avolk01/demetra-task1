import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../providers';
import { RegisterRequestDto } from '../dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.userService.register(body);
  }
}
