import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken({ userId, login }: JWTPayloadDto): Promise<string> {
    return this.jwtService.signAsync({ userId, login });
  }
}
