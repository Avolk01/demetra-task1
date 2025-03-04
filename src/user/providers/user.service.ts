import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../dto';
import { UserRepository } from '.';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async register(input: RegisterRequestDto): Promise<SuccessResponseDto> {
    const user = await this.userRepository.findOneByLogin(input.login);

    if (user) {
      console.log('Пользователь с таким логином уже существует');
      return null;
    }

    //const token = await this.authService.generateJWT({})
  }
}
