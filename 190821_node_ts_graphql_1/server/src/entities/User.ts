import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from './Profile';
import { Photo } from './Photo';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 230 })
  firstName!: string;

  /**
   * @relation Profile
   *
   * @OneToOne
   */
  @Column({ nullable: true })
  profileId!: number;

  @OneToOne(type => Profile, { cascade: true, nullable: true })
  /**
   * @note JoinColumn is optional for @ManyToOne, but required for @OneToOne
   * Specifying join key:
   *  - @JoinColumn({ name: 'profileId' })
   * ?:
   *  - @JoinColumn({ relationName: 'favouriteColour' })
   */
  @JoinColumn()
  profile!: Profile

  /**
   * @relation Photos
   * @OneToMany
   */
  @OneToMany(type => Photo, (photo: Photo) => photo.user, { cascade: true, nullable: true })
  photos!: Photo[];

  // @Column({ type: 'text' })
  // lastName!: string;

  // @Column({ type: 'boolean', default: false })
  // confirmed!: boolean;

  // @Column()
  // age!: number;
}
