import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    type: String,
    example: 'login',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'email@mail.com',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty({
    type: Number,
    example: 18,
    required: true,
  })
  age: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @ApiProperty({
    type: String,
    example: 'description about user',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Ivan',
    required: false,
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Ivanov',
    required: false,
  })
  lastName?: string;
}
