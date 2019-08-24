import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProfileEntity } from './ProfileEntity';
import { PhotoEntity } from './PhotoEntity';

export const USERS_TABLE = 'users';

@Entity({ name: USERS_TABLE })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  email!: string;

  /**
   * @relation ProfileEntity
   * @OneToOne
   */
  @Column({ nullable: true })
  profileId!: number;

  @OneToOne(type => ProfileEntity, { cascade: true, nullable: true })
  @JoinColumn()
  profile!: ProfileEntity

  /**
   * @relation Photos
   * @OneToMany
   */
  @OneToMany(type => PhotoEntity, (photo: PhotoEntity) => photo.user, { cascade: true, nullable: true })
  photos!: PhotoEntity[];
}

// export for graphql codegen
export interface User extends UserEntity {}

const z: User = {  };

z.id
