import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany, RelationId } from 'typeorm';
import { ProfileEntity } from './ProfileEntity';
import { PhotoEntity } from './PhotoEntity';
import { User, Maybe } from '../graphql/generated/graphql.generated';

export const USERS_TABLE = 'users';

@Entity({ name: USERS_TABLE })
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'text', unique: true })
  email!: string;

  /**
   * @relation ProfileEntity
   * @OneToOne
   */
  @OneToOne(() => ProfileEntity, profile => profile.user, { nullable: true, cascade: true })
  profile?: ProfileEntity;

  /**
   * @description
   * Lazy load relationship
   */
  getProfile = async () => {
    if (this.profile) return this.profile;

    const profile = await ProfileEntity.findOne({ userId: this.id });
    this.profile = profile;
    return profile;
  }

  /**
   * @relation Photos
   * @OneToMany
   */
  @OneToMany(() => PhotoEntity, photo => photo.user, { nullable: true, cascade: true })
  photos?: PhotoEntity[];

  /**
   * @description
   * Lazy load relationship
   */
  getPhotos = async () => {
    if (this.photos) return this.photos;

    const photos = await PhotoEntity.find({ userId: this.id });
    this.photos = photos;
    return photos;
  }
}
