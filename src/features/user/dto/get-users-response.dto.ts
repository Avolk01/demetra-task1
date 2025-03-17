import { UserEntity } from '../entities';

export class GetUsersResponseDto {
  page: number;
  totalUsersCount: number;
  users: UserEntity[];
  perPage: number;
}
