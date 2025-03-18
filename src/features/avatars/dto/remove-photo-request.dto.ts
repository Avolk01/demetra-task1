import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePhotoRequestDto {
  @ApiProperty({ example: 'path' })
  @IsNotEmpty()
  @IsString()
  path: string;
}
