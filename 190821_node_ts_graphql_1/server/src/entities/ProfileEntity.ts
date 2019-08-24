import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { UserEntity } from './UserEntity';
import { PhotoEntity } from './PhotoEntity';

export const PROFILES_TABLE = 'profiles';

@Entity({ name: PROFILES_TABLE })
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  favouriteColour!: string;

  @OneToOne((type) => ProfileEntity, (user: UserEntity) => user.profile)
  user!: UserEntity;
}