import { BaseEntity } from '../../common/entities/base-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, name: 'first_name' })
  firstName?: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName?: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column({ length: 1000, nullable: true })
  description: string;
}
