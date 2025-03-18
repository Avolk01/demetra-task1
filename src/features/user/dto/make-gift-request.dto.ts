import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class MakeGiftRequestDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
