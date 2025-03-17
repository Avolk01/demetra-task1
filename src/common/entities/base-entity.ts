import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ default: new Date(), name: 'created_at' })
  createdAt: Date;

  @Column({ default: new Date(), name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: null, name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
