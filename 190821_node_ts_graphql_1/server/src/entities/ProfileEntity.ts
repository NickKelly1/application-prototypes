import { Entity, PrimaryGeneratedColumn, Column, OneToOne, BaseEntity, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { Profile } from '../graphql/generated/graphql.generated';

export const PROFILES_TABLE = 'profiles';

@Entity({ name: PROFILES_TABLE })
export class ProfileEntity extends BaseEntity implements Profile {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text')
  favouriteColour!: string;

  @Column('int')
  userId!: number;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  /**
   * @description
   * Lazy load relationship
   */
  getUser = async () => {
    if (this.user) return this.user;

    const user = await UserEntity.findOne({ id: this.userId });
    if (!user) throw new TypeError(`Unable to find user for Photo ${this.id}`);
    this.user = user;
    return user;
  }
}
