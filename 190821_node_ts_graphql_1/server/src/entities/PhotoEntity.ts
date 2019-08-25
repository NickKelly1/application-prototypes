import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { Photo } from '../graphql/generated/graphql.generated';

const PHOTOS_TABLE = 'photos';

@Entity({ name: PHOTOS_TABLE })
export class PhotoEntity extends BaseEntity implements Photo {
  @PrimaryGeneratedColumn('increment') id!: number;

  @Column('text') url!: string;

  @Column('int')
  userId!: number;

  /**
   * @OneToMany user
   */
  @ManyToOne(type => UserEntity, (user: UserEntity) => user.photos)
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
