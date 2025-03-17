import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'token' })
  refreshToken: string;
}
