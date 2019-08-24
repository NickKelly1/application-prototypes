import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { ProfileEntity } from './ProfileEntity';
import { PostEntity } from './PostEntity';

const VOTES_TABLE = 'votes';

/**
 * Join table between users and posts
 */
@Entity({ name: VOTES_TABLE })
export class VoteEntity {
  @Column({ type: 'int' })
  value!: number;

  @PrimaryColumn({ type: 'int' })
  userId!: number;

  @PrimaryColumn({ type: 'int' })
  postId!: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user!: UserEntity;

  @OneToOne(() => PostEntity)
  @JoinColumn()
  post!: PostEntity;
}