import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import { UserEntity } from './UserEntity';

const POSTS_TABLE = 'posts';

@Entity({ name: POSTS_TABLE })
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToMany(type => UserEntity)
  @JoinTable({ name: 'vote'})
  users!: UserEntity[];
}