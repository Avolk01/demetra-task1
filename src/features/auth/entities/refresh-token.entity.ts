import { BaseEntity } from '../../../common/entities/base-entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'refresh-tokens' })
export class RefreshTokenEntity extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  token: string;
}
