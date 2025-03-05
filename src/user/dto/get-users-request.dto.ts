import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetUsersRequestDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsNumberString()
  page: number;

  @ApiProperty({ example: 10, required: true })
  @IsNotEmpty()
  @IsNumberString()
  perPage: number;

  @ApiProperty({ example: 'login', required: false })
  @IsOptional()
  @IsString()
  loginFilter?: string;
}
