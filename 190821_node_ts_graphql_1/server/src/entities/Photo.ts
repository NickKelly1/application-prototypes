import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;

  @Column() url!: string;

  @Column()
  userId!: number;

  @ManyToOne(type => User, (user: User) => user.photos, { nullable: true })
  user!: User;
}