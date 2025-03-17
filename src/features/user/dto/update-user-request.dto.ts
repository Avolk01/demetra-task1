import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({ example: 'Petr', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Petrov', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'petrov@mail.com', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ example: 'new description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
